import './style.css';
export default angular.module('dialogs', []).factory("dialogsManager", ['$q', '$compile', '$timeout', '$rootScope',function ($q, $compile, $timeout, $rootScope) {

    //不明白可加  qq群517568588 交流

    //消息模板
    let megTmp = `<div class='nspop_megcontainer myactive' ng-click='close()'>
                    <div class='main_msg'>
                        <div class='textContent'>
                            <i class='bdpIconfont'></i>
                            <span>{{content}}</span>
                        </div>
                    </div>
                  </div>`;

    let dialog = {
        megs: [],
        showMessage: showMessage,
        alert: alert,  //未实现
        confirm: confirm 
    };

    //消息展示
    function showMessage(content, options) {
        //移除已存在的消息展示
        angular.forEach(dialog.megs, function (item, index) {
            item.remove();
        });
        createMeg(content, options);
    };

    //消息创建
    function createMeg(content, options) {
        options = angular.extend({
            scope: $rootScope.$new(), //创建一个继承自根的作用域
            timeout: 2000,  //多少秒后自动隐藏
            callback: null //结束之后的回调
        }, options);
        //消息文本
        options.scope.content = content;
        let megPromise = $q.when(compileTmp({
            template: megTmp,
            scope: options.scope,
            appendTo: angular.element(document.body),
            className: options.className
        }));
        megPromise.then((result) => {
            dialog.megs.push(result);
            let callback = options.callback;
            options.scope.close = () => {
                $timeout.cancel(options.scope.destroy);
                result.remove(); //移除消息展示
                options.scope.$destroy();  //摧毁作用域
                $timeout(() => {
                    callback && typeof callback === 'function' && callback(); //执行回调
                }, 50)
            };
            options.scope.destroy = $timeout(() => {
                options.scope.close();
            }, options.timeout);
        })
    }

    //编译模板
    function compileTmp(options) {
        let tem = $compile(options.template)(options.scope);
        tem.children()[0].className += ' ' + options.className;
        if (options.appendTo) {
            options.appendTo.append(tem);
        }
        return tem;
    };

    /*****************************************************确认框********************************************************************/

        //消息模板
    let confirmTmp = `<div class='nspop_megcontainer myactive' ng-click="close($event)">
                        <div class='lw-confirm-wrap'>
                            <div class="lw-confirm-header">
                                {{title}}
                                <span class="lw-close iconfont icon-off"></span>
                            </div>
                            <div class='lw-confirm-content'>
                                <p class="lw-confirm-text">{{content}}</p>
                            </div>
                            <div class="lw-confirm-footer">
                                <a class="lw-confirm-btn lw-confirm-cancel" href="javascript:void(0);" ng-click="callback[0]()">{{btn[0]}}</a>
                                <a class="lw-confirm-btn lw-confirm-sure" href="javascript:void(0);" ng-click="callback[1]()">{{btn[1]}}</a>
                            </div>
                        </div>
                      </div>`;

    //确认框展示
    function confirm(options) {
        createConfirm(options);
    };

    //确认框创建
    function createConfirm(options) {
        let scope = $rootScope.$new();
        options = angular.extend({
            title: '操作提示',
            content: '您确定进行当前操作吗？',
            scope: scope, //创建一个继承自根的作用域
            btn:['取消','确定'], //按钮文案定义
            callback: [] // 
        }, options||{});
        
        //文本
        let megPromise = $q.when(compileTmp({
            template: confirmTmp,
            scope: options.scope,
            appendTo: angular.element(document.body)
        }));
        megPromise.then((result) => {
            options.scope.btn = options.btn;
            options.scope.title = options.title;
            options.scope.content = options.content;
            options.scope.close = ($event) => {
                if(!$event||$event&&$event.target.className.indexOf('lw-confirm-')<0){
                    result.remove(); //移除消息展示
                    options.scope.$destroy();  //摧毁作用域
                }
            };
        }).then(()=>{
            console.log(angular.isFunction(options.callback),options)
            if(options.callback&&angular.isFunction(options.callback)){
                let callback = [];
                callback[0] = options.scope.close;
                callback[1] = ()=>{
                    options.callback();
                    options.scope.close();
                };
                options.scope.callback = callback;
            }else if(options.callback&&(options.callback[0]&&angular.isFunction(options.callback[0])
                ||options.callback[0]&&angular.isFunction(options.callback[1]))){
                let callback = [];
                callback[0] = ()=>{
                    options.callback[0]&&options.callback[0]();
                    options.scope.close();
                };
                callback[1] = ()=>{
                    options.callback[1]&&options.callback[1]();
                    options.scope.close();
                };
                options.scope.callback = callback;
            }else if(!options.callback||(!options.callback[0]&&!options.callback[1])){
                options.callback[0] = options.callback[0]||options.scope.close;
                options.callback[1] = options.callback[0]||options.scope.close;
                options.scope.callback = options.callback;
            }
            
        })
    }

    //编译模板
    function compileConfirm(options) {
        let tem = $compile(options.template)(options.scope);
        if (options.appendTo) {
            options.appendTo.append(tem);
        }
        return tem;
    };


    return dialog;
}]).name;