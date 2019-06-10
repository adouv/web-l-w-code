/**
 * @Author hejialin
 * @Description 描述
 */
import validCtrl from '../services/baseValidate';
export default class uploadTenderMaterial extends validCtrl {
    constructor(purchaseInterface, purchaseService, dialogsManager) {
        super();
        this.purchaseInterface = purchaseInterface;
        this.purchaseService = purchaseService;
        this.dialogsManager = dialogsManager;
        this.init();
    }

    init() {
        this.importUrl = this.purchaseInterface.getImportUrl(this.purchaseInterface.templateType.APPROVALOUTCATALOGENQUIRY);
        if (this.isEdit === undefined) {
            this.editForm.purchaseList = [{}];
        }
    }

    /**
     * 下载采购模版
     */
    downloadTemplate(type) {
        this.purchaseInterface.downloadTemplate(type);
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
            this.editForm.purchaseList.forEach(price => {
                totalPrice += price.totalPrice * 1;
            });
            this.editForm.totalPrice = totalPrice.toFixed(2);
        }
    }

    /**
     * 确定审核
     */
    auditThisTask() {
        if (this.editForm.isOffline === undefined) {
            this.dialogsManager.showMessage('请选择标书线下是否送达！', { className: 'warning' });
        } else {
            this.auditing = true;
            this.setUsefulData();
            this.auditTask(this.editForm);
        }
    }

    /**
     * 设置使用的数据
     */
    setUsefulData() {
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.bidGarden.field,
            this.editForm.bidGarden
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.bidDate.field,
            this.editForm.bidDate
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.bidAmount.field,
            this.editForm.bidAmount
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.attachmentType.bidNotice,
            this.getTypeAttachments(this.attachmentType.bidNotice)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.attachmentType.bidEvaluate,
            this.getTypeAttachments(this.attachmentType.bidEvaluate)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.attachmentType.proxyAgree,
            this.getTypeAttachments(this.attachmentType.proxyAgree)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.attachmentType.expertOpinion,
            this.getTypeAttachments(this.attachmentType.expertOpinion)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.attachmentType.bidDocument,
            this.getTypeAttachments(this.attachmentType.bidDocument)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.attachmentType.publicBidMaterial,
            this.getTypeAttachments(this.attachmentType.publicBidMaterial)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.isOffline.field,
            this.editForm.isOffline
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.bidGoodList.field,
            this.editForm.purchaseList
        );
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
            this.editForm.totalPrice = this.editForm.totalPrice || 0;
            list.forEach(data => {
                data.totalPrice = data.price * data.number;
                this.editForm.totalPrice += data.totalPrice;
            });
        })
    }

    /**
     * 获取对应类型的附件
     * @param type
     * @return {Array}
     */
    getTypeAttachments(type) {
        let attachmentList = [];
        this.editForm.attachments.forEach(attachment => {
            if (type == attachment.type) {
                attachmentList.push(attachment)
            }
        });
        return attachmentList;
    }

    removeLine(list, index) {
        list.splice(index, 1);
    }

    addLine(list, index) {
        list.splice(index + 1, 0, {});
    }

    getTemplate() {
        return `<div class="purchaseDraft">
            <form class="w5c-form" name="addConfigForm" novalidate ng-if="purchaseForm.isEdit===undefined">
                <!--标题-->
                <div class="draft_title">
                    <p class="draft_detail">{{purchaseForm.taskName}}</p>
                </div>
                <div class="reDraft_content2">
                    <div class="reDraft_list">
                        <span class="width160 word_center">中标公司：</span>
                        <input type="text" class="input_class w50 width600" placeholder="100个汉字以内，必填" ng-model="purchaseForm.editForm.bidGarden" required name="bidGarden">
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">中标金额：</span>
                        <input type="text" class="input_class w50 width600" placeholder="正实数，默认支持小数点后两位，必填" ng-change="purchaseForm.controlAmount(purchaseForm.editForm,'bidAmount')" ng-model="purchaseForm.editForm.bidAmount" required name="bidAmount">
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">中标时间：</span>
                        <input type="text" class="input_class width600 curr" id="time" lw-laydate='YYYY-MM-DD' ng-model="purchaseForm.editForm.bidDate" readonly="readonly" placeholder="时间" required name="bidDate">
                        <label class="iconfont icon-llreservecalendar input-icon"></label>
                    </div>
                    <div class="reDraft_list width870">
                        <bdp-upload-file
                            required="true"
                            attachment-list="purchaseForm.editForm.attachments"
                            title="中标通知书（原件扫描件）"
                            message="只允许上传jpg、png、gif格式的图片、单个文件大小不超过5M；必填"
                            type="{{purchaseForm.attachmentType.bidNotice}}"
                            size="{{5*1024*1024}}"
                            format="jpg,jpeg,png">
                        </bdp-upload-file>
                    </div>
                    <div class="reDraft_list width870">
                        <bdp-upload-file
                            required="true"
                            attachment-list="purchaseForm.editForm.attachments"
                            title="评标报告"
                            message="只允许上传jpg、png、gif和常用office格式的文件，单个文件大小不超过5M；必填"
                            type="{{purchaseForm.attachmentType.bidEvaluate}}"
                            size="{{5*1024*1024}}"
                            format="doc,docx,xls,xlsx,ppt,pptx,pdf,jpeg,jpg,png">
                        </bdp-upload-file>
                    </div>
                    <div class="reDraft_list width870">
                        <bdp-upload-file
                            required="true"
                            attachment-list="purchaseForm.editForm.attachments"
                            title="代理协议"
                            message="只允许上传jpg、png、gif和常用office格式的文件，单个文件大小不超过5M；必填"
                            type="{{purchaseForm.attachmentType.proxyAgree}}"
                            size="{{5*1024*1024}}"
                            format="doc,docx,xls,xlsx,ppt,pptx,pdf,jpeg,jpg,png">
                        </bdp-upload-file>
                    </div>
                    <div class="reDraft_list width870">
                        <bdp-upload-file
                            attachment-list="purchaseForm.editForm.attachments"
                            title="专家论证意见"
                            message="只允许上传jpg、png、gif和常用office格式的文件，单个文件大小不超过5M；非必填"
                            type="{{purchaseForm.attachmentType.expertOpinion}}"
                            size="{{5*1024*1024}}"
                            format="doc,docx,xls,xlsx,ppt,pptx,pdf,jpeg,jpg,png">
                        </bdp-upload-file>
                    </div>
                    <div class="reDraft_list width870">
                        <bdp-upload-file
                            attachment-list="purchaseForm.editForm.attachments"
                            title="招标文件"
                            message="只允许上传jpg、png、gif和常用office格式的文件，单个文件大小不超过5M；非必填"
                            type="{{purchaseForm.attachmentType.bidDocument}}"
                            size="{{5*1024*1024}}"
                            format="doc,docx,xls,xlsx,ppt,pptx,pdf,jpeg,jpg,png">
                        </bdp-upload-file>
                    </div>
                    <div class="reDraft_list width870">
                        <bdp-upload-file
                            attachment-list="purchaseForm.editForm.attachments"
                            title="公招资料汇编"
                            message="只允许上传jpg、png、gif和常用office格式的文件，单个文件大小不超过5M；非必填"
                            type="{{purchaseForm.attachmentType.publicBidMaterial}}"
                            size="{{5*1024*1024}}"
                            format="doc,docx,xls,xlsx,ppt,pptx,pdf,jpeg,jpg,png">
                        </bdp-upload-file>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">标书线下是否送达：</span>
                        <span class="word_center lookApproveCon">
                                <label>
                                    <input type="radio" class="radio_class" ng-model="purchaseForm.editForm.isOffline" value="true">是
                                </label>
                                <label>
                                    <input type="radio" class="radio_class" ng-model="purchaseForm.editForm.isOffline" value="false">否
                                </label>
                            </span>
                    </div>
                </div>
                <div class="notable_title">
                    <span>项目中标货物清单：</span>
                    <div class="down_import">
                        <import-file url="purchaseForm.importUrl" size="{{5*1024*1024}}" file-name="批量导入" callback-success="purchaseForm.importSuccess($importData,$importFile)"></import-file>
                        <span class="download" ng-click="purchaseForm.downloadTemplate(purchaseForm.purchaseInterface.templateType.APPROVALOUTCATALOGENQUIRY)">模板下载</span>
                    </div>
                </div>
                <table class="itemTable noBorderTable">
                    <tr class="productOrder-table">
                        <td width="70">序号</td>
                        <td width="160">货品名称</td>
                        <td width="130">品牌</td>
                        <td>规格型号</td>
                        <td width="70">数量</td>
                        <td width="130">单位</td>
                        <td width="160">单价（元）</td>
                        <td width="160">总价（元）</td>
                    </tr>
                    <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.purchaseList track by $index">
                        <td>
                            <span>{{$index+1}}</span>
                            <span class="add_minus">
                                <i class="iconfont icon-minus" ng-show="purchaseForm.editForm.purchaseList.length>1" ng-click="purchaseForm.removeLine(purchaseForm.editForm.purchaseList,$index)"></i>
                                <i class="iconfont icon-plus" ng-click="purchaseForm.addLine(purchaseForm.editForm.purchaseList,$index)"></i>
                            </span>
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="50个汉字以内，必填" ng-model="data.itemName" maxlength="50" required name="itemName{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="20个汉字以内，必填" ng-model="data.brand" maxlength="20" required name="brand{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="500个汉字以内，必填" ng-model="data.category" maxlength="500" required name="specifications{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="正整数，必填" ng-model="data.number" ng-change="purchaseForm.getTotalPrice(data)" maxlength="20" required name="num{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="10个汉字以内，必填" ng-model="data.unit" maxlength="10" required name="unit{{$index}}">
                        </td>
                        <td>
                            <input type="text" class="input_class" placeholder="必填" ng-model="data.price" required ng-change="purchaseForm.getTotalPrice(data)" name="price{{$index}}">
                        </td>
                        <td>
                            <span>{{data.totalPrice||0}}</span>
                        </td>
                    </tr>
                </table>
                <table class="itemTable allTable">
                    <tr>
                        <td class="text-right">总计</td>
                        <td width="160" style="text-align:center">
                            {{purchaseForm.editForm.totalPrice||0}}
                        </td>
                    </tr>
                </table>
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
                        
                        <select-options class="selectWid400 get_method" ng-model="purchaseForm.editForm[purchaseForm.nextAuditInfo.taskInfoList[0].assigneeVar]" name="assigneeVar" repeat-items="data in purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList" item-key="accountId" required>
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
                    <span class="btn_bd" ng-click="auditCancel(purchaseForm.isEdit)">取消</span>
                    <button class="btn_bg" type="submit" ng-disabled="purchaseForm.auditing || purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0" form-submit-valid="purchaseForm.auditThisTask()">确定</button>
                </div>
            </form>
            <div ng-if="purchaseForm.isEdit===false">
            <table class="itemTable noBorderTable" style="margin-top: 50px;">
                    <tr class="productOrder-table">
                        <td width="70">序号</td>
                        <td width="160">货品名称</td>
                        <td width="130">品牌</td>
                        <td>规格型号</td>
                        <td width="70">数量</td>
                        <td width="130">单位</td>
                        <td width="160">单价（元）</td>
                        <td width="160">总价（元）</td>
                    </tr>
                    <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.bidGoodList track by $index">
                        <td>
                            <span>{{$index+1}}</span>
                        </td>
                        <td>{{data.itemName}}</td>
                        <td>{{data.brand}}</td>
                        <td>{{data.category}}</td>
                        <td>{{data.number}}</td>
                        <td>{{data.unit}}</td>
                        <td>{{data.price}}</td>
                        <td>
                            <span>{{data.totalPrice||0}}</span>
                        </td>
                    </tr>
                </table>
                <div class="reDraft_btn" style="padding:0">
                    <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
                </div>
            </div>
        </div>`;
    }
}
uploadTenderMaterial.$inject = ['purchaseInterface', 'purchaseService', 'dialogsManager'];
