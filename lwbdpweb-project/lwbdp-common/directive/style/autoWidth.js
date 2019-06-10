/**
 * @Author hejialin
 * @Description 表单验证指令
 */

export default class autoWidth {
    constructor() {
        this.scope = {
            autoWidth: '@',
            watchChange:'='
        };
    }

    link(scope, elem, attr) {
        let scrollElem = scope.autoWidth?document.querySelector(scope.autoWidth):elem[0];
        var isScroll = function (el) {
            // test targets
            var elems = el ? [el] : [document.documentElement, document.body];
            var scrollX = false, scrollY = false;
            for (var i = 0; i < elems.length; i++) {
                var o = elems[i];
                // test horizontal
                var sl = o.scrollLeft;
                o.scrollLeft += (sl > 0) ? -1 : 1;
                o.scrollLeft !== sl && (scrollX = scrollX || true);
                o.scrollLeft = sl;
                // test vertical
                var st = o.scrollTop;
                o.scrollTop += (st > 0) ? -1 : 1;
                o.scrollTop !== st && (scrollY = scrollY || true);
                o.scrollTop = st;
            }
            // ret
            return {
                scrollX: scrollX,
                scrollY: scrollY
            };
        };
        let changeWidth = ()=>{
            let width = scrollElem.firstElementChild.offsetWidth;
            elem[0].style.width = width+40+'px';
        }
        scope.$watch('watchChange',(change,oldVal)=>{
            if(change!==undefined && oldVal!=change){
                clearInterval(scope.intervalTime);
                scope.intervalTime = setInterval(()=>{
                    changeWidth();
                },50);
                let timeout = setTimeout(()=>{
                    clearInterval(scope.intervalTime);
                    clearTimeout(timeout);
                },1000)
            }
        });
        angular.element(window).on('resize',()=>{
            changeWidth();
        });
        angular.element(document.getElementById('normalscreen')).on('click',()=>{
            changeWidth();
        })
        angular.element(document.getElementById('fullscreen')).on('click',()=>{
            changeWidth();
        })
    }
}
