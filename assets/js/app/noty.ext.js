define([
    'Noty'
], function (Noty) {

    Noty.overrideDefaults({
        layout: 'topRight',     // top(Left|Center|Right) center(Left|Right) bottom(Left|Center|Right)
        theme: 'relax',         // relax|mint|metrou
        type: 'success',        // alert|success|error|warning|info
        timeout: false,         // delay for closing event. Set false for sticky notifications
        force: false,           // adds notification to the beginning of queue when set to true
        modal: false,           // modal dialog
        killer: true,           // for close all notifications before show
        closeWith: ['click'],   // ['click', 'button']
        animation: {
            open: 'animated fadeInRight',
            close: 'animated fadeOutRight'
        }
    });

    Noty.alert = alert;
    Noty.confirm = confirm;
    Noty.message = message;

    return Noty;

    function alert(msg, type, callback) {

        var args = Array.prototype.slice.call(arguments);
        msg = args.shift();
        if (typeof args[args.length - 1] === 'function') {
            callback = args.pop();
        }
        type = args.length > 0 ? args.shift() : null;

        var Type = {alert: 'alert', success: 'success', error: 'error', warning: 'warning', info: 'info'};
        type = Type[type] || Type.alert;

        var noty = new Noty({
            text: msg,
            type: type,
            modal: true,
            closeWith: [],
            layout: 'topCenter',
            buttons: [
                Noty.button('确定', 'btn btn-sm btn-primary', function () {
                    noty.close();
                    callback && callback(true);
                })
            ],
            animation: {
                open: 'animated flipInY',
                close: 'animated flipOutY'
            }
        }).show();

    }

    function confirm(msg, callback) {
        var noty = new Noty({
            text: msg,
            type: 'alert',
            modal: true,
            closeWith: [],
            layout: 'topCenter',
            buttons: [
                Noty.button('确定', 'btn btn-sm btn-primary pull-right', function () {
                    noty.close();
                    callback && callback(true);
                }, {style: 'margin-left: 5px; margin-bottom: 5px;'}),
                Noty.button('取消', 'btn btn-sm btn-default pull-right', function () {
                    noty.close();
                    callback && callback(false);
                }, {style: 'margin-bottom: 5px;'})
            ],
            animation: {
                open: 'animated flipInY',
                close: 'animated flipOutY'
            }
        }).show();
    }

    function message(msg, type) {
        new Noty({
            text: msg,
            type: type || 'success'
        }).show();
    }

});
