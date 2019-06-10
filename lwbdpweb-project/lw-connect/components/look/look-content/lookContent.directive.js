import lookContentHtml from './lookContent.html';
export default function lookContentDirective(){
    return {
        restrict : "E",
        replace : "true",
        template : lookContentHtml,
        link($scope,elem,attrs){
            let listBox = document.querySelector("#content_list");
            let timer = null,timer2 = null;
            let clicked = false,
                scrolled = false,
                noMore = false;
            listBox.onmousewheel = function(e){
                if(timer){
                    clearTimeout(timer);
                    clearTimeout(timer2);
                }
                if(listBox.scrollTop<50){
                    timer = setTimeout(function(){
                        let len = document.querySelectorAll(".content_item").length;
                        let first = len%10;
                        if(len==10 || len>10){
                            document.querySelectorAll("#content_fresh")[0].className = 'content_loading';
                        }
                        if(first>0){
                            noMore = true;
                            document.querySelectorAll("#content_fresh")[0].className = 'content_top';
                            document.querySelectorAll("#content_fresh")[0].textContent = '没有更多内容';
                            return false;
                        }
                        if(clicked){
                            return false;
                        }
                        clicked = true;
                        document.getElementById("getPage").click();
                    },200);
                    timer2= setTimeout(function(){
                        if(scrolled || noMore){
                            return false;
                        }
                        scrolled = true;
                        let len = document.querySelectorAll(".content_item ").length;
                        let first = len%10;
                        first = first === 0 ? 10 : first;
                        let firstNode = document.querySelectorAll(".content_item")[first];
                        if(firstNode){
                            let firstHeight = firstNode.offsetHeight,
                                firstTop = firstNode.offsetTop,
                                boxHeight = listBox.offsetHeight;
                            listBox.scrollTop = firstNode.offsetTop;
                            clicked = false;
                            scrolled = false;
                        }
                    },500)
                }
            };
        }
    }
}
