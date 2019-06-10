import '../styles/addProjectMaterial.css';
import baseForm from './base.form';
export default class uploadApproveMaterial extends baseForm{
    constructor(ProjectInterface,repairInterface,$stateParams,$scope,$filter,bdpInterface,dialogsManager,SelectItemService,ProjectService){
        super();
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.bdpInterface = bdpInterface;
        this.dialogsManager = dialogsManager;
        this.repairInterface = repairInterface;
        this.ProjectInterface = ProjectInterface;
        this.SelectItemService = SelectItemService;
        if(this.isEdit!==false){
            this.editForm.hasProject = true;
        }
        if(this.isEdit===undefined) {
            this.editForm.useCapitalNums = [];
            this.editForm.noFinanceTotalAmount = 0;
        }else{
            this.editForm = ProjectService.formatCacheData(this.editForm);
        }
        if(this.isEdit!==false){
            this.getApproveAmount();
        }
        this.getApplyProject();
        this.getCapitalNumber();

    }

    getApproveAmount(){
        this.ProjectInterface.getUsefulData(this.$stateParams.id).then(res=>{
            this.approveAmount = res.data.approveAmount.value;
        });
    }

    /**
     * 本次节点的表单详细信息
     */
    getApplyProject() {
        this.ProjectInterface.getApplicationDetail(
            moduleAlias.REPAIR,
            this.$stateParams.id
        ).then(res => {
            if(this.isEdit===undefined){
                this.editForm.gardenId = res.data.gardenId;
                this.editForm.gardenName = res.data.projectGarden;
                this.editForm.projectName = res.data.projectName;
            }
            //获取用户电话信息
            this.getAccountPhone(res.data.applyAccountId);
        })
    }

    /**
     * 校验手机号格式
     */
    validPhone(phone,showError) {
        let mobileRex = /^((\+?86)|(\+86))?(1[3|4|5|7|8][0-9]\d{8})$/;
        let phoneRex = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        this[showError] = !(mobileRex.test(phone) || phoneRex.test(phone));
    }
    
    /**
     * 获取联系人手机号
     * @param creatorId
     */
    getAccountPhone(creatorId) {
        this.repairInterface.getPersonPhone(creatorId).then(res => {
            let data = res.data;
            this.contact = data;
            if(this.isEdit===undefined){
                this.editForm.creatorName = data.displayName;
                this.editForm.cellphone = data.cellphone;
            }
        })
    }

    /**
     * 控制错误信息显示隐藏
     */
    showErrorMsg(show) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[show] = !this[show];
    }

    /**
     * 保存联系人
     */
    saveContact(callback){
        if(!this.showPhoneErrorIcon){
            if(this.contact.cellphone!=this.editForm.cellphone){
                this.contact.cellphone = this.editForm.cellphone;
                this.bdpInterface.saveContact(this.contact).then(res=>{
                    callback&&callback()
                });
            }else{
                callback&&callback()
            }
        }
    }

    /**
     * 配置服务商
     */
    chooseNumber(){
        this.fundnumber = true;
        /*this.SelectItemService.open({
            idField:'id',
            eachIds:this.editForm.capitalId,
            nameField:'name',
            title:'选择预算批复文号',
            selectItemTitle:'已选择的文号',
            itemList:this.capitalNumberList,
            callback:(data)=>{
                this.editForm.capitalId = data.ids;
                this.editForm.capitalNames = data.names;
                this.providerList = data.list;
            }
        })*/
    }

    amountNumber(list){
        if(angular.isArray(list)){
            if(list && list.length>0){
                let newArr = [];
                for(let data of list){
                    let fund = this.editForm.useCapitalNums.find((numData,index)=>{
                        if(numData.id==data.id){
                            numData.index = index;
                            return numData;
                        }
                    });
                    if(fund){
                        this.editForm.useCapitalNums[fund.index].amount += parseFloat(data.amount);
                    }else{
                        newArr.push(data);
                    }
                }
                this.editForm.useCapitalNums.push(...newArr);
            }
            this.sumTotalAmount(this.editForm.useCapitalNums);
        }else if(angular.isString(list)||angular.isNumber(list)){
            this.sumTotalAmount(null,list);
        }
    }

    sumTotalAmount(useCapitalNums,noFinanceAmount){
        if(useCapitalNums){
            this.editForm.financePublicAmount = 0;
            this.editForm.financeGovernmentAmount = 0;
            this.editForm.financeOtherAmount = 0;
            useCapitalNums.forEach(data=>{
                switch (data.nature){
                    case 'COMMON_BUDGET_CAPITAL':
                        this.editForm.financePublicAmount += parseFloat(data.amount);
                        break;
                    case 'GOVERNMENT_FUND_BUDGET':
                        this.editForm.financeGovernmentAmount += parseFloat(data.amount);
                        break;
                    case 'OTHER_CAPITAL':
                        this.editForm.financeOtherAmount += parseFloat(data.amount);
                        break;
                }
            });
            this.editForm.totalFinanceAmount = parseFloat(this.editForm.financePublicAmount) + parseFloat(this.editForm.financeGovernmentAmount) + parseFloat(this.editForm.financeOtherAmount);
        }
        if(noFinanceAmount){
            this.editForm.noFinanceTotalAmount = parseFloat(noFinanceAmount);
        }
        this.editForm.AllmoneyTotal = parseFloat(this.editForm.totalFinanceAmount||0) + parseFloat(this.editForm.noFinanceTotalAmount||0);
    }

    getCapitalNumber(){
        this.repairInterface.getCapitalNumber().then(res=>{
            // TODO 可分配金额未保存(未处理)
            if(this.isEdit===true){
                this.capitalNumberList = this.handleAvailAmount(res.data);
            }else{
                this.capitalNumberList = res.data;
            }
        })
    }

    // TODO 可分配金额未保存(未处理)
    handleAvailAmount(amountList){
        let list = angular.copy(amountList);
        this.editForm.useCapitalNums.map(data=>{
            let index = list.findIndex(amount=>{
                return amount.id == data.id;
            });
            amountList[index].availableAmount = parseFloat(amountList[index].availableAmount) - parseFloat(data.amount);
        });
        return amountList;
    }

    removeAmount(data,index){
        for(let amount of this.capitalNumberList){
            if(amount.id == data.id){
                amount.availableAmount = parseFloat(amount.availableAmount) + parseFloat(data.amount);
                break;
            }
        }
        this.rmAmount(data);
        this.editForm.useCapitalNums.splice(index,1);
    }

    rmAmount(data){
        switch (data.nature){
            case 'COMMON_BUDGET_CAPITAL':
                this.editForm.financePublicAmount = parseFloat(this.editForm.financePublicAmount) - parseFloat(data.amount);
                break;
            case 'GOVERNMENT_FUND_BUDGET':
                this.editForm.financeGovernmentAmount = parseFloat(this.editForm.financeGovernmentAmount) - parseFloat(data.amount);
                break;
            case 'OTHER_CAPITAL':
                this.editForm.financeOtherAmount = parseFloat(this.editForm.financeOtherAmount) - parseFloat(data.amount);
                break;
        }
        this.editForm.totalFinanceAmount = parseFloat(this.editForm.totalFinanceAmount) - parseFloat(data.amount);
        this.editForm.AllmoneyTotal = parseFloat(this.editForm.AllmoneyTotal) - parseFloat(data.amount);
    }

    saveAuditTask(){
        if(!this.showPhoneErrorIcon && !this.showPhoneErrorIcon1){
            this.saveContact(()=>{
                this.editForm.usefulVars = [{name:'projectApproval',value:JSON.stringify(this.editForm)}];
                this.auditing = true;
                if(this.isEdit!==undefined){
                    this.saveAuditInfo();
                }else{
                    this.auditTask(this.editForm);
                }
            })
        }
    }
    
    /**
     * 隐藏错误信息
     */
    hideErrorMsg(){
        this.showPhoneError = false;
        this.showPhoneError1 = false;
    }

    downloadDoc(filename){
       /* window.open('assets/'+filename);*/
        this.ProjectInterface.downloadFile('repair',filename);
    }

    cleanNoFinanceAmount(){
        this.editForm.AllmoneyTotal = parseFloat(this.editForm.AllmoneyTotal) - parseFloat(this.editForm.noFinanceTotalAmount);
        this.editForm.noFinanceTotalAmount = 0;
    }

    getTemplate(){
        return `
            <div class="repairDraft" ng-if="repairForm.isEdit===true||repairForm.isEdit===undefined"  ng-click="repairForm.hideErrorMsg()">
            <form class="w5c-form" novalidate name="addConfigForm">
                <div class="draft_title" ng-if="repairForm.propEdit===undefined">
                    <p class="draft_detail">添加项目立项材料</p>
                </div>
                <!-- 表格 -->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <caption>政府采购立项表</caption>
                        <tbody>
                        <tr>
                            <td class="oneTitle" colspan="5">
                                <span class="spanText">申请日期：</span>
                                <input style="padding-left: 120px;cursor:pointer;" type="text" class="input_class" id="date"
                                       lw-laydate='YYYY年MM月DD日' readonly='readonly'
                                       ng-model="repairForm.editForm.createDate" name="createDate" required>
                                </td>
                            <td colspan="3">
                                <span class="spanText">项目编号：</span>
                                <input style="padding-left: 80px"  type="text" class="input_class" maxlength="20"
                                       ng-model="repairForm.editForm.projectNo" placeholder="点击输入" name="projectNo" required>
                            </td>
                        </tr>
                        <tr>
                            <td width="38" rowspan="10">预算单位填写</td>
                            <td colspan="3">预算单位全称：{{ repairForm.editForm.gardenName }}</td>
                            <td width="110">联系人</td>
                            <td>
                                <span>{{repairForm.editForm.creatorName}}</span>
                            </td>
                            <td width="140">联系电话</td>
                            <td>
                                <input ng-disabled="!repairForm.phoneDisabled" auto-focus="repairForm.phoneDisabled"
                                       ng-blur="repairForm.validPhone(repairForm.editForm.cellphone,'showPhoneErrorIcon')"
                                       ng-model="repairForm.editForm.cellphone" type="text" class="input_class"
                                       placeholder="请输入手机号" name="cellphone" id="cellphone" required >
                                <span class="notEmptyPass" ng-show="repairForm.showPhoneErrorIcon" ng-click="repairForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="repairForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!repairForm.showPhoneErrorIcon" class="iconfont icon-edit col0096ff" ng-click="repairForm.phoneDisabled = !repairForm.phoneDisabled"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <span class="spanText">上级主管部门全称：</span>
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.superiorDepartment }}</span>
                                <input style="padding-left: 140px"  type="text" class="input_class"
                                       ng-model="repairForm.editForm.superiorDepartment" maxlength="50"
                                       placeholder="50个汉字以内，必填" name="superiorDepartment" required>
                            </td>
                            <td width="110">联系人</td>
                            <td>
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.superiorName }}</span>
                                <input  type="text" class="input_class" maxlength="10"
                                       ng-model="repairForm.editForm.superiorName" placeholder="10个汉字以内，必填"
                                       name="superiorName" required>
                            </td>
                            <td width="140">联系电话</td>
                            <td>
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.superiorCellphone }}</span>
                                <input  type="text"
                                       ng-blur="repairForm.validPhone(repairForm.editForm.superiorCellphone,'showPhoneErrorIcon1')"
                                       ng-model="repairForm.editForm.superiorCellphone" class="input_class"
                                       placeholder="必填" name="superiorCellphone" required
                                       ng-focus="repairForm.superiorCellphone = false">
                                <span class="notEmptyPass" ng-show="repairForm.showPhoneErrorIcon1" ng-click="repairForm.showErrorMsg('showPhoneError1')"></span>
                                <div class="right_format" ng-show="repairForm.showPhoneError1">请输入正确手机号</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="7">
                                <span class="spanText">项目名称：</span>
                                <span>{{ repairForm.editForm.projectName }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:60px !important" rowspan="4">资金来源情况
                            </td>
                            <td colspan="6">预算批复文号：
                            <button class="btn_bd" ng-click="repairForm.chooseNumber()">配置</button>
                            <div class="fund_number_list fund_middle" ng-repeat="data in repairForm.editForm.useCapitalNums track by $index">
                                <span>{{data.name}}({{data.amount}});</span>
                                <span class="delete_btn remove_button" ng-click="repairForm.removeAmount(data,$index)"></span>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" align="center">财政性资金</td>
                            <td align="center">非财政性资金（元）</td>
                            <td align="center">总计（元）</td>
                        </tr>
                        <tr>
                            <td width="180" align="center">小计（元）</td>
                            <td width="180" align="center">一般公共预算资金（元）</td>
                            <td width="180" align="center">政府性基金预算（元）</td>
                            <td width="180" align="center">其他资金（元）</td>
                            <td align="center" rowspan="2" class="td_clean_hover">
                                <div ng-show="!repairForm.show" class="amount_box">{{ repairForm.editForm.noFinanceTotalAmount*10000||0|ToFixed:2 }}</div>
                                <div class="clean_shadow" ng-click="repairForm.cleanNoFinanceAmount()">清零</div>
                            </td>
                            <td align="center" rowspan="2">
                                <span>{{ repairForm.editForm.AllmoneyTotal*10000||0|ToFixed:2 }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <span>{{ repairForm.editForm.totalFinanceAmount*10000||0|ToFixed:2 }}</span>
                            </td>
                            <td align="center">
                                <span>{{ repairForm.editForm.financePublicAmount*10000||0|ToFixed:2}}</span>
                            </td>
                            <td align="center">
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.financeGovernmentAmount*10000||0|ToFixed:2 }}</span>
                            </td>
                            <td align="center">
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.financeOtherAmount*10000||0|ToFixed:2 }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="7">
                                <span class="spanText">拟委托代理采购机构名称（必填）：</span>
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.delegationOrgan }}</span>
                                <input style="padding-left: 235px"  type="text"
                                       ng-model="repairForm.editForm.delegationOrgan" class="input_class" maxlength="50"
                                       placeholder="50个汉字以内，必填" name="delegationOrgan" required>
                            </td>
                        </tr>
                        <tr class="tab_height90">
                            <td>项目简介</td>
                            <td colspan="6">
                                <span ng-show="!repairForm.show">{{ repairForm.editForm.projectIntroduction }}</span>
                                <textarea  class="textarea_h100" placeholder="500个汉字以内，必填" maxlength="500"
                                          ng-model="repairForm.editForm. projectIntroduction" name="projectIntroduction"
                                          required></textarea>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="4">
                                <span class="tab_top">预算单位意见：</span>
                                <span class="textarea_h70">{{ repairForm.editForm.budgetUnitCommit }}</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                            <td colspan="3">
                                <span class="tab_top">上级主管部门意见：</span>
                                <span class="textarea_h70">{{ repairForm.editForm.directorCommit }}</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table class="itemTable">
                        <tbody>
                        <tr class="tab_height150">
                            <td width="38" rowspan="10">预算单位填写：</td>
                            <td width="50">财政主管科室意见</td>
                            <td colspan="2">
                                <span class="tab_top">财政主管科室意见：</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td width="50">采购管理科意见</td>
                            <td width="">
                                <div>
                                    <p>拟定采购组织形式：</p>
                                    <span>集中采购（）</span>
                                    <span>协议供货（）</span>
                                    <span>分散采购（）</span>
                                </div>
                                <div>
                                    <p>拟定采购方式：</p>
                                    <span>公开招标（）</span>
                                    <span>邀请招标（）</span>
                                    <span>竞争性谈判（）</span>
                                    <span>竞争性磋商（）</span>
                                    <span>询价（）</span>
                                    <span>单一来源采购（）</span>
                                    <span>其他（）</span>
                                </div>
                                <div>
                                    <span class="w40">其他需注明事项：</span>
                                    <span class="w30">经办人签字：</span>
                                    <span class="w30"> 年 月 日</span>
                                </div>
                            </td>
                            <td width="400">
                                <span class="tab_top">采购管理科科长意见：</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td width="50">主管局领导意见</td>
                            <td colspan="2">
                                <span class="tab_bottom">年 月 日</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 文件预览 -->
                <div class="file_preview">
                    <p class="file_preview_tit">
                        <span>立项申请</span>
                    </p>
                    <div class="file_preview_con">
                        <p class="col0096ff" style="text-align: right;"><em ng-click="repairForm.downloadDoc('立项申请.doc')">查看示例</em></p>
                        <neditor-area class="file_preview_list" ng-if="repairForm.isEdit!==false" id="approvalApply" required="true" ng-model="repairForm.editForm.approvalApply"></neditor-area>
                    </div>
                </div>
                <div class="file_preview">
                    <p class="file_preview_tit">
                        <span>项目申请</span>
                    </p>
                    <div class="file_preview_con">
                        <p class="col0096ff" style="text-align: right;"><em ng-click="repairForm.downloadDoc('项目说明.doc')">查看示例</em></p>
                        <neditor-area class="file_preview_list" ng-if="repairForm.isEdit!==false" id="projectApply" required="true" ng-model="repairForm.editForm.projectApply"></neditor-area>
                    </div>
                </div>
                <div class="reDraft_content2" >
                    <div class="reDraft_list">
                        <span class="width160 word_center">完成时间状态：</span>
                        <span class="green_color word_center">
                                <i ng-if="repairForm.nextAuditInfo.statusDescription==='正常'" class="green_color">正常</i>
                                <i ng-if="repairForm.nextAuditInfo.statusDescription==='临期'" class="yellow_color">临期</i>
                                <i ng-if="repairForm.nextAuditInfo.statusDescription!=='正常'&&repairForm.nextAuditInfo.statusDescription!=='临期'&&repairForm.nextAuditInfo.statusDescription"
                                   class="red_color">{{repairForm.nextAuditInfo.statusDescription}}</i>
                              </span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">最晚完成任务日期截点：</span>
                        <span class="word_center">{{ repairForm.nextAuditInfo.dueDate | date:'yyyy-MM-dd' }}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">下一步操作名称：</span>
                        <span class="word_center">{{ repairForm.nextAuditInfo.taskName }}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">下一步操作人：</span>
                        <select-options class="select_class selectW200 get_method" name="type" id="nextAuditor"
                                repeat-items="data in repairForm.nextAuditInfo.nextAuditorQoList" item-key="accountId"
                                ng-model="repairForm.editForm[repairForm.nextAuditInfo.assigneeVar]" ng-if="repairForm.nextAuditInfo.nextAuditorQoList[0]">
                                {{data.displayName}}<span>({{data.gardenName}})</span>
                        </select-options>
                        <span ng-if="!repairForm.nextAuditInfo.nextAuditorQoList[0]" class="word_center gray">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
                    </div>
                </div>
                <div class="reDraft_btn" style="padding:0">
                    <span class="btn_bd" ng-click="repairForm.isEdit!==undefined?closeThisDialog():repairForm.auditCancel()">取消</span>
                    <button class="btn_bg" ng-disabled="repairForm.auditing" form-submit-valid="repairForm.saveAuditTask()">确定</button>
                </div>
            </form>
        </div>
        <div class="repairDraft" ng-if="repairForm.isEdit===false">
            <div class="addTable_box">
                <div class="line_strip"></div>
                <table class="itemTable">
                    <caption>政府采购立项表</caption>
                    <tbody>
                    <tr>
                        <td class="oneTitle" colspan="5">
                            <span class="spanText">申请日期：</span>
                            <span>{{repairForm.detailForm.createDate}}</span>
                        </td>
                        <td colspan="3">
                            <span class="spanText">项目编号：</span>
                            <span>{{ repairForm.detailForm.projectNo }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td width="38" rowspan="10">预算单位填写</td>
                        <td colspan="3">预算单位全称：{{ repairForm.detailForm.gardenName }}</td>
                        <td width="110">联系人</td>
                        <td>
                            <span>{{ repairForm.detailForm.creatorName }}</span>
                        </td>
                        <td width="140">联系电话</td>
                        <td>
                            <span>{{repairForm.detailForm.cellphone}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <span class="spanText">上级主管部门全称：</span>
                            <span>{{ repairForm.detailForm.superiorDepartment }}</span>
                        </td>
                        <td width="110">联系人</td>
                        <td>
                            <span>{{ repairForm.detailForm.superiorName }}</span>
                        </td>
                        <td width="140">联系电话</td>
                        <td>
                            <span>{{ repairForm.detailForm.superiorCellphone }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="7">
                            <span class="spanText">项目名称：</span>
                            <span>{{ repairForm.detailForm.projectName }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:60px !important" rowspan="4">资金来源情况
                        </td>
                        <td colspan="6">预算批复文号：</td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">财政性资金</td>
                        <td align="center">非财政性资金（元）</td>
                        <td align="center">总计（元）</td>
                    </tr>
                    <tr>
                        <td width="180" align="center">小计（元）</td>
                        <td width="180" align="center">一般公共预算资金（元）</td>
                        <td width="180" align="center">政府性基金预算（元）</td>
                        <td width="180" align="center">其他资金（元）</td>
                        <td align="center" rowspan="2">
                            <span>{{ repairForm.detailForm.noAccountTotal*10000 }}</span>
                        </td>
                        <td align="center" rowspan="2">
                            <span>{{ repairForm.detailForm.AllmoneyTotal*10000 }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <span>{{ repairForm.detailForm.moneyTotal*10000 }}</span>
                        </td>
                        <td align="center">
                            <span>{{ repairForm.detailForm.accountPublic*10000 }}</span>
                        </td>
                        <td align="center">
                            <span>{{ repairForm.detailForm.accountGovernment*10000 }}</span>
                        </td>
                        <td align="center">
                            <span>{{ repairForm.detailForm.accountOther*10000 }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="7">
                            <span class="spanText">拟委托代理采购机构名称（必填）：</span>
                            <span>{{ repairForm.detailForm.delegationOrgan }}</span>
                        </td>
                    </tr>
                    <tr class="tab_height90">
                        <td>项目简介</td>
                        <td colspan="6">
                            <span>{{ repairForm.detailForm.projectIntroduction }}</span>
                        </td>
                    </tr>
                    <tr class="tab_height150">
                        <td colspan="4">
                            <span class="tab_top">预算单位意见：</span>
                            <span class="textarea_h70">{{ repairForm.detailForm.budgetUnitCommit }}</span>
                            <span class="tab_bottom"> 年 月 日</span>
                        </td>
                        <td colspan="3">
                            <span class="tab_top">上级主管部门意见：</span>
                            <span class="textarea_h70">{{ repairForm.detailForm.directorCommit }}</span>
                            <span class="tab_bottom"> 年 月 日</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="itemTable">
                    <tbody>
                    <tr class="tab_height150">
                        <td width="38" rowspan="10">预算单位填写：</td>
                        <td width="50">财政主管科室意见</td>
                        <td colspan="2">
                            <span class="tab_top">财政主管科室意见：</span>
                            <span class="tab_bottom"> 年 月 日</span>
                        </td>
                    </tr>
                    <tr class="tab_height150">
                        <td width="50">采购管理科意见</td>
                        <td width="">
                            <div>
                                <p>拟定采购组织形式：</p>
                                <span>集中采购（）</span>
                                <span>协议供货（）</span>
                                <span>分散采购（）</span>
                            </div>
                            <div>
                                <p>拟定采购方式：</p>
                                <span>公开招标（）</span>
                                <span>邀请招标（）</span>
                                <span>竞争性谈判（）</span>
                                <span>竞争性磋商（）</span>
                                <span>询价（）</span>
                                <span>单一来源采购（）</span>
                                <span>其他（）</span>
                            </div>
                            <div>
                                <span class="w40">其他需注明事项：</span>
                                <span class="w30">经办人签字：</span>
                                <span class="w30"> 年 月 日</span>
                            </div>
                        </td>
                        <td width="400">
                            <span class="tab_top">采购管理科科长意见：</span>
                            <span class="tab_bottom"> 年 月 日</span>
                        </td>
                    </tr>
                    <tr class="tab_height150">
                        <td width="50">主管局领导意见</td>
                        <td colspan="2">
                            <span class="tab_bottom">年 月 日</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="file_preview">
                <p class="file_preview_tit">
                    <span>立项申请</span>
                </p>
                <div class="file_preview_con">
                    <p class="col0096ff" style="text-align:right;"><em ng-click="repairForm.downloadDoc('立项申请.doc')">查看示例</em></p>
                    <div class="file_preview_list">
                    <div class="file_preview_list" compile-html='repairForm.detailForm.approvalApply'></div>
                    </div>
                </div>
            </div>
            <div class="file_preview">
                <p class="file_preview_tit">
                    <span>项目申请</span>
                </p>
                <div class="file_preview_con">
                    <p class="col0096ff" style="text-align:right;"><em ng-click="repairForm.downloadDoc('项目说明.doc')">查看示例</em> </p>
                    <div class="file_preview_list">
                    <div class="file_preview_list" compile-html='repairForm.detailForm.projectApply'></div>
                    </div>
                </div>
            </div>
            <div class="report_btn bottom_btn">
                <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
            </div>
        </div>
        
        <dialog ng-if="repairForm.fundnumber" modal>
            <div dialog-content>
                <choose-fund-number show="repairForm.fundnumber" max-amount='repairForm.approveAmount' current-amount="repairForm.editForm.AllmoneyTotal" list="repairForm.capitalNumberList" callback="repairForm.amountNumber(avalData)"></choose-fund-number>
            </div>
        </dialog>
        `
    }
}
uploadApproveMaterial.$inject = ['ProjectInterface','repairInterface','$stateParams','$scope','$filter','bdpInterface','dialogsManager','SelectItemService','ProjectService'];
