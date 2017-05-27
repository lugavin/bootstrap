/**
 * @namespace Base
 */
(function (window) {

    var Base = {
        format: function () {
            if (arguments.length == 0) {
                return null;
            }
            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gm'), arguments[i]);
            }
            return str;
        },
        formatString: function (string) {
            var args = arguments;
            var pattern = new RegExp('\\{([1-' + arguments.length + '])\\}', 'g');
            return String(string).replace(pattern, function (match, index) {
                return args[index];
            });
        },
        formatObject: function (str, obj) {
            /**
             * \s 匹配任何空白字符
             * /g 直接量语法(/regexp/g) 用于执行全局匹配
             */
            return str.replace(/\{\s*([^}\s]+)\s*}/g, function (match, p1, offset, string) {
                return obj[p1]
            });
        },
        generateRandomNumber: function () {
            return new Date().getTime() * Math.floor(Math.random() * 1000000);
        },
        generateGUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        /**
         * options参数说明:
         * url: 发送请求的地址, 默认值: 当前页地址
         * data: string, json
         * method: 请求方式: GET/POST, 默认值: GET
         * async: 是否异步: true/false, 默认值: true
         * cache: 是否缓存: true/false, 默认值: true
         * contentType: HTTP头信息, 默认值: application/x-www-form-urlencoded
         * success: 请求成功后的回调函数
         * error: 请求失败后的回调函数
         */
        ajax: function (options) {
            // (一)设置默认参数
            var defaults = {
                url: '',
                data: '',
                async: true,
                cache: true,
                method: 'GET',
                contentType: 'application/x-www-form-urlencoded',
                success: function () {
                },
                error: function () {
                }
            };
            // (二)覆盖默认参数
            for (var key in options) {
                defaults[key] = options[key];
            }
            // (三)对数据进行处理
            // 1)处理data
            if (typeof defaults.data === 'object') {
                var param = '';
                for (var key in defaults.data) {
                    var value = defaults.data[key];
                    if (String(defaults.data[key]).indexOf('&') !== -1) {
                        value = defaults.data[key].replace(/&/g, escape('&'));
                    }
                    if (key.indexOf('&') !== -1) {
                        key = key.replace(/&/g, escape('&'));
                    }
                    param += key + '=' + value + '&';
                }
                defaults.data = param.substring(0, param.length - 1);
            }
            // 2)处理method
            defaults.method = defaults.method.toUpperCase();
            // 3)处理cache
            defaults.cache = defaults.cache ? '' : '&' + new Date().getTime();
            // 4)处理url
            if (defaults.method === 'GET' && (defaults.data || defaults.cache)) {
                defaults.url += '?' + defaults.data + defaults.cache;
            }
            // (四)发送Ajax请求
            // 1)创建XMLHttpRequest对象(XMLHttpRequest用于在后台与服务器交换数据,这意味着可以在不重新加载整个网页的情况下,对网页的某部分进行更新)
            var xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            // 2)向服务器发送请求
            xmlHttp.open(defaults.method, defaults.url, defaults.async);
            if (defaults.method === 'GET') {
                xmlHttp.send(null);
            } else {
                xmlHttp.setRequestHeader("Content-type", defaults.contentType);
                xmlHttp.send(defaults.data); // 仅用于POST请求
            }
            // 3)服务器响应
            /**
             * onreadystatechange 事件: 每当 readyState 改变时, 就会触发 onreadystatechange 事件;
             * readyState: 存有 XMLHttpRequest 的状态信息, 从 0 到 4 发生变化.
             *    |-0: 请求未初始化
             *    |-1: 服务器连接已建立
             *    |-2: 请求已接收
             *    |-3: 请求处理中
             *    |-4: 请求已完成且响应已就绪
             */
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    // 执行 Callback 函数
                    if (xmlHttp.status === 200) {
                        defaults.success.call(xmlHttp, xmlHttp.responseText);
                    } else {
                        defaults.error();
                    }
                }
            };
        }
    };

    if (typeof window === 'object' && typeof window.document === 'object') {
        window.Base = Base;
    }

})(window);