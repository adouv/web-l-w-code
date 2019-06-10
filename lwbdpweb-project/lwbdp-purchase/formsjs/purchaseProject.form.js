/**
 * @Author hejialin
 * @Description 项目立项（特殊节点5）
 */
import validCtrl from '../services/baseValidate'

export default class purchaseProject extends validCtrl {
    constructor(ProjectInterface, $sessionStorage, purchaseInterface, dialogsManager, $filter, $compile, $scope, bdpInterface, purchaseService, $stateParams,$location) {
        super();
        this.$scope = $scope;
        this.$filter = $filter;
        this.$location = $location;
        this.$compile = $compile;
        this.bdpInterface = bdpInterface;
        this.$stateParams = $stateParams;
        this.dialogsManager = dialogsManager;
        this.purchaseService = purchaseService;
        this.$sessionStorage = $sessionStorage;
        this.ProjectInterface = ProjectInterface;
        this.purchaseInterface = purchaseInterface;
        this.init();
    }

    init() {
        this.paramsInit();
        this.constParams();
        this.templateType = this.purchaseInterface.templateType;
        this.deviceUrl = this.purchaseInterface.getImportUrl(this.templateType.APPROVALDEVICE);
        this.furnitureUrl = this.purchaseInterface.getImportUrl(this.templateType.APPROVALFURNITURE);
        this.selffurnitureUrl = this.purchaseInterface.getImportUrl(this.templateType.APPROVALSELFFURNITURE);
        this.outCatalogUrl = this.purchaseInterface.getImportUrl(this.templateType.APPROVALOUTCATALOG);
    }

    /**
     * 常量初始化
     */
    constParams() {
        this.PURCHASECOMPANYNAME = '北京市顺义区教育资产管理服务中心';
        this.DEPARTMENTNAME = '北京市顺义区教育委员会';
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.recordList = [];
        this.tableData = {};
        this.trueAndFalseOptions = [
            {value:'false',name:"否"},
            {value:'true',name:"是"}

        ]
        if (this.isEdit === undefined) {
            this.projectName = this.project.projectName;
            this.gardenName = this.project.projectGarden;
            this.creatorName = this.project.applyAccount;
            this.editForm = {};
            this.editForm.governmentList = [];
            this.editForm.deviceList = [];
            this.editForm.furnitureList = [];
            this.editForm.deviceSelfList = [];
            this.editForm.furnitureSelfList = [];
            this.editForm.outCatalogList = [];
            this.editForm.createTime = this.$filter('date')(new Date(), 'yyyy-MM-dd');
            this.createTimeZh = this.$filter('date')(new Date(), 'yyyy年MM月dd日');
            this.getAccountPhone(() => {
                this.getPurchaseMethod();
            });
        } else if (this.isEdit === true) {
            this.getFormData();
            this.getPurchaseMethod();
        } else if (!this.isDetail && this.isEdit === false) {
            this.purchaseInterface.getPurchaseApprovalProject(this.project.projectId, this.taskId).then(res => {
                this.handleFormData(res.data);
            });
            this.getPurchaseMethod();
        } else if (this.isDetail && this.editForm) {
            setTimeout(() => {
                this.handleFormData(this.editForm);
            }, 100);
            this.getPurchaseMethod();
        }
        if (this.project) {
            this.getCapitalInfo(this.project.projectId);
        }
    }

    /**
     * 获取联系人手机号
     */
    getAccountPhone(callback) {
        let accountId = this.$sessionStorage.get('account').accountId;
        this.ProjectInterface.getPersonPhone(accountId).then(res => {
            this.editForm.cellphone = res.data.cellphone;
            callback && callback();
        });
    }

    /**
     * 获取外置表单数据
     * @param taskId
     */
    getFormData() {
        if(!this.editForm){
            this.purchaseInterface.getPurchaseProject(this.$stateParams.id).then(res => {
                this.handleFormData(res.data);
            });
        }else{
            this.handleFormData(this.editForm);
        }
    }

    handleFormData(formData) {
        if(formData){
            formData.uuid = null;
            if (formData.list) {
                formData.totalPrice = 0;
                formData.list.forEach(data => {
                    data.totalPrice = data.number * data.price;
                    formData.totalPrice += data.totalPrice;
                });
            }
        }
        this.editForm = this.tableData = formData;
        this.togglePurchaseMethod(formData.purchaseMethod);
    }

    /**
     * 获取所有采购方式
     */
    getPurchaseMethod() {
        this.purchaseInterface.getPurchaseMethod().then(res => {
            this.purchaseMethods = res.data;
            if (this.isEdit == undefined) {
                this.defaultMethod = this.editForm.purchaseMethod || this.purchaseMethods[0].itemValue;
                this.togglePurchaseMethod(this.defaultMethod);
            }
        });
    }

    /**
     * 下一步审核人
     */
    getNextAuditInfo(isProject, id, callback) {
        let gardenId = this.$sessionStorage.get('currentGarden').gardenId;
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId, gardenId,
            'hasGovernmentPurchase,hasNotGovernmentPurchase',
            isProject ? 'true,false' : 'false,true'
        ).then(res => {
            this.nextAuditInfo = {};
            let nextTaskInfoList = res.data.nextTaskInfoList;
            this.nextAuditInfo = nextTaskInfoList[0];
            this.nextAuditInfo.dueDate = res.data.dueDate;
            this.nextAuditInfo.statusName = res.data.statusDescription;
            let firstAuthor = this.nextAuditInfo.nextAuditorQoList[0];
            if(!this.tableData.nextOperator){
                this.tableData.nextOperatorField = this.nextAuditInfo.assigneeVar;
                this.tableData.nextOperator = id || firstAuthor && firstAuthor.accountId;
            }
            callback && callback();
        })
    }

    /**
     * 提交后台保存数据
     * @param data
     */
    saveAuditData(data) {
        this.auditing = true;
        data.createTime = null;
        if (this.isEdit === undefined) {
            this.purchaseService.setPurchaseCacheField(
                this.editForm,
                this.configCache.approvalGarden.field,
                this.gardenName
            );
        }
        if (this.recordList.length > 0) {
            data.taskId = this.currentTaskId;
            this.removeTotalPrice(data.deviceList);
            this.removeTotalPrice(data.furnitureList);
            this.removeTotalPrice(data.deviceSelfList);
            this.removeTotalPrice(data.furnitureSelfList);
            this.purchaseInterface.savePurchaseProject(data).then(res => {
                this.dialogsManager.showMessage('操作成功！', {
                    className: "success",
                    callback: () => {
                        this.auditCancel();
                    }
                })
            })
        } else {
            this.purchaseInterface.updatePurchaseProject(data).then(res => {
                this.dialogsManager.showMessage('操作成功！', {
                    className: "success",
                    callback: () => {
                        this.auditCancel();
                    }
                })
            })
        }
    }

    /**
     * 删除总价格
     * @param data
     */
    removeTotalPrice(data) {
        data.forEach(price => {
            price.totalPrice = null;
        });
        data.totalPrice = null;
    }

    /**
     * 保存并提交一个新表格
     */
    saveTable() {
        if (this.getValidResult()) {
            let methodMap = this.getMethodMap(this.tableData.purchaseMethod);
            if (this.activeIndex !== undefined) {
                this.editForm[methodMap][this.recordList[this.activeIndex].index] = angular.copy(this.tableData);
            } else {
                this.editForm[methodMap].push(angular.copy(this.tableData));
                this.recordList.push({
                    method: this.tableData.purchaseMethod,
                    index: this.editForm[methodMap].length - 1
                });
            }
            this.activeIndex = undefined;
            this.togglePurchaseMethod(this.defaultMethod);
            this.dialogsManager.showMessage('表格配置成功!');
        }
    }

    /**
     * 切换采购方式
     * @param method
     */
    togglePurchaseMethod(method, nextAuditorId) {
        this.currentMethod = method;
        let template = this.getTableHtml(method);
        if (!nextAuditorId && this.isEdit === undefined) {
            let time = setTimeout(() => {
                this.tableData = angular.copy(template.data);
                this.tableData.purchaseMethod = method;
                clearTimeout(time);
            }, 0)
        }
        if (this.isEdit !== false) {
            this.getNextAuditInfo(method == 'GOVERNMENT', nextAuditorId, () => {
                let html = this.$compile(template.html)(this.$scope);
                let content = angular.element(document.getElementById('table_content'));
                content.html('').append(html);
            });

        } else {
            let html = this.$compile(template.html)(this.$scope);
            let content = angular.element(document.getElementById('table_content'));
            content.html('').append(html);
        }

    }

    /**
     * 获取对应采购方式模版
     * @param method
     */
    getTableHtml(method) {
        let html = null,
            tableData = {};
        this.phoneDisabled = false;
        this.companyDisabled = false;
        switch (method) {
            case 'DEVICE':
                if (this.isEdit === undefined) {
                    tableData = { list: [{ isImport: 'false' }] };
                    tableData.purchaseCompanyName = this.PURCHASECOMPANYNAME;
                }
                html = this.getPurchaseDevice();
                break;
            case 'FURNITURE':
                if (this.isEdit === undefined) {
                    tableData = { list: [{}] };
                    tableData.purchaseCompanyName = this.PURCHASECOMPANYNAME;
                }
                html = this.getPurchaseFurniture();
                break;
            case 'GOVERNMENT':
                if (this.isEdit === undefined) {
                    tableData.chargeDepName = this.DEPARTMENTNAME;
                    tableData.approvalCompany = this.PURCHASECOMPANYNAME;
                    tableData.applyTable = this.getPurchaseApply();
                    tableData.promiseTable = this.getPurchasePromise();
                }
                html = this.getPurchaseProject();
                break;
            case 'OUT_CATALOG':
                if (this.isEdit === undefined) {
                    tableData = { list: [{}] };
                    tableData.approvalCompany = this.PURCHASECOMPANYNAME;
                    tableData.chargeDepName = this.PURCHASECOMPANYNAME;
                }
                html = this.getPurchaseOther();
                break;
            case 'DEVICE_SELF':
                if (this.isEdit === undefined) {
                    tableData = { list: [{ isImport: 'false' }] };
                    tableData.purchaseCompanyName = this.PURCHASECOMPANYNAME;
                }
                html = this.getSelfPurchaseDevice();
                break;
            case 'FURNITURE_SELF':
                if (this.isEdit === undefined) {
                    tableData = { list: [{ isImport: 'false' }] };
                    tableData.purchaseCompanyName = this.PURCHASECOMPANYNAME;
                }
                html = this.getSelfPurchaseFurniture();
                break;
        }
        this.hideErrorMsg();
        tableData.cellphone = this.editForm.cellphone;
        return { html: html, data: tableData };
    }

    /**
     * 获取采购类型对应提交数据的列表对象
     * @param method
     * @return {*}
     */
    getMethodMap(method) {
        let methodMap = {
            'DEVICE': 'deviceList',
            'FURNITURE': 'furnitureList',
            'GOVERNMENT': 'governmentList',
            'OUT_CATALOG': 'outCatalogList',
            'DEVICE_SELF': 'deviceSelfList',
            'FURNITURE_SELF': 'furnitureSelfList'
        };
        return methodMap[method] || '';
    }

    /**
     * 获取资金信息
     * @param projectId
     */
    getCapitalInfo(projectId, callback) {
        this.purchaseInterface.getCapitalInfo(projectId).then(res => {
            this.capital = res.data;
            this.capital.totalFinance = this.capital.commonBudgetCapitalAmount * 1 + this.capital.governmentFundBudgetAmount * 1 + this.capital.otherCapitalAmount * 1;
            this.capital.totalAmount = this.capital.totalFinance + this.capital.nonFinanceCapitalAmount * 1;
        });
    }

    /**
     * 计算总价格
     * @param num
     * @param price
     * @return {number}
     */
    getTotalPrice(data) {
        data.number = data.number && this.validNumber(data.number || 0);
        data.price = data.price && this.validPrice(data.price || 0);
        if (data.price !== undefined && data.number !== undefined) {
            data.totalPrice = (data.price * 1 * data.number).toFixed(2);
            let totalPrice = 0;
            this.tableData.list.forEach(price => {
                totalPrice += price.totalPrice * 1;
            });
            this.tableData.totalPrice = totalPrice.toFixed(2);
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
     * 选中表格
     * @param method
     * @param $index
     */
    selectedTable(method, $index) {
        if (this.activeIndex != $index && $index !== undefined) {
            this.activeIndex = $index;
            let methodMap = this.getMethodMap(method.method),
                tableData = this.editForm[methodMap][method.index];
            this.togglePurchaseMethod(method.method, tableData.nextOperator);
            let time = setTimeout(() => {
                this.tableData = angular.copy(tableData);
                clearTimeout(time);
            }, 0)
        } else {
            this.activeIndex = $index;
            this.tableData = {};
            this.togglePurchaseMethod(this.defaultMethod);
        }
    }

    /**
     * 下载采购模版
     */
    downloadTemplate(flag) {
        this.purchaseInterface.downloadTemplate(flag);
    }

    /**
     * 删除表格
     * @param method
     * @param index
     */
    removeTable(method, index) {
        if (this.activeIndex == index) {
            this.activeIndex = undefined;
            this.tableData = {};
            this.togglePurchaseMethod(this.defaultMethod);
        }
        this.recordList.splice(index, 1);
        let methodMap = this.getMethodMap(method.method);
        this.editForm[methodMap].splice(method.index, 1);
    }

    /**
     * 导入成功
     * @param data
     * @param file
     */
    importSuccess(data, file, flag) {
        this.purchaseService.importError(data, file, list => {
            if (flag) {
                list.forEach(data => {
                    if (data.isImport.indexOf('是') > -1) {
                        data.isImport = 'true';
                    } else {
                        data.isImport = 'false';
                    }
                });
            }
            let newTableData = [];
            this.tableData.list.forEach((order, index) => {
                let isEmpty = true;
                for (let key in order) {
                    if (key !== 'isImport' && order[key]) {
                        isEmpty = false;
                        break;
                    }
                }
                if (!isEmpty) {
                    newTableData.push(order)
                }
            });
            newTableData.unshift(...list);
            this.tableData.list = newTableData;
            this.tableData.totalPrice = 0;
            this.tableData.list.forEach(data => {
                data.price = data.price || 0;
                data.number = data.number || 0;
                let totalPrice = data.price * data.number;
                data.totalPrice = totalPrice ? totalPrice.toFixed(2) : 0;
                this.tableData.totalPrice += totalPrice;
            });
            this.tableData.totalPrice = this.tableData.totalPrice.toFixed(2);
        })
    }

    /**
     * 校验联系电话
     * @param phone
     * @param show
     */
    checkPhone(phone, show) {
        this[show] = !this.validPhone(phone);
    }

    /**
     * 控制错误信息显示隐藏
     */
    showErrorMsg(show) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[show] = !this[show];
    }

    /**
     * 隐藏错误信息
     */
    hideErrorMsg() {
        this.showPhoneError = false;
        this.showPhoneError1 = false;
    }

    /**
     * 保存弹窗里面的数据
     */
    saveDialogData() {
        this.$scope.$emit('formData', this.tableData);
        this.$scope.closeThisDialog();
    }

    /**
     * 获取验证结果
     * @return {*}
     */
    getValidResult() {
        return !this.showPhoneErrorIcon && !this.showPhoneErrorIcon1;
    }

    removeLine(list, index) {
        list.splice(index, 1);
    }

    addLine(list, data, index) {
        list.splice(index + 1, 0, data || {});
    }

    /**
     * 点击编辑图标
     */
    showEdit(itemName) {
        this[itemName] = !this[itemName];
    }

    getPurchaseApply() {
        return `<p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 28px; text-align: center; line-height: normal;"><span style="font-weight: 700;">关于${this.projectName}项目的申请</span></p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px; line-height: 36px;text-align: left">顺义区政府采购管理科：</p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left;"><span style="font-family: &quot;宋体 常规&quot;, 宋体;">&nbsp;&nbsp;&nbsp; XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX，目前已完前期方案制定工作，为保证该校XX月XX日顺利供暖，现急需购置XXX一批（详见明细）。该项目需资金&nbsp;${this.capital.totalAmount*10000}元。资金来源为预算内资金。</span></p><br><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">特此申请</p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px; text-align: right;"><span style="font-family: &quot;宋体 常规&quot;, 宋体;">顺义区教育资产管理服务中心</span></p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px; text-align: right;">${this.createTimeZh}</p>`;
    }

    getPurchasePromise() {
        return `<p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 28px; line-height: normal; text-align: center;"><span style="font-weight: 700;">关于“${this.projectName}”项目的承诺书</span></p><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px; line-height: 28px;"></p><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">北京市顺义区财政局：</p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;">
                    <span style="font-family: &quot;宋体 常规&quot;, 宋体;">&nbsp;&nbsp; 在“${this.projectName}” 项目政府采购过程中，我单位承诺严格遵照《中华人民共和国政府采购法》第四十六条、第四十七条之规定，在中标、成交通知书发出之日起三十日内，与中标、成交供应商按照采购文件确定的事项签订政府采购合同，自政府采购合同签订之日起七个工作日内，将合同副本报区财政局备案。</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;">
                    <span style="font-family: &quot;宋体 常规&quot;, 宋体;">&nbsp; &nbsp;同时，在政府采购合同履约过程中，我单位承诺严格遵照《中国人民共和国政府采购法》第五十条之规定执行，即：“政府采购合同的双方当事人不得擅自变更、中止或者终止合同……”</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">特此承诺。</p><br><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">承诺单位名称（盖章）：${this.gardenName}</p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">法定代表人（签字或盖章）：</p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">日期：${this.createTimeZh}</p>
                `
    }

    getTemplate() {
        return `<div class="purchaseDraft" ng-click="purchaseForm.hideErrorMsg()">
                <div ng-if="purchaseForm.isEdit===undefined">
                <div class="draft_title">
                    <p class="draft_detail">填写项目立项申请表</p>
                </div>
                <div class="inputed_table">
                    已填写的表格：
                    <span class="inputed_table_span" ng-class="{'active':purchaseForm.activeIndex==undefined}" ng-click="purchaseForm.selectedTable()"><span class="iconfont icon-tianjiaxinbiaoge add_table_icon"></span>添加新表格</span>
                    <span class="inputed_table_span" ng-repeat="method in purchaseForm.recordList" ng-class="{'active':$index==purchaseForm.activeIndex}" ng-click="purchaseForm.selectedTable(method,$index)">第{{$index+1|NumberToChinese}}份表格 <span class="iconfont icon-icon_off close_table_icon" ng-click="purchaseForm.removeTable(method,$index)"></span></span>
                </div>
                <div class="purchase_func">
                    <label for="purchase_func">采购方式：</label>
                    <select-options id="purchase_func" class="select_class select_w235" ng-model="purchaseForm.tableData.purchaseMethod" 
                        change="purchaseForm.togglePurchaseMethod(purchaseForm.tableData.purchaseMethod)"
                        repeat-items="method in purchaseForm.purchaseMethods" item-key="itemValue"
                        >
                        {{method.itemName}}
                    </select-options>
                </div>
                </div>
                <div id="table_content"></div>
                <div ng-if="purchaseForm.isEdit!==false">
                    <!--已填写的表格下方的虚线-->
                    <div class="table_dashed"></div>
                    <div class="reDraft_content2">
                        <div class="reDraft_list">
                            <span class="width160 word_center">完成时间状态：</span>
                            <p class="word_center" ng-switch="purchaseForm.nextAuditInfo.statusName">
                                <span class="green_color" ng-switch-when="正常">正常</span>
                                <span class="yellow_color" ng-switch-when="临期">临期</span>
                                <span class="red_color" ng-switch-default="">{{purchaseForm.nextAuditInfo.statusName}}</span>
                            </p>
                        </div>
                        <div class="reDraft_list">
                            <span class="width160 word_center">最晚完成任务日期截点：</span>
                            <span class="word_center">{{purchaseForm.nextAuditInfo.dueDate|date:'yyyy/MM/dd HH:mm'}}</span>
                        </div>
                        <div class="reDraft_list">
                            <span class="width160 word_center">下一步操作节点名称：</span>
                            <span class="word_center">{{purchaseForm.nextAuditInfo.taskName}}</span>
                        </div>
                        <div class="reDraft_list">
                            <span class="width160 word_center">下一步操作人：</span>
                            
                            <select-options class="selectWid400 get_method" ng-model="purchaseForm.tableData.nextOperator" name="assigneeVar" repeat-items="data in purchaseForm.nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                                {{data.displayName}} <span>（{{data.gardenName}}）</span>
                            </select-options>
                        </div>
                    </div>
                    </div>
                    <div ng-if="purchaseForm.isEdit===undefined">
                    <!--已填写的表格-->
                    <div class="inputed_table">
                        已填写的表格：
                        <span class="inputed_table_span" ng-class="{'active':purchaseForm.activeIndex==undefined}"  ng-click="purchaseForm.selectedTable()"><span class="iconfont icon-tianjiaxinbiaoge add_table_icon"></span>添加新表格</span>
                        <span class="inputed_table_span" ng-repeat="method in purchaseForm.recordList" ng-class="{'active':$index==purchaseForm.activeIndex}" ng-click="purchaseForm.selectedTable(method,$index)">第{{$index+1|NumberToChinese}}份表格 <span class="iconfont icon-icon_off close_table_icon" ng-click="purchaseForm.removeTable(method,$index)"></span></span>
                    </div>
                    <!--按钮-->
                    <div class="reDraft_btn" style="padding:0">
                        <span class="btn_bd" ng-click="auditCancel(purchaseForm.isEdit)">取消</span>
                        <button class="btn_bg" ng-disabled="purchaseForm.recordList.length<=0||purchaseForm.auditing" ng-click='purchaseForm.saveAuditData(purchaseForm.editForm)'>提交上部所有已填写的表格</button>
                    </div>
                </div>
                <div class="reDraft_btn" style="padding:0" ng-if="purchaseForm.isEdit!==undefined">
                    <span class="btn_bd" ng-if="purchaseForm.isEdit===true" ng-click="closeThisDialog()">取消</span>
                    <span class="btn_bg" ng-if="purchaseForm.isEdit===true" ng-click="purchaseForm.saveDialogData()">确定</span>
                    <span class="btn_bd" ng-if="purchaseForm.isEdit===false" ng-click="closeThisDialog()">返回</span>
                </div>
            </div>`;
    }

    /**
     * 政府立项采购（表一）
     * @return {string}
     */
    getPurchaseProject() {
        return `<form class="w5c-form" novalidate name="addConfigForm">
                <button class="btn_bd fr submit_top" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                <p class="file_preview_tit">
                    <span>政府采购立项表</span>
                </p>
                <!--申请日期和编号-->
                <div class="name_time">
                    <span class="name_time_left">申请日期：{{purchaseForm.editForm.createTime|date:'yyyy年MM月dd日'}}</span>
                </div>
                <!--表格-->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <tbody>
                        <tr>
                            <td width="38" rowspan="14">预算单位填写</td>
                            <td colspan="4">预算单位全称：{{purchaseForm.project.projectGarden}}</td>
                            <td>联系人：{{purchaseForm.project.applyAccount}}</td>
                            <td colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-model="purchaseForm.tableData.cellphone" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.cellphone,'showPhoneErrorIcon')" ng-disabled="!purchaseForm.phoneDisabled" placeholder="必填" required id="telephone" name="telephone">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!purchaseForm.showPhoneErrorIcon" ng-if="purchaseForm.isEdit!==false" class="iconfont icon-edit col0096ff" ng-click="purchaseForm.showEdit('phoneDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <span class="spanText">上级主管部门全称：</span>
                                <input type="text" class="input_class w50 padding_140" ng-model="purchaseForm.tableData.chargeDepName" id="orderName"
                                        ng-disabled="!purchaseForm.departmentDisabled" placeholder="50个汉字以内，必填" maxlength="50" required name="departmentName">
                                <label for="orderName" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('departmentDisabled')"></label>
                            </td>
                            <td>
                                <span class="spanText">联系人：</span>
                                <input type="text" class="input_class w50 padding_65" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.tableData.linkman" placeholder="10个汉字以内，必填" required name="contact">
                            </td>
                            <td  colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-disabled="purchaseForm.isEdit===false" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.linkmanTelephone,'showPhoneErrorIcon1')" ng-model="purchaseForm.tableData.linkmanTelephone" placeholder="必填" required name="telephone2">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon1" ng-click="purchaseForm.showErrorMsg('showPhoneError1')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError1">请输入正确手机号</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="7">
                                <span class="spanText">立项单位全称：</span>
                                <input type="text" class="input_class w50 padding_140" ng-model="purchaseForm.tableData.approvalCompany" id="allName"
                                        ng-disabled="!purchaseForm.companyDisabled" placeholder="50个汉字以内，必填" maxlength="50" required name="allName">
                                <label for="allName" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('companyDisabled')"></label>
                            </td>
                        </tr>
                         <tr>
                            <td colspan="7">项目名称：
                                <span>{{purchaseForm.project.projectName}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="4" class="text-center">资金来源情况</td>
                            <td colspan="6">预算批复文号：{{purchaseForm.capital.capitalNames}}</td>
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
                                <span>{{purchaseForm.capital.nonFinanceCapitalAmount*10000}}</span>
                            </td>
                            <td align="center" rowspan="2">
                                <span>{{purchaseForm.capital.totalAmount*10000}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <span>{{purchaseForm.capital.totalFinance*10000}}</span>
                            </td>
                            <td align="center">
                                <span>{{purchaseForm.capital.commonBudgetCapitalAmount*10000}}</span>
                            </td>
                            <td align="center">
                                <span>{{purchaseForm.capital.governmentFundBudgetAmount*10000}}</span>
                            </td>
                            <td align="center">
                                <span>{{purchaseForm.capital.otherCapitalAmount*10000}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="7">
                                <span class="spanText">拟委托代理采购机构名称（必填）：</span>
                                <input type="text" class="input_class w50 padding_240" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.tableData.proxyPurchaseCompany" placeholder="50个汉字以内，必填" maxlength="50" required name="organizationName">
                            </td>
                        </tr>
                        <tr class="tab_height90">
                            <td class="text-center">项目简介</td>
                            <td colspan="6">
                                <textarea class="textarea_h100" placeholder="500个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.tableData.projectIntroduce" maxlength="500" required name="projectInfo"></textarea>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="4">
                                <span class="tab_top">预算单位意见：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                            <td colspan="3">
                                <span class="tab_top">上级主管部门意见：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table class="itemTable">
                        <tbody>
                        <tr class="tab_height150">
                            <td width="38" rowspan="10">预算单位填写</td>
                            <td width="50">财政主管科室意见： </td>
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
                                <span class="tab_top">财政主管科室意见：</span>
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
                        <span>项目采购申请</span>
                    </p>
                    <div class="file_preview_con">
                        <neditor-area class="file_preview_list" ng-if="purchaseForm.isEdit!==false" id="purchaseApply" required="true" ng-model="purchaseForm.tableData.applyTable"></neditor-area>
                        <div class="file_preview_list" ng-if="purchaseForm.isEdit===false" compile-html='purchaseForm.tableData.applyTable'></div>
                    </div>
                </div>
                <div class="file_preview">
                    <p class="file_preview_tit">
                        <span>项目采购承诺书</span>
                    </p>
                    <div class="file_preview_con">
                        <neditor-area class="file_preview_list" ng-if="purchaseForm.isEdit!==false" id="purchasePromise" required="true" ng-model="purchaseForm.tableData.promiseTable"></neditor-area>
                        <div class="file_preview_list" ng-if="purchaseForm.isEdit===false" compile-html='purchaseForm.tableData.promiseTable'></div>
                    </div>
                </div>
                <button class="btn_bd fr submit_bottom" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
            </form>
        `;
    }

    /**
     * 办公设备协议采购（表二）
     * @return {string}
     */
    getPurchaseDevice() {
        return `<form class="w5c-form" novalidate name="addConfigForm">
                <button class="btn_bd fr submit_top" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                <span class="error" ng-show='addConfigForm.itemName.$invalid'>不通过</span>
                <p class="file_preview_tit">
                    <span>办公设备协议采购审批表</span>
                </p>
                <!--项目名称,单位名称,填表时间-->
                <div class="name_time">
                    <div class="name_time_left">项目名称：{{purchaseForm.project.projectName}}</div>
                    <span class="name_time_left">使用单位名称：{{purchaseForm.project.projectGarden}}</span>
                    <span class="name_time_right">填表日期：{{purchaseForm.editForm.createTime|date:'yyyy年MM月dd日'}}</span>
                </div>
                <!--表格-->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <tbody>
                        <tr>
                            <td colspan="6">
                                <span class="spanText">采购单位名称：</span>
                                <input placeholder="50个汉字，必填" type="text" class="input_class w50 padding_120" maxlength="50" id="company"
                                        ng-model="purchaseForm.tableData.purchaseCompanyName" ng-disabled="!purchaseForm.companyDisabled" required name="gardenName">
                                <label for="company" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('companyDisabled')"></label>
                            </td>
                            <td colspan="2">联系人：
                                <span>{{purchaseForm.project.applyAccount}}</span>
                            </td>
                            <td colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-model="purchaseForm.tableData.cellphone" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.cellphone,'showPhoneErrorIcon')" ng-disabled="!purchaseForm.phoneDisabled" placeholder="必填" required id="telephone" name="telephone">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!purchaseForm.showPhoneErrorIcon" ng-if="purchaseForm.isEdit!==false" class="iconfont icon-edit col0096ff" ng-click="purchaseForm.showEdit('phoneDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">资金来源：
                                <span>{{purchaseForm.capital.capitalCategoryName}}</span>
                            </td>
                            <td colspan="5">预算指标文号：
                                <span>{{purchaseForm.capital.capitalNames}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10" class="text_center">协议采购产品清单：
                                <div class="down_import" ng-if="purchaseForm.isEdit!==false">
                                    <import-file url="purchaseForm.deviceUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile,true)"></import-file>
                                    <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.templateType.APPROVALDEVICE)">模板下载</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="7%">序号</td>
                            <td width="10%">品目</td>
                            <td width="10%">品牌</td>
                            <td width="20%">具体产品型号</td>
                            <td width="7%">数量</td>
                            <td width="7%">单位</td>
                            <td width="9%">单价（元）</td>
                            <td width="9%">总价（元）</td>
                            <td width="120">是否进口设备</td>
                            <td>备注</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit!==false">
                            <td>
                                <span>{{$index+1}}</span>
                                <span class="add_minus">
                                    <i class="iconfont icon-minus" ng-show="purchaseForm.tableData.list.length>1" ng-click="purchaseForm.removeLine(purchaseForm.tableData.list,$index)"></i>
                                    <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.tableData.list,{isImport:'false'},$index)"></i>
                                </span>
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.category" placeholder="50个汉字以内，必填" maxlength="50" required name="itemName{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.brand" placeholder="20个汉字以内，必填" maxlength="20" required name="brand{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.specifications" placeholder="500个汉字以内，必填" maxlength="500" required name="specif{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.number" ng-change="purchaseForm.getTotalPrice(data)" placeholder="必填" maxlength="20" required name="num{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.unit" placeholder="10个汉字以内，必填" maxlength="10" required name="unit{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.price" ng-change="purchaseForm.getTotalPrice(data)" placeholder="必填" required name="money{{$index}}">
                            </td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <select-options name="isCome{{$index}}" class="select_class" ng-model="data.isImport" required
                                    repeat-items="opt in purchaseForm.trueAndFalseOptions" item-key="value"
                                >
                                    {{opt.name}}
                                </select-options>
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.remark" placeholder="500个汉字以内，非必填" name="message" maxlength="500">
                            </td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit===false">
                            <td>
                                <span>{{$index+1}}</span>
                            </td>
                            <td>{{data.category}}</td>
                            <td>{{data.brand}}</td>
                            <td>{{data.specifications}}</td>
                            <td>{{data.number}}</td>
                            <td>{{data.unit}}</td>
                            <td>{{data.price}}</td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <select-options name="isCome{{$index}}" class="select_class" ng-model="data.isImport" required disabled
                                  repeat-items="opt in purchaseForm.trueAndFalseOptions" item-key="value"
                                >
                                    {{opt.name}}
                                </select-options>
                            </td>
                            <td>{{data.remark}}</td>
                        </tr>
                        <tr>
                            <td colspan="7" class="text-right">合计（元）</td>
                            <td colspan="3">
                                <span>{{purchaseForm.tableData.totalPrice||0}}</span>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td colspan="5">
                                <span class="tab_top">采购单位意见（公章）：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                            <td colspan="5">
                                <span class="tab_top">上级主管部门意见（公章）：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="10">
                                <span class="tab_top">财政局支出科室意见（公章）：</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <button class="btn_bd fr submit_bottom" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
            </form>`;
    }

    /**
     * 办公家具采购（表三）
     * @return {string}
     */
    getPurchaseFurniture() {
        return `<form class="w5c-form" novalidate name="addConfigForm">
                <button class="btn_bd fr submit_top" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                <p class="file_preview_tit">
                    <span>办公家具协议采购审批表</span>
                </p>
                <!--项目名称,单位名称,填表时间-->
                <div class="name_time">
                    <div class="name_time_left">项目名称：{{purchaseForm.project.projectName}}</div>
                    <span class="name_time_left">使用单位名称：{{purchaseForm.project.projectGarden}}</span>
                    <span class="name_time_right">填表日期：{{purchaseForm.editForm.createTime|date:'yyyy年MM月dd日'}}</span>
                </div>
                <!--表格-->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <tbody>
                        <tr>
                            <td colspan="6">
                                <span class="spanText">采购单位名称：</span>
                                <input placeholder="50个汉字，必填" type="text" class="input_class w50 padding_120" maxlength="50" maxlength="50" id="company"
                                        ng-model="purchaseForm.tableData.purchaseCompanyName" ng-disabled="!purchaseForm.companyDisabled" required name="gardenName">
                                <label for="company" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('companyDisabled')"></label>
                            </td>
                            <td colspan="2">联系人：
                                <span>{{purchaseForm.project.applyAccount}}</span>
                            </td>
                            <td colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-model="purchaseForm.tableData.cellphone" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.cellphone,'showPhoneErrorIcon')" ng-disabled="!purchaseForm.phoneDisabled" placeholder="必填" required id="telephone" name="telephone">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!purchaseForm.showPhoneErrorIcon" ng-if="purchaseForm.isEdit!==false" class="iconfont icon-edit col0096ff" ng-click="purchaseForm.showEdit('phoneDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">资金来源：
                                <span>{{purchaseForm.capital.capitalCategoryName}}</span>
                            </td>
                            <td colspan="5">预算指标文号：
                                <span>{{purchaseForm.capital.capitalNames}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10" class="text_center">协议采购产品清单：
                                <div class="down_import" ng-if="purchaseForm.isEdit!==false">
                                    <import-file url="purchaseForm.furnitureUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile)"></import-file>
                                    <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.templateType.APPROVALFURNITURE)">模板下载</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="7%">序号</td>
                            <td width="20%" colspan="2">家具类别</td>
                            <td width="30%" colspan="2">具体产品型号</td>
                            <td width="7%">数量</td>
                            <td width="7%">单位</td>
                            <td width="9%">单价（元）</td>
                            <td width="9%">总价（元）</td>
                            <td>备注</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit!==false">
                            <td>
                                <span>{{$index+1}}</span>
                                <span class="add_minus">
                                    <i class="iconfont icon-minus" ng-show="purchaseForm.tableData.list.length>1" ng-click="purchaseForm.removeLine(purchaseForm.tableData.list,$index)"></i>
                                    <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.tableData.list,{isImport:'false'},$index)"></i>
                                </span>
                            </td>
                            <td colspan="2">
                                <input type="text" class="input_class" ng-model="data.category" placeholder="50个汉字以内，必填" maxlength="50" required name="category{{$index}}">
                            </td>
                            <td  colspan="2">
                                <input type="text" class="input_class" ng-model="data.specifications" placeholder="500个汉字以内，必填" maxlength="500" required name="specifications{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" placeholder="必填" maxlength="20" ng-model="data.number" ng-change="purchaseForm.getTotalPrice(data)" required name="num{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" placeholder="10个汉字以内，必填" maxlength="10" ng-model="data.unit" required name="unit{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" placeholder="必填" ng-model="data.price" ng-change="purchaseForm.getTotalPrice(data)" required name="price{{$index}}">
                            </td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <input type="text" class="input_class" placeholder="500个汉字以内，非必填" maxlength="500" ng-model="data.remark" name="message">
                            </td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit===false">
                            <td>
                                <span>{{$index+1}}</span>
                            </td>
                            <td colspan="2">{{data.category}}</td>
                            <td  colspan="2">{{data.specifications}}</td>
                            <td>{{data.number}}</td>
                            <td>{{data.unit}}</td>
                            <td>{{data.price}}</td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>{{data.remark}}</td>
                        </tr>
                        <tr>
                            <td colspan="8" class="text-right">合计（元）</td>
                            <td colspan="2">
                                {{purchaseForm.tableData.totalPrice||0}}
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td colspan="5">
                                <span class="tab_top">采购单位意见（公章）：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                            <td colspan="5">
                                <span class="tab_top">上级主管部门意见（公章）：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="10">
                                <span class="tab_top">财政局支出科室意见（公章）：</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <button class="btn_bd fr submit_bottom" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
            </form>`;
    }

    /**
     * 办公设备采购-自筹资金（表4）
     * @return {string}
     */
    getSelfPurchaseDevice() {
        return `<form class="w5c-form" novalidate name="addConfigForm">
                <button class="btn_bd fr submit_top" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                <p class="file_preview_tit">
                    <span>教育系统办公设备协议采购审批表（自筹资金）</span>
                </p>
                <!--项目名称,单位名称,填表时间-->
                <div class="name_time">
                    <div class="name_time_left">项目名称：{{purchaseForm.project.projectName}}</div>
                    <span class="name_time_left">使用单位名称：{{purchaseForm.project.projectGarden}}</span>
                    <span class="name_time_right">填表日期：{{purchaseForm.editForm.createTime|date:'yyyy年MM月dd日'}}</span>
                </div>
                <!--表格-->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <tbody>
                        <tr>
                            <td colspan="6">
                                <span class="spanText">采购单位名称：</span>
                                <input placeholder="50个汉字，必填" type="text" class="input_class w50 padding_120" maxlength="50" id="company"
                                        ng-model="purchaseForm.tableData.purchaseCompanyName" ng-disabled="!purchaseForm.companyDisabled" required name="gardenName">
                                <label for="company" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('companyDisabled')"></label>
                            </td>
                            <td colspan="2">联系人：
                                <span>{{purchaseForm.project.applyAccount}}</span>
                            </td>
                            <td colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-model="purchaseForm.tableData.cellphone" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.cellphone,'showPhoneErrorIcon')" ng-disabled="!purchaseForm.phoneDisabled" placeholder="必填" required id="telephone" name="telephone">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!purchaseForm.showPhoneErrorIcon" ng-if="purchaseForm.isEdit!==false" class="iconfont icon-edit col0096ff" ng-click="purchaseForm.showEdit('phoneDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">资金来源：
                                <span>{{purchaseForm.capital.capitalCategoryName}}</span>
                            </td>
                            <td colspan="5">预算指标文号：
                                <span>{{purchaseForm.capital.capitalNames}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10" class="text_center">协议采购产品清单：
                                <div class="down_import" ng-if="purchaseForm.isEdit!==false">
                                    <import-file url="purchaseForm.deviceUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile,true)"></import-file>
                                    <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.templateType.APPROVALDEVICE)">模板下载</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="7%">序号</td>
                            <td width="10%">品目</td>
                            <td width="10%">品牌</td>
                            <td width="20%">具体产品型号</td>
                            <td width="7%">数量</td>
                            <td width="7%">单位</td>
                            <td width="9%">单价（元）</td>
                            <td width="9%">总价（元）</td>
                            <td width="120">是否进口设备</td>
                            <td>备注</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit!==false">
                            <td>
                                <span>{{$index+1}}</span>
                                <span class="add_minus">
                                    <i class="iconfont icon-minus" ng-show="purchaseForm.tableData.list.length>1" ng-click="purchaseForm.removeLine(purchaseForm.tableData.list,$index)"></i>
                                    <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.tableData.list,{isImport:'false'},$index)"></i>
                                </span>
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.category" placeholder="50个汉字以内，必填" maxlength="50" required name="itemName{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.brand" placeholder="20个汉字以内，必填" maxlength="20" required name="brand{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.specifications" placeholder="500个汉字以内，必填" maxlength="500" required name="specifications{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.number" ng-change="purchaseForm.getTotalPrice(data)" maxlength="20" placeholder="必填" required name="size{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.unit" placeholder="10个汉字以内，必填" maxlength="10" required name="number{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.price" ng-change="purchaseForm.getTotalPrice(data)" placeholder="必填" required name="money{{$index}}">
                            </td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <select-options name="isImport{{$index}}" ng-model="data.isImport" class="select_class"
                                 repeat-items="opt in purchaseForm.trueAndFalseOptions" item-key="value"
                                >
                                   {{opt.name}}
                                </select-options>
                            </td>
                            <td>
                                <input type="text" class="input_class" placeholder="500个汉字以内，非必填" maxlength="500" name="message" ng-model="data.remark">
                            </td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit===false">
                            <td>
                                <span>{{$index+1}}</span>
                            </td>
                            <td>{{data.category}}</td>
                            <td>{{data.brand}}</td>
                            <td>{{data.specifications}}</td>
                            <td>{{data.number}}</td>
                            <td>{{data.unit}}</td>
                            <td>{{data.price}}</td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <select-options name="isImport{{$index}}" ng-disabled="purchaseForm.isEdit===false" ng-model="data.isImport" class="select_class" repeat-items="opt in purchaseForm.trueAndFalseOptions" item-key="value">
                                   {{opt.name}}
                                </select-options>
                            </td>
                            <td>{{data.remark}}</td>
                        </tr>
                        <tr>
                            <td colspan="7" class="text-right">合计（元）</td>
                            <td colspan="3">
                                {{purchaseForm.tableData.totalPrice||0}}
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td colspan="10">
                                <span class="tab_top">采购单位意见（公章）：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="10">
                                <span class="tab_top">上级主管部门意见（公章）：</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <button class="btn_bd fr submit_bottom" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                </form>`;
    }

    /**
     * 办公家具采购-自筹资金（表五）
     * @return {string}
     */
    getSelfPurchaseFurniture() {
        return `<form class="w5c-form" novalidate name="addConfigForm">
                <button class="btn_bd fr submit_top" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                <p class="file_preview_tit">
                    <span>教育系统办公家具协议采购审批表（自筹资金）</span>
                </p>
                <!--项目名称,单位名称,填表时间-->
                <div class="name_time">
                    <div class="name_time_left">项目名称：{{purchaseForm.project.projectName}}</div>
                    <span class="name_time_left">使用单位名称：{{purchaseForm.project.projectGarden}}</span>
                    <span class="name_time_right">填表日期：{{purchaseForm.editForm.createTime|date:'yyyy年MM月dd日'}}</span>
                </div>
                <!--表格-->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <tbody>
                        <tr>
                            <td colspan="6">
                                <span class="spanText">采购单位名称：</span>
                               <input placeholder="50个汉字，必填" type="text" class="input_class w50 padding_120" maxlength="50" id="company"
                                        ng-model="purchaseForm.tableData.purchaseCompanyName" ng-disabled="!purchaseForm.companyDisabled" required name="gardenName">
                                <label for="company" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('companyDisabled')"></label>
                            </td>
                            <td colspan="2">联系人：
                                <span>{{purchaseForm.project.applyAccount}}</span>
                            </td>
                            <td colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-model="purchaseForm.tableData.cellphone" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.cellphone,'showPhoneErrorIcon')" ng-disabled="!purchaseForm.phoneDisabled" placeholder="必填" required id="telephone" name="telephone">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!purchaseForm.showPhoneErrorIcon" ng-if="purchaseForm.isEdit!==false" class="iconfont icon-edit col0096ff" ng-click="purchaseForm.showEdit('phoneDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">资金来源：
                                <span>{{purchaseForm.capital.capitalCategoryName}}</span>
                            </td>
                            <td colspan="5">预算指标文号：
                                <span>{{purchaseForm.capital.capitalNames}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10" class="text_center">协议采购产品清单：
                                <div class="down_import" ng-if="purchaseForm.isEdit!==false">
                                    <import-file url="purchaseForm.selffurnitureUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile,true)"></import-file>
                                    <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.templateType.APPROVALSELFFURNITURE)">模板下载</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="5%">序号</td>
                            <td width="10%" colspan="2">家具类别</td>
                            <td width="20%" colspan="2">具体产品型号</td>
                            <td width="7%">数量</td>
                            <td width="6%">单位</td>
                            <td width="8%">单价（元）</td>
                            <td width="10%">总价（元）</td>
                            <td width="12%">是否进口设备</td>
                            <td>备注</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit!==false">
                            <td>
                                <span>{{$index+1}}</span>
                                <span class="add_minus">
                                    <i class="iconfont icon-minus" ng-show="purchaseForm.tableData.list.length>1" ng-click="purchaseForm.removeLine(purchaseForm.tableData.list,$index)"></i>
                                    <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.tableData.list,{isImport:'false'},$index)"></i>
                                </span>
                            </td>
                            <td colspan="2">
                                <input type="text" class="input_class" ng-model="data.category" placeholder="50个汉字以内，必填" maxlength="50" required name="category{{$index}}">
                            </td>
                            <td colspan="2">
                                <input type="text" class="input_class" ng-model="data.specifications" placeholder="500个汉字以内，必填" maxlength="500" required name="specifications{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.number" ng-change="purchaseForm.getTotalPrice(data)" placeholder="必填" maxlength="20" required name="num{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.unit" placeholder="10个汉字以内，必填" maxlength="10" required name="unit{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.price" ng-change="purchaseForm.getTotalPrice(data)" placeholder="必填" required name="price{{$index}}">
                            </td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <select-options name="isImport{{$index}}" ng-model="data.isImport" class="select_class"
                                    repeat-items="opt in purchaseForm.trueAndFalseOptions" item-key="value"
                                >
                                  {{opt.name}}
                                </select-options>
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.remark" placeholder="500个汉字以内，非必填" maxlength="500" name="message">
                            </td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit===false">
                            <td>
                                <span>{{$index+1}}</span>
                            </td>
                            <td colspan="2">{{data.category}}</td>
                            <td colspan="2">{{data.specifications}}</td>
                            <td>{{data.number}}</td>
                            <td>{{data.unit}}</td>
                            <td>{{data.price}}</td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                            <td>
                                <select-options name="isImport{{$index}}" disabled ng-model="data.isImport" class="select_class"
                                     repeat-items="opt in purchaseForm.trueAndFalseOptions" item-key="value"
                                >
                                    {{opt.name}}
                                </select-options>
                            </td>
                            <td>{{data.remark}}</td>
                        </tr>
                        <tr>
                            <td colspan="8" class="text-right">合计（元）</td>
                            <td colspan="3">
                                {{purchaseForm.tableData.totalPrice||0}}
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td colspan="10">
                                <span class="tab_top">采购单位意见（公章）：</span>
                                <span class="textarea_h70"></span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="10">
                                <span class="tab_top">上级主管部门意见（公章）：</span>
                                <span class="tab_bottom"> 年 月 日</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <button class="btn_bd fr submit_bottom" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                </form>`;
    }

    /**
     * 目录外设备采购（表六）
     * @return {string}
     */
    getPurchaseOther() {
        return `<form class="w5c-form" novalidate name="addConfigForm">
                <button class="btn_bd fr submit_top" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                <p class="file_preview_tit">
                    <span>教育系统政府采购目录外设备采购审批表</span>
                </p>
                <!--项目名称,单位名称,填表时间-->
                <div class="name_time">
                    <span class="name_time_left">申请时间：{{purchaseForm.editForm.createTime|date:'yyyy年MM月dd日'}}</span>
                </div>
                <!--表格-->
                <div class="addTable_box">
                    <div class="line_strip"></div>
                    <table class="itemTable">
                        <tbody>
                        <tr>
                            <td colspan="4">
                                <span class="spanText">立项单位全称：{{companyDisabled}}</span>
                                <input placeholder="50个汉字，必填" type="text" class="input_class w50 padding_120" maxlength="50" ng-model="purchaseForm.tableData.approvalCompany" ng-disabled="purchaseForm.tableData.approvalCompany&&!purchaseForm.companyDisabled" required name="gardenName">
                                <label for="telephone" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('companyDisabled')"></label>
                            </td>
                            <td>
                                <span class="spanText">联系人：</span>
                                <span>{{purchaseForm.project.applyAccount}}</span>
                            </td>
                            <td colspan="2">
                                <span class="spanText">联系电话：</span>
                                <input type="text" class="input_class w50 padding_80" ng-model="purchaseForm.tableData.cellphone" ng-blur="purchaseForm.checkPhone(purchaseForm.tableData.cellphone,'showPhoneErrorIcon')" ng-disabled="!purchaseForm.phoneDisabled" placeholder="必填" required id="telephone" name="telephone">
                                <span class="notEmptyPass" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                                <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                                <label for="telephone" ng-show="!purchaseForm.showPhoneErrorIcon" ng-if="purchaseForm.isEdit!==false" class="iconfont icon-edit col0096ff" ng-click="purchaseForm.showEdit('phoneDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">预算单位全称：
                                <span>{{purchaseForm.project.projectGarden}}</span>
                            </td>
                            <td colspan="3">
                                <span class="spanText">上级主管部门全称：</span>
                                <input placeholder="50个汉字，必填" type="text" style="padding-left:140px;" maxlength="50" class="input_class w50 padding_120" maxlength="50" ng-model="purchaseForm.tableData.chargeDepName" ng-disabled="purchaseForm.tableData.chargeDepName&&!purchaseForm.deptDisabled" required name="gardenName">
                                <label for="telephone" class="iconfont icon-edit col0096ff" ng-if="purchaseForm.isEdit!==false" ng-click="purchaseForm.showEdit('deptDisabled')"></label>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="7">项目名称：
                                <span>{{purchaseForm.project.projectName}}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table class="itemTable">
                        <tr>
                            <td rowspan="4" width="100" class="text-center">资金来源情况
                            </td>
                            <td colspan="6">预算批复文号：{{purchaseForm.capital.capitalNames}}</td>
                        </tr>
                        <tr>
                            <td colspan="6">
                                <span class="spanText">采购金额（元）：</span>
                                <input type="text" class="input_class w50 padding_120" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.tableData.purchaseMoney" ng-change="purchaseForm.controlAmount(purchaseForm.tableData,'purchaseMoney')" placeholder="正实数，最多支持15位数字，必填" required name="money">
                                <span class="popup_title">提示：资金证明里本项目的批复额度是{{purchaseForm.capital.totalAmount*10000}}元</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text-center">
                                <span class="spanText">预算内金额（元）</span>
                            </td>
                            <td colspan="2" class="text-center">
                                <span class="spanText">预算外金额（元）</span>
                            </td>
                            <td colspan="2" class="text-center">
                                <span class="spanText">自筹资金金额（元）</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                &nbsp;<input type="text" class="input_class w50" ng-disabled="purchaseForm.isEdit===false" ng-model='purchaseForm.tableData.inBudgetMoney' ng-change="purchaseForm.controlAmount(purchaseForm.tableData,'inBudgetMoney')" placeholder="正实数，最多支持15位数字，必填" required name="budgetAmount">
                            </td>
                            <td colspan="2">
                                <input type="text" class="input_class w50" ng-disabled="purchaseForm.isEdit===false" ng-model='purchaseForm.tableData.outBudgetMoney' ng-change="purchaseForm.controlAmount(purchaseForm.tableData,'outBudgetMoney')" placeholder="正实数，最多支持15位数字，必填" required name="extraBudgetAmount">
                            </td>
                            <td colspan="2">
                                <input type="text" class="input_class w50" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.tableData.selfMoney" ng-change="purchaseForm.controlAmount(purchaseForm.tableData,'selfMoney')" placeholder="正实数，最多支持15位数字，必填" required name="selfRaisedAmount">
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td width="100" class="text-center">项目简介</td>
                            <td colspan="2">
                                <textarea cols="30" rows="10" class="textarea_class" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.tableData.projectIntroduce" required name="projectDesc" maxlength="500" placeholder="500个汉字以内，必填"></textarea>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td class="text-center">拟定采购方式</td>
                            <td colspan="2">
                                <div class="text-position-top">
                                    <span>公开招标（）</span>
                                    <span>邀请招标（）</span>
                                    <span>竞争性谈判（）</span>
                                    <span>竞争性磋商（）</span>
                                    <span>询价（）</span>
                                    <span>单一来源采购（）</span>
                                    <span>其他（）</span>
                                </div>
                                <div class="text-position-bottom">
                                    <span class="w40">其他需注明事项：</span>
                                    <span class="tab_bottom"> 年 月 日</span>
                                </div>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td width="50" class="text-center">上级主管部门意见</td>
                            <td colspan="2">
                                <span class="tab_bottom">年 月 日</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text_center">设备采购清单：
                                <span ng-show=""></span>
                                <div class="down_import" ng-if="purchaseForm.isEdit!==false">
                                    <import-file url="purchaseForm.outCatalogUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile)"></import-file>
                                    <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.templateType.APPROVALOUTCATALOG)">模板下载</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable"></table>
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="7%">序号</td>
                            <td width="20%">设备名称</td>
                            <td width="10%">品牌</td>
                            <td width="15%">型号</td>
                            <td>规格参数</td>
                            <td width="7%">数量</td>
                            <td width="7%">单位</td>
                            <td width="10%">单价（元）</td>
                            <td width="10%">小计（元）</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit!==false">
                            <td>
                                <span>{{$index+1}}</span>
                                <span class="add_minus">
                                    <i class="iconfont icon-minus" ng-show="purchaseForm.tableData.list.length>1" ng-click="purchaseForm.removeLine(purchaseForm.tableData.list,$index)"></i>
                                    <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.tableData.list,{isImport:'false'},$index)"></i>
                                </span>
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.itemName" placeholder="50个汉字以内，必填" maxlength="50" required name="itemName{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.brand" placeholder="20个汉字以内，必填" maxlength="20" required name="brand{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.category" placeholder="500个汉字以内，必填" maxlength="500" required name="category{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.specifications" placeholder="20个汉字以内，必填" maxlength="20" required name="specifications{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.number" ng-change="purchaseForm.getTotalPrice(data)" maxlength="10" placeholder="必填" required name="num{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.unit" placeholder="必填" required name="unit{{$index}}">
                            </td>
                            <td>
                                <input type="text" class="input_class" ng-model="data.price" ng-change="purchaseForm.getTotalPrice(data)" placeholder="必填" required name="price{{$index}}">
                            </td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.tableData.list track by $index" ng-if="purchaseForm.isEdit===false">
                            <td>
                                <span>{{$index+1}}</span>
                            </td>
                            <td>{{data.itemName}}</td>
                            <td>{{data.brand}}</td>
                            <td>{{data.category}}</td>
                            <td>{{data.specifications}}</td>
                            <td>{{data.number}}</td>
                            <td>{{data.unit}}</td>
                            <td>{{data.price}}</td>
                            <td>
                                <span>{{data.totalPrice||0}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="8" class="text-right">合计（元）</td>
                            <td colspan="1" style="text-align:center;">
                                <span>{{purchaseForm.tableData.totalPrice||0}}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <button class="btn_bd fr submit_bottom" ng-if="purchaseForm.isEdit===undefined" form-submit-valid="purchaseForm.saveTable()">提交此份表格配置</button>
                </form>`;
    }
}
purchaseProject.$inject = ['ProjectInterface', '$sessionStorage', 'purchaseInterface', 'dialogsManager', '$filter', '$compile', '$scope', 'bdpInterface', 'purchaseService', '$stateParams','$location'];
