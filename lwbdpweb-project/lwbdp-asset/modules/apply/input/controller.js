export class assetInputCtrl {
    constructor($stateParams, AssetInterface, AssetDictionaryInterface, $scope, $filter, $sessionStorage, SelectGarden, dialogsManager, $timeout, $state, ApplyService, ProjectInterface, WorkflowInterface, ngDialog, sidebarService, gardenService, $location) {
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$location = $location;
        this.AssetInterface = AssetInterface;
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.$scope = $scope;
        this.$filter = $filter;
        this.gardenService = gardenService;
        this.$timeout = $timeout;
        this.SelectGarden = SelectGarden;
        this.session = $sessionStorage;
        this.sidebarService = sidebarService;
        this.dialogsManager = dialogsManager;
        this.ApplyService = ApplyService;
        this.ProjectInterface = ProjectInterface;
        this.WorkflowInterface = WorkflowInterface;
        this.ngDialog = ngDialog;
        this.init();
    }

    init() {
        this.paramsInit();
        //获取基础信息
        this.getSelectData();
        //获取申请单信息
        this.getApplyOrder();
        this.getCrumbList();
        this.watchSelectAssetType();
        this.getVisibleGarden();
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.IsElectronicSelectList = [{name:"非电子类",value:'false'},{name:"电子类",value:'true'}];
        let garden = this.session.get('currentGarden');
        this.account = this.session.get('account');
        this.currentGardenId = garden.gardenId;
        this.isDisposal = false;
        if (this.$stateParams.id) {
            this.isReapply = this.getIsReapply();
            this.isEdit = !this.isReapply;
        } else {
            this.appendParamsInit(garden, this.account);
        }
        this.otherEvidence = { attachmentList: [] };


    }

    /**
     * 添加页参数初始化
     * @param garden
     * @param account
     */
    appendParamsInit(garden, account) {
        this.apply = {};
        this.apply.status = 0;
        this.apply.isElectronic = 'true';
        this.apply.applyUnitId = garden.gardenId;
        this.apply.allocatedGardenId = '';
        this.apply.creatorId = account.accountId;
        this.apply.creatorName = account.displayName;
        this.apply.applyUnitName = garden.gardenName;
        this.apply.processConfigId = this.$stateParams.processConfigId;
        // 申请处置的资产明细列表
        this.apply.assetDisposeDetailList = [{}];
        // 上传的资产原始材料 附件类型 1
        this.apply.originalEvidenceList = [{}];
        // 上传的资产处置申报说明 附件类型 2
        this.apply.applyEvidenceList = [{}];
        // 上传的成套设备资产明细 附件类型 3
        this.apply.batchAssetEvidenceList = [{}];
        // 其他辅助支持材料 附件类型 4
        this.apply.otherEvidenceList = [];
    }

    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getFirstCrumb(
            moduleAlias.ASSET,
            this.$stateParams.sidebarId, data => {
                this.crumbList = data;
            });
    }

    /**
     * 获取用户可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.visibleGardens = res.data;
        })
    }

    /**
     * 获取申请单
     */
    getApplyOrder() {
        // 打回编辑
        if (this.isFormEdit()) {
            this.backFormData(data => {
                this.apply = data;
                if (this.apply.disposeTypeName == "报废") {
                    this.isDisposal = true;
                }
            });
            this.getAuditResult();
        } else if (this.$stateParams.id) { //申请单详情
            this.ApplyService.getApplyOrder(this.$stateParams.id, (data) => {
                this.apply = this.handleApplyData(data);
                this.splitBasicData();
                if (this.isReapply) {
                    this.formParamsInit();
                } else {
                    data.assetDisposeDetailList.forEach(item => {
                        item.acquireDate = this.computedDate(item.acquireDate)
                    });
                }
                if (this.apply.disposeTypeName == "报废") {
                    this.isDisposal = true;
                }
            });
        }
    }

    handleApplyData(data) {
        data.batchAssetEvidenceList[0] = data.batchAssetEvidenceList[0] || {};
        if (data.batchAssetEvidenceList && data.batchAssetEvidenceList.length > 0) {
            data.batchAssetEvidenceList.map(evidence => {
                delete evidence.batchNo;
                delete evidence.sourceId;
            })
        }

        if (data.otherEvidenceList && data.otherEvidenceList.length > 0) {
            data.otherEvidenceList.map(other => {
                delete other.batchNo;
            })
        }

        data.applyEvidenceList.map(apply => {
            delete apply.batchNo;
            delete apply.applyEvidenceList;
        });

        data.originalEvidenceList.map(original => {
            delete original.batchNo;
            delete original.applyEvidenceList;
        });
        return data;
    }

    /**
     * 以此为模板重新提交
     * @return {boolean}
     */
    getIsReapply() {
        return this.$state.current.name.split('.')[1] == 'formEdit';
    }

    /**
     * 以此为模板重新提交参数处理
     */
    formParamsInit() {
        this.apply.assetTotalAmountSum = 0;
        this.apply.assetCountSum = 0;
        this.apply.creatorName = this.account.displayName;
        this.apply.assetDisposeDetailList = [{}];
        this.apply.batchAssetEvidenceList.forEach(data => {
            data.assetNos = undefined;
            data.assetDetails = undefined;
        });
        this.apply.originalEvidenceList.forEach(data => {
            data.assetNos = undefined;
            data.assetDetails = undefined;
        });
    }

    /**
     * 获取审核结果信息
     */
    getAuditResult() {
        if (this.$stateParams.id) {
            this.AssetInterface.getAssetAudit(this.$stateParams.id).then(res => {
                this.auditCondition = res.data;
                this.auditCondition.length === 8 ? this.isFinance = true : this.isFinance = false;
            });
        }
    }

    /**
     * 是否是外置表单编辑
     */
    isFormEdit() {
        return this.$scope.$parent.apply;
    }

    /**
     * 返回外置表单数据
     * @param callback
     */
    backFormData(callback) {
        this.$scope.$parent.$watch('apply', val => {
            if (val.id) {
                callback && callback(val);
            }
        });
    }

    /**
     * 校验最低年限
     * @param idx
     */
    verification(data, name) {
        let num = parseInt(data[name]);
        data[name] = num;
        if (num >= 100000) {
            data[name] = 10000;
            return;
        }
        if (data[name] > 10000) {
            data[name] = num.toString().substring(0, 4);
        }
    }

    generateEvidenceList($flow) {
        this.validOtherEvidence = false;
        this.apply.otherEvidenceList.push(this.otherEvidence);
        this.otherEvidence = { attachmentList: [], name: undefined, description: undefined };
        $flow.cancel();
    }

    /**
     * 选择园区
     */
    chooseGarden(id, name) {
        this.SelectGarden.dialog({
            single: true,
            ids: this.apply[id]
        }, $garden => {
            if ($garden.ids.length > 0) {
                this.apply[id] = $garden.gardenList[0].id;
                this.apply[name] = $garden.gardenList[0].name;
            } else {
                this.apply[id] = null;
                this.apply[name] = null;
            }
        });
    }

    goJump(url) {
        this.$location.path(url);
    }

    /**
     * 时间格式化
     * @param d
     * @return {*}
     */
    computedDate(d) {
        return this.$filter('date')(d, 'yyyy-MM-dd')
    }

    /**
     * 分割数据,对下拉框或弹框中的数据进行筛选
     * @return {boolean}
     */
    splitBasicData() {
        if (!(this.KindList && this.ReasonList && this.apply)) return false;
        let assetTypeName = this.apply.assetType;
        this.canUseKind = assetTypeName ? assetTypeName.split(';') : [];
        for (let data of this.KindList) {
            if (this.canUseKind && this.canUseKind.indexOf(data.id) !== -1) {
                data.checked = true;
                this.canUseKind.splice(this.canUseKind.indexOf(data.id), 1, data);
            }
        }
        let applyReasonName = this.apply.applyReason;
        this.canUseReason = applyReasonName ? applyReasonName.split(';') : [];
        for (let data of this.ReasonList) {
            if (this.canUseReason && this.canUseReason.indexOf(data.id) !== -1) {
                data.checked = true;
                this.canUseReason.splice(this.canUseReason.indexOf(data.id), 1, data);
            }
        }
    }

    /**
     * 选中名称
     * @param list
     * @param data
     * @param key
     * @param keyName
     */
    selectList(list, data, key, keyName) {
        for (let obj of list) {
            if (obj.id == data[key]) {
                data[keyName] = obj.name;
            }
        }
        this.setIsDisposal();
    }

    /**
     * 删除指定文件
     * @param list
     * @param index
     */
    removeFile(list, index) {
        list.splice(index, 1);
    }

    /**
     * 显示弹窗 资产大类
     * @param name
     */
    showDialog(name, index) {
        this[name + 'Show'] = true;
        this[name + 'Index'] = index;
    }

    /**
     * 获取下拉框基础信息
     */
    getSelectData() {
        //申请大类
        this.AssetDictionaryInterface.getValidAssetType().then(res => {
            this.KindList = res.data;
            this.splitBasicData();
        });
        //申请原因
        this.AssetDictionaryInterface.getValidAssetApplyReason().then(res => {
            this.ReasonList = res.data;
            this.splitBasicData();
        });
        //处置方式
        this.AssetDictionaryInterface.getValidDisposeType().then(res => {
            this.disposeTypeList = res.data;
            if (!this.$stateParams.id) {
                this.apply.disposeType = res.data[0].id;
                this.apply.disposeTypeName = res.data[0].name;
            }
        });
        //处置方向
        this.AssetDictionaryInterface.getValidDisposeDirection().then(res => {
            this.disposeDirectionList = res.data;
            if (!this.$stateParams.id) {
                this.apply.disposeDirection = res.data[0].id;
                this.apply.disposeDirectionName = res.data[0].name;
            }
        });
        //取得方式
        this.AssetDictionaryInterface.getValidAcquireWay().then(res => {
            this.acquireWayList = res.data;
            // if(!this.$stateParams.id){
            //     let length =this.apply.assetDisposeDetailList.length;
            //     this.apply.assetDisposeDetailList[length-1].acquireWay = res.data[0].id;
            //     this.apply.assetDisposeDetailList[length-1].acquireWayName = res.data[0].name;
            // }
        })
    }

    /**
     * 监听资产大类
     */
    watchSelectAssetType() {
        this.$scope.$watch('assetInput.apply.assetType', val => {
            if (val) {
                let ids = val.split(',');
                let names = this.apply.assetTypeName.split(';');
                let assetTypeList = [];
                for (let i = 0, len = ids.length; i < len; i++) {
                    assetTypeList.push({ id: ids[i], name: names[i] })
                }
                this.assetTypeList = assetTypeList;
            }
        });
    }

    /**
     * 验证资产编号
     * @param data
     */
    validateAssetNo(data, idx) {
        if (data.assetNo) {
            // 更新资产编号总数
            let assetDisposeDetailList = this.apply.assetDisposeDetailList;
            data.assetNo = data.assetNo.replace(/\s+/g, '');
            this.AssetInterface.validateAssetNo(data.assetNo).then(res => {
                data.assetCount = res.data;
                this.getTotalCount(data, idx);
            });
        } else {
            data.assetCount = 0;
            this.getTotalCount(data, idx);
        }
    }

    getTotalCount(data, index) {
        let assetList = this.apply.assetDisposeDetailList,
            totalCount = 0;
        for (let i = 0, len = assetList.length; i < len; i++) {
            totalCount += assetList[i].assetCount;
            if (index != i && assetList[i].assetNo == data.assetNo) {
                this.dialogsManager.showMessage('该资产编号和已有资产编号重复！', { className: 'warning' });
                totalCount = this.apply.assetCountSum;
                break;
            }
        }
        this.apply.assetCountSum = totalCount;
    }

    /**
     * 验证中小学办学条件达标系统编号
     * @param data
     */
    validateSystemNo(data) {
        this.AssetInterface.validateSystemNo(data.standardSystemNo).then(res => {}, err => {
            let msg = err.data.error_description;
            this.dialogsManager.showMessage(msg, { className: 'warning' });
        });
    }

    /**
     * 添加行
     * @param index
     * @param name
     */
    addLine(list, index) {
        list.splice(index + 1, 0, {});
    }

    /**
     * 删除行
     * @param index
     * @param name
     */
    removeLine(index, name) {
        let flag = false;
        if (name === 'originalEvidenceList') {
            console.log(this.apply.originalEvidenceList[index]);
            if (this.ObjectHashProperties(this.apply.originalEvidenceList[index])) {
                flag = true;
            }
        } else if (name === 'batchAssetEvidenceList') {
            console.log(this.apply.batchAssetEvidenceList[index]);
            if (this.ObjectHashProperties(this.apply.batchAssetEvidenceList[index])) {
                flag = true;
            }
        } else {
            console.log(this.apply[name][index]);
            if (this.ObjectHashProperties(this.apply[name][index])) {
                flag = true;
            }
        }
        if (flag) {
            this.dialogsManager.confirm({
                title: '删除提示',
                content: '是否确认删除？',
                btn: ['是', '否'],
                callback: [() => {
                    this.removeLineNoConfirm(index, name);
                }]
            })
        } else {
            this.removeLineNoConfirm(index, name);
        }
    }

    ObjectHashProperties(obj) {
        let hasProp = false;
        if (typeof obj === "object" && !(obj instanceof Array)) {
            for (let prop in obj) {
                if (obj[prop] instanceof Array) {
                    for (let subProp in obj[prop]) {
                        if (obj[prop][subProp]) {
                            hasProp = true;
                            return hasProp;
                        }
                    }
                } else {
                    if (obj[prop]) {
                        hasProp = true;
                        return hasProp;
                    }
                }
            }
        }
        return hasProp;
    }

    removeLineNoConfirm(index, name) {
        if (name === 'originalEvidenceList') {
            this.apply.originalEvidenceList.splice(index, 1);
        } else if (name === 'batchAssetEvidenceList') {
            this.apply.batchAssetEvidenceList.splice(index, 1);
        } else {
            this.apply[name].splice(index, 1);
        }
        // 计算资产原值总数，以及资产数量总数
        let assetDisposeDetailList = this.apply.assetDisposeDetailList;
        let computered = this.ApplyService.assetComputed(assetDisposeDetailList);
        this.apply.assetTotalAmountSum = computered.assetTotalAmountSum;
        this.apply.assetCountSum = computered.assetCountSum;
    }

    /**
     * 验证账面原值,更新账面原值总数
     * @param idx
     * @param paperValue
     */
    vailAssetTotalAmount(idx, paperValue) {
        this.isFinance = false;
        let assetDisposeDetailList = this.apply.assetDisposeDetailList;
        let computered = this.ApplyService.clearNoNum(paperValue, assetDisposeDetailList, idx);
        this.apply.assetTotalAmountSum = computered.assetTotalAmountSum;
        if (this.apply.isElectronic==='false') {
            //判断是否单价大于5万
            this.apply.assetDisposeDetailList.forEach(v => {
                if (v.assetTotalAmount >= 50000) {
                    this.isFinance = true;
                    return;
                }
            });
            //如果单价小于五万，就再去判断总价是否大于十万
            if (this.apply.assetTotalAmountSum >= 100000) {
                this.isFinance = true;
            }
        }
    }

    setIsDisposal() {
        if (this.apply.disposeType) {
            this.isDisposal = false;
            this.disposeTypeList.forEach((e) => {
                if (this.apply.disposeType == e.id && e.name == "报废") {
                    this.isDisposal = true;
                }
            });
        }
    }

    // 取消
    goBack() {
        this.dialogsManager.confirm({
            title: '取消提示',
            content: '离开本页，将放弃本页所有编辑结果……<br/>是否继续离开？',
            btn: ['是', '否'],
            callback: [() => {
                history.back();
            }]
        })
    }

    /**
     * 验证资产编号重复
     * @return {boolean}
     */
    validAssetNo() {
        let assetList = this.apply.assetDisposeDetailList;
        let assetNos = [];
        for (let asset of assetList) {
            assetNos.push(asset.assetNo);
        }
        for (let i = 0, len = assetNos.length; i < len; i++) {
            let index = assetNos.indexOf(assetNos[i]);
            if (index > -1 && index != i) {
                this.dialogsManager.showMessage('资产编号不能重复！', { className: 'warning' });
                return false;
            }
        }
        return true;
    }

    /**
     * 下一步
     */
    goSecond() {
        if (this.checkPhone(this.apply.phone) &&
            this.checkLoginName(this.apply.systemLoginName) &&
            this.validAssetNo()) {
            this.showSecond = true;
            this.getNextAuditTaskInfo();
        }
    }

    /**
     * 下一步操作人信息
     */
    getNextAuditTaskInfo() {
        this.ProjectInterface.getNextTaskAudit(
            this.apply.processConfigId,
            null, this.currentGardenId,
            null, null).then(res => {
            let nextTaskInfoList = res.data.nextTaskInfoList[0];
            if (nextTaskInfoList) {
                this.nextAuditTaskInfo = nextTaskInfoList;
                if (nextTaskInfoList.nextAuditorQoList[0]) {
                    this.apply.nextOperator = nextTaskInfoList.nextAuditorQoList[0].accountId;
                }
            }
        });
    }

    /**
     * 进度条控制显示隐藏
     * @param file
     * @return {boolean}
     */
    uploadProgress(file) {
        let imgType = ['jpg', 'jpeg', 'png', 'gif'];
        file.isImg = imgType.indexOf(file.getType()) > -1;
        if (!file.isImg) {
            let names = file.name.split('.');
            file.ext = names[names.length - 1];
        }
        if (file.progress() >= 1) {
            this.$timeout(() => {
                file.hide = true;
            }, 500);
        }
        return true;
    }

    /**
     * 上传文件验证
     * @param $file ngFlow的文件对象
     * @return {boolean}
     */
    validFile($file, exts, size) {
        exts = exts.split(',');
        let validExt = {};
        exts.forEach(ext => {
            validExt[ext] = 1;
        });
        if (!validExt[$file.getExtension()]) {
            this.dialogsManager.showMessage('上传文件格式不正确！', { className: 'warning' });
            return false;
        } else if ($file.size > (size)) {
            this.dialogsManager.showMessage('上传文件大小不能超过10M！', { className: 'warning' });
            return false;
        }
        return true;
    }

    //文件上传成功后触发的函数
    originalUploadSuccess(message, file, index) {
        file.hide = true;
        let fileInfo = eval("(" + message + ")");
        file.path = fileInfo.path;
        if (!angular.isArray(this.apply.originalEvidenceList[index].attachmentList)) {
            this.apply.originalEvidenceList[index].attachmentList = [];
        }
        this.apply.originalEvidenceList[index].attachmentList.push({
            type: 1,
            name: fileInfo.name,
            url: fileInfo.path
        });
        this.uploadProgress(file);
    }

    /**
     * 成套设备资产明细文件上传成功后触发的函数
     * @param message
     * @param file
     * @param index
     */
    batchUploadSuccess(message, file, index) {
        file.hide = true;
        let fileInfo = eval("(" + message + ")");
        file.path = fileInfo.path;
        if (!angular.isArray(this.apply.batchAssetEvidenceList[index].attachmentList)) {
            this.apply.batchAssetEvidenceList[index].attachmentList = [];
        }
        this.apply.batchAssetEvidenceList[index].attachmentList.push({
            type: 3,
            name: fileInfo.name,
            url: fileInfo.path
        });
        this.uploadProgress(file);
    }

    /**
     * 说明文件上传成功后触发的函数
     * @param message
     * @param file
     * @param index
     */
    applyUploadSuccess(message, file, index) {
        file.hide = true;
        let fileInfo = eval("(" + message + ")");
        file.path = fileInfo.path;
        if (!angular.isArray(this.apply.applyEvidenceList[0].attachmentList)) {
            this.apply.applyEvidenceList[0].attachmentList = [];
        }
        this.apply.applyEvidenceList[0].attachmentList.push({
            type: 2,
            name: fileInfo.name,
            url: fileInfo.path
        });
        this.uploadProgress(file);
    }

    /**
     * 辅助文件上传成功后触发的函数
     * @param message
     * @param file
     * @param index
     */
    assistUploadSuccess(message, file, index) {
        file.hide = true;
        let fileInfo = eval("(" + message + ")");
        //判断新上传的图片尺寸
        if (fileInfo.height > 140 && fileInfo.height > fileInfo.width) {
            file.height = true;
        } else {
            file.height = false;
        }
        file.path = fileInfo.path;
        this.otherEvidence.attachmentList.push({
            type: 4,
            name: fileInfo.name,
            url: fileInfo.path
        });
        this.uploadProgress(file);
    }

    /**
     * 辅助材料验证
     * @param flag
     * @return {boolean}
     */
    vailAssistEvidence(flag) {
        if (flag && !this.otherEvidence.attachmentList[0]) {
            this.dialogsManager.showMessage('请上传材料附件！', {
                className: 'warning'
            });
            return false;
        }
        return true;
    }

    /**
     * 保存数据
     */
    saveApplyOrder(status) {
        this.apply.status = status;
        if (!status) {
            this.dialogsManager.confirm({
                content: `申请单一旦提交，不能再修改和删除,是否继续提交？`,
                btn: ['是', '否'],
                callback: [() => {
                    this.submitOrder();
                }]
            })
        } else {
            this.submitOrder();
        }
    }

    submitOrder() {
        this.apply.createTime = null;
        this.apply.lastUpdateTime = null;
        let method = this.isEdit ? 'updateApplication' : 'addApplication';
        this.$stateParams.id && this.dealApplyDate(this.apply);
        this.ProjectInterface[method](moduleAlias.ASSET, this.apply).then(res => {
            this.dialogsManager.showMessage('操作成功', {
                className: 'success',
                callback: () => {
                    this.$location.path(this.crumbList[this.crumbList.length - 1].url);
                }
            })
        })
    }

    /**
     * 外置表单数据保存
     */
    saveFormApply() {
        this.dealApplyDate(this.apply);
        this.$scope.$parent.apply = this.apply;
        this.$scope.closeThisDialog();
    }

    /**
     * 处理申请单中的日期
     */
    dealApplyDate(applyData) {
        applyData.assetDisposeDetailList.forEach(data => {
            data.createTime = null;
            data.lastUpdateTime = null;
            data.acquireDate = this.$filter('date')(data.acquireDate, 'yyyy-MM-dd');
        });
    }

    /**
     * 电话号码校验
     * @param phone
     */
    checkPhone(phone) {
        let re = /^1\d{10}$/;
        let re2 = /^0\d{2,3}-?\d{7,8}$/;
        let re3 = /^[1-9][0-9]{5,8}$/;
        if (this.phoneNumberIcon !== undefined && !(re.test(phone) || re2.test(phone) || re3.test(phone))) {
            this.phoneNumberIcon = true;
            return false;
        }
        return true;
    }

    /**
     * 用户名校验
     */
    checkLoginName(data) {
        if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(data)) {
            this.loginNameIcon = true;
            return false;
        } else {
            this.loginNameIcon = false;
            return true;
        }
    }

    /**
     * 校验数据格式
     */
    verify(name) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[name] = true;
    }

}

assetInputCtrl.$inject = ['$stateParams', 'AssetInterface', 'AssetDictionaryInterface', '$scope', '$filter', '$sessionStorage', 'SelectGarden', 'dialogsManager', '$timeout', '$state', 'AssetApplyService', 'ProjectInterface', 'WorkflowInterface', 'ngDialog', 'sidebarService', 'lwGardenService', '$location'];

export function countAssetNum() {
    return function(list) {
        if (list) {
            let selectedIds = [];
            list.forEach(data => {
                if (data.assetNos) {
                    selectedIds.push(data.assetNos);
                }
            });
            selectedIds = selectedIds.toString();
            return selectedIds ? selectedIds.split(',') : [];
        }
    }
}
