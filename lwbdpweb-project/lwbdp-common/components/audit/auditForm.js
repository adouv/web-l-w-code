/**
 * @Author hejialin
 * @Description 审核组件
 */


export default class auditForm{
    constructor($compile,$controller){
        this.restrict = 'EA';
        this.replace = true;
        this.$controller = $controller;
        this.$compile = $compile;
        this.scope = {
            ctrl:'=',
            formData:'=',
            currentTaskId:'=',
            projectDetail:'=',
            nextAuditInfo:'=',
            auditedTaskKey:'=',
            configCache:'=',
            backUrl:'=',
            attachmentType:'=',
            auditTask:'&',
            auditCancel:'&'
        };
        this.template = '<div id="review" class="review"></div>';
    }
    
    link(scope,elem,attrs){
        let template = null;
        scope.$watch('ctrl',ctrl=>{
            if(ctrl){
                if(angular.isFunction(ctrl)){
                    this.ctrlInit(ctrl.prototype,scope);
                    let newCtrl = this.$controller(scope.ctrl,{$scope:scope,$element:elem},true, attrs.ctrlAs);
                    // this.newCtrlInit(attrs.ctrlAs,scope);
                    scope.formData = scope.formData||{};
                    if(scope.configCache){
                        scope[attrs.ctrlAs].configCache = scope.configCache;
                        scope[attrs.ctrlAs].attachmentType = scope.attachmentType;
                    }
                    scope[attrs.ctrlAs].backUrl = scope.backUrl;
                    scope[attrs.ctrlAs]['project'] = scope.projectDetail;
                    scope[attrs.ctrlAs].isEdit = undefined;
                    scope[attrs.ctrlAs]['editForm'] = scope.formData;
                    template = newCtrl().getTemplate();
                    this.auditParamsInit(scope.formData,template,newCtrl.prototype,scope);
                    elem.append(this.$compile(template)(scope));
                }
            }
        });
        scope.$watch('auditedTaskKey',(key)=>{
            if(key){
                scope[attrs.ctrlAs].auditedTaskKey = key;
            }  
        });
        scope.$watch('nextAuditInfo',data=>{
            if(data){
                scope[attrs.ctrlAs]['nextAuditInfo'] = scope.nextAuditInfo;
                if(data&&data.nextAuditorQoList
                    &&data.nextAuditorQoList[0]&&!data.nextAuditorQoList[0].assigneeVar&&template){
                    scope.formData[data.assigneeVar] = data.nextAuditorQoList[0].accountId;
                }
                if(data&&data.taskInfoList
                    &&data.taskInfoList[0]){
                    let taskList = scope.nextAuditInfo.taskInfoList;
                    taskList.forEach(task=>{
                        scope.formData[task.assigneeVar] = task.nextAuditorQoList[0].accountId;
                    });
                }
                scope[attrs.ctrlAs]['editForm'] = scope.formData;
            }
        });
    }

    /**
     * formCtrl初始化
     * @param ctrl
     * @param scope
     */
    ctrlInit(ctrl,scope){
        ctrl.auditTask = (data)=>{
            scope.auditTask({formData:data})
        };
        ctrl.auditCancel = (flag)=>{
            scope.auditCancel({isEdit:flag})
        };
        ctrl.currentTaskId = scope.currentTaskId;
    }
    
    /**
     * 外置表单参数初始化
     * @param form
     */
    auditParamsInit(data,form,ctrl,scope){
        if(form.indexOf('editForm.approved')>-1)data.approved = 'true';
        if(form.indexOf('editForm.agreed')>-1)data.agreed = 'true';
        if(form.indexOf('editForm.comment.message')>-1)data.comment = {};
        if(form.indexOf('editForm.attachments')>-1)data.attachments = [];// 设置附件++
        if(form.indexOf('editForm.isDispose')>-1)data.isDispose = 'true';// 设置是否处置字段
    }

    /**
     * 获取下一步审核人字段key
     * @param form
     * @return {*}
     */
    getNextUserKey(form){
        if(form.indexOf('.editForm.nextOperator')>-1){
            return 'nextOperator';
        }else if(form.indexOf('.editForm.user')>-1){
            return 'user';
        }else if(form.indexOf('.editForm.handler')>-1){
            return 'handler';
        }
    }
}
