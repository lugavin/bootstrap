(function (root, factory) {

    factory(root);

})(window, function (root) {

    const EMPTY_STRING = "";
    const DialogType = {ALERT: 'alert', CONFIRM: 'confirm'};
    const MsgType = {SUCCESS: 'success', ERROR: 'error', WARN: 'warn', QUESTION: 'question'};

    var Base = {};

    Base.alert = alert;
    Base.confirm = confirm;

    if (typeof root === 'object' && typeof root.document === 'object') {
        root.Base = Base;
    }

    return root;

    /*!
     * <div class="modal">
     *     <div class="modal-dialog">
     *         <div class="modal-content">
     *             <div class="modal-header">{{title}}</div>
     *             <div class="modal-body">{{msg}}</div>
     *             <div class="modal-footer">
     *                 <button type="button" class="btn btn-default">{{btnText}}</button>
     *                 <button type="button" class="btn btn-primary">{{btnText}}</button>
     *             </div>
     *         </div>
     *     </div>
     * </div>
     */
    function Dialog(options, dialogType) {
        /**
         * 用var定义类的private属性和private方法
         * 用this定义类的public属性和public方法
         */
        this.modalId = createIndex('modal');
        this.maskId = createIndex('mask');
        this.msg = options.msg || '';
        this.msgType = options.msgType || MsgType.SUCCESS;
        this.callback = options.callback || noop;
        this.dialogType = dialogType;
        this.show = function () {
            createDialog(this);
        };
        this.close = function () {
            closeDialog(this);
        }
    }

    function append(node) {
        document.querySelector('body').appendChild(node);
    }

    function remove(node) {
        node && node.parentNode.removeChild(node);
    }

    function createDialog(dialog) {
        var footerNode = createModalFooterNode();
        if (dialog.dialogType === DialogType.CONFIRM) {
            var cancelBtnNode = createCancelButtonNode('取消');
            cancelBtnNode.onclick = function () {
                dialog.close();
                dialog.callback(false);
            };
            footerNode.appendChild(cancelBtnNode);
        }
        var confirmBtnNode = createConfirmButtonNode('确定');
        confirmBtnNode.onclick = function () {
            dialog.close();
            dialog.callback(true);
        };
        footerNode.appendChild(confirmBtnNode);
        var bodyNode = createModalBodyNode(dialog.msg);
        var headerNode = createModalHeaderNode('提示消息');
        var contentNode = createModalContentNode();
        var modalDialogNode = createModalDialogNode();
        var modalNode = createModalNode(dialog);
        contentNode.appendChild(headerNode);
        contentNode.appendChild(bodyNode);
        contentNode.appendChild(footerNode);
        modalDialogNode.appendChild(contentNode);
        modalNode.appendChild(modalDialogNode);
        append(modalNode);
        append(createMask(dialog));
    }

    function closeDialog(dialog) {
        remove(document.querySelector('#' + dialog.modalId));
        remove(document.querySelector('#' + dialog.maskId));
    }

    function createMask(dialog) {
        var node = document.createElement('div');
        node.setAttribute('id', dialog.maskId);
        node.setAttribute('class', 'modal-backdrop fade in');
        return node;
    }

    function createCancelButtonNode(text) {
        var node = document.createElement('button');
        node.setAttribute('type', 'button');
        node.setAttribute('class', 'btn btn-default');
        node.textContent = text;
        return node;
    }

    function createConfirmButtonNode(text) {
        var node = document.createElement('button');
        node.setAttribute('type', 'button');
        node.setAttribute('class', 'btn btn-primary');
        node.textContent = text;
        return node;
    }

    function createModalFooterNode() {
        var node = document.createElement('div');
        node.setAttribute('class', 'modal-footer');
        return node;
    }

    function createModalBodyNode(msg) {
        var node = document.createElement('div');
        node.setAttribute('class', 'modal-body');
        node.textContent = msg;
        return node;
    }

    function createModalHeaderNode(title) {
        var node = document.createElement('div');
        node.setAttribute('class', 'modal-header');
        node.textContent = title;
        return node;
    }

    function createModalContentNode() {
        var node = document.createElement('div');
        node.setAttribute('class', 'modal-content');
        return node;
    }

    function createModalDialogNode() {
        var node = document.createElement('div');
        node.setAttribute('class', 'modal-dialog');
        return node;
    }

    function createModalNode(dialog) {
        var node = document.createElement('div');
        node.setAttribute('id', dialog.modalId);
        node.setAttribute('class', 'modal face in');
        return node;
    }

    function alert(msg, type, callback) {
        // arguments并不是真正意义上的Javascript数组, 所以需要使用Array.prototype.slice.call(arguments)方法将其转换成数组
        var args = Array.prototype.slice.call(arguments);
        // 移除数组中的第一个元素并返回该元素
        msg = args.shift();
        // 移除数组中的最后一个元素并返回该元素
        if (typeof args[args.length - 1] === 'function') {
            callback = args.pop();
        }
        // 如果args中仍有元素, 那就是可选参数, 使用以下方法逐个取出
        // args.length > 0 ? optionalA = args.shift() : optionalA = null;
        // args.length > 0 ? optionalB = args.shift() : optionalB = null;
        type = args.length > 0 ? args.shift() : null;
        new Dialog({
            msg: msg,
            type: type,
            callback: callback
        }, DialogType.ALERT).show();
    }

    function confirm(msg, callback) {
        new Dialog({
            msg: msg,
            callback: callback
        }, DialogType.CONFIRM).show();
    }

    function message(msg, type) {

    }

    function noop() {
    }

    function createIndex(prefix) {
        return format('{0}_{1}_{2}', prefix, new Date().getTime(), Math.floor(Math.random() * 1000000));
    }

    function format() {
        if (arguments.length == 0) {
            return EMPTY_STRING;
        }
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            str = String(str).replace(new RegExp('\\{' + (i - 1) + '\\}', 'gm'), arguments[i]);
        }
        return str;
    }

});