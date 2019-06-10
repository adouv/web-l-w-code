/**
 * @Author hejialin
 * @Description 表单验证指令
 */

export default class formSubmitValid{
    constructor(dialogsManager){
        this.require = '^?form';
        this.dialogsManager = dialogsManager;
        this.scope = {
            formSubmitValid:'&'
        };
    }
    
    link(scope,elem,attr,ctrl){
        let inputBlurEvent = (event)=>{
            let element = angular.element(event.target);
            element.removeClass('error');
            element.unbind('blur',inputBlurEvent);
        };
        
        elem.bind('click',()=>{
            let attrModelList = ctrl['$$controls'],
                isValidPass=true,
                targetElem=null;
            attrModelList.forEach(model=>{
                let element = model.$$element;
                if(model.$invalid){
                    element.addClass('error');
                    isValidPass = false;
                    model.change = true;
                    targetElem = !targetElem?model.$$element[0]:targetElem;
                }else{
                    element.removeClass('error');
                }
                element.unbind('blur',inputBlurEvent);
                element.bind('blur',inputBlurEvent);
            });
            if(!isValidPass){
                let scrollDom = document.querySelector('.main_content')||document.querySelector('.w5c-auto');
                if(scrollDom)scrollDom.scrollTop = targetElem.scrollTop + 'px';
                this.dialogsManager.showMessage('存在必填项未填写，请填写后再提交！',{className:'warning'});
            }
            if(attr.formSubmitValid&&isValidPass){
                scope.formSubmitValid();
            }
        })
    }
    
}