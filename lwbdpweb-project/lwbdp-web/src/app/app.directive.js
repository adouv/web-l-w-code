/**
 * @Author hejialin
 * @Description 
 */

/**
 * 自动获取焦点指令
 */
class autoFocus{
    constructor($timeout){
        this.scope = {
            autoFocus:'='
        };
        this.$timeout = $timeout;
    };
    
    link(scope,elem,attrs){
        //火狐浏览器无法autofocus
        scope.$watch('autoFocus',(val)=>{
            if(val===true||val==='true'){
                this.$timeout(()=>{
                    if(scope.autoFocus){
                        elem[0].focus()
                    }
                },100);
            }
        });
    }
}

/**
 * 最大化和最小化
 */
function fullScreen(clientService,$timeout){
    return{
        link:(scope,elem,attrs)=>{
            let _this = this;
            _this.max = document.querySelector("#fullscreen");
            _this.normal = document.querySelector("#normalscreen");
            if(clientService.isFullScreen===true||attrs.full == 1){
                $timeout(()=> {
                    let  client =  document.querySelector(".client");
                    client.style.cssText = "width:800px;height:600px;min-width:800px;min-height:600px";
                    _this.max.style.display = 'inline-block';
                    _this.normal.style.display = 'none';
                    clientService.setWindowSize(800, 600);
                    clientService.setPosition('center');
                }, 0);
            }
            if(clientService.isClient()&&attrs.full != 1&&attrs.isConnect== -1||
                clientService.isFullScreen===false){
                $timeout(()=> {
                    let  client =  document.querySelector(".client");
                    client.style.cssText = "width:100%;height:100%;";
                    _this.normal.style.display = 'inline-block';
                    clientService.maximize();
                }, 0);
            }
            elem[0].onclick = ()=>{
                var client = document.querySelector(".client");
                elem[0].style.display = 'none';
                if (attrs.fullScreen === 'true') {
                    client.style.cssText = "width:100%;height:100%;margin:0;";
                    _this.normal.style.display = 'inline-block';
                    clientService.maximize();
                } else {
                    client.style.cssText = "";
                    clientService.restore();
                    _this.max.style.display = 'inline-block';
                }
            }
        }
    }
}

/**
 * 控制input框只能输入 数字
 */
class inputNumber{
    constructor($window){
        this.$window = $window;
    }
    link(scope,elem,attrs){
        let keyDownEvent = ev=>{
            if(ev.key.length==1&&
                this.$window.isNaN(ev.key*1)){
                ev.isPreventDefault = true;
                ev.preventDefault();
            }
        };

        elem.bind('keydown',keyDownEvent);
        elem.bind('keyup',ev=>{
            if(ev.isPreventDefault){
                elem.unbind('keydown');
                elem.bind('keydown',keyDownEvent);
            }
            elem.val(elem.val().replace(/\D/g,''));
        });
    }
}


/**
 * 控制input框输入
 */
class controlInput{
    constructor(){
        this.scope = {
            controlInput:'@'
        };
    }
    link(scope,elem,attrs){
        let keyDownEvent = ev=>{
            if(new RegExp(scope.controlInput).test(elem.val())){
                ev.isPreventDefault = true;
                ev.preventDefault();
            }
        };
        elem.on('change',keyDownEvent);
    }
}

export default angular.module('lw.directive',[])
    .directive('autoFocus',($timeout)=>new autoFocus($timeout))
    .directive('fullScreen',(clientService,$timeout)=>new fullScreen(clientService,$timeout))
    .directive('inputNumber',($window)=>new inputNumber($window))
    .directive('controlInput',()=>new controlInput())
    .name;