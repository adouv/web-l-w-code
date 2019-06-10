window.tpkApp.service("$layer", [
    function () {
        return {
            //确认信息
            confirm: function (msg, btn, callBcak1, callback2) {
                var btns = btn ? btn : ['确定', '取消'];
                index = layer.open({
                    content: msg
                    , btn: btns
                    , yes: callBcak1
                    , no: callback2
                });
            },
            //操作提示信息,有回调
            statusMsg: function (data, callback) {
                var index = null;
                if (data.code == 0) {
                    index = layer.open({
                        content: '操作成功',
                        style: 'background:#68686b url(/images/layer_success.png) no-repeat 70px center; ' +
                        'color:#fff; ' +
                        'border:none;' +
                        '-webkit-background-size: 30px;' +
                        ' background-size:30px;', //自定风格
                        time: 2,
                        end: callback
                    });
                } else {
                    var msg = '操作失败,请重试';
                    if (data.msg) {
                        msg = data.msg;
                    }
                    index = layer.open({
                        content: msg,
                        style: 'background:#68686b url(/images/layer_success.png) no-repeat 70px center; ' +
                        'color:#fff; ' +
                        'border:none;' +
                        '-webkit-background-size: 30px;' +
                        ' background-size:30px;', //自定风格
                        time: 2,
                    });
                    return false;
                }
            },
            successMsg:function (msg,callback) {
                index = layer.open({
                    content: '操作成功',
                    style: 'background:#68686b url(/images/layer_success.png) no-repeat 70px center;' +
                    'color:#fff; ' +
                    'border:none;' +
                    '-webkit-background-size: 30px;' +
                    ' background-size:30px;', //自定风格
                    time: 2,
                    end: callback
                });
            },
            //错误提示,无回调
            errorMsg: function (msg,callback) {
                var index = layer.open({
                    content: msg,
                    style: 'background:#68686b url(/images/layer_success.png) no-repeat 70px center; ' +
                    'color:#fff; ' +
                    '-webkit-background-size: 30px;' +
                    ' background-size:30px;' +
                    'border:none;', //自定风格
                    time: 2,
                    end:callback
                });
            }
        }
    }
]);
