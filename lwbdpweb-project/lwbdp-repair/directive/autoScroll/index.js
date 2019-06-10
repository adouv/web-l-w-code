/**
 * Created by lizp on 2017/10/23.
 */
export default class autoScroll{
    constructor(){
        this.replace = true;
        this.scope = {
            autoScroll:'='
        };
    }

    link(scope,elem){
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

        let getStyle = (node, name)=> {
            let style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
            return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
        }

        scope.$watch('autoScroll',(change)=>{
            setTimeout(()=>{
                if(isScroll(elem[0]).scrollY){
                    let paddingRight = getStyle(elem[0],'padding-right').replace('px','')*1;
                    elem[0].style.padding = paddingRight-10+'px';
                }
            },200)
        });

    }
}
