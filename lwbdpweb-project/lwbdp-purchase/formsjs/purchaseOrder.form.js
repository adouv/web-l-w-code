/**
 * @Author hejialin
 * @Description 描述
 */
import '../modules/apply/input/input.css'
import baseValidate from '../services/baseValidate';
export default class purchaseOrder extends baseValidate {
    constructor($scope, ProjectInterface, PurchaseInterface, dialogsManager, ProjectService, purchaseService,$sessionStorage,$location) {
        super();
        this.$scope = $scope;
        this.$location = $location;
        this.dialogsManager = dialogsManager;
        this.purchaseService = purchaseService;
        this.ProjectService = ProjectService;
        this.ProjectInterface = ProjectInterface;
        this.purchaseInterface = PurchaseInterface;
        this.$sessionStorage = $sessionStorage;
        this.init();
    }

    init() {
        if(!this.editForm){
            this.getFormData(this.taskId);
        }
        if(this.isEdit!==false){
            let gardenId = this.$sessionStorage.get('currentGarden').gardenId;
            this.getNextAuditInfo(gardenId);
        }
        this.getPriority();
        this.importUrl = this.purchaseInterface.getImportUrl();
    }

    /**
     * 下载采购模版
     */
    downloadTemplate() {
        this.purchaseInterface.downloadTemplate();
    }

    /**
     * 获取外置表单数据
     * @param taskId
     */
    getFormData(taskId) {
        this.ProjectInterface.getTaskFormData(taskId).then(res => {
            this.editForm = this.sanitizeTotalPrice(res.data);
            this.getAccountPhone(res.data.creatorId);
        });
    }

    /**
     * 校验手机号格式
     */
    checkPhone(phone, validNum) {
        this[validNum] = !this.validPhone(phone);
    }

    /**
     * 文件上传成功
     * @param message
     * @param file
     * @param type
     */
    uploadAttestFileSuccess(message, file) {
        this.purchaseService.importError(message, file, data => {
            this.editForm.projectPurchaseItemList.push(data);
            this.sanitizeTotalPrice(this.editForm);
        });
    }

    /**
     * 处理价格
     * @param data
     */
    sanitizeTotalPrice(data) {
        this.totalPrice = 0;
        data.projectPurchaseItemList.forEach(price => {
            price.totalPrice = price.buyNum * price.price;
            this.totalPrice += price.totalPrice;
        });
        return data;
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
     * 下一步审核人
     */
    getNextAuditInfo(gardenId) {
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId, gardenId, 'approved', true
        ).then(res => {
            this.nextAuditInfo = {};
            let nextTaskInfoList = res.data.nextTaskInfoList;
            this.nextAuditInfo = nextTaskInfoList[0];
        })
    }

    /**
     * 项目类别弹窗
     */
    getProjectType() {
        this.ProjectInterface.getProjectType('PURCHASE_PROJECT_CATEGORY').then(res => {
            this.ProjectService.getProjectType(this.editForm.categoryName, this.editForm.category, res.data, res => {
                this.editForm.categoryName = res.typeName;
                this.editForm.category = res.typeId.join("");
            }, true);
        })
    }

    /**
     * 提示信息显示
     */
    getPromptInfo(inputName) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[inputName] = true;
    }

    /**
     * 项目目录
     */
    getProjectCatalog() {
        this.purchaseInterface.getProjectCatalog().then(res => {
            this.ProjectService.getProjectType(this.editForm.catalogName, this.editForm.catalog, res.data, res => {
                this.editForm.catalogName = res.typeName;
                this.editForm.catalog = res.typeId.join("");
            }, true, '请选择项目目录');
        })
    }

    /**
     * 获取联系人手机号
     */
    getAccountPhone(accountId) {
        this.ProjectInterface.getPersonPhone(accountId).then(res => {
            this.phone = res.data.cellphone;
            this.editForm.cellphone = res.data.cellphone;
        });
    }

    /**
     * 保存弹窗里面的数据
     */
    saveDialogData() {
        this.auditing = true;
        this.$scope.$emit('formData', this.editForm);
        this.$scope.closeThisDialog();
    }

    /**
     * 提交后台保存数据
     * @param data
     */
    saveAuditData(data) {
        this.purchaseInterface.updateProject(data).then(res => {
            this.dialogsManager.showMessage('操作成功！', {
                className: "success",
                callback: () => {
                    this.auditCancel();
                }
            })
        })
    }

    /**
     *  修改默认显示
     */
    showPlaceHolder(index, placeHolder, placeHolderName) {
        this.editForm.projectPurchaseItemList[index][placeHolder] = placeHolderName;
    }

    /**
     * 校验现有数量、采购数量的格式
     */
    existingNum(nowNum, index, numName) {
        this.editForm.projectPurchaseItemList[index][numName] = this.validNumber(nowNum, numName);
        this.totalPrice = this.countTotal(this.editForm.projectPurchaseItemList, index).totalPricesSum;
    }

    /**
     * 校验单价
     */
    verifyPrice(price, index, priceName) {
        this.editForm.projectPurchaseItemList[index][priceName] = this.validPrice(price);
        this.totalPrice = this.countTotal(this.editForm.projectPurchaseItemList, index).totalPricesSum;
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
        this.editForm.projectPurchaseItemList.splice(index, 1);
        this.totalPrices(this.editForm.projectPurchaseItemList)
    }

    /**
     * 设备采购计算总价、合计
     */
    totalPrices(projectPurchaseItemList) {
        let totalPricesSum = 0;
        projectPurchaseItemList.map(v => {
            v.totalPrice = parseInt(v.buyNum) * parseFloat(v.price);
            totalPricesSum += parseFloat(v.totalPrice);
        });
        this.totalPrice = totalPricesSum;
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
            item.totalPrice = (item.buyNum * item.price).toFixed(2);
        } else {
            item.totalPrice = 0;
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
     * 编辑联系电话
     */
    editPhone() {
        if (this.phone) {
            this.phone = !this.phone;
        }
        this.validNum = false
    }

    /**
     *  手机号码只允许数字和'-'
     */
    clearPhone(phone) {
        if (phone) {
            phone = phone.replace(/[^\d-]/g, ""); //清除“数字”和“-”以外的字符
            phone = phone.replace(/\-{2,}/g, "-"); //只保留第一个- 清除多余的
            this.editForm.cellphone = phone
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

    getTemplate() {
        return `<div class="purchaseDraft" ng-click="purchaseForm.promptInfoHidden()" ng-if='purchaseForm.isEdit===undefined||purchaseForm.isEdit===true'>
            <form class="w5c-form" novalidate name="Form">
                <div class="project_info">
                    <p class="project_info_tit">项目基本信息
                        <span class="prompt_tit">整体说明：所申报项目必须真实、准确，具有可行性。</span>
                    </p>
                    <div class="purDraft_content">
                        <div class="purDraft_list">
                            <span class="w120">项目申报单位：</span>
                            <span class="txt_center">{{purchaseForm.editForm.gardenName}}</span>&nbsp;&nbsp;
                            <span class="iconfont icon-switch" ng-click="purchaseForm.chooseGarden()" ng-if="purchaseForm.visibleGardens.length>1"></span>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">项目目录：</span>
                            <div class="purDraft_list_info">
                                <input type="text" class="input_class pro_input curr" ng-model="purchaseForm.editForm.catalogName" placeholder="点击选择，必选" readonly="readonly" ng-click="purchaseForm.getProjectCatalog()" name="catalogName" required
                                     />  
                                <span class="iconfont icon-prompt promptBtn" ng-click="purchaseForm.getPromptInfo('promptInfo')"></span>
                                <div class="prompt_info" ng-if="purchaseForm.promptInfo">
                                    此目录使用的是计财财务的目录分类，您根据所属项目内容和目录分类的含义自行归类即可。项目内容和目录分类在大类上要一致。
                                </div>
                            </div>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">项目申报年份：</span>
                            <div class="purDraft_list_info">
                                <input type="text" class="input_class pro_input curr" placeholder="项目年份，必选" readonly="readonly" lw-laydate='YYYY' id="applyYear"
                                    ng-model="purchaseForm.editForm.applyYear" required name="applyYear" />
                            </div>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">项目类别：</span>
                            <div class="purDraft_list_info">
                                <input type="text" class="input_class pro_input curr" ng-click="purchaseForm.getProjectType()" placeholder="点击选择，必选" ng-model="purchaseForm.editForm.categoryName"
                                    readonly="readonly" required name="categoryName" />
                            </div>
                        </div>
                        <div class="purDraft_list clearfix">
                            <span class="w120 fl mat4">项目名称：</span>
                            <div class="purDraft_list_info fl">
                                <input type="text" class="input_class pro_input" placeholder="100字以内，必填" ng-model="purchaseForm.editForm.name" required name="name"
                                    maxlength="100" ng-blur="purchaseForm.verifyProjectName(purchaseForm.editForm.name)" />
                                <p class="declarea">*形如XXXXXX设备采购，包含建筑物功能室名称，不含学校名称，例如：教学楼网络设备采购、资源教室多媒体设备采购。一项目一报，杜绝打包申报。</p>
                            </div>
                        </div>
                        <div class="purDraft_list clearfix">
                            <span class="w120 fl mat4">项目内容：</span>
                            <div class="purDraft_list_info fl">
                                <textarea class="textarea_class pro_input hg100" placeholder="1000汉字以内，必填" ng-model="purchaseForm.editForm.content" required
                                    name="content"></textarea>
                                <p class="declarea">*将所报项目作简要说明，比如项目的设备类型、功能点等，项目内容与项目名称相符。</p>
                            </div>
                        </div>
                        <div class="purDraft_list clearfix">
                            <span class="w120 fl mat4">申报理由：</span>
                            <div class="purDraft_list_info fl">
                                <textarea class="textarea_class pro_input hg100" placeholder="1000汉字以内，必填" ng-model="purchaseForm.editForm.reason" required
                                    name="reason"></textarea>
                                <p class="declarea">*对申报项目的现状进行简要描述，阐述项目执行的必要性。</p>
                            </div>
                        </div>
                        <div class="purDraft_list clearfix">
                            <span class="w120 fl mat4">备注：</span>
                            <div class="purDraft_list_info fl">
                                <textarea class="textarea_class pro_input hg100" placeholder="1000汉字以内，不必填" ng-model="purchaseForm.editForm.remark"></textarea>
                                <p class="declarea">*如有特殊情况，请在备注中说明。</p> 
                            </div>
                        </div>
                    </div>
                </div>
                <!--项目设备采购清单-->
                <div class="project_info">
                    <import-file url="purchaseInput.importUrl" size="{{5*1024*1024}}" callback-success="purchaseInput.uploadAttestFileSuccess($importData,$importFile)" class="project_info_tit" >
                        <p>    项目设备采购清单
                            <span class="download_file fr" ng-click="purchaseForm.downloadTemplate()">下载模板文件</span>
                        </p>
                    </import-file>
                    <div class="info_table">
                        <table ng-class="{'tab_outline': purchaseForm.verify_table}">
                            <thead>
                                <th width="100">序号</th>
                                <th width="220">设备名称</th>
                                <th width="160">品牌</th>
                                <th width="180">规格型号</th>
                                <th width="90">单位</th>
                                <th width="120">现有数量</th>
                                <th width="120">采购数量</th>
                                <th width="110">参考单价(元)</th>
                                <th width="120">总价(元)</th>
                            </thead>
                            <tbody>
                                <tr ng-repeat="detail in purchaseForm.editForm.projectPurchaseItemList track by $index">
                                    <td class="plus_td">
                                        <span>{{detail.num =  $index+1}}</span>
                                        <span class="add_minus">
                                        <i class="iconfont icon-minus" ng-show="purchaseForm.editForm.projectPurchaseItemList.length>1" ng-click="purchaseForm.removeLine($index)"></i>
                                        <i class="iconfont icon-plus" ng-click="purchaseForm.deviceAddLine(purchaseForm.editForm.projectPurchaseItemList,$index)"></i>
                                    </span>
                                    </td>
                                    <td>
                                        <input type="text" class="input_class" ng-model="detail.itemName" placeholder="{{detail.devicePlaceHolder}}" maxlength="50" name="itemName{{$index}}"
                                       required ng-blur="detail.devicePlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'devicePlaceHolder','50个汉字以内，必填')"/>
                                    </td>
                                    <td>
                                        <input type="text" class="input_class" ng-model="detail.brand" placeholder="{{detail.brandPlaceHolder}}" name="brand{{$index}}" required
                                       ng-blur="detail.brandPlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'brandPlaceHolder','10个汉字以内，必填')"  maxlength="10" />
                                    </td>
                                    <td>
                                        <textarea class="textarea_class" ng-model="detail.specifications" placeholder="{{detail.sizePlaceHolder}}" maxlength="1000"
                                          ng-class="{'auto':detail.specifications}"
                                          ng-blur="detail.sizePlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'sizePlaceHolder','1000个汉字以内，非必填')"></textarea>
                                    </td>
                                    <td>
                                        <input type="text" ng-model="detail.unit" class="input_class" placeholder="{{detail.unitPlaceHolder}}" name="unit{{$index}}" required
                                       ng-blur="detail.unitPlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'unitPlaceHolder','必填')" maxlength="10" />
                                    </td>
                                    <td>
                                        <input type="text" class="input_class" ng-model="detail.nowNum" placeholder="{{detail.nowNumberPlaceHolder}}" name="nowNum{{$index}}" required
                                       ng-blur="detail.nowNumberPlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'nowNumberPlaceHolder','必填')"
                                       ng-change="purchaseForm.existingNum(detail.nowNum,$index,'nowNum')" maxlength="6"/>
                                    </td>
                                    <td>
                                        <input type="text" class="input_class" ng-model="detail.buyNum" placeholder="{{detail.buyNumPlaceHolder}}"
                                       ng-change="purchaseForm.existingNum(detail.buyNum,$index,'buyNum')" name="buyNum{{$index}}" required
                                       ng-blur="detail.buyNumPlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'buyNumPlaceHolder','必填')" maxlength="6" />
                                    </td>
                                    <td>
                                        <input type="text" class="input_class" ng-model="detail.price" placeholder="{{detail.pricePlaceHolder}}" name="price{{$index}}"
                                       ng-blur="detail.pricePlaceHolder=''" ng-focus="purchaseForm.showPlaceHolder($index,'pricePlaceHolder','非必填')"
                                       ng-change="purchaseForm.verifyPrice(detail.price,$index,'price')" maxlength="15"/>
                                    </td>
                                    <td>{{(detail.totalPrice) |number}}</td>
                                </tr>
                                <tr>
                                    <td colspan="8" style="text-align:right">合计</td>
                                    <td>{{purchaseForm.totalPrice|number}}</td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="project_info">
                    <div class="purDraft_content">
                        <div class="purDraft_list clearfix">
                            <span class="w120 fl mat4">校内项目优先级：</span>
                            <div class="purDraft_list_info fl">
                                <select-options class="select_class" ng-model="purchaseForm.editForm.priority" required name="priority"
                                  repeat-items="data in purchaseForm.priority track by $index" item-key="id"
                                >
                                    {{data.name}}
                                </select-options>
                                <p class="declarea">*请根据您学校在本年度的所有申报项目进行综合设置。</p>
                            </div>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">项目联系人：</span>
                            <span class="txt_center">{{purchaseForm.project.applyAccount}}</span>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">联系人电话：</span>
                            <div class="purDraft_list_info">
                                <span class="txt_center" ng-if="purchaseForm.phone">{{purchaseForm.editForm.cellphone}}</span>
                                <div class="input-phone" ng-if="!purchaseForm.phone">
                                    <input type="text" class="input_class w180" placeholder="必填" ng-model="purchaseForm.editForm.cellphone" required name="phone"
                                        ng-blur="purchaseForm.checkPhone(purchaseForm.editForm.cellphone,'validNum')"
                                        ng-change="purchaseForm.clearPhone(purchaseForm.editForm.cellphone)"/>
                                    <span class="right_format" ng-show="purchaseForm.verifyPhone">请输入正确的手机号</span>
                                    <span class="iconfont icon-warn promptIcon" ng-if='purchaseForm.validNum' ng-click="purchaseForm.getPromptInfo('verifyPhone')"></span>
                                </div>
                                <span class="iconfont icon-edit" ng-click="purchaseForm.editPhone()" ng-show="purchaseForm.phone"></span>
                            </div>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">下一步操作节点名称：</span>
                            <span class="txt_center">{{purchaseForm.nextAuditInfo.taskName}}</span>
                        </div>
                        <div class="purDraft_list">
                            <span class="w120">下一步操作人：</span>
                            <div class="purDraft_list_info">
                                
                                <select-options class="sele400" ng-model="purchaseForm.editForm.nextOperator" name="nextOperator" repeat-items="data in purchaseForm.nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                                    {{data.displayName}} <span>（{{data.gardenName}}）</span>
                                </select-options>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pusDraft_btn">
                    <span class="btn_bd" ng-click="closeThisDialog()">取消</span>
                    <button class="btn_bg" ng-disabled="purchaseForm.auditing" form-submit-valid="purchaseForm.saveDialogData()">确定</button>
                </div>
            </form>
        </div>
        <div ng-if='purchaseForm.isEdit===false' class="order_detail">
            <div class="content-list">
                <span class="content-list-left">项目申报单位：</span>
                <span class="content-list-right">{{purchaseForm.editForm.gardenName}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">项目名称：</span>
                <span class="content-list-right">{{purchaseForm.editForm.name}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">项目目录：</span>
                <span class="content-list-right">{{purchaseForm.editForm.catalogName}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">项目申报年份：</span>
                <span class="content-list-right">{{purchaseForm.editForm.applyYear}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">项目类别：</span>
                <span class="content-list-right">{{purchaseForm.editForm.categoryName}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">项目内容：</span>
                <span class="content-list-right">{{purchaseForm.editForm.content}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">申报理由：</span>
                <span class="content-list-right">{{purchaseForm.editForm.reason}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">备注：</span>
                <span class="content-list-right">{{purchaseForm.editForm.remark}}</span>
            </div>
            <div class="table_box" style="width:100%;margin:auto;">
                <div class="margin_bot20">项目设备采购清单</div>
                <table class="listTable">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="280">设备名称</th>
                        <th width="160">品牌</th>
                        <th width="160">规格型号</th>
                        <th width="160">单位</th>
                        <th width="80">现有数量</th>
                        <th width="80">采购数量</th>
                        <th width="80">参考单价（元）</th>
                        <th width="125">总价（元）</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="data in purchaseForm.editForm.projectPurchaseItemList">
                        <td>{{$index+1}}</td>
                        <td>{{data.itemName}}</td>
                        <td>{{data.brand}}</td>
                        <td>{{data.specifications}}</td>
                        <td>{{data.unit}}</td>
                        <td>{{data.nowNum}}</td>
                        <td>{{data.buyNum}}</td>
                        <td>{{data.price}}</td>
                        <td>{{data.totalPrice}}</td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align:right">合计</td>
                        <td>{{purchaseForm.totalPrice|number}}</td> 
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="content-list">
                <span class="content-list-left">校内项目优先级：</span>
                <span class="content-list-right">
                    <select-options class="select_class" ng-model="purchaseForm.editForm.priority" required name="priority" disabled
                     repeat-items="data in purchaseForm.priority track by $index" item-key="id"
                    >
                       {{data.name}}
                    </select-options>
                </span>
            </div>
            <div class="content-list">
                <span class="content-list-left">项目联系人：</span>
                <span class="content-list-right">{{purchaseForm.project.applyAccount}}</span>
            </div>
            <div class="content-list">
                <span class="content-list-left">联系人电话：</span>
                <span class="content-list-right">{{purchaseForm.editForm.cellphone}}</span>
            </div>
            <div class="btn_box">
                <button class="btn_bd" ng-click="closeThisDialog()">返回</button>
            </div>
        </div>
        `;
    }
}
purchaseOrder.$inject = ['$scope', 'ProjectInterface', 'purchaseInterface', 'dialogsManager', 'ProjectService', 'purchaseService','$sessionStorage','$location'];
