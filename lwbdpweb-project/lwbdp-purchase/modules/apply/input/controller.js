/**
 * @Author hejialin
 * @Description 描述
 */
import './input.css';
import baseValidate from '../../../services/baseValidate';
export default class inputCtrl extends baseValidate {
    constructor($stateParams, $sessionStorage, SelectGarden, dialogsManager, ngDialog, sidebarService, lwGardenService, ProjectInterface, ProjectService, purchaseInterface, $state, $config, purchaseService, $location) {
        super();
        this.$stateParams = $stateParams;
        this.purchaseService = purchaseService;
        this.session = $sessionStorage;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.ngDialog = ngDialog;
        this.ProjectInterface = ProjectInterface;
        this.ProjectService = ProjectService;
        this.sidebarService = sidebarService;
        this.gardenService = lwGardenService;
        this.purchaseInterface = purchaseInterface;
        this.$config = $config;
        this.$state = $state;
        this.$location = $location;
        this.init();
    }
    init() {
        this.paramsInit();
        this.getCrumb();
        this.getVisibleGarden();
        this.getPriority();
    }

    /**
     * 下载采购模版
     */
    downloadTemplate() {
        this.purchaseInterface.downloadTemplate(this.purchaseInterface.templateType.PURCHASE);
    }

    /**
     * 获取初始化参数
     */
    paramsInit(reset) {
        // 判断是否是编辑页
        this.isEdit = (this.$state.current.name.split('.')[1] == 'edit');
        this.importUrl = this.purchaseInterface.getImportUrl(this.purchaseInterface.templateType.PURCHASE);
        this.initPurchaseInfo(reset);
        this.module = this.$config.modules.PURCHASE;
        if (this.nextAuditInfo || reset) {
            this.apply.nextOperator = this.nextAuditTaskInfo[0].nextAuditorQoList[0].accountId;
        }
    }

    initPurchaseInfo(reset) {
        this.account = this.session.get('account');
        let garden = this.session.get('currentGarden');
        if (this.$stateParams.id && !reset) {
            this.ProjectInterface.getApplicationDetail('purchase', this.$stateParams.id).then(res => {
                this.apply = res.data;
                if (!this.isEdit) {
                    this.apply.projectId = null;
                }
                this.apply.gardenName = this.apply.projectGarden;
                this.apply.name = this.apply.projectName;
                this.getNextTaskAudit();
                this.getAccountPhone();
                this.totalPrices(this.apply.projectPurchaseItemList);
            });

        } else {
            this.apply = {};
            this.apply.gardenId = garden.gardenId;
            this.apply.gardenName = garden.gardenName;
            // this.condition = {};
            // 流程配置ID
            this.apply.processConfigId = this.$stateParams.processConfigId;
            this.apply.projectPurchaseItemList = [{}];
            if (!reset) {
                this.getNextTaskAudit();
            }
            this.getAccountPhone();
            // this.appData = {};
            // this.appData.attachments = [];
        }
        this.displayName = this.account.displayName;
    }

    /**
     * 面包屑导航
     */
    getCrumb() {
        this.sidebarService.getFirstCrumb(moduleAlias.PURCHASE, this.$stateParams.sidebarId, data => {
            this.crumbList = data;
        });
    }

    goJump(url) {
        this.$location.path(url);
    }

    /**
     * 提示信息显示
     */
    getPromptInfo(inputName) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[inputName] = !this[inputName];
    }

    /**
     * 选择默认园区
     */
    chooseGarden() {
        this.SelectGarden.dialog({
            single: true,
            ids: this.apply.gardenId
        }, garden => {
            this.apply.gardenId = garden.gardenList[0].id;
            this.apply.gardenName = garden.gardenList[0].name;
            this.getNextTaskAudit();
        });
    }

    /**
     * 获取可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.visibleGardens = res.data;
        })
    }

    /**
     * 项目类别弹窗
     */
    getProjectType() {
        this.ProjectInterface.getProjectType('PURCHASE_PROJECT_CATEGORY').then(res => {
            this.ProjectService.getProjectType(this.apply.categoryName, this.apply.category, res.data, res => {
                this.apply.categoryName = res.typeName;
                this.apply.category = res.typeId;
            }, true);
        })
    }

    /**
     * 项目目录
     */
    getProjectCatalog() {
        this.purchaseInterface.getProjectCatalog().then(res => {
            this.ProjectService.getProjectType(this.apply.catalogName, this.apply.catalog, res.data, res => {
                this.apply.catalogName = res.typeName;
                this.apply.catalog = res.typeId;
            }, true, '请选择项目目录');
        })
    }

    /**
     * 获取联系人手机号
     */
    getAccountPhone() {
        this.ProjectInterface.getPersonPhone(this.account.accountId).then(res => {
            this.phone = res.data.cellphone;
            this.apply.cellphone = res.data.cellphone;
        });
    }

    /**
     * 编辑联系电话
     */
    editPhone() {
        if (this.phone) {
            this.phone = !this.phone;
        }
        this.validNum = false
    }

    /**
     * 获取优先级
     */
    getPriority() {
        this.ProjectInterface.getPriority().then(res => {
            this.priority = res.data;
        })
    }

    /**
     * 获取下一步审核人
     */
    getNextTaskAudit() {
        this.ProjectInterface.getNextTaskAudit(this.apply.processConfigId, null, this.apply.gardenId, null, null).then(res => {
            this.nextAuditTaskInfo = res.data.nextTaskInfoList;
            if (this.nextAuditTaskInfo && this.nextAuditTaskInfo[0].nextAuditorQoList.length > 0) {
                this.apply.nextOperator = this.nextAuditTaskInfo[0].nextAuditorQoList[0].accountId;
            }
        })
    }

    //校验添加项目的名称
    verifyProjectName(name, callback) {
        this.ProjectInterface.validateName('purchase', name, this.apply.projectId).then(res => {
            if (res.data == true) {
                this.dialogsManager.showMessage('数据格式错误！', { className: 'warning' });
                this.showErrName = true;
            } else {
                this.showErrName = false
                callback && callback();
            }
        });
    }

    // 提交并申报
    saveProject(status, isBack) {
        this.verifyProjectName(this.apply.name, () => {
            if (!this.validNum) {
                this.apply.status = status;
                this.dialogsManager.confirm({
                    title: "确认提示",
                    btn: ['否', '是'],
                    content: '提交申报后，该记录将不能再修改，是否继续？',
                    callback: () => {
                        this.veriftTableData();
                        this.saveData(status, isBack);
                    }
                })
            }
        });
    }

    /**
     * 保存数据
     */
    saveData(status, isBack) {
        if (!this.validNum) {
            this.verifyProjectName(this.apply.name, () => {
                this.apply.status = status;
                this.apply.type = "purchase";
                this.apply.processVersion = null;
                this.apply.category = this.apply.category.toString();
                this.apply.catalog = this.apply.catalog.toString();
                if (!this.$stateParams.id || !this.isEdit) {
                    this.purchaseInterface.addApplication(this.apply).then(res => {
                        this.dialogsManager.showMessage('保存成功', {
                            className: "success",
                            callback: () => {
                                if (!isBack) {
                                    this.veriftTableData();
                                    this.goBack();
                                } else if (status === -1) {
                                    this.veriftTableData();
                                    this.$state.go('purchase.draft', {
                                        sidebarId: this.$stateParams.sidebarId
                                    })
                                } else if (isBack) {
                                    this.apply = {};
                                    this.paramsInit('reset');
                                }
                            }
                        })
                    })
                } else {
                    this.purchaseInterface.updateProject(this.apply).then(res => {
                        this.dialogsManager.showMessage('保存成功', {
                            className: "success",
                            callback: () => {
                                if (!isBack) {
                                    this.veriftTableData();
                                    this.goBack();
                                } else if (status === -1) {
                                    this.veriftTableData();
                                    this.$state.go('purchase.draft', {
                                        sidebarId: this.$stateParams.sidebarId
                                    })
                                } else if (isBack) {
                                    this.apply = {};
                                    this.paramsInit('reset');
                                }

                            }
                        })
                    })
                }
            });
        }
    }

    /**
     * 校验表格数据是否为空
     */
    veriftTableData() {
        let verifyList = { num: 1, itemName: undefined, brand: undefined, specifications: undefined, unit: undefined, nowNum: undefined, buyNum: undefined, price: undefined };
        for (var key in verifyList) {
            if (verifyList[key] === this.apply.projectPurchaseItemList[0][key]) {
                this.verify_table = true;
            }
        }
    }


    /**
     * 设备采购表格添加行
     */
    deviceAddLine(list, index) {
        list.splice(index + 1, 0, {});
    }

    /**
     * 删除行
     */
    removeLine(index) {
        this.apply.projectPurchaseItemList.splice(index, 1);
        this.totalPrices(this.apply.projectPurchaseItemList)
    }

    /**
     * 初始化设备采购计算总价、合计
     */
    totalPrices(projectPurchaseItemList) {
        let totalPricesSum = 0;
        projectPurchaseItemList.map(v => {
            v.totalPrices = parseInt(v.buyNum) * parseFloat(v.price);
            totalPricesSum += parseFloat(v.totalPrices);
        });
        this.apply.totalPricesSum = totalPricesSum;
        return {
            totalPricesSum: totalPricesSum
        };
    }

    /**
     * 输入时计算单个总价 / 总价
     * @param projectPurchaseItemList
     * @param index
     * @returns {{totalPricesSum: (number|*)}}
     */
    countTotal(projectPurchaseItemList, index) {
        let item = projectPurchaseItemList[index];
        if (item.buyNum && item.price) {
            item.totalPrices = (item.buyNum * item.price).toFixed(2);
        } else {
            item.totalPrices = 0;
        }
        let totalPricesSum = 0;
        projectPurchaseItemList.forEach(item => {
            if (item.buyNum && item.price) {
                totalPricesSum += item.buyNum * item.price
            }
        });
        if (totalPricesSum) {
            totalPricesSum = totalPricesSum.toFixed(2);
        }
        return {
            totalPricesSum: totalPricesSum
        };
    }

    /**
     * 校验现有数量、采购数量的格式
     */
    existingNum(nowNum, index, numName) {
        this.apply.projectPurchaseItemList[index][numName] = this.validNumber(nowNum, numName);
        this.apply.totalPricesSum = this.countTotal(this.apply.projectPurchaseItemList, index).totalPricesSum;
    }

    /**
     * 校验单价
     */
    verifyPrice(price, index, priceName) {
        this.apply.projectPurchaseItemList[index][priceName] = this.validPrice(price);
        this.apply.totalPricesSum = this.countTotal(this.apply.projectPurchaseItemList, index).totalPricesSum;
    }

    /**
     * 校验手机号格式
     */
    checkPhone(phone, validNum) {
        this[validNum] = !this.validPhone(phone);
    }

    /**
     *  手机号码只允许数字和'-'
     */
    clearPhone(phone) {
        if (phone) {
            phone = phone.replace(/[^\d-]/g, ""); //清除“数字”和“-”以外的字符
            phone = phone.replace(/\-{2,}/g, "-"); //只保留第一个- 清除多余的
            this.apply.cellphone = phone
        }
    }

    /**
     * 清除提示信息
     */
    promptInfoHidden() {
        this.promptInfo = false;
        this.verifyPhone = false;
        this.verifyName = false;
    }

    /**
     * 文件上传成功
     * @param message
     * @param file
     * @param type
     */
    uploadAttestFileSuccess(message, file) {
        this.purchaseService.importError(message, file, data => {
            if (this.apply.totalPricesSum === undefined || 0) {
                this.apply.projectPurchaseItemList = data
            } else {
                this.apply.projectPurchaseItemList = this.apply.projectPurchaseItemList.concat(data)
            }
            this.apply.totalPricesSum = this.totalPrices(this.apply.projectPurchaseItemList).totalPricesSum;
        });
    }

    /**
     * 阻止默认行为
     */
    stopPropagation() {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
    }

    /**
     * 返回
     */
    goBack() {
        this.$location.path(this.crumbList[1].url);
    }

    /**
     *  修改默认显示
     */
    showPlaceHolder(index, placeHolder, placeHolderName) {
        this.apply.projectPurchaseItemList[index][placeHolder] = placeHolderName;
    }

}


inputCtrl.$inject = ['$stateParams', '$sessionStorage', 'SelectGarden', 'dialogsManager', 'ngDialog', 'sidebarService', 'lwGardenService', 'ProjectInterface', 'ProjectService', 'purchaseInterface', '$state', '$config', 'purchaseService', '$location'];