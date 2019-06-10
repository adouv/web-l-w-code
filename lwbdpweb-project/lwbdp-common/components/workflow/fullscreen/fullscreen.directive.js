export default function previewFullSreen() {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        template: '<span class="iconfont icon-fullScreen"></span>',
        link($scope, btn) {
            /*进入全屏*/
            let requestFullScreen = function (docElm) {
                //W3C
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                //FireFox
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                //Chrome等
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
                //IE11
                else if (document.body.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
            }
            /*退出全屏*/
            let exitFullScreen = function () {
                let doc = document;
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                }
            }
            /*判断浏览器是否全屏 */
            let isFullScreen = function () {
                let doc = document;
                return doc.fullscreenElement ||
                    doc.msFullscreenElement ||
                    doc.mozFullScreenElement ||
                    doc.webkitFullscreenElement || false;
            }
            /*全屏切换事件*/
            let onChangeHandle = function () {
                let el = angular.element(document.querySelector('.preview-flow'));
                if (isFullScreen()) {
                    exitFullScreen();
                    el.removeClass("fullscreen");
                    btn.removeClass("icon-cancelFullscreen").addClass("icon-fullScreen");
                    el.find('ul').css("max-height", "480px");
                } else {
                    let ulHeight = window.innerHeight + "px";
                    requestFullScreen(document.querySelector('.preview-flow'));
                    btn.removeClass("icon-fullScreen").addClass("icon-cancelFullscreen");
                    el.find('ul').css("max-height", ulHeight);
                    el.addClass("fullscreen");
                }
            }
            /*切换全屏事件*/
            let fullScreenChange = function () {
                let doc = document;
                if (doc.onwebkitfullscreenchange === null) {
                    doc.onwebkitfullscreenchange = onChangeHandle();
                } else if (doc.onmozfullscreenchange === null) {
                    doc.onmozfullscreenchange = onChangeHandle();
                } else if (doc.onMSFullscreenChange === null) {
                    doc.onMSFullscreenChange = onChangeHandle();
                } else if (doc.onfullscreenchange === null) {
                    doc.onfullscreenchange = onChangeHandle();
                }
            }
            /*添加点击事件*/
            btn.on("click", () => {
                //let el = angular.element(document.querySelector('.preview-flow'));
                onChangeHandle();
            })
        }
    }
}
previewFullSreen.$inject = [];