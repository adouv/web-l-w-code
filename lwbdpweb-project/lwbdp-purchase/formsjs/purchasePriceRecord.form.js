/**
 * @Author hejialin
 * @Description 描述
 */
import validCtrl from '../services/baseValidate'
export default class purchasePriceRecord extends validCtrl {
    constructor(SelectItemService, purchaseInterface, $stateParams, ProjectInterface, $sessionStorage, dialogsManager, $q, purchaseService, ProjectService, $scope, $filter) {
        super();
        this.$q = $q;
        this.$scope = $scope;
        this.$filter = $filter;
        this.SelectItemService = SelectItemService;
        this.ProjectInterface = ProjectInterface;
        this.$stateParams = $stateParams;
        this.dialogsManager = dialogsManager;
        this.$sessionStorage = $sessionStorage;
        this.purchaseService = purchaseService;
        this.ProjectService = ProjectService;
        this.purchaseInterface = purchaseInterface;
        this.init();
    }

    init() {
        if (this.isEdit === undefined) {
            this.getPurchaseProject(() => {
                this.getNextAuditInfo();
                this.getUsefulData(() => {
                    this.paramsInit()
                });
            });
        } else {
            if (!this.editForm) {
                this.editForm = {};
                this.ProjectInterface.getTaskFormData(this.taskId).then(res => {
                    this.getNextAuditInfo();
                    this.formData = this.ProjectService.formatCacheData(res.data.properties); //nextStepCount
                    this.editForm = angular.copy(this.formData);
                });
            }else{
                this.getNextAuditInfo();
            }
            this.getPurchaseProject();
            this.getUsefulData();
        }
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.editForm.projectName = this.project.projectName;
        if (this.isBargain) {
            this.editForm.bidIndex = 0;
            this.editForm.purchaseList = [{}];
            this.editForm.tenderMethod = '询价';
            this.editForm.providerUnitIds = [];
            this.importUrl = this.purchaseInterface.getImportUrl(this.purchaseInterface.templateType.APPROVALOUTCATALOGENQUIRY);
            this.editForm.bidUnitId = this.providerList[0].gardenId;
            this.providerList.forEach(data => {
                this.editForm.providerUnitIds.push(data.gardenId)
            });
            this.editForm.nameAndNumber = '一批';
            this.editForm.bidResult = `    ${this.project.projectName}，${this.editForm.purchaseCompanyName}按政府采购程序以询价方式进行采购。${this.$filter('date')(new Date(),'yyyy年MM月dd日')}，${this.editForm.purchaseCompanyName},组织专业人员对“${this.providerList[0].gardenName}”等三家投标供应商送达的报价文件进行了审核。${this.editForm.purchaseCompanyName}依据“政府采购法”和“顺义区政府采购程序”的有关规定，本着公开、公正、透明的原则对三家投标供应商送达报价文件进行了评定，评定结果如下：`;
        } else {
            this.editForm.providerUnitId = this.providerList[0].gardenId;
            let budgePrice = 0;
            this.editForm.purchaseList.forEach(data => {
                budgePrice += data.price * data.number;
            });
            this.editForm.budgePrice = budgePrice.toFixed(2);
            this.editForm.bargainResult = `    “${this.project.projectName}”项目，${this.editForm.purchaseCompanyName}按照顺义区财政局办公家具定点协议供货程序规定以议价方式进行采购。${this.$filter('date')(new Date(),'yyyy年MM月dd日')}，${this.editForm.purchaseCompanyName}组织专业人员与“${this.providerList[0].gardenName}” 对“${this.project.projectName}”项目中的办公家具价格进行了议价协商。${this.editForm.purchaseCompanyName}依据顺义区财政局办公家具协议供货采购程序的有关规定，本着公开、公正、透明的原则最终评定该项目议价后金额  元，大写：  元整。`;
        }
    }

    /**
     * 获取所有采购方式
     */
    getPurchaseMethod(purchaseMethod) {
        this.purchaseInterface.getPurchaseMethod().then(res => {
            this.purchaseMethods = res.data;
            for (let method of res.data) {
                if (method.itemValue == purchaseMethod) {
                    this.editForm.purchaseMethodName = method.itemName;
                    break;
                }
            }
        });
    }

    /**
     * 获取下一步审核人信息
     */
    getNextAuditInfo() {
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId,
            this.$sessionStorage.get('currentGarden').gardenId,
            'approved', true
        ).then(res => {
            this.nextAuditInfo = {};
            this.nextAuditInfo.nextTaskInfoList = res.data.nextTaskInfoList[0];
            this.nextAuditInfo.dueDate = res.data.dueDate;
            this.nextAuditInfo.statusName = res.data.statusDescription;
            if(!this.editForm.leaderId){
                this.editForm.leaderId = this.nextAuditInfo.nextTaskInfoList.nextAuditorQoList[0].accountId;
            }
        });
    }

    /**
     * 计算总价格
     * @param data
     */
    getTotalPrice(data, allTotalPrice, attrName, hasNumber) {
        attrName = attrName || 'bargainPrice';
        data[attrName] = data[attrName] && this.validPrice(data[attrName] || 0);
        if (hasNumber) {
            data.number = data.number && this.validNumber(data.number || 0);
        }
        let price = (data[attrName] || 0) * data.number;
        data.totalPrice = price ? price.toFixed(2) : 0;
        let totalPrice = 0;
        this.editForm.purchaseList.forEach(price => {
            totalPrice += price.totalPrice * 1;
        });
        this.editForm[allTotalPrice] = totalPrice ? totalPrice.toFixed(2) : 0;

    }

    /**
     * 校验中标结果单位
     * @return {boolean}
     */
    validBidResult() {
        if (this.isBargain) {
            for (let provider of this.providerList) {
                if (this.editForm.providerUnitIds.indexOf(provider.gardenId) < 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 获取特殊节点5信息
     */
    getPurchaseProject(callback) {
        this.purchaseInterface.getPurchaseProject(this.$stateParams.id).then(res => {
            this.isBargain = res.data.purchaseMethod == 'OUT_CATALOG';
            if (this.isEdit === undefined) {
                this.getPurchaseMethod(res.data.purchaseMethod);
                this.editForm.purchaseCompanyName = res.data.purchaseCompanyName || res.data.approvalCompany;
                this.editForm.purchaseList = res.data.list;
                this.editForm.projectNo = res.data.projectNum;
            }
            callback && callback()
        });
    }

    /**
     * 确定审核
     */
    auditThisTask() {
        if (!this.validBidResult()) {
            this.dialogsManager.showMessage('预中标结果中的中标单位不能重复！', { className: 'warning' });
            return;
        }
        if (this.editForm.memberIds.indexOf(this.editForm.leaderId) > -1) {
            this.dialogsManager.showMessage('组长和组员成员不能重复！', { className: 'warning' });
            return;
        }
        let userField = this.nextAuditInfo.nextTaskInfoList.assigneeVar;
        this.editForm.multi = userField;
        this.editForm[userField] = this.editForm.memberIds + ',' + this.editForm.leaderId;
        this.getNextAuditorName();
        this.cacheUsefulData();
        this.auditing = true;
        if (this.isEdit === undefined) {
            this.auditTask(this.editForm);
        } else {
            this.$scope.$emit('formData', this.editForm);
            this.$scope.closeThisDialog();
        }
    }

    /**
     * 获取下一步审核人（组长名称）
     */
    getNextAuditorName() {
        let nextAuditInfo = this.nextAuditInfo.nextTaskInfoList;
        let nextAuditors = nextAuditInfo.nextAuditorQoList;
        for (let auditor of nextAuditors) {
            if (auditor.accountId == this.editForm.leaderId) {
                this.editForm.nextAuditorName = auditor.displayName + '（' + auditor.gardenName + '）';
                break;
            }
        }
    }

    /**
     * 缓存需要使用的数据
     */
    cacheUsefulData() {
        if (this.isBargain) {
            this.purchaseService.setPurchaseCacheField(this.editForm,
                this.configCache.bidUnitGoodsList.field,
                this.editForm.purchaseList
            );
            this.purchaseService.setPurchaseCacheField(this.editForm,
                this.configCache.bidGarden.field,
                this.providerList[this.editForm.bidIndex].gardenName
            );
            this.purchaseService.setPurchaseCacheField(this.editForm,
                this.configCache.bidAmount.field,
                this.providerList[this.editForm.bidIndex].quotePrice
            );
            this.purchaseService.setPurchaseCacheField(this.editForm,
                this.configCache.providerList.field,
                this.providerList
            );
        } else {
            for (let i = 0, len = this.providerList.length; i < len; i++) {
                if (this.editForm.providerUnitId == this.providerList[i].gardenId) {
                    this.purchaseService.setPurchaseCacheField(this.editForm,
                        this.configCache.bidGarden.field,
                        this.providerList[i].gardenName
                    );
                }
            }
            this.purchaseService.setPurchaseCacheField(this.editForm,
                this.configCache.bidAmount.field,
                this.editForm.totalPrice
            );
        }
        this.purchaseService.setPurchaseCacheField(this.editForm,
            this.configCache.bargainPriceOrder.field,
            this.editForm
        );
    }

    /**
     * 获取使用数据
     */
    getUsefulData(callback) {
        this.ProjectInterface.getUsefulData(this.$stateParams.id).then(res => {
            let field = this.configCache.providerList.field;
            this.providerList = JSON.parse(res.data[field].value);
            callback && callback()
        });
    }

    /**
     * 选择下一步审核人
     */
    selectNextAuditAuditor() {
        let nextAuditInfo = this.nextAuditInfo.nextTaskInfoList;
        this.SelectItemService.open({
            idField: 'accountId',
            eachIds: this.editForm.memberIds || [],
            nameField: 'displayName',
            className: 'lw-next-auditor',
            title: '配置成员',
            selectItemTitle: '已选择的成员',
            itemList: nextAuditInfo.nextAuditorQoList,
            callback: (data) => {
                this.editForm.memberIds = data.ids.toString();
                this.editForm.memberNames = data.names ? data.names.join('；') + '；' : '';
            }
        })
    }

    /**
     * 根据中标单位获取中标价格
     */
    getbidAmount(id) {
        for (let i = 0, len = this.providerList.length; i < len; i++) {
            let provider = this.providerList[i];
            if (provider.gardenId == id) {
                this.editForm.bidIndex = i;
                break;
            }
        }
    }

    /**
     * 控制金额输入
     * @param data
     * @param attrName
     */
    controlAmount(data, attrName) {
        data[attrName] = this.validPrice(data[attrName]);
    }

    /**
     * 下载采购模版
     */
    downloadTemplate(type) {
        this.purchaseInterface.downloadTemplate(type);
    }

    /**
     * 导入成功
     * @param data
     * @param file
     */
    importSuccess(data, file, flag) {
        this.purchaseService.importError(data, file, list => {
            let purchase = this.editForm.purchaseList[this.editForm.purchaseList.length - 1],
                isEmpty = true;
            for (let key in purchase) {
                if (purchase[key]) {
                    isEmpty = false;
                    break;
                }
            }
            if (isEmpty) {
                this.editForm.purchaseList.splice(this.editForm.purchaseList.length - 1, 1);
            }
            this.editForm.purchaseList.push(...list);
            this.editForm.bidTotalPrice = 0;
            this.editForm.purchaseList.forEach(data => {
                if (data.price && data.number) {
                    data.totalPrice = (data.price * data.number).toFixed(2);
                    this.editForm.bidTotalPrice += data.price * data.number;
                }
            });
            this.editForm.bidTotalPrice = this.editForm.bidTotalPrice.toFixed(2)
        })
    }

    removeLine(list, index) {
        list.splice(index, 1);
    }

    addLine(list, index) {
        list.splice(index + 1, 0, {});
    }

    getTemplate() {
        return `<div class="purchaseDraft">
            <form class="w5c-form" name="addConfigForm" novalidate>
                <div class="draft_title">
                    <p class="draft_detail">{{purchaseForm.taskName}}</p>
                </div>
                <div ng-if="!purchaseForm.isBargain">
                <p class="file_preview_tit">
                    <span><i class="color-purple">{{purchaseForm.editForm.purchaseMethodName}}</i>对应的协议采购供货议价记录</span>
                </p>
                <div class="name_time">
                    <div class="name_time_left">编号：{{purchaseForm.editForm.projectNo}}</div>
                    <div class="name_time_left">项目名称：{{purchaseForm.editForm.projectName}}</div>
                </div>
                <!--彩色线条-->
                <div class="line_strip"></div>
                <table class="itemTable">
                    <tr>
                        <td width="150" class="text-center">议价地点</td>
                        <td>
                            <input type="text" class="input_class" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.address" maxlength="20" placeholder="20个汉字以内,必填" required name="area">
                        </td>
                        <td width="100" class="text-center">日期</td>
                        <td width="200">
                            <input type="text" class="input_date td_ab" style="padding-left:10px;" ng-if="purchaseForm.isEdit!==false" id="taskTimeStart" lw-laydate='YYYY-MM-DD' required name="laydate" ng-model="purchaseForm.editForm.createDate" readonly="readonly" placeholder="时间">
                            <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.createDate}}</span>
                            <label class="iconfont icon-llreservecalendar col0096ff" ng-if="purchaseForm.isEdit!==false"></label>
                        </td>
                    </tr>
                </table>
                <table class="itemTable">
                    <tr>
                        <td width="150" class="text-center">预算金额（元）</td>
                        <td width="300">{{purchaseForm.editForm.budgePrice}}</td>
                        <td width="200">供货单位名称</td>
                        <td>
                            <select-options class="select_class get_method" style="width:100%;" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.providerUnitId" name="providerUnit" required
                                repeat-items="provider in purchaseForm.providerList" item-key="gardenId"
                            >
                                {{provider.gardenName}}
                            </select-options>
                        </td>
                    </tr>
                </table>
                <table class="itemTable">
                    <tr>
                        <td class="text_center">详细议价情况</td>
                    </tr>
                </table>
                <table class="itemTable">
                    <tr class="productOrder-table">
                        <td width="100">设备名称</td>
                        <td>品牌型号</td>
                        <td width="130">数量</td>
                        <td width="150">最高跟价单位（元）</td>
                        <td width="130">议价单价（元）</td>
                        <td width="200">小计（元）</td>
                    </tr>
                    <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.purchaseList track by $index">
                        <td>{{data.category}}</td>
                        <td>{{(data.brand||'')+(data.specifications||'')}}</td>
                        <td>{{data.number}}</td>
                        <td>{{data.price}}</td>
                        <td>
                            <input type="text" ng-change="purchaseForm.getTotalPrice(data,'totalPrice')" ng-disabled="purchaseForm.isEdit===false" ng-model="data.bargainPrice" class="input_class" placeholder="正实数，必填" name="bargainPrice{{$index}}" required>
                        </td>
                        <td>{{data.totalPrice||0}}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colspan="3" class="text_center">合计人民币大写：{{purchaseForm.editForm.totalPrice||0|numberToUpperCase}}</td>
                        <td colspan="2">
                            <span>{{purchaseForm.editForm.totalPrice||0}}元</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="text_center">议价结果</td>
                        <td colspan="5">
                            <textarea class="area_auto" id="bargainResult" contenteditable="true" style="height:200px;" required name="bargainResult" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.bargainResult" placeholder="500个汉字以内，必填" maxlength="500"></textarea>
                            <p> </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text_center">最终合同价格</td>
                        <td colspan="5">
                            <span class="margin-right">人民币（大写）：{{purchaseForm.editForm.totalPrice||0|numberToUpperCase}}</span>
                            <span>¥：{{purchaseForm.editForm.totalPrice||0}}元</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="text_center">组长</td>
                        <td colspan="5">
                            <select-options class="select_class get_method" ng-model="purchaseForm.editForm.leaderId" ng-if="purchaseForm.isEdit!==false" required name="nextOperator"
                                repeat-items="data in purchaseForm.nextAuditInfo.nextTaskInfoList.nextAuditorQoList track by $index" item-key="accountId"
                            >
                               {{data.displayName}}<span>（{{data.gardenName}}）</span>
                            </select-options>
                            <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.nextAuditorName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center">组员</td>
                        <td colspan="5">
                            <button class="btn_bd" ng-click="purchaseForm.selectNextAuditAuditor()" ng-if="purchaseForm.isEdit!==false" >选择</button>
                            <p>
                                <input type="text" class="none" ng-model="purchaseForm.editForm.memberNames" required name="memberNames"/>
                                <span class="color_error" ng-if="addConfigForm.memberNames.change&&addConfigForm.memberNames.$invalid">此项不能为空</span>
                                {{purchaseForm.editForm.memberNames}}
                            </p>
                        </td>
                    </tr>
                </table>
                </div>
                <div ng-if="purchaseForm.isBargain">
                <!--分级标题-->
                <p class="file_preview_tit">
                    <span><i class="color-purple">{{purchaseForm.editForm.purchaseMethodName}}</i>对应的询价开标记录</span>
                </p>
                <!--申请日期和编号等-->
                <div class="name_time">
                    <div class="name_time_left">招标编号：{{purchaseForm.editForm.projectNo}}</div>
                    <div class="name_time_left">项目名称：{{purchaseForm.editForm.projectName}}</div>
                </div>
                <!--彩色线条-->
                <div class="line_strip"></div>
                <!--表格-->
                <table class="itemTable">
                    <tr>
                        <td width="100" class="text-center">开标地点</td>
                        <td>
                            <input type="text" class="input_class" placeholder="20个汉字以内,必填" maxlength="20" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.bidAddress" required name="bidAddress">
                        </td>
                        <td width="100" class="text-center">日期</td>
                        <td width="200">
                            <input type="text" class="input_date" id="taskTimeStart" lw-laydate='YYYY-MM-DD' required ng-if="purchaseForm.isEdit!==false" name="laydate" ng-model="purchaseForm.editForm.createDate" readonly="readonly" placeholder="时间">
                            <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.createDate}}</span>
                            <label class="iconfont icon-llreservecalendar col0096ff" ng-if="purchaseForm.isEdit!==false"></label>
                        </td>
                    </tr>
                    <tr>
                        <td width="150" class="text-center">货物名称及数量</td>
                        <td>
                            <textarea class="area_auto" required name="nameAndNumber" ng-model="purchaseForm.editForm.nameAndNumber" ng-disabled="purchaseForm.isEdit===false" placeholder="100个汉字以内，必填" maxlength="100"></textarea><p></p>
                        </td>
                        <td width="100" class="text-center">招标方式</td>
                        <td width="200">
                            <input type="text" class="input_class" ng-model="purchaseForm.editForm.tenderMethod" ng-disabled="purchaseForm.isEdit===false" placeholder="10个汉字以内,必填" required name="tenderMethod" maxlength="10">
                        </td>
                    </tr>
                    <tr>
                        <td width="150" class="text-center" rowspan="{{purchaseForm.providerList.length+1}}">投标单位</td>
                        <td class="text-center">投标单位名称</td>
                        <td width="100" class="text-center" colspan="2">报价（元）</td>
                    </tr>
                    <tr ng-repeat="provider in purchaseForm.providerList track by $index">
                        <td class="text-center">{{provider.gardenName}}</td>
                        <td width="100" colspan="2">
                            <input type="text" class="input_class" placeholder="正实数，默认小数点后两位" maxlength="15" ng-disabled="purchaseForm.isEdit===false" ng-change="purchaseForm.controlAmount(provider,'quotePrice')" ng-model="provider.quotePrice" required name="quotePrice{{$index}}">
                        </td>
                    </tr>
                    <tr>
                        <td width="150" class="text-center">预中标结果</td>
                        <td colspan="3">
                            <textarea class="area_auto" required name="bidResult" style="height:150px;" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.bidResult" maxlength="500" placeholder="500个汉字以内，必填"></textarea>
                            <p class="margin-bottom10" ng-repeat="data in purchaseForm.providerList">
                                {{$index+1}}.
                                <select-options class="select_class get_method" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.providerUnitIds[$index]" name="providerUnit{{$index}}" required
                                    repeat-items="provider in purchaseForm.providerList" item-key="gardenId"
                                >
                                    {{provider.gardenName}}
                                </select-options>
                            </p>
                            <p class="margin-bottom10">
                                经小组成员评定：
                                <select-options class="select_class get_method" ng-model="purchaseForm.editForm.bidUnitId" ng-disabled="purchaseForm.isEdit===false" ng-change="purchaseForm.getbidAmount(purchaseForm.editForm.bidUnitId)" name="bidUnitId" required
                                 repeat-items="provider in purchaseForm.providerList" item-key="gardenId"
                                >
                                    {{provider.gardenName}}
                                </select-options>
                                单位。成交供应商合同金额为：{{purchaseForm.providerList[purchaseForm.editForm.bidIndex].quotePrice||0}}元
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text_center">最终报价</td>
                        <td colspan="3">
                            <span class="margin-right">人民币（大写）：{{purchaseForm.providerList[purchaseForm.editForm.bidIndex].quotePrice||0|numberToUpperCase}}</span>
                            <span>¥：{{purchaseForm.providerList[purchaseForm.editForm.bidIndex].quotePrice||0}}元</span>
                        </td>
                    </tr>
                </table>
                <table class="itemTable">
                    <tr>
                        <td colspan="9" class="text_center">最终中标单位＂{{purchaseForm.providerList[purchaseForm.editForm.bidIndex].gardenName}}＂的报价清单：
                            <div class="down_import" ng-if="purchaseForm.isEdit!==false">
                                <import-file url="purchaseForm.importUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile)"></import-file>
                                <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.purchaseInterface.templateType.APPROVALOUTCATALOGENQUIRY)">模板下载</span>
                            </div>
                        </td>
                    </tr>
                    <tr class="productOrder-table">
                        <td width="70">序号</td>
                        <td width="200" colspan="2">设备名称</td>
                        <td width="130">品牌</td>
                        <td>规格型号</td>
                        <td width="70">数量</td>
                        <td width="100">单位</td>
                        <td width="130">单价（元）</td>
                        <td width="166">小计（元）</td>
                    </tr>
                    <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.purchaseList track by $index">
                        <td>
                            <span>{{$index+1}}</span>
                            <span class="add_minus">
                                <i class="iconfont icon-minus" ng-show="purchaseForm.editForm.purchaseList.length>1" ng-click="purchaseForm.removeLine(purchaseForm.editForm.purchaseList,$index)"></i>
                                <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.editForm.purchaseList,$index)"></i>
                            </span>
                        </td>
                        <td colspan="2">
                            <input type="text" class="input_class" ng-model="data.itemName" placeholder="50个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" required name="itemName{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="20个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="data.brand" required name="brand{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="20个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" maxlength="20" ng-model="data.category" required name="specifications{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="正整数，必填" ng-disabled="purchaseForm.isEdit===false" maxlength="10" ng-change="purchaseForm.getTotalPrice(data,'bidTotalPrice','price',true)" ng-model="data.number" required name="num{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="必填" ng-disabled="purchaseForm.isEdit===false" ng-model="data.unit" required name="unit{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="必填" ng-disabled="purchaseForm.isEdit===false" ng-model="data.price" ng-change="purchaseForm.getTotalPrice(data,'bidTotalPrice','price',true)" required name="price{{$index}}">
                        </td>
                        <td>
                            <span>{{data.totalPrice||0}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right">总计</td>
                        <td colspan="1">
                            {{purchaseForm.editForm.bidTotalPrice||0}}
                        </td>
                    </tr>
                    <tr>
                        <td class="text_center">组长</td>
                        <td colspan="8">
                            <select-options class="select_class get_method" ng-model="purchaseForm.editForm.leaderId" ng-if="purchaseForm.isEdit!==false" required name="nextOperator"
                            repeat-items ="data in purchaseForm.nextAuditInfo.nextTaskInfoList.nextAuditorQoList track by $index" item-key="accountId"
                            >
                              {{data.displayName}}<span>（{{data.gardenName}}）</span>
                            </select-options>
                            <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.nextAuditorName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center">组员</td>
                        <td colspan="8">
                            <button class="btn_bd" ng-click="purchaseForm.selectNextAuditAuditor()" ng-if="purchaseForm.isEdit!==false">选择</button>
                            <p>
                                <input type="text" class="none" ng-model="purchaseForm.editForm.memberNames" required name="memberNames"/>
                                <span class="color_error" ng-if="addConfigForm.memberNames.change&&addConfigForm.memberNames.$invalid">此项不能为空</span>
                                {{purchaseForm.editForm.memberNames}}
                            </p>
                        </td>
                    </tr>
                </table>
                </div>
                <!--已填写的表格下方的虚线-->
                <div ng-if="purchaseForm.isEdit!==false">
                    <div class="table_dashed"></div>
                    <div class="reDraft_content2">
                    <div class="reDraft_list">
                        <span class="width200 word_center">完成时间状态：</span>
                        <p class="word_center" ng-switch="purchaseForm.nextAuditInfo.statusName">
                            <span class="green_color" ng-switch-when="正常">正常</span>
                            <span class="yellow_color" ng-switch-when="临期">临期</span>
                            <span class="red_color" ng-switch-default="">{{nextAuditInfo.statusName}}</span>
                        </p>
                    </div>
                    <div class="reDraft_list">
                        <span class="width200 word_center">最晚完成任务日期截点：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.dueDate|date:'yyyy/MM/dd'}}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width200 word_center">下一步操作节点名称：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.nextTaskInfoList.taskName}}</span>
                    </div>
                    </div>
                    <!--按钮-->
                    <div class="reDraft_btn" style="padding:0">
                        <span class="btn_bd" ng-click="purchaseForm.isEdit===undefined?auditCancel():closeThisDialog()">取消</span>
                        <button class="btn_bg" type="submit" form-submit-valid="purchaseForm.auditThisTask(purchaseForm.editForm)" ng-disabled="purchaseForm.nextAuditInfo.nextTaskInfoList.nextAuditorQoList.length<=0||purchaseForm.auditing">确定</button>
                    </div>
                </div>
                <div ng-if="purchaseForm.isEdit===false">
                    <div class="reDraft_btn" style="padding:0">
                        <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
                    </div>
                </div>
            </form>
        </div>`;
    }
}
purchasePriceRecord.$inject = ['SelectItemService', 'purchaseInterface', '$stateParams', 'ProjectInterface', '$sessionStorage', 'dialogsManager', '$q', 'purchaseService', 'ProjectService', '$scope', '$filter'];
