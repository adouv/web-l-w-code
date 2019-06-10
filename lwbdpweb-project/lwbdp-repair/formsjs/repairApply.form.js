export default class repairFormInputCtrl {
    constructor(RepairDictionaryInterface,$compile,$scope,dialogsManager,ProjectInterface,$location) {
        this.RepairDictionaryInterface = RepairDictionaryInterface;
        this.ProjectInterface = ProjectInterface;
        this.dialogsManager = dialogsManager;
        this.$compile = $compile;
        this.$location = $location;
        this.$scope = $scope;
        this.init();
    }

    init() {
        this.getConditionItems();
    }

    /**
     * 下拉框选择数据
     */
    getConditionItems() {
        this.RepairDictionaryInterface.getProjectCategory().then(res => {
            this.types = res.data;
        });
        this.RepairDictionaryInterface.getPriority().then(res => {
            this.prioritys = res.data;
        })
    }

    /**
     * 设置对应的属性名
     * @param list
     * @param id
     * @param key
     */
    getAttrName(list,id,key){
        for(let data of list){
            if(data.id==id){
                this.editForm[key] = data.name;
                break;
            }
        }
    }
    
    /**
     * 保存编辑的数据
     */
    saveProject(){
        this.$scope.$emit('formData',this.editForm);
        this.$scope.closeThisDialog();
    }

    /**
     * 编辑重新提交数据
     */
    auditSaveTask(data){
        this.ProjectInterface.updateApplication(moduleAlias.REPAIR, data).then(res => {
            this.dialogsManager.showMessage('操作成功！',{callback:()=>{
                this.auditCancel();
            }});
        });
    }
    
    /**
     * 表单模版
     * @return {string}
     */
    getTemplate(){
        return `
        <div class="repairForm" style="padding: 0 20px;" ng-if="repairForm.isEdit===true||repairForm.isEdit===undefined">
            <form class="w5c-form" novalidate name="Formd">
                <div class="reDraft_content">
                    <p class="f_size12">整体说明：所申报项目必须真实、准确，具有可行性</p>
                    <div class="reDraft_list">
                        <span class="w140 word_center">项目申报单位：</span>
                        <span class="word_center">{{ repairForm.editForm.gardenName}}</span>
                        <span ng-if="repairForm.visibleGardens.length>1" ng-click="repairForm.chooseGarden()"
                              class="iconfont icon-switch word_center switch_fos16"></span>
                        <input type="hidden" ng-model="repairForm.editForm.gardenId" required name="gardenId">
                        <span class="error" ng-if="!repairForm.editForm.gardenId&&repairForm.isVaild"
                              style="color:#ff272e;display: block;margin: 0 42px">此项不能为空</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">项目名称：</span>
                        <input ng-blur="repairForm.verificationProjectName()" ng-model="repairForm.editForm.name" maxlength="100" type="text" class="draft_input word_center" placeholder="100字以内，必填" name="name" required/>
                        <div class="draft_from">
                            <span class="w140 fl">&nbsp;</span>
                            <p class="declare fl">
                                *形如XXX维修工程、XXX改造工程，包含建筑物、设施或部位名称，不含学校名称，例如：教学楼外墙维修工程、室外暖气管道改造工程。一项目一报，杜绝打包申报。
                            </p>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 fl">项目内容：</span>
                        <div class="draft_from fl">
                            <textarea ng-model="repairForm.editForm.content" maxlength="1000" class="draft_input h100" placeholder="1000字以内，必填" name="content" required></textarea>
                            <p class="declare">*将所报项目作简要说明，比如维修改造的具体位置、数量、所用材质、最近一次维修改造时间等，项目内容与项目名称相符。</p>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 fl">申报理由：</span>
                        <div class="draft_from fl">
                            <textarea ng-model="repairForm.editForm.reason" maxlength="1000" class="draft_input h100" placeholder="1000字以内，必填" name="reason" required></textarea>
                            <p class="declare">*对申报项目的现状进行简要描述，阐述项目执行的必要性。</p>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 fl">备注：</span>
                        <div class="draft_from fl">
                            <textarea ng-model="repairForm.editForm.remarks" maxlength="1000" class="draft_input h100" placeholder="1000字以内，不必填" name="remarks"></textarea>
                            <p class="declare">*如有特殊情况，请在备注中说明。</p>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">年度项目优先级：</span>
                        <select-options class="select_class" ng-model="repairForm.editForm.priority" name="priority" required
                                change="repairForm.getAttrName(repairForm.prioritys,repairForm.editForm.priority,'priorityName')"
                                repeat-items="data in repairForm.prioritys" item-key="id"
                                >
                            {{data.name}}
                        </select-options>
                        <div class="draft_from">
                            <span class="w140 fl">&nbsp;</span>
                            <p class="declare fl">*请根据您学校在本年度的所有申报项目进行综合设置。</p>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">项目类别：</span>
                        <select-options class="select_class" ng-model="repairForm.editForm.category" name="type" required
                                change="repairForm.getAttrName(repairForm.types,repairForm.editForm.category,'categoryName')"
                                repeat-items="data in repairForm.types" item-key="id"
                                >
                            {{data.name}}
                        </select-options>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">项目联系人：</span>
                        <span class="word_center">{{ repairForm.editForm.creatorName }}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">联系人电话：</span>
                        <span class="word_center"
                              ng-show="!repairForm.phoneInputShow">{{ repairForm.editForm.cellphone }}</span>
                        <input ng-model="repairForm.editForm.cellphone" type="text" class="input_class word_center" placeholder="请输入手机号" ng-show="repairForm.phoneInputShow" name="cellphone" required>
                        <span class="iconfont icon-edit word_center" ng-click="repairForm.togglePhoneStatus()"ng-if="repairForm.togglePhoneButton"></span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">下一步操作名称：</span>
                        <span class="word_center">{{ repairForm.nextAuditInfo.taskName }}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w140 word_center">下一步操作人：</span>
                        <select-options class="selectWid400" ng-model="repairForm.editForm.nextOperator" name="nextOperator" required repeat-items="data in repairForm.nextAuditInfo.nextAuditorQoList" item-key="accountId">
                                {{data.displayName}}<span>({{data.gardenName}})</span>
                        </select-options>
                    </div>
                    <div class="reDraft_btn">
                        <span class="btn_bd" ng-click="closeThisDialog()">取消</span>
                        <span class="btn_bg" ng-click="repairForm.isVaild = true" form-submit-valid="repairForm.saveProject()">确定</span>
                    </div>
                </div>
            </form>
        </div>
        <div class="disposal_info" style='border:0;' ng-if='repairForm.isEdit===false'>
            <div class="reDraft_list">
                <span class="w120 word_center">项目申报单位：</span>
                <span class="word_center">{{repairForm.detailForm.gardenName}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center fl">项目名称：</span>
                <span class="word_center fl w850">{{repairForm.detailForm.name}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center fl">项目内容：</span>
                <span class="word_center fl w850">{{repairForm.detailForm.content}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center fl">申报理由：</span>
                <span class="word_center fl w850">{{repairForm.detailForm.reason}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center fl">备注：</span>
                <span class="word_center fl w850">{{repairForm.detailForm.remarks}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center">校内项目优先级：</span>
                <span class="word_center">{{repairForm.detailForm.priorityName}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center">项目类别：</span>
                <span class="word_center">{{repairForm.detailForm.categoryName}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center">项目联系人：</span>
                <span class="word_center">{{repairForm.detailForm.creatorName}}</span>
            </div>
            <div class="reDraft_list">
                <span class="w120 word_center">联系人电话：</span>
                <span class="word_center">{{repairForm.detailForm.cellphone}}</span>
            </div>
            <div class="report_btn bottom_btn">
                <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
            </div>
        </div>
        `;
    }
}
repairFormInputCtrl.$inject = ['RepairDictionaryInterface','$compile','$scope','dialogsManager','ProjectInterface','$location'];
