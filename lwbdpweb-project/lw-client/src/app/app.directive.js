/**
 * @Author hejialin
 * @Description
 */

/**
 * 自动获取焦点指令
 */
class autoFocus {
    constructor($timeout) {
        this.scope = {
            autoFocus: '='
        };
        this.$timeout = $timeout;
    };

    link(scope, elem, attrs) {
        //火狐浏览器无法autofocus
        scope.$watch('autoFocus', (val) => {
            if (val === true || val === 'true') {
                this.$timeout(() => {
                    if (scope.autoFocus) {
                        elem[0].focus()
                    }
                }, 100);
            }
        });
    }
}

/**
 * 最大化和最小化
 */
function fullScreen(clientService, $timeout) {
    return {
        link: (scope, elem, attrs) => {
            let _this = {};
            _this.max = document.querySelector("#fullscreen");
            _this.normal = document.querySelector("#normalscreen");
            if (attrs.full == 1) {
                $timeout(() => {
                    let client = document.querySelector(".client");
                    client.style.cssText = "width:1000px;height:600px;min-width:800px;min-height:600px";
                    document.querySelector("#fullscreen").style.display = 'inline-block';
                    document.querySelector("#normalscreen").style.display = 'none';
                    clientService.setMinimumSize(820, 620);
                    clientService.setWindowSize(1000, 600);
                    clientService.setPosition('center');
                }, 0);
            }
            let docHtml = angular.element(document.querySelector('html'));
            if (attrs.full != 1 && attrs.isConnect == -1) {
                $timeout(() => {
                    let client = document.querySelector(".client");
                    client.style.cssText = "width:1366px;height:771px;min-width:1366px;min-height:771px;";
                    document.querySelector("#normalscreen").style.display = 'inline-block';
                    //clientService.maximize();
                    clientService.setMinimumSize(1366, 771);
                    clientService.setWindowSize(1366, 771);
                    docHtml.removeClass('padding');
                }, 0);
            } else {
                let client = document.querySelector(".client");
                client.style.cssText = "width:1366px;height:771px;min-width:1366px;min-height:771px;";
                document.querySelector("#normalscreen").style.display = 'inline-block';
                //clientService.maximize();
                clientService.setMinimumSize(1366, 771);
                clientService.setWindowSize(1366, 771);
                docHtml.removeClass('padding');
            }
            elem[0].onclick = () => {
                let client = document.querySelector(".client");
                elem[0].style.display = 'none';
                if (attrs.fullScreen === 'true') {
                    client.style.cssText = "width:100%;height:100%;";
                    document.querySelector("#normalscreen").style.display = 'inline-block';
                    docHtml.removeClass('padding');
                    clientService.maximize();
                } else {
                    client.style.cssText = "";
                    document.querySelector("#fullscreen").style.display = 'inline-block';
                    docHtml.addClass('padding');
                    clientService.restore();
                }
            };

            clientService.toggleMaximize(function() {
                document.querySelector("#fullscreen").style.display = 'none';
                document.querySelector(".client").style.cssText = "width:100%;height:100%;margin:0;";
                document.querySelector("#normalscreen").style.display = 'inline-block';
                angular.element(document.querySelector('html')).removeClass('padding');
            }, function() {
                document.querySelector("#normalscreen").style.display = 'none';
                document.querySelector(".client").style.cssText = "";
                document.querySelector("#fullscreen").style.display = 'inline-block';
                angular.element(document.querySelector('html')).addClass('padding');
            });
        }
    }
}

function toBack() {
    return {
        link: (scope, elem) => {
            elem.on('click', () => {
                const backDom = document.querySelector('webview');
                if (backDom) {
                    if (backDom.canGoBack()) {
                        backDom.back();
                    }
                } else {
                    history.go(-1);
                }
            });
        }
    }
}

/**
 * 控制input框只能输入 数字
 */
class inputNumber {
    constructor($window) {
        this.$window = $window;
    }

    link(scope, elem, attrs) {
        let keyDownEvent = ev => {
            if (ev.key.length == 1 &&
                this.$window.isNaN(ev.key * 1)) {
                ev.isPreventDefault = true;
                ev.preventDefault();
            }
        };

        elem.bind('keydown', keyDownEvent);
        elem.bind('keyup', ev => {
            if (ev.isPreventDefault) {
                elem.unbind('keydown');
                elem.bind('keydown', keyDownEvent);
            }
            elem.val(elem.val().replace(/\D/g, ''));
        });
    }
}


/**
 * 控制input框输入
 */
class controlInput {
    constructor() {
        this.scope = {
            controlInput: '@'
        };
    }

    link(scope, elem, attrs) {
        let keyDownEvent = ev => {
            if (new RegExp(scope.controlInput).test(elem.val())) {
                ev.isPreventDefault = true;
                ev.preventDefault();
            }
        };
        elem.on('change', keyDownEvent);
    }
}

export default angular.module('lw.directive', [])
    .directive('autoFocus', ($timeout) => new autoFocus($timeout))
    .directive('fullScreen', (clientService, $timeout) => new fullScreen(clientService, $timeout))
    .directive('inputNumber', ($window) => new inputNumber($window))
    .directive('controlInput', () => new controlInput())
    .directive('kjBack', () => new toBack())
    .name;