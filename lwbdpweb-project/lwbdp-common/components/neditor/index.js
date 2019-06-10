import './style.css';
export default class neditorComponent{
    constructor($config){
        this.replace = true;
        this.host = $config.HOST?$config.PROTOCOL+$config.HOST:'';
        this.require = '^ngModel';
        this.scope = {
            ngModel:'=',
            config:'=',
            required:'@',
            height:'@',
            width:'@'
        };
        this.template = `<div class="neditor">
            <input type="text" style="display: none !important;" ng-model="modelConent" ng-required="required" name="{{validName}}">
        </div>`;
    }

    link(scope,elem,attr){
        let ue = null,
            config = {
                change:null, // 输入内容改变触发
                focus:null, // 获取焦点触发
                ready:null // 初始化完成之后触发调用
            };
        scope.config && angular.extend(config,scope.config);
        let setGetValue = (ue)=>{
            this.monitor(ue, ()=>{
                scope.ngModel = ue.getContent();
                scope.$apply();
                scope.isApply = true;
                scope.modelConent = ue.getContentTxt().replace(/\s/g,'');
            });
        };

        let setStyle = (elem)=>{
            let editDom = elem.children().eq(1),editChildDom = editDom.children()[1];
            if(scope.height){
                editDom[0].style.height = scope.height+'px';
                editChildDom.style.height = scope.height+'px';
            }
            if(scope.width){
                editDom[0].style.width = scope.width+'px';
                editChildDom.style.width = scope.width+'px';
            }else{
                editDom[0].style.width = '100%';
                editChildDom.style.width = '100%';
            }
            elem.removeAttr('id');
        };

        let initEvent = (ue,elem)=>{
            this.focus(ue,()=>{
                let focus = config.focus;
                focus && typeof focus === 'function' && focus();
                elem.children().eq(0).removeClass('error');
            });
            // 执行ready方法
            ue.ready(()=>{
                setStyle(elem);
                elem.children().eq(1).children().eq(0).addClass('editor_error');
                config.ready && config.ready();
                let setcont = setTimeout(()=>{
                    scope.ngModel&&ue.setContent(scope.ngModel);
                    clearTimeout(setcont);
                    let gettext = setTimeout(()=>{
                        scope.modelConent = ue.getContentTxt().replace(/\s/g,'');
                        scope.$apply();
                        clearTimeout(gettext);
                    },500)
                },200);
            });
        };

        if(elem[0].id){
            let idName = elem[0].id;
            // 删除已存在的
            UE.delEditor(idName);
            ue = UE.getEditor(idName,{host:this.host,width:scope.width||'100%'});
            setGetValue(ue,config.monitor);
            scope.validName = idName+'Neditor';
            initEvent(ue,elem);
        }else{
            console.error('~标签缺少id属性')
        }
    }

    monitor(ue,fn){
        if(fn && typeof fn === 'function'){
            ue.addListener('selectionchange',fn);
        }
    }

    change(ue,fn){
        if(fn && typeof fn === 'function'){
            ue.addListener('selectionchange',fn);
        }
    }

    focus(ue,fn){
        if(fn && typeof fn === 'function'){
            ue.addListener('focus',fn);
        }
    }
}
