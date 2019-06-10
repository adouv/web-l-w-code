export default class createAssetDispose {
    constructor($stateParams, AssetInterface, AssetDictionaryInterface, $scope, $filter, $sessionStorage, SelectGarden, dialogsManager, $timeout, $state, AssetApplyService, ProjectInterface, WorkflowInterface, ngDialog, sidebarService, gardenService,$location) {
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$location = $location;
        this.AssetInterface = AssetInterface;
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.$scope = $scope;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.SelectGarden = SelectGarden;
        this.session = $sessionStorage;
        this.gardenService = gardenService;
        this.sidebarService = sidebarService;
        this.dialogsManager = dialogsManager;
        this.ApplyService = AssetApplyService;
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
        this.getCrumbList();
        this.getVisibleGarden();
        this.getAuditResult();
        if (this.isEdit === false) {
            this.getSelectAssetType(this.detailForm);
            this.formatDate(this.detailForm);
            this.getTotalAmount(this.detailForm);
        } else {
            this.getSelectAssetType(this.editForm);
            this.formatDate(this.editForm);
            this.getTotalAmount(this.editForm);
            this.editForm.batchAssetEvidenceList[0] = this.editForm.batchAssetEvidenceList[0] || {};
            this.editForm.isElectronic = this.editForm.isElectronic.toString();
            if (this.editForm.disposeTypeName == "报废") {
                this.isDisposal = true;
            }
            this.watchSelectAssetType();
        }
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.IsElectronicSelectList = [{name:"非电子类",value:'false'},{name:"电子类",value:'true'}];
        let garden = this.session.get('currentGarden');
        let account = this.session.get('account');
        this.currentGardenId = garden.gardenId;
        this.otherEvidence = { attachmentList: [], name: '', description: '' };
    }

    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getCrumbList(
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

    formatDate(data) {
        data.assetDisposeDetailList.forEach(item => {
            item.acquireDate = this.computedDate(item.acquireDate)
        });
    }

    getTotalAmount(data) {
        this.assetCountSum = 0;
        this.assetTotalAmountSum = 0;
        data.assetDisposeDetailList.forEach(item => {
            this.assetCountSum += item.assetCount;
            this.assetTotalAmountSum += item.assetTotalAmount;
        })
    }

    /**
     * 获取审核结果信息
     */
    getAuditResult() {
        if (this.$stateParams.id) {
            this.AssetInterface.getAssetAudit(this.$stateParams.id).then(res => {
                this.auditCondition = res.data;
                res.data.length === 8 ? this.isFinance = true : this.isFinance = false;
                console.log(this.isFinance)
            });
        }
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

    /**
     * 选择园区
     */
    chooseGarden() {
            this.SelectGarden.dialog({
                single: true,
                ids: this.editForm.allocatedGardenId
            }, $garden => {
                this.editForm.allocatedGardenId = $garden.gardenList[0].id;
                this.editForm.allocatedGardenName = $garden.gardenList[0].name;
            });
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
    splitBasicData(data) {
        if (!(this.KindList && this.ReasonList && data)) return false;
        let assetTypeName = data.assetType;
        this.canUseKind = assetTypeName ? assetTypeName.split(';') : [];
        for (let data of this.KindList) {
            if (this.canUseKind && this.canUseKind.indexOf(data.id) !== -1) {
                data.checked = true;
                this.canUseKind.splice(this.canUseKind.indexOf(data.id), 1, data);
            }
        }
        let applyReasonName = data.applyReason;
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
     * 监听资产大类
     */
    watchSelectAssetType() {
        this.$scope.$watch('assetForm.editForm.assetType', val => {
            if (val) {
                let ids = val.split(',');
                let names = this.editForm.assetTypeName.split(';');
                let assetTypeList = [];
                for (let i = 0, len = ids.length; i < len; i++) {
                    assetTypeList.push({ id: ids[i], name: names[i] })
                }
                this.assetTypeList = assetTypeList;
            }
        });
    }

    /**
     * 获取下拉框基础信息
     */
    getSelectData() {
        //申请大类
        this.AssetDictionaryInterface.getValidAssetType().then(res => {
            this.KindList = res.data;
            if (this.isEdit === false) {
                this.splitBasicData(this.detailForm);
            } else {
                this.splitBasicData(this.editForm);
            }
        });
        //申请原因
        this.AssetDictionaryInterface.getValidAssetApplyReason().then(res => {
            this.ReasonList = res.data;
            if (this.isEdit === false) {
                this.splitBasicData(this.detailForm);
            } else {
                this.splitBasicData(this.editForm);
            }
        });
        //处置方式
        this.AssetDictionaryInterface.getValidDisposeType().then(res => {
            this.disposeTypeList = res.data;
        });
        //处置方向
        this.AssetDictionaryInterface.getValidDisposeDirection().then(res => {
            this.disposeDirectionList = res.data;
        });
        //取得方式
        this.AssetDictionaryInterface.getValidAcquireWay().then(res => {
            this.acquireWayList = res.data;
        })
    }

    /**
     * 监听资产大类
     */
    getSelectAssetType(data) {
        let ids = data.assetType.split(',');
        let names = data.assetTypeName.split(';');
        let assetTypeList = [];
        for (let i = 0, len = ids.length; i < len; i++) {
            assetTypeList.push({ id: ids[i], name: names[i] })
        }
        this.assetTypeList = assetTypeList;
    }

    /**
     * 验证资产编号
     * @param data
     */
    validateAssetNo(data, idx) {
        if (data.assetNo) {
            // 更新资产编号总数
            let assetDisposeDetailList = this.editForm.assetDisposeDetailList;
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
        let assetList = this.editForm.assetDisposeDetailList,
            totalCount = 0;
        for (let i = 0, len = assetList.length; i < len; i++) {
            totalCount += assetList[i].assetCount;
            if (index != i && assetList[i].assetNo == data.assetNo) {
                this.dialogsManager.showMessage('该资产编号和已有资产编号重复！', { className: 'warning' });
                totalCount = this.assetCountSum;
                break;
            }
        }
        this.editForm.assetCountSum = totalCount;
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
        if (name === 'originalEvidenceList') {
            this.editForm.originalEvidenceList.splice(index, 1);
        } else if (name === 'batchAssetEvidenceList') {
            this.editForm.batchAssetEvidenceList.splice(index, 1);
        } else {
            this.editForm[name].splice(index, 1);
        }
    }

    /**
     * 验证账面原值,更新账面原值总数
     * @param idx
     * @param paperValue
     */
    vailAssetTotalAmount(idx, paperValue) {
        let assetDisposeDetailList = this.editForm.assetDisposeDetailList;
        let computered = this.ApplyService.clearNoNum(paperValue, assetDisposeDetailList, idx);
        this.assetTotalAmountSum = computered.assetTotalAmountSum;
        if (this.editForm.isElectronic!=='false') {
            //判断是否单价大于5万
            this.editForm.assetDisposeDetailList.forEach(v => {
                if (v.assetTotalAmount > 50000) {
                    this.isFinance = true;
                    return;
                }
            });
            //如果单价小于五万，就再去判断总价是否大于十万 
            if (this.assetTotalAmountSum > 100000) {
                this.isFinance = true;
            }
        }
    }

    /**
     * 验证账面原值,更新账面原值总数
     * @param idx
     * @param paperValue
     */
    vailAssetTotalAmount(idx, paperValue) {
        let assetDisposeDetailList = this.editForm.assetDisposeDetailList;
        let computered = this.ApplyService.clearNoNum(paperValue, assetDisposeDetailList, idx);
        this.assetTotalAmountSum = computered.assetTotalAmountSum;
        if (this.editForm.isElectronic!=='false') {
            //判断是否单价大于5万
            this.editForm.assetDisposeDetailList.forEach(v => {
                if (v.assetTotalAmount > 50000) {
                    this.isFinance = true;
                    return;
                }
            });
            //如果单价小于五万，就再去判断总价是否大于十万 
            if (this.assetTotalAmountSum > 100000) {
                this.isFinance = true;
            }
        }
    }

    // 取消
    goBack() {
        history.back();
    }



    /**
     * 下一步
     */
    goSecond() {
            if (this.checkPhone(this.editForm.phone) &&
                this.checkLoginName(this.editForm.systemLoginName)) {
                this.showSecond = true;
                this.getNextAuditTaskInfo();
                this.$scope.$apply();
            }
        }
        /**
         * 下一步操作人信息
         */
    getNextAuditTaskInfo() {
        this.ProjectInterface.getNextTaskAudit(
            this.editForm.processConfigId,
            this.currentTaskId, this.currentGardenId,
            'approved', true).then(res => {
            let nextTaskInfoList = res.data.nextTaskInfoList[0];
            if (nextTaskInfoList) {
                this.nextAuditTaskInfo = nextTaskInfoList;
                if(nextTaskInfoList.nextAuditorQoList[0]&& !this.editForm.nextOperator){
                    this.editForm.nextOperator = nextTaskInfoList.nextAuditorQoList[0].accountId;
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
        if (!angular.isArray(this.editForm.originalEvidenceList[index].attachmentList)) {
            this.editForm.originalEvidenceList[index].attachmentList = [];
        }
        this.editForm.originalEvidenceList[index].attachmentList.push({
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
        if (!angular.isArray(this.editForm.batchAssetEvidenceList[index].attachmentList)) {
            this.editForm.batchAssetEvidenceList[index].attachmentList = [];
        }
        this.editForm.batchAssetEvidenceList[index].attachmentList.push({
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
        if (!angular.isArray(this.editForm.applyEvidenceList[0].attachmentList)) {
            this.editForm.applyEvidenceList[0].attachmentList = [];
        }
        this.editForm.applyEvidenceList[0].attachmentList.push({
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

    getValue($event, attrName) {
        this.otherEvidence[attrName] = $event.target.value;
        console.log(this.otherEvidence)
    }

    deleteFile(index) {
        this.otherEvidence.attachmentList.splice(index, 1);
    }

    generateEvidenceList($flow) {
        this.validOtherEvidence = false;
        this.editForm.otherEvidenceList.push(this.otherEvidence);
        this.otherEvidence = { attachmentList: [], name: '', description: '' };
        $flow.cancel();
    }


    /**
     * 提交数据
     */
    auditSaveTask(data) {
        let method = this.$stateParams.id ? 'updateApplication' : 'addApplication';
        this.ProjectInterface[method](moduleAlias.ASSET, data).then(res => {
            this.dialogsManager.showMessage('操作成功', {
                className: 'success',
                callback: () => {
                    this.auditCancel(undefined,this.backUrl);
                }
            })
        })
    }

    /**
     * 外置表单数据保存
     */
    saveFormApply() {
        this.dealApplyDate(this.editForm);
        this.$scope.$emit('formData', this.editForm);
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

    getTemplate() {
        return require('./createAssetDispose.html');
    }

    setIsDisposal() {
        if (this.editForm.disposeType) {
            this.isDisposal = false;
            this.disposeTypeList.forEach((e) => {
                if (this.editForm.disposeType == e.id && e.name == "报废") {
                    this.isDisposal = true;
                }
            });
        }
    }

}

createAssetDispose.$inject = ['$stateParams', 'AssetInterface', 'AssetDictionaryInterface', '$scope', '$filter', '$sessionStorage', 'SelectGarden', 'dialogsManager', '$timeout', '$state', 'AssetApplyService', 'ProjectInterface', 'WorkflowInterface', 'ngDialog', 'sidebarService', 'lwGardenService','$location'];
