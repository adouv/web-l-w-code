/**
 * @Author hejialin
 * @Description 状态栏定位
 */

export class backToTop{
    constructor(){
        this.replace = true;
    }
    
    link(scope,elem,attrs){
        elem.on('click',()=>{
            $(attrs.backToTop).animate({
                'scrollTop': 0
            }, 500)
        });
    }
}

export class statusPosition{
    constructor(){
        this.replace = true;
    }
    
    link(scope,elem,attrs){
        let scrollTop = 0;
        let scrollDom = document.querySelector('.'+attrs.statusPosition),
            positionDom = document.querySelector('.repaDisposal_flow'),
            palette = document.getElementById('palette');
        scrollDom.addEventListener('scroll',e=>{
            scrollTop = positionDom.offsetTop+80;
            if(scrollDom.scrollTop>scrollTop){
                if(document.querySelector('.head')){
                    elem[0].style.top = 112+'px';
                }else{
                    elem[0].style.top = 40+'px';
                }
                elem[0].style.position = 'fixed';
                elem[0].style.left = '4%';
            }else{
                elem[0].style.position = 'relative';
                elem[0].style.top = 'inherit';
                elem[0].style.left = scrollDom.scrollLeft?scrollDom.scrollLeft+'px':'inherit';
            }
        });
    }
}