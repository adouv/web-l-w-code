/**
 * @Author hejialin
 * @Description 描述
 */
import validCtrl from '../services/baseValidate';
export default class uploadCapitalProve extends validCtrl {
    constructor(purchaseInterface, ProjectInterface, $scope, dialogsManager, purchaseService, $location) {
        super();
        this.$scope = $scope;
        this.$location = $location;
        this.dialogsManager = dialogsManager;
        this.purchaseService = purchaseService;
        this.ProjectInterface = ProjectInterface;
        this.purchaseInterface = purchaseInterface;
        this.init();
    }

    init() {

        this.isHideType = [];
        if (this.isEdit === undefined) {
            this.editForm.attachments = [];
            this.editForm.appendCapitalDtoList = [{}];
            this.editForm.projectId = this.project.projectId;
            this.editForm.gardenName = this.project.projectGarden;
            this.getCapitalType();
        } else if (!this.editForm) {
            this.getFormData();
        }
        if (this.editForm && this.isEdit === true) {
            this.getCapitalType();
        }
    }

    /**
     * 获取表单数据
     */
    getFormData() {
        this.ProjectInterface.getTaskFormData(this.taskId).then(res => {
            this.editForm = {};
            if (this.isEdit === true) {
                this.editForm = res.data;
                this.getCapitalType();
            } else {
                this.editForm = res.data;
                this.editForm.appendCapitalDtoList = JSON.parse(res.data.usefulVars[1].value);
            }
            res.data.appendCapitalDtoList.forEach((data, index) => {
                this.controlType(data.category, index);
            });
        });
    }

    /**
     * 控制资金输入
     * @param data
     */
    controlAmount(data) {
        data.amount = this.validPrice(data.amount);
        if (data.availableAmount && data.amount > data.availableAmount) {
            data.amount = data.availableAmount;
        }
    }

    /**
     * 获取条件数据
     */
    getCapitalType() {
        let capitalList = this.editForm.appendCapitalDtoList;
        this.ProjectInterface.getCapitalNature().then(res => {
            this.natureList = res.data;
            if (capitalList && capitalList[0]) {
                capitalList[capitalList.length - 1].nature = this.natureList[0].itemValue;
            }
        });
        this.ProjectInterface.getCapitalCategory().then(res => {
            this.categoryList = res.data;
            if (capitalList && capitalList[0]) {
                capitalList[capitalList.length - 1].category = this.categoryList[0].itemValue;
            }
        });
        this.ProjectInterface.getCapitalSourceType().then(res => {
            let sourceTypeList = [];
            res.data.forEach(data => {
                if (data.parentCode == 'capitalNumber') sourceTypeList.push(data);
            });
            this.sourceTypeList = sourceTypeList;
            if (capitalList && capitalList[0]) {
                capitalList[capitalList.length - 1].type = this.sourceTypeList[0].itemValue;
            }
        });
    }

    /**
     * 初始化参数
     */
    paramsInit() {
        let capitalList = this.editForm.appendCapitalDtoList;
        capitalList[capitalList.length - 1].type = this.sourceTypeList[0].itemValue;
        capitalList[capitalList.length - 1].nature = this.natureList[0].itemValue;
        capitalList[capitalList.length - 1].category = this.categoryList[0].itemValue;
    }

    /**
     * 验证资金文号
     */
    validCapitalNumber(capital) {
        this.ProjectInterface.getCapitalNumber(capital.name).then(res => {
            if (res.data) {
                capital.totalAmount = res.data.totalAmount;
                capital.availableAmount = res.data.availableAmount;
                capital.executeYear = res.data.executeYear;
                capital.capitalId = res.data.id;
            } else {
                capital.capitalId = undefined;
                capital.totalAmount = undefined;
                capital.availableAmount = undefined;
                capital.executeYear = undefined;
            }
        });
    }

    /**
     * 控制资金文号类型
     */
    controlType(category, index) {
        this.isHideType[index] = category != 'FINANCE_CAPITAL';
    }

    /**
     * 操作资金文号数组
     * @param index
     */
    operateCapital(index) {
        if (index!==undefined) {
            this.editForm.appendCapitalDtoList.splice(index, 1);
        } else {
            this.editForm.appendCapitalDtoList.splice(index + 1, 0, {});
            this.paramsInit();
        }
    }

    /**
     * 审核保存数据
     */
    saveAuditData(data) {
        data.taskId = this.currentTaskId;
        this.purchaseInterface.saveCapitalInfo(data).then(res => {
            this.auditing = false;
            this.dialogsManager.showMessage('操作成功！', {
                className: 'success',
                callback: () => {
                    this.auditCancel();
                }
            });
        });
    }

    auditThisTask(data) {
        this.auditing = true;
        this.setCacheData(data);
        if (this.isEdit === undefined) {
            this.saveAuditData(data);
        } else {
            this.$scope.$emit('formData', data);
            this.$scope.closeThisDialog();
        }
    }

    /**
     * 设置需要存的数据
     */
    setCacheData(data) {
        this.purchaseService.setPurchaseCacheField(
            data,
            this.configCache.capitalProve.field,
            data.attachments
        );
        this.purchaseService.setPurchaseCacheField(
            data,
            this.configCache.capitalMaterialList.field,
            this.handleCapitalList(data.appendCapitalDtoList)
        );
        this.purchaseService.setPurchaseCacheField(
            data,
            this.configCache.budgetGarden.field,
            this.editForm.gardenName
        );
    }

    /**
     * 处理资金文号列表
     * @param appendCapitalDtoList
     * @returns {Array}
     */
    handleCapitalList(appendCapitalDtoList) {
        let capitalMaterialList = [];
        appendCapitalDtoList.forEach((data, index) => {
            let capitalMaterial = {};
            capitalMaterial.name = data.name;
            capitalMaterial.amount = data.amount;
            capitalMaterial.year = data.executeYear;
            if (!data.capitalId) {
                if (this.isHideType[index]) {
                    capitalMaterial.category = this.getNameByValue(this.categoryList, data.category);
                } else {
                    capitalMaterial.category = this.getNameByValue(this.categoryList, data.category) + '-' +
                        this.getNameByValue(this.sourceTypeList, data.type) + '-' +
                        this.getNameByValue(this.natureList, data.nature);
                }
            }
            capitalMaterialList.push(capitalMaterial);
        });
        return capitalMaterialList;
    }

    /**
     * 通过value获取name
     * @param list
     * @param vlaue
     * @returns {string}
     */
    getNameByValue(list, vlaue) {
        for (let data of list) {
            if (data.itemValue == vlaue) {
                return data.itemName;
            }
        }
    }

    getTemplate() {
        return `<div class="purchaseDraft" ng-if="purchaseForm.isEdit===undefined||purchaseForm.isEdit===true">
            <form class="w5c-form" novalidate name="addConfigForm">
                <div class="draft_title">
                    <p class="draft_detail_noBorder">{{purchaseForm.taskName}}</p>
                </div>
                <div class="reDraft_list width870">
                    <span class="width160 word_center">财政审定的项目名称：</span>
                    <input type="text" class="input_class w50 width600" ng-model='purchaseForm.editForm.projectName' placeholder="100个汉字以内，必填" required name="projectName">
                </div>
                <div class="dashed_wrapper" ng-repeat="capital in purchaseForm.editForm.appendCapitalDtoList track by $index">
                    <div class="pad-top-bottom10 bor_dashed">
                        <div class='icon_wrapper'>
                            <i class="iconfont icon-plus" ng-click="purchaseForm.operateCapital()"></i>
                            <i class="iconfont" ng-if="purchaseForm.editForm.appendCapitalDtoList.length>1" ng-click="purchaseForm.operateCapital($index)">一</i>
                        </div> 
                        <div class="reDraft_list width870">
                            <span class="width160 word_center">资金文号名称：</span>
                            <input type="text" class="input_class w50 width600" ng-blur="capital.name&&purchaseForm.validCapitalNumber(capital)" placeholder="100个汉字以内，必填" required ng-model="capital.name" name="capitalName{{$index}}">
                        </div>
                        <div class="pad-left-170 width870" ng-if="capital.availableAmount!==undefined && capital.availableAmount!==null">
                            <p class="color-green margin-bottom10">该资金文号在资金文号库中已存在，请直接在下部输入项目资金金额；</p>
                            <p class="margin-bottom10">该资金文号在资金文号库中已存在，资金总额 <span class="color-blue">{{capital.totalAmount|ToFixed:2}}</span>元，已分配 <span
                                    class="color-yellow">{{capital.totalAmount-capital.availableAmount|ToFixed:2}}</span>元，剩余可分配金额 <span class="color-green">{{capital.availableAmount|ToFixed:2}}</span>元；</p>
                        </div>
                        <div class="reDraft_list width870" ng-if="capital.availableAmount===undefined || capital.availableAmount===null">
                            <span class="width160 word_center">资金文号类型：</span>
                            <select-options class="select_class select_w160" ng-model="capital.category" name="category{{$index}}" required 
                                change="purchaseForm.controlType(capital.category,$index)"
                                repeat-items="category in purchaseForm.categoryList" item-key="itemValue"
                                >
                               {{category.itemName}}
                            </select-options>
                            <select-options class="select_class select_w160" ng-model="capital.type" name="sourceType{{$index}}" required ng-if="!purchaseForm.isHideType[$index]"
                                 repeat-items="source in purchaseForm.sourceTypeList" item-key="itemValue"
                            >
                                {{source.itemName}}
                            </select-options>
                            <select-options class="select_class select_w160" ng-model="capital.nature" name="nature{{$index}}" required ng-if="!purchaseForm.isHideType[$index]"
                                 repeat-items="nature in purchaseForm.natureList" item-key="itemValue"
                            >
                                {{nature.itemName}}
                            </select-options>
                        </div>
                        <div class="reDraft_list width870">
                            <span class="width160 word_center">项目资金额度：</span>
                            <input type="text" class="input_class w50 width400" name="money{{$index}}" ng-disabled="capital.availableAmount===0" ng-class="{'disabled':capital.availableAmount===0}" ng-change="purchaseForm.controlAmount(capital)" placeholder="正实数，最大支持15位，最多支持小数点后两位，必填" required ng-model="capital.amount">
                            <span class="width60d text-money">元；</span>
                        </div>
                        <div class="reDraft_list width870" ng-if="capital.availableAmount===undefined || capital.availableAmount===null">
                            <span class="width160 word_center">执行年度：</span>
                            <span class="input-box">
                            <input type="text" class="input_date_border width_160" id="year{{$index}}" name="executeYear" lw-laydate="YYYY" ng-model="capital.executeYear" readonly="readonly" required>
                            <label class="iconfont icon-dateYear long-input-icon"></label>
                        </span>
                        </div>
                    </div>
                </div>
                <!--上传-->
                <div class="reDraft_list width870">
                    <bdp-upload-file
                        required="true"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="项目资金证明原件扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.capitalProve}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list" style="border-bottom:1px dashed #dbe2ed;padding-bottom: 15px;">
                    <div class="width870">
                        <span class="width160 word_center">预算单位：</span>
                        <span class="word_center">{{purchaseForm.editForm.gardenName}}</span>
                    </div>
                </div>
                <div class="reDraft_content2">
                    <div class="reDraft_list">
                        <span class="width160 word_center">完成时间状态：</span>
                        <p class="word_center maleft10" ng-switch="purchaseForm.nextAuditInfo.statusName">
                            <span class="green_color" ng-switch-when="正常">正常</span>
                            <span class="yellow_color" ng-switch-when="临期">临期</span>
                            <span class="red_color" ng-switch-default="">{{purchaseForm.nextAuditInfo.statusName}}</span>
                        </p>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">最晚完成任务日期截点：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.dueDate|date:'yyyy/MM/dd'}}</span>
                    </div>
                    <div ng-repeat="nextAuditInfo in purchaseForm.nextAuditInfo.taskInfoList"> 
                        <div class="reDraft_list">
                            <span class="width160 word_center">下一步操作节点名称：</span>
                            <span class="word_center">{{nextAuditInfo.taskName}}</span>
                        </div>
                        <div class="reDraft_list">
                            <span class="width160 word_center">下一步操作人：</span>
                            
                            <select-options class="get_method selectWid400" ng-model="purchaseForm.editForm[nextAuditInfo.assigneeVar]" name="assigneeVar" repeat-items="data in nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                                {{data.displayName}} <span>（{{data.gardenName}}）</span>
                            </select-options>
                        </div>
                        <div class="reDraft_list" ng-if="nextAuditInfo.nextAuditorQoList.length<=0">
                            <p class="width160 word_center"></p>
                            <p class="word_center red_color"><i class="iconfont icon-alarmPrompt yellow_color"></i>系统检测到当前项目在下一节点无任何满足条件的操作用户接收，这将导致本项目永远无法推进，请迅速联系系统管理员配置相关节点操作用户！</p>
                        </div>
                    </div>
                </div>
                <div class="reDraft_btn" style="padding:0">
                    <button class="btn_bd" ng-click="purchaseForm.auditCancel(purchaseForm.isEdit)">取消</button>
                    <button class="btn_bg" type='submit' ng-disabled="purchaseForm.auditing || purchaseForm.nextAuditInfo.taskInfoList.nextAuditorQoList.length<=0" form-submit-valid="purchaseForm.auditThisTask(purchaseForm.editForm)">确定</button>
                </div>
            </form>
        </div>
        <div ng-if="purchaseForm.isEdit===false">
            <div class="reDraft_list width870">
                <span class="width160 word_center">财政审定的项目名称：</span>
                <span class="word_center">{{purchaseForm.project.projectName}}</span>
            </div>
            <div ng-repeat="data in purchaseForm.editForm.appendCapitalDtoList">
            <div class="reDraft_list width870">
                <span class="width160 word_center">资金文号名称：</span>
                <span class="word_center">{{data.name}}</span>
            </div>
            <div class="reDraft_list width870" ng-if="data.category">
                <span class="width160 word_center">资金文号类型：</span>
                <span class="word_center">{{data.category}}</span>
            </div>
            <div class="reDraft_list width870">
                <span class="width160 word_center">项目资金额度：</span>
                <span class="word_center">{{data.amount}}元</span>
            </div>
            <div class="reDraft_list width870" ng-if="data.year">
                <span class="width160 word_center">执行年度：</span>
                <span class="word_center">{{data.year}}年</span>
            </div>
            </div>
            <div class="reDraft_list width870" style="overflow:inherit;">
                <span class="width170 word_center">项目资金证明原件扫描件：</span>
                <div class="width600" style="display:inline-block;">
                    <pic-view ng-repeat="file in purchaseForm.editForm.attachments" file-name="file.name" file-path="file.url"></pic-view>
                </div>
            </div>
            <br>
            <div class="reDraft_list width870">
                <span class="width160 word_center">预算单位：</span>
                <span class="word_center">{{purchaseForm.editForm.gardenName}}</span>
            </div>
            <div class="reDraft_btn" style="padding:0">
                <button class="btn_bd" ng-click="closeThisDialog()">返回</button>
            </div>
        </div>
        `;
    }
}
uploadCapitalProve.$inject = ['purchaseInterface', 'ProjectInterface', '$scope', 'dialogsManager', 'purchaseService', '$location'];
