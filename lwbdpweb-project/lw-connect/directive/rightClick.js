export default function ngRightClickDirective($parse){
    return {
        restrict : 'AE',
        link (scope, element, attrs){
            let parent = element[0].parentNode;
            
            parent.onmousewheel = function(e){
                if(this.className.indexOf("no_scroll")!==-1){
                    e.preventDefault();
                }
            };
            document.onclick = function(){
                if(document.querySelector(".operation")){
                    let operation = document.querySelector(".operation");
                    let optCss =  window.getComputedStyle(operation).display;
                    if(optCss==='block'){
                        operation.style.display = "none";
                        if(scope.look){scope.look.rightIndex = null;} 
                        if(scope.link){scope.link.selectedId = null;} 
                        scope.$apply();
                    }
                   
                }
                if(document.querySelector("#look_search_result")){
                    let look_res = document.querySelector("#look_search_result");
                    let ls_display =  window.getComputedStyle(look_res).display;
                    if(ls_display==='block'){
                        look_res.style.display = "none";
                    }
                    if(scope.look && scope.look.searchData){
                        scope.look.cleanResaults();
                        scope.$apply();
                    }
                }
            }
            parent.onclick = function(){
                if(this.className.indexOf("no_scroll")!==-1){
                    this.className = parent.className.replace("no_scroll",'');
                    document.querySelector(".operation").style.display = "none";
                    if(scope.look){scope.look.rightIndex = null;} 
                    if(scope.link){scope.link.selectedId = null;} 
                        scope.$apply();
                }
            };
            document.oncontextmenu=function(event){
                event.preventDefault();
            };
            element.bind('contextmenu', function(event) {
                event.preventDefault();
                if(document.querySelector(".show-exit")){
                    document.querySelector(".show-exit").style.display = "none";
                }
                if(parent.className.indexOf("no_scroll")===-1){
                    parent.className = parent.className + ' ' + 'no_scroll';
                }
                let left = event.clientX,
                top = event.clientY;
                var fn = $parse(attrs.ngRightClick);
                let btn = document.querySelector("#operation_box");
                let  client = document.querySelector(".client"),
                     body  = document.querySelector("body"),
                        width = client.offsetWidth,
                        height = client.offsetHeight,
                        allWidth = body.offsetWidth,
                        allHeight = body.offsetHeight;
                
                if(parent.className.indexOf("link_module_list")>-1){
                    let maxRight = (allWidth-width)/2+width - 100,
                        maxHeight = (allHeight-height)/2+height -112;
                        if(left>maxRight){
                            left = maxRight;
                        }
                        if(top>maxHeight){
                            top = maxHeight
                        }
                       
                }else{
                    let maxHeight = (allHeight-height)/2+height -92;
                    if(top>maxHeight){
                        top = maxHeight
                    }
                }
                 btn.style.cssText = "top:"+ top +"px;"+"left:"+ left +"px;"
                scope.$apply(function() {
                    event.preventDefault();
                     fn(scope, {$event:event});
                });
            });
            if(document.querySelector("#look_search")){
                 let input = document.querySelector("#look_search");
                input.addEventListener('input',function(){
                    let look_res = document.querySelector("#look_search_result");
                    if(!look_res){
                        return false;
                    }
                    let ls_display =  window.getComputedStyle(look_res).display;
                        if(ls_display==='none'){
                            look_res.style.display = "inherit";
                        }
                })
            }
        }
    }
}