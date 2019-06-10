export default function autoListDirective(){
    return {
        restrict : "AE",
        link(scope, element, attrs){
            let selectIdx = -1,
                itemLength = 0;
            let boxHeight = document.querySelector("#look_search_result").offsetHeight,
                listHeight = document.querySelector("#look_search_result_list").offsetHeight;
            let reset = function(){
                selectIdx = -1;
                itemLength = 0;
                if(document.querySelector("#look_search_result")){
                    boxHeight = document.querySelector("#look_search_result").offsetHeight;
                }
                if (document.querySelector("#look_search_result_list")){
                    listHeight = document.querySelector("#look_search_result_list").offsetHeight;
                }
                let result_items = document.querySelectorAll(".result_item");
                itemLength =result_items.length;
                addClass(result_items[0],'selected');
                selectIdx+=1;
            };
            let resaultBox  = document.querySelector("#look_search_result");
            resaultBox.onclick =function(e){
                e.stopPropagation();
                reset();
            };
            setTimeout(function() {
                reset();
            }, 10);

            let more = document.querySelector('.more');
            more.addEventListener('click',function(event){
                input.focus();
            });
            let nomore = document.querySelector('.nomore');
            nomore.addEventListener('click',function(event){
                input.focus();
            });
           let input = document.querySelector("#look_search"); //搜索框
            input.addEventListener('keyup',function(event){ //监听输入框的keyup事件
                if(event.which === 38 || event.which === 40 || event.which === 13){
                    event.preventDefault;
                    let result_items = document.querySelectorAll(".result_item"); //搜索的结果项
                    let box = document.querySelector("#look_search_result");//包含着结果项的盒子
                    if(event.which === 38){  //上
                        removeClass(result_items[selectIdx],"selected");
                        // 当在选中第一个的时候,按上键,则选中最后一个
                        if(selectIdx===0){
                            selectIdx = itemLength-1;
                            addClass(result_items[itemLength-1],'selected');
                            box.scrollTop = box.scrollHeight;
                            return false;
                        }
                        let top = result_items[selectIdx].offsetTop;
                        if(boxHeight<listHeight && top<boxHeight-70){
                           box.scrollTop = box.scrollTop-50; 
                        }
                        selectIdx-=1;
                        addClass(result_items[selectIdx],'selected');
                    }
                    if(event.which === 40){ //下
                        removeClass(result_items[selectIdx],"selected");
                        if(selectIdx === itemLength-1){
                            addClass(result_items[0],'selected');
                            selectIdx = 0;
                            box.scrollTop = 0;
                            return false;
                        }
                        selectIdx+=1;
                        addClass(result_items[selectIdx],'selected');
                        let top = result_items[selectIdx].offsetTop;
                        if(boxHeight<listHeight && top>boxHeight-70){
                             box.scrollTop = box.scrollTop+50;   
                        }
                    }
                    if(event.which === 13){ //enter
                        result_items[selectIdx].click();
                    }
                }
                
            })
            function addClass(obj, cls){
                if(obj){
                    let obj_class = obj.className,
                        blank = (obj_class != '') ? ' ' : '';
                    let added = obj_class + blank + cls;
                    obj.className = added;
                }
            }

            function removeClass(obj, cls){
                if(obj){
                    let obj_class = ' '+obj.className+' ';
                    obj_class = obj_class.replace(/(\s+)/g, ' ');
                    let removed = obj_class.replace(' '+cls+' ', ' ');
                    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
                    obj.className = removed;
                }
            }
            
        }
    }
}