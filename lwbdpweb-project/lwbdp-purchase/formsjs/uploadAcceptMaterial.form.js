/**
 * @Author hejialin
 * @Description 特殊节点9(项目验收报告)
 */
import validCtrl from '../services/baseValidate'

export default class uploadAcceptMaterial extends validCtrl{
    constructor(purchaseInterface,$stateParams,$sessionStorage,purchaseService,$filter,$timeout,dialogsManager,ProjectInterface,$scope,ProjectService){
        super();
        this.$filter = $filter;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.ProjectService = ProjectService;
        this.$stateParams = $stateParams;
        this.$sessionStorage = $sessionStorage;
        this.purchaseInterface = purchaseInterface;
        this.purchaseService = purchaseService;
        this.dialogsManager = dialogsManager;
        this.ProjectInterface = ProjectInterface;
        this.init();
    }

    init(){

        this.trueAndFalseOptions = [
            {value:false,name:"否"},
            {value:true,name:"是"}

        ]
        if(this.isEdit===undefined){
            this.getPurchaseProject();
            this.accountName = this.$sessionStorage.get('account').displayName;
            this.createTime = this.$filter('date')(new Date(), 'yyyy年MM月dd日');
        }else if(!this.isDetail&&!this.editForm){
            this.editForm = {};
            this.getFormData();
        }
    }

    /**
     * 获取特殊节点5立项信息
     */
    getPurchaseProject(){
        this.purchaseInterface.getPurchaseProject(this.$stateParams.id).then(res=>{
            this.getPurchaseList(res.data);
            this.purchaseProject = res.data;
        });
    }

    /**
     * 获取中标单位供货清单
     * @param data
     */
    getPurchaseList(data){
        switch (data.purchaseMethod){
            case 'OUT_CATALOG':
                this.getUsefulData(this.configCache.bidUnitGoodsList.field);
                break;
            case 'GOVERNMENT':
                this.getUsefulData(this.configCache.bidGoodList.field);
                break;
            default:
                this.purchaseList = data.list;
                this.getUsefulData();
        }
    }

    /**
     * 获取外置表单数据
     * @param taskId
     */
    getFormData(){
        this.ProjectInterface.getTaskFormData(this.taskId).then(res => {
            this.editForm = this.ProjectService.formatCacheData(res.data.properties);
            this.editForm.attachments = res.data.attachments;
        });
    }

    /**
     * 计算总价格
     * @param list
     */
    getTotalPrice(list){
        let totalPrice = 0;
        list.forEach(data=>{
            data.totalPrice = data.number*1*data.price;
            totalPrice += data.totalPrice;
            if(this.isEdit===undefined){
                data.gardenName = this.project.projectGarden;
            }
            data.totalPrice = data.totalPrice>0?data.totalPrice.toFixed(2):data.totalPrice;
        });
        this.editForm.providerGoodsTable.totalPrice = totalPrice.toFixed(2);
        this.editForm.acceptOrder.totalPrice = totalPrice.toFixed(2);
    }

    /**
     * 计算总分数
     * @param grade
     */
    getTotalGrade(grade){
        this.editForm.serviceQuality[grade] = this.editForm.serviceQuality[grade].replace(/[^\d]/g, "");
        if(this.editForm.serviceQuality[grade]>35){
            this.editForm.serviceQuality[grade] = 35;
        }
        this.editForm.serviceQuality.totalGrade = (this.editForm.serviceQuality.fillContractGrade||0)*1+
            (this.editForm.serviceQuality.productQualityGrade||0)*1+
            (this.editForm.serviceQuality.safeguardGrade||0)*1+
            (this.editForm.serviceQuality.trainGrade||0)*1+
            (this.editForm.serviceQuality.afterSalesGrade||0)*1;
    }

    /**
     * 获取使用数据
     */
    getUsefulData(field){
        this.ProjectInterface.getUsefulData(this.$stateParams.id).then(res=>{
            if(field){
                this.purchaseList = JSON.parse(res.data[field].value);
            }
            if(this.isEdit===undefined){
                this.getProviderGoods();
                this.getSelfCheckDocument();
                this.getAcceptOrder(res.data);
                this.editForm.qualityPromise = this.getQualityPromise();
                this.approvalGarden = JSON.parse(res.data['approvalGarden'].value)
                this.editForm.acceptApplyDocument = this.getAcceptApplyDocument(res.data['bidAmount'].value);
            }
            this.getTotalPrice(this.purchaseList);
            this.getQualifiedProve();
            this.editForm.serviceQuality = {};
            this.editForm.serviceQuality.accountName = this.accountName;
        });
    }

    /**
     * 设置供货数据
     */
    getProviderGoods(){
        this.editForm.providerGoodsTable = {};
        this.editForm.providerGoodsTable.gardenName = this.project.projectGarden;
        this.editForm.providerGoodsTable.list = this.purchaseList;
    }

    /**
     * 设置单位自检报告
     */
    getSelfCheckDocument(){
        this.editForm.unitSelfCheck = {};
        this.editForm.unitSelfCheck.isAfterSales = 'true';
        this.editForm.unitSelfCheck.projectName = this.project.projectName;
        this.editForm.unitSelfCheck.gardenName = this.project.projectGarden;
        this.editForm.unitSelfCheck.list = this.purchaseList;
    }

    /**
     * 设置验收单数据
     */
    getAcceptOrder(data){
        this.editForm.acceptOrder = {};
        this.editForm.acceptOrder.projectNo = this.purchaseProject.projectNum;
        this.editForm.acceptOrder.projectName = this.project.projectName;
        this.editForm.acceptOrder.receiptGarden = this.project.projectGarden;
        let bidGarden = data[this.configCache.bidGarden.field].value;
        this.editForm.acceptOrder.providerGarden = bidGarden&&JSON.parse(bidGarden);
        this.editForm.acceptOrder.list = this.purchaseList;
    }

    /**
     * 上传文件验证
     * @param $file ngFlow的文件对象
     * @return {boolean}
     */
    validFile($file,format,size) {
        let type = this.getFlowVailFormat(format);
        if (!type[$file.getExtension()]) {
            this.dialogsManager.showMessage(
                '所选附件格式系统不支持上传！', {
                    className: 'warning'
                });
            return false;
        } else if ($file.size > size) {
            this.dialogsManager.showMessage(
                '附件大小不允许超过'+this.$filter('formatFileSize')(size)+'！', {
                    className: 'warning'
                });
            return false;
        }
        return true;
    }

    /**
     * 获取flow验证的格式
     * @return {{}}
     */
    getFlowVailFormat(format){
        let validExt = {};
        format.split(',').forEach(ext => {
            validExt[ext] = 1;
        });
        return validExt;
    }

    /**
     * 上传文件成功
     * @param message
     * @param file
     */
    uploadSuccess(data,message, file) {
        let fileInfo = eval("(" + message + ")");
        if(!data.attachments){
            data.attachments = [];
        }
        this.uploadProgress(file);
        data.attachments.push({
            name: fileInfo.name,
            url: fileInfo.path
        });
        file.url = fileInfo.path;
    }

    /**
     * 删除附件
     * @param data
     * @param $index
     */
    removeFile(data,$index,files){
        data.attachments.splice($index,1);
        files[$index].cancel();
    }

    /**
     * 进度条控制显示隐藏
     * @param file
     * @return {boolean}
     */
    uploadProgress(file) {
        let imgType = ['jpg', 'jpeg', 'png', 'gif'];
        file.isImg = imgType.indexOf(file.getType()) > -1;
        if (!file.ext && !file.isImg) {
            let names = file.name.split('.');
            file.ext = names[names.length - 1];
        }
        if (file.progress() >= 1) {
            file.hide = true
        }
        return true;
    }
    
    /**
     * 设置合格证明材料
     */
    getQualifiedProve(){
        this.editForm.qualifiedProve = {};
        this.editForm.qualifiedProve.list = this.purchaseList;
    }

    /**
     * 确认审核
     */
    auditThisTask(){
        if(!this.showPhoneErrorIcon){
            this.auditing =true;
            this.setUsefulData();
            if(this.isEdit===undefined){
                this.auditTask(this.editForm);
            }else{
                this.$scope.$emit('formData',this.editForm);
                this.$scope.closeThisDialog();
            }
        }
    }

    checkPhone(phone,show){
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
     * 设置使用数据
     */
    setUsefulData(){
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.acceptApplyDocument.field,
            this.editForm.acceptApplyDocument
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.providerGoodsTable.field,
            this.editForm.providerGoodsTable
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.unitSelfCheck.field,
            this.editForm.unitSelfCheck
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.acceptOrder.field,
            this.editForm.acceptOrder
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.qualifiedProve.field,
            this.editForm.qualifiedProve
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.qualityPromise.field,
            this.editForm.qualityPromise
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.serviceQuality.field,
            this.editForm.serviceQuality
        );
    }

    getAcceptApplyDocument(amount){
        return `<p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; font-weight: bold; white-space: normal; font-size: 28px; text-align: center;">
                    验收申请报告
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">
                    <span>${this.approvalGarden}</span>：
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;">
                    &nbsp;&nbsp;&nbsp; 关于${this.project.projectName}项目，${this.createTime}“XXXXXXXXXXXXXXXXXXXXXXXXX公司”参加了${this.approvalGarden}举行的XXXXXXXXXXXXXXX会。&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日“XXXXXXXXXXXXXX公司”与${this.project.projectGarden}共同签署了政府采购合同（设备安装单位1家${this.project.projectGarden}合同总价${amount}元）。
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;">
                    <span>${this.project.projectName}项目，XXXXXXXXXXXXXXXXXXXXXXXX公司&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日开始送货安装，&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日安装竣工完成，同时向使用单位提交了使用单位自检报告，该项目经使用单位自检，货物数量、质量完全符合合同要求，设备使用正常。特申请${this.approvalGarden}，对该项目按政府采购程序予以验收。</span>
                </p><br><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px; text-align: left;">XXXXXXXXXXXXXXXXXXXXXXXX公司</p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px; text-align: right;"><span style="text-align: right;">${this.createTime}</span></p>`;
    }

    getQualityPromise(){
        return `<p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; font-weight: bold; white-space: normal; font-size: 28px; text-align: center;">产品质量承诺书</p><br><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;">
                    &nbsp;&nbsp;&nbsp; “${this.project.projectName}”项目，我公司所提供的产品，质量符合国家相关规定，若出现质量问题，愿承担相应法律责任。
                </p><br><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">XXXXXXXXXXXXXXXXXXXXXXXX公司</p><br><p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizeLegibility; font-feature-settings: &#39;kern&#39; 1; font-kerning: normal; color: rgb(51, 51, 51); font-family: &quot;宋体 Bold&quot;, &quot;宋体 常规&quot;, 宋体; white-space: normal; font-size: 20px;text-align: left">${this.createTime}</p>`;
    }
    
    getTemplate(){
        return `<div class="purchaseDraft" style="width: 1200px;" ng-click="purchaseForm.showPhoneError = false">
            <form class="w5c-form" novalidate name="addConfigForm">
                <!--标题-->
                <div class="draft_title">
                    <p class="draft_detail">{{purchaseForm.taskName}}</p>
                </div>
                <div ng-if="!purchaseForm.isDetail || purchaseForm.isDetail&&purchaseForm.editForm.acceptApplyDocument">
                    <div class="draft_title">
                        <p class="draft_detail_noBorder font_weight">项目验收申请报告</p>
                    </div>
                    <div class="file_preview">
                        <neditor-area class="file_preview_con" ng-if="purchaseForm.isEdit!==false" id="acceptApplyDocument" required="true" ng-model="purchaseForm.editForm.acceptApplyDocument"></neditor-area>
                        <div class="file_preview_con" ng-if="purchaseForm.isEdit===false" compile-html='purchaseForm.editForm.acceptApplyDocument'></div>
                    </div>
                </div>
                <div ng-if="purchaseForm.isEdit!==false||purchaseForm.editForm.providerGoodsTable">
                    <div class="draft_title">
                        <p class="draft_detail_noBorder font_weight">学校供货一览表（总汇表）</p>
                    </div>
                    <!--申请日期和编号等-->
                    <div class="name_time">
                        <span class="name_time_left">使用单位：{{purchaseForm.project.projectGarden}}</span>
                        <span class="name_time_right name_time_data">
                            供货日期：
                            <input type="text" class="input_date_border" id="applyDate" ng-disabled="purchaseForm.isEdit===false" lw-laydate='YYYY-MM-DD' ng-model="purchaseForm.editForm.providerGoodsTable.createDate" readonly="readonly" required placeholder="时间" name="applyDate">
                            <label class="iconfont icon-llreservecalendar data-icon" ng-if="purchaseForm.isEdit!==false"></label>
                        </span>
                    </div>
                    <!--表格-->
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="70">序号</td>
                            <td width="160">学校名称</td>
                            <td width="130">货物名称</td>
                            <td>规格（mm）</td>
                            <td width="70">数量</td>
                            <td width="130">单位</td>
                            <td width="160">单价（元）</td>
                            <td width="160">小计（元）</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.providerGoodsTable.list track by $index">
                            <td>{{$index+1}}</td>
                            <td>{{data.gardenName}}</td>
                            <td>{{data.itemName||data.category}}</td>
                            <td>{{data.specifications||data.category}}</td>
                            <td>{{data.number}}</td>
                            <td>{{data.unit}}</td>
                            <td>{{data.price}}</td>
                            <td>{{data.totalPrice||0}}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text_center">合计大写人民币：{{purchaseForm.editForm.providerGoodsTable.totalPrice||0|numberToUpperCase}}</td>
                            <td></td>
                            <td class="text_center">{{purchaseForm.editForm.providerGoodsTable.totalPrice||0}}</td>
                        </tr>
                    </table>
                    <!--地址,电话-->
                    <div class="reDraft_list">
                        <span class="name_time_left">
                            <label for="deliveryUnit" class="word_center">送货单位：</label>
                            <input id="deliveryUnit" type="text" class="input_class input_no_border w50 width400" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.providerGoodsTable.deliveryUnit" maxlength="20" required name="deliveryUnit" placeholder="20个汉字以内，必填">
                        </span>
                        <span class="name_time_right name_time_contacts">
                            <label for="contacts" class="word_center">联系人：</label>
                            <input id="contacts" type="text" class="input_class input_no_border w50 width275" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.providerGoodsTable.contact" required name="contacts" maxlength="10" placeholder="10个汉字以内，必填">
                        </span>>
                    </div>
                    <div class="reDraft_list" style="overflow:inherit;">
                        <span class="name_time_left">
                            <label for="adress" class="word_center">单位地址：</label>
                            <input id="adress" type="text" class="input_class input_no_border w50 width400" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.providerGoodsTable.unitAddress" maxlength="100" required name="unitAddress" placeholder="100个汉字以内，必填">
                        </span>
                        <span class="name_time_right name_time_contacts">
                            <label for="telephone" class="word_center">联系电话：</label>
                            <input id="telephone" type="text" class="input_class input_no_border w50 width275" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.providerGoodsTable.telephone" ng-blur="purchaseForm.checkPhone(purchaseForm.editForm.providerGoodsTable.telephone,'showPhoneErrorIcon')" maxlength="11" required name="telephone" placeholder="只允许输入电话格式数字，必填">
                            <span class="notEmptyPass" style="margin: -5px 5px;" ng-show="purchaseForm.showPhoneErrorIcon" ng-click="purchaseForm.showErrorMsg('showPhoneError')"></span>
                            <div class="right_format" ng-show="purchaseForm.showPhoneError">请输入正确手机号</div>
                        </span>>
                    </div>
                    <!--已填写的表格下方的虚线-->
                    <div class="table_dashed"></div>
                </div>
                <div ng-if="purchaseForm.isEdit!==false||purchaseForm.editForm.unitSelfCheck">
                    <div class="draft_title">
                        <p class="draft_detail_noBorder font_weight">使用单位自检报告</p>
                    </div>
                    <!--表格-->
                    <table class="itemTable">
                       <tr>
                           <td class="text_center" width="150">使用单位名称</td>
                           <td colspan="3">{{purchaseForm.editForm.unitSelfCheck.gardenName}}</td>
                       </tr>
                        <tr>
                            <td class="text_center">供货单位名称</td>
                            <td colspan="3">
                                <input type="text" class="input_class w50" required ng-disabled="purchaseForm.isEdit===false" name="providerName" ng-model="purchaseForm.editForm.unitSelfCheck.providerName" placeholder="40个字符以内，必填" maxlength="40">
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr>
                            <td class="text_center" width="150">项目名称</td>
                            <td>{{purchaseForm.editForm.unitSelfCheck.projectName}}</td>
                            <td width="150" class="text_center">招标编号</td>
                            <td width="200">
                                <input type="text" ng-if="purchaseForm.isEdit!==false" class="input_class" placeholder="40个字符以内，非必填" maxlength="40" ng-model="purchaseForm.editForm.unitSelfCheck.bidNo" />
                                <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.unitSelfCheck.bidNo}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="text_center">开工日期</td>
                            <td colspan="3">
                                <span class="table-input-date">
                                    <input type="text" class="input_date_border" id="startOperate" max-date="purchaseForm.editForm.unitSelfCheck.endOperateDate" ng-disabled="purchaseForm.isEdit===false" lw-laydate='YYYY-MM-DD' readonly="readonly" ng-model="purchaseForm.editForm.unitSelfCheck.startOperateDate" name="startOperate" required>
                                    <label class="iconfont icon-llreservecalendar table-date-icon" ng-if="purchaseForm.isEdit!==false"></label>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="text_center">完工日期</td>
                            <td colspan="3">
                                <span class="table-input-date">
                                    <input type="text" class="input_date_border" id="endOperateDate" ng-disabled="purchaseForm.isEdit===false" lw-laydate='YYYY-MM-DD' min-date="purchaseForm.editForm.unitSelfCheck.startOperateDate" ng-model="purchaseForm.editForm.unitSelfCheck.endOperateDate" name="endOperateDate" readonly="readonly" required>
                                    <label class="iconfont icon-llreservecalendar table-date-icon" ng-if="purchaseForm.isEdit!==false"></label>
                                </span>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr>
                            <td rowspan={{purchaseForm.editForm.unitSelfCheck.list.length+2}}"" width="100" class="text_center">供货设备名称</td>
                            <td>售后服务条款是否送达</td>
                            <td colspan="5">
                                <select-options class="select_class" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.unitSelfCheck.isAfterSales"
                                    repeat-items="data in purchaseForm.trueAndFalseOptions" item-key="value" is-boolean='true'
                                >
                                   {{data.name}}
                                </select-options>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text_center">设备名称</td>
                            <td colspan="2" class="text_center">规格（mm）</td>
                            <td colspan="2" class="text_center">数量</td>
                        </tr>
                        <tr ng-repeat="data in purchaseForm.editForm.unitSelfCheck.list track by $index">
                            <td colspan="2" class="text_center">{{data.itemName||data.category}}</td>
                            <td colspan="2" class="text_center">{{data.specifications||data.category}}</td>
                            <td colspan="2" class="text_center">{{data.number}}</td>
                        </tr>
                        <tr>
                            <td rowspan="2" width="100" class="text_center">使用单位自检结论</td>
                            <td colspan="6">
                                <textarea class="area_auto input_no_border" required ng-disabled="purchaseForm.isEdit===false" name="selfCheckOpinion" placeholder="1000个汉字以内，必填" ng-model="purchaseForm.editForm.unitSelfCheck.opinion" maxlength="1000"></textarea>
                                <p> </p>
                            </td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td>
                                <span class="tab_top">供货单位签字盖章：</span>
                                <span class="textarea_h70"></span>
                            </td>
                            <td>
                                <span class="tab_top">使用单位签字盖章：</span>
                                <span class="textarea_h70"></span>
                            </td>
                        </tr>
                    </table>
                    <!--已填写的表格下方的虚线-->
                    <div class="table_dashed"></div>
                </div>
                <div ng-if="purchaseForm.isEdit!==false||purchaseForm.editForm.acceptOrder">
                    <div class="draft_title">
                        <p class="draft_detail_noBorder font_weight">项目验收单</p>
                    </div>
                    <div class="draft_title">
                        <p class="draft_detail_noBorder font_weight">顺义区政府采购物资验收单</p>
                    </div>
                    <!--申请日期和编号等-->
                    <div class="name_time">
                        <span class="name_time_left">项目编号：{{purchaseForm.editForm.acceptOrder.projectNo}}</span>
                        <span class="name_time_right">项目名称：{{purchaseForm.editForm.acceptOrder.projectName}}</span>
                    </div>
                    <table class="itemTable">
                        <tr>
                            <td width="60" class="text_center">序号</td>
                            <td width="250" class="text_center">货物名称</td>
                            <td class="text_center">规格（mm）</td>
                            <td width="65" class="text_center">数量</td>
                            <td width="65" class="text_center">单位</td>
                            <td width="96" class="text_center">单价（元）</td>
                            <td width="100" class="text_center">小计（元）</td>
                            <td width="160" class="text_center">备注</td>
                        </tr>
                        <tr ng-repeat="data in purchaseForm.editForm.acceptOrder.list track by $index">
                            <td class="text_center">{{$index+1}}</td>
                            <td class="text_center">{{data.itemName||data.category}}</td>
                            <td class="text_center">{{data.specifications||data.category}}</td>
                            <td class="text_center">{{data.number}}</td>
                            <td class="text_center">{{data.unit}}</td>
                            <td class="text_center">{{data.price}}</td>
                            <td class="text_center">{{data.totalPrice}}</td>
                            <td class="text_center">{{data.remark}}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text_center">合计大写人民币：{{purchaseForm.editForm.acceptOrder.totalPrice||0|numberToUpperCase}}</td>
                            <td class="text_center">{{purchaseForm.editForm.acceptOrder.totalPrice||0}}</td>
                            <td></td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="tab_height150">
                            <td>
                                <p>供货单位：{{purchaseForm.editForm.acceptOrder.providerGarden}}</p>
                                <p class="margin-top-bottom">发货人签字：</p>
                                <p>发货日期：年 月 日</p>
                            </td>
                            <td>
                                <p>收货单位：{{purchaseForm.editForm.acceptOrder.receiptGarden}}</p>
                                <p class="margin-top-bottom">负责人签字：</p>
                                <p>收货日期：年 月 日</p>
                            </td>
                        </tr>
                        <tr class="tab_height150">
                            <td colspan="2">
                                <span>验收意见:</span>
                                <textarea class="area_auto input_no_border area_before_text" ng-disabled="purchaseForm.isEdit===false" required name="acceptOpinion" ng-model="purchaseForm.editForm.acceptOrder.acceptOpinion" placeholder="1000个汉字以内，必填" maxlength="1000"></textarea>
                                <p class="margin-top20">
                                    <span>验收小组签字：</span>
                                    <span class="tab_bottom">年 月 日</span>
                                </p>
                            </td>
                        </tr>
                    </table>
                    <!--已填写的表格下方的虚线-->
                    <div class="table_dashed"></div>
                </div>
                <div ng-if="purchaseForm.isEdit!==false||purchaseForm.editForm.qualifiedProve">
                    <div class="draft_title">
                        <p class="draft_detail_noBorder font_weight">产品质量合格证明材料</p>
                    </div>
                    <table class="itemTable">
                        <tr class="text_center">
                            <td>项目名称-产品质量合格证明资料目录</td>
                        </tr>
                    </table>
                    <table class="itemTable">
                        <tr class="productOrder-table">
                            <td width="60">序号</td>
                            <td width="150">品目</td>
                            <td width="335">具体产品型号</td>
                            <td width="465">合格证</td>
                            <td width="160">备注</td>
                        </tr>
                        <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.qualifiedProve.list track by $index">
                            <td>{{$index+1}}</td>
                            <td>{{data.itemName||data.category}}</td>
                            <td>{{data.specifications||data.category}}</td>
                            <td width="465" class="add_img_td" flow-init="{query:{folder: 'dbp'}}" flow-files-submitted="$flow.upload()" 
                                flow-file-added="purchaseForm.validFile($file,'jpg,png,gif',10*1024*1024)"
                                flow-file-success="purchaseForm.uploadSuccess(data,$message,$file)">
                                <div class="td_border" ng-class="{'error':addConfigForm['attachmentProve'+$index].change&&addConfigForm['attachmentProve'+$index].$invalid}"> 
                                    <input type="text" class="none" ng-model="data.attachments[0]" name="attachmentProve{{$index}}" required/>
                                    <!--展示已经前面的记录-->
                                    <div class="img_box uploaded" ng-repeat="x in data.attachments track by $index">
                                        <pic-view del-file="purchaseForm.removeFile(data,$index,$flow.files)" hide-name="true" edit='true' file-name="x.name" file-path="x.url"></pic-view>
                                    </div>
                                    <div class="img_box uploading" ng-class="{true:'uploaded',false:'uploading'}[file.hide]" ng-repeat="file in $flow.files" ng-if="!file.hide">
                                        <p class="percent">
                                            <em ng-hide="file.hide">{{file.progress()|flowPercentage}}</em>
                                        </p>
                                        <span ng-show="file.hide" ng-class="{'top':file.hide}" class="remove" ng-click="file.cancel();"></span>
                                        <p class="procress" ng-hide="file.hide">
                                            <span class="bg_purple" ng-style="{width: (file.progress() * 100 + '%')}"></span>
                                        </p>
                                    </div>
                                    <flow-btn class="img_box add" ng-if="purchaseForm.isEdit!==false"></flow-btn>
                                </div>
                            </td>
                            <td width="160">
                                <textarea class="area_auto h100" placeholder="500个汉字以内，非必填"你 ng-if="purchaseForm.isEdit!==false"ng-model="data.remark" name="productRemark"></textarea>
                                <span ng-if="purchaseForm.isEdit===false">{{data.remark}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">
                                <span class="width60">其他资料</span>
                                <span>1.公司营业性质</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">
                                <span class="width60"></span>
                                <span>2.供应商《产品质量承诺书》</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">
                                <span class="width60"></span>
                                <span>3.其他材料</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="reDraft_list w200_upload" ng-if="purchaseForm.editForm.attachments">
                    <bdp-upload-file
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="公司营业性质"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M"
                        type="{{purchaseForm.attachmentType.businessNature}}"
                        size="{{5*1024*1024}}"
                        format="jpg,gif,png">
                    </bdp-upload-file>
                </div>
                <div ng-if="purchaseForm.isEdit!==false||purchaseForm.editForm.qualityPromise">
                    <span class="width200 word_center">产品质量承诺书：</span>
                    <div class="file_preview">
                        <neditor-area ng-if="purchaseForm.isEdit!==false" class="file_preview_con" id="qualityPromise" required="true" ng-model="purchaseForm.editForm.qualityPromise"></neditor-area>
                        <div class="file_preview_con" ng-if="purchaseForm.isEdit===false" compile-html='purchaseForm.editForm.qualityPromise'></div>
                    </div>
                </div>
                <div class="reDraft_list w27_upload" ng-if="purchaseForm.editForm.attachments">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="供货服务商满意度调查表（原件扫描件）"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.providerSatisfy}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div ng-if="purchaseForm.isEdit!==false||purchaseForm.editForm.serviceQuality">
                    <div class="reDraft_list overflow_hide">
                        <span class="width165 word_center"></span>
                        <span class="word_center" ng-if="purchaseForm.isEdit!==false">请将上部纸质版的满意度调查表数据录入下部表格中：（请确保纸质版和录入的数据一致，否则审核将不能通过。）</span>
                        <table class="itemTable nomalTable gradeTable">
                            <tr class="productOrder-table">
                                <td width="191">评级内容</td>
                                <td width="123">等级</td>
                                <td width="100">分数</td>
                                <td width="186">得分</td>
                                <td width="209">备注</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td rowspan="3">合同履行</td>
                                <td>好</td>
                                <td>20</td>
                                <td rowspan="3">
                                    <input type="text" class="input_class" ng-disabled="purchaseForm.isEdit===false" placeholder="0 ~ 35之间的整数，必填" ng-change="purchaseForm.getTotalGrade('fillContractGrade')" ng-model="purchaseForm.editForm.serviceQuality.fillContractGrade" required name="fillContractGrade">   
                                </td>
                                <td rowspan="3">
                                    <textarea class="area_auto input_no_border" placeholder="100个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.serviceQuality.fillContractRemark" required name="fillContractRemark"></textarea>
                                </td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>一般</td>
                                <td>10</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>差</td>
                                <td>5</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td rowspan="3">产品质量</td>
                                <td>好</td>
                                <td>20</td>
                                <td rowspan="3">
                                    <input type="text" class="input_class" placeholder="0 ~ 35之间的整数，必填" ng-disabled="purchaseForm.isEdit===false" ng-change="purchaseForm.getTotalGrade('productQualityGrade')" ng-model="purchaseForm.editForm.serviceQuality.productQualityGrade" required name="productQualityGrade">   
                                </td>
                                <td rowspan="3">
                                    <textarea class="area_auto input_no_border" placeholder="100个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.serviceQuality.productQualityRemark" required name="productQualityRemark"></textarea>
                                </td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>一般</td>
                                <td>10</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>差</td>
                                <td>5</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td rowspan="3">安全防范</td>
                                <td>好</td>
                                <td>20</td>
                                <td rowspan="3">
                                    <input type="text" class="input_class" placeholder="0 ~ 35之间的整数，必填" ng-disabled="purchaseForm.isEdit===false" ng-change="purchaseForm.getTotalGrade('safeguardGrade')" ng-model="purchaseForm.editForm.serviceQuality.safeguardGrade" required name="safeguardGrade">   
                                </td>
                                <td rowspan="3">
                                    <textarea class="area_auto input_no_border" placeholder="100个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.serviceQuality.safeguardRemark" required name="safeguardRemark"></textarea>
                                </td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>一般</td>
                                <td>10</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>差</td>
                                <td>5</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td rowspan="3">培训情况</td>
                                <td>好</td>
                                <td>20</td>
                                <td rowspan="3">
                                    <input type="text" class="input_class" placeholder="0 ~ 35之间的整数，必填" ng-disabled="purchaseForm.isEdit===false" ng-change="purchaseForm.getTotalGrade('trainGrade')" ng-model="purchaseForm.editForm.serviceQuality.trainGrade" required name="trainGrade">   
                                </td>
                                <td rowspan="3">
                                    <textarea class="area_auto input_no_border" placeholder="100个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.serviceQuality.trainRemark" required name="trainRemark"></textarea>
                                </td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>一般</td>
                                <td>10</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>差</td>
                                <td>5</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td rowspan="3">售后服务</td>
                                <td>好</td>
                                <td>20</td>
                                <td rowspan="3">
                                    <input type="text" class="input_class" placeholder="0 ~ 35之间的整数，必填" ng-disabled="purchaseForm.isEdit===false" ng-change="purchaseForm.getTotalGrade('afterSalesGrade')" ng-model="purchaseForm.editForm.serviceQuality.afterSalesGrade" required name="afterSalesGrade">   
                                </td>
                                <td rowspan="3">
                                    <textarea class="area_auto input_no_border" placeholder="100个汉字以内，必填" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.serviceQuality.afterSalesRemark" required name="afterSalesRemark"></textarea>
                                </td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>一般</td>
                                <td>10</td>
                            </tr>
                            <tr class="productOrder-table">
                                <td>差</td>
                                <td>5</td>
                            </tr>
                            <tr>
                                <td colspan="5">
                                    <span class="name_time_left">总分：{{purchaseForm.editForm.serviceQuality.totalGrade||0}}</span>
                                    <span class="name_time_right">打分人：{{purchaseForm.editForm.serviceQuality.accountName}}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="reDraft_list w200_upload" ng-if="purchaseForm.editForm.attachments">
                    <bdp-upload-file
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="其他材料（非必填）"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.acceptOther}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div ng-if="purchaseForm.isEdit!==false">
                <!--已填写的表格下方的虚线-->
                <div class="table_dashed"></div>
        
                <!--审核表单-->
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
                    <div class="reDraft_list">
                        <span class="width160 word_center">下一步操作节点名称：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.taskInfoList[0].taskName}}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">下一步操作人：</span>
                        
                        <select-options class="get_method" ng-model="purchaseForm.editForm[purchaseForm.nextAuditInfo.taskInfoList[0].assigneeVar]" name="assigneeVar" repeat-items="data in purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                        </select-options>
                    </div>
                    <div class="reDraft_list" ng-if="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0">
                        <p class="width160 word_center"></p>
                        <p class="word_center red_color"><i class="iconfont icon-alarmPrompt yellow_color"></i>系统检测到当前项目在下一节点无任何满足条件的操作用户接收，这将导致本项目永远无法推进，请迅速联系系统管理员配置相关节点操作用户！</p>
                    </div>
                </div>
                <!--按钮-->
                <div class="reDraft_btn" style="padding:0">
                    <button class="btn_bd" ng-click="purchaseForm.isEdit===undefined?auditCancel():closeThisDialog()">取消</button>
                    <button class="btn_bg" ng-disabled="purchaseForm.auditing && purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0" form-submit-valid="purchaseForm.auditThisTask()">确定</button>
                </div>
                </div>
                <div class="reDraft_btn" style="padding:0" ng-if="purchaseForm.isEdit===false">
                    <button class="btn_bd" ng-click="closeThisDialog()">返回</button>
                </div>
            </form>
        </div>`
    }
}
uploadAcceptMaterial.$inject = ['purchaseInterface','$stateParams','$sessionStorage','purchaseService','$filter','$timeout','dialogsManager','ProjectInterface','$scope','ProjectService'];
