/**
 * @Author hejialin
 * @Description 审核配置
 */
export default {
    auditCategory: { // 通用节点2
        taskKey: ['usertask02'],
        kindCategory: {
            field: 'kindCategory'
        },
        template: `<div class="content-list" style="width:70%">
                        <span class="content-list-left">配标类别：</span>
                        <span class="content-list-right">{{purchaseDetail.formData.kindCategory}}</span>
                    </div>`
    },
    uploadCapitalProve: { // 通用节点8
        taskKey: ["usertask61-redosame"],
        attachments: {
            capitalProve: 'capitalProve'
        },
        capitalProve: {
            field: 'capitalProve',
        },
        capitalMaterialList: {
            field: 'capitalMaterialList'
        },
        budgetGarden: {
            field: 'budgetGarden',
        },
        template: `<div class="go-back-box">
                    <div class="red_outbor" id="{{purchaseDetail.formData.budgetGardenTaskKey}}">
                        <a href="javascript:void(0);" name="{{purchaseDetail.formData.budgetGardenTaskKey}}"></a>
                        <div ng-repeat="data in purchaseDetail.formData.capitalMaterialList">
                            <div class="content-list">
                                <span class="content-list-left">项目资金文号：</span>
                                <span class="content-list-right">{{data.name}}</span>
                            </div>
                            <div class="content-list" ng-if="data.category">
                                <span class="content-list-left">资金文号类型：</span>
                                <span class="content-list-right">{{data.category}}</span>
                            </div>
                            <div class="content-list">
                                <span class="content-list-left">项目资金额度：</span>
                                <span class="content-list-right">{{data.amount?data.amount+'万元':''}}</span>
                            </div>
                            <div class="content-list" ng-if="data.year">
                                <span class="content-list-left">资金执行年度：</span>
                                <span class="content-list-right">{{data.year?data.year+'年':''}}</span>
                            </div>
                        </div>
                        <div class="content-list" ng-class="{'down':purchaseDetail.formData.capitalProve.length>1}">
                            <span class="content-list-left">项目资金证明原件扫描件：</span>
                            <span class="content-list-right">
                                <pic-view class="attachment" sp="true"  ng-repeat="data in purchaseDetail.formData.capitalProve" file-name="data.name" file-path="data.url"></pic-view>
                                <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.capitalProve.length>1" download-zip="purchaseDetail.formData.capitalProve" zip-name="项目资金证明原件扫描件">打包下载</button>
                            </span>
                        </div>
                        <div class="content-list">
                            <span class="content-list-left">项目预算单位：</span>
                            <span class="content-list-right">{{purchaseDetail.formData.budgetGarden}}</span>
                        </div>
                        <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.budgetGardenTaskKey)">返回审批操作 ＞＞</a>
                    </div>
                </div>`
    },
    auditFinance: { // 通用节点14
        attachments: {
            auditFinance: 'auditFinance'
        }
    },
    uploadContract: { // 通用节点18
        taskKey: ['usertask90-redosame', 'usertask49-redosame'],
        attachments: {
            originalContract: 'originalContract',
            contractProve: 'contractProve',
            legalAdvice: 'legalAdvice',
            recordNotice: 'recordNotice',
            meetingMinutes: 'meetingMinutes',
        },
        originalContract: {
            field: 'originalContract'
        },
        contractProve: {
            field: 'contractProve'
        },
        legalAdvice: {
            field: 'legalAdvice'
        },
        recordNotice: {
            field: 'recordNotice'
        },
        meetingMinutes: {
            field: 'meetingMinutes'
        },
        template: `<div class="go-back-box">
                    <div class="red_outbor" id="{{purchaseDetail.formData.contractProveTaskKey}}">
                    <a href="javascript:void(0);" name="{{purchaseDetail.formData.contractProveTaskKey}}"></a>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.originalContract.length>1}">
                        <span class="content-list-left">项目合同原件（含签字盖章）扫描件：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.originalContract" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.originalContract.length>0" download-zip="purchaseDetail.formData.originalContract" zip-name="项目合同原件（含签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.contractProve.length>1}">
                        <span class="content-list-left">项目合同乙方资质证明原件扫描件：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.contractProve" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.contractProve.length>1" download-zip="purchaseDetail.formData.contractProve" zip-name="项目合同乙方资质证明原件扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.legalAdvice.length>1}">
                        <span class="content-list-left">项目法律意见书原件扫描件：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.legalAdvice" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.legalAdvice.length>1" download-zip="purchaseDetail.formData.legalAdvice" zip-name="项目法律意见书原件扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.recordNotice.length>1}">
                        <span class="content-list-left">项目备案通知书原件扫描件：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.recordNotice" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.recordNotice.length>1" download-zip="purchaseDetail.formData.recordNotice" zip-name="项目备案通知书原件扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.meetingMinutes.length>1}">
                        <span class="content-list-left">项目会议纪要原件扫描件：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.meetingMinutes" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.meetingMinutes.length>1" download-zip="purchaseDetail.formData.meetingMinutes" zip-name="项目会议纪要原件扫描件">打包下载</button>
                        </span>
                    </div>
                    <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.contractProveTaskKey)">返回审批操作 ＞＞</a>
                   </div>
                </div>`
    },
    purchaseReferPrice: { // 特殊节点4
        purchaseList: {
            field: 'purchaseList'
        }
    },
    purchaseProject: { // 特殊节点5
        taskKey: ['usertask63'],
        approvalGarden:{
            field: 'approvalGarden'
        },
        projectApproval: {
            field: 'projectApproval'
        },
        template: `<div class="go-back-box">
                    <div class="red_outbor" id="{{purchaseDetail.formData.projectApproval.taskKey}}">
                        <a href="javascript:void(0);" name="{{purchaseDetail.formData.projectApproval.taskKey}}"></a>
                        <div class="content-list">
                            <span class="content-list-left">项目编号：</span>
                            <span class="content-list-right">{{purchaseDetail.formData.projectApproval.projectNum}}</span>
                        </div>
                        <div class="content-list">
                            <span class="content-list-left">项目采购方式：</span>
                            <span class="content-list-right" ng-repeat="method in purchaseDetail.purchaseMethods" 
                                ng-if="method.itemValue==purchaseDetail.formData.projectApproval.purchaseMethod">
                                {{method.itemName}}
                            </span>
                        </div>
                        <div class="content-list">
                            <span class="content-list-left">项目立项表单：</span>
                            <span class="content-list-right">
                                <span class="projectApprovalForm-left" ng-switch="purchaseDetail.formData.projectApproval.purchaseMethod">
                                    <em ng-click="purchaseDetail.showProjectApprovalForm('政府立项采购表',purchaseDetail.formData.projectApproval)" ng-switch-when="GOVERNMENT">政府立项采购表</em>
                                    <em ng-click="purchaseDetail.showProjectApprovalForm('教育系统政府采购目录外设备采购审批表',purchaseDetail.formData.projectApproval)" ng-switch-when="OUT_CATALOG">教育系统政府采购目录外设备采购审批表</em>
                                    <em ng-click="purchaseDetail.showProjectApprovalForm('办公设备协议采购审批表',purchaseDetail.formData.projectApproval)" ng-switch-when="DEVICE">办公设备协议采购审批表</em>
                                    <em ng-click="purchaseDetail.showProjectApprovalForm('家具设备协议采购审批表',purchaseDetail.formData.projectApproval)" ng-switch-when="FURNITURE">家具设备协议采购审批表</em>
                                    <em ng-click="purchaseDetail.showProjectApprovalForm('教育系统办公设备协议采购审批表（自筹资金）',purchaseDetail.formData.projectApproval)" ng-switch-when="DEVICE_SELF">教育系统办公设备协议采购审批表（自筹资金）</em>
                                    <em ng-click="purchaseDetail.showProjectApprovalForm('教育系统办公家具协议采购审批表（自筹资金）',purchaseDetail.formData.projectApproval)" ng-switch-when="FURNITURE_SELF">教育系统办公家具协议采购审批表（自筹资金）</em>
                                </span>
                            </span>
                        </div>
                        <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.projectApproval.taskKey)">返回审批操作 ＞＞</a>
                    </div>
                </div>`
    },
    purchaseSupplier: { //特殊节点6
        taskKey:['usertask44-redosame'],
        providerList: {
            field: 'providerList'
        },
        providerRecord:{
            field: 'providerRecord'
        },
        template:`<div class="go-back-box" ng-if="purchaseDetail.formData.projectApproval.purchaseMethod!='GOVERNMENT'">
                 <div class="red_outbor" id="{{purchaseDetail.formData.providerRecord.taskKey}}">
                    <a href="javascript:void(0);" name="{{purchaseDetail.formData.providerRecord.taskKey}}"></a>
                    <div class="content-list">
                        <span class="content-list-left">项目供货商选用记录单：</span>
                        <span class="projectApprovalForm-left">
                            <em ng-if="purchaseDetail.formData.providerRecord" ng-click="purchaseDetail.openExternalFormDialog('项目供货商选用记录单',purchaseDetail.formData.providerRecord)">设备采购项目会议纪要</em>
                        </span>
                    </div>
                    <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.providerRecord.taskKey)">返回审批操作 ＞＞</a>
                 </div>
                </div>`
    },
    purchasePriceRecord: { // 特殊节点7
        taskKey: ['usertask47-redosame'],
        bidUnitGoodsList: {
            field: 'bidUnitGoodsList'
        },
        bidGarden: {
            field: 'bidGarden'
        },
        bidAmount: {  //中标价格
            field: 'bidAmount'
        },
        bargainPriceOrder:{
            field:'bargainPriceOrder'
        },
        template: `<div class="go-back-box" ng-if="purchaseDetail.formData.projectApproval.purchaseMethod!='GOVERNMENT'">
                    <div class="red_outbor" id="{{purchaseDetail.formData.bargainPriceOrder.taskKey}}">
                        <a href="javascript:void(0);" name="{{purchaseDetail.formData.bargainPriceOrder.taskKey}}"></a>
                        <div class="content-list">
                            <span class="content-list-left">项目询价议价开标记录单：</span>
                            <span class="projectApprovalForm-left" ng-if="purchaseDetail.formData.bargainPriceOrder">
                                <em ng-if="purchaseDetail.formData.projectApproval.purchaseMethod!='OUT_CATALOG'" ng-click="purchaseDetail.openExternalFormDialog('协议采购供货议价记录',purchaseDetail.formData.bargainPriceOrder)">协议采购供货议价记录</em>
                                <em ng-if="purchaseDetail.formData.projectApproval.purchaseMethod=='OUT_CATALOG'" ng-click="purchaseDetail.openExternalFormDialog('询价开标记录',purchaseDetail.formData.bargainPriceOrder)">询价开标记录</em>
                            </span>
                        </div>
                        <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.bargainPriceOrder.taskKey)">返回审批操作 ＞＞</a>
                    </div>
                </div>`
    },
    uploadTenderMaterial: { // 特殊节点8
        taskKey: ['usertask89'],
        attachments: {
            bidNotice: 'bidNotice',
            bidEvaluate: 'bidEvaluate',
            proxyAgree: 'proxyAgree',
            expertOpinion: 'expertOpinion',
            bidDocument: 'bidDocument',
            publicBidMaterial: 'publicBidMaterial',
        },
        bidGarden: {
            field: 'bidGarden',
            template: '项目中标公司'
        },
        bidAmount: {
            field: 'bidAmount',
            template: '项目中标金额'
        },
        bidDate: {
            field: 'bidDate',
            template: '项目中标时间'
        },
        isOffline: {
            field: 'isOffline',
            template: '标书线下是否送达'
        },
        bidGoodList: {
            field: 'bidGoodList',
            template: '项目中标货物清单'
        },
        bidNotice: {
            field:'bidNotice'
        },
        bidEvaluate: {
            field:'bidEvaluate'
        },
        proxyAgree: {
            field:'proxyAgree'
        },
        expertOpinion: {
            field:'expertOpinion'
        },
        bidDocument: {
            field:'bidDocument'
        },
        publicBidMaterial: {
            field:'publicBidMaterial'
        },
        template: `<div class="go-back-box noneDetailImg" ng-if="!purchaseDetail.formData.projectApproval.purchaseMethod||purchaseDetail.formData.projectApproval.purchaseMethod=='GOVERNMENT'">
                    <div class="red_outbor" id="{{purchaseDetail.formData.isOfflineTaskKey}}">
                    <a href="javascript:void(0);" name="{{purchaseDetail.formData.isOfflineTaskKey}}"></a>
                    <div class="content-list">
                        <span class="content-list-left">项目中标公司：</span>
                        <span class="content-list-right">{{purchaseDetail.formData.bidGarden}}</span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">项目中标金额：</span>
                        <span class="content-list-right">{{purchaseDetail.formData.bidAmount?purchaseDetail.formData.bidAmount+'元':''}}</span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">项目中标时间：</span>
                        <span class="content-list-right">{{purchaseDetail.formData.bidDate|date:'yyyy年MM月dd日'}}</span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.bidNotice.length>1}">
                        <span class="content-list-left">中标通知书（原件扫描件）：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.bidNotice" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.bidNotice.length>1" download-zip="purchaseDetail.formData.bidNotice" zip-name="中标通知书（原件扫描件）">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.bidEvaluate.length>1}">
                        <span class="content-list-left">评标报告：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.bidEvaluate" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.bidEvaluate.length>1" download-zip="purchaseDetail.formData.bidEvaluate" zip-name="评标报告">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.proxyAgree.length>1}">
                        <span class="content-list-left">代理协议：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.proxyAgree" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.proxyAgree.length>1" download-zip="purchaseDetail.formData.proxyAgree" zip-name="代理协议">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.expertOpinion.length>1}">
                        <span class="content-list-left">专家论证意见：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.expertOpinion" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.expertOpinion.length>1" download-zip="purchaseDetail.formData.expertOpinion" zip-name="专家论证意见">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.publicBidMaterial.length>1}">
                        <span class="content-list-left">招标文件：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.bidDocument" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.bidDocument.length>1" download-zip="purchaseDetail.formData.bidDocument" zip-name="招标文件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.publicBidMaterial.length>1}">
                        <span class="content-list-left">公招资料汇编：</span>
                        <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.publicBidMaterial" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.publicBidMaterial.length>1" download-zip="purchaseDetail.formData.publicBidMaterial" zip-name="公招资料汇编">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">标书线下是否送达：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.isOffline!==undefined">{{purchaseDetail.formData.isOffline?'是':'否'}}</span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">项目中标货物清单：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.bidGoodList">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('项目中标货物清单',purchaseDetail.formData.bidGoodList,'bidGoodList',purchaseDetail.formData.bidGoodListTaskKey)">查看</button>
                        </span>
                    </div>
                        <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.isOfflineTaskKey)">返回审批操作 ＞＞</a>
                    </div>
                </div>`
    },
    uploadAcceptMaterial: { // 特殊节点9
        taskKey: ['usertask92-redosame', 'usertask51-redosame'],
        attachments: {
            acceptOther: 'acceptOther',
            providerSatisfy: 'providerSatisfy',
            businessNature: 'businessNature',

        },
        acceptApplyDocument: {
            field: 'acceptApplyDocument',
            template: '项目验收申请报告'
        },
        providerGoodsTable: {
            field: 'providerGoodsTable',
            template: '学校供货一览表'
        },
        unitSelfCheck: {
            field: 'unitSelfCheck',
            template: '使用单位自检报告'
        },
        acceptOrder: {
            field: 'acceptOrder',
            template: '项目验收单'
        },
        qualifiedProve: {
            field: 'qualifiedProve',
            template: '产品质量合格证明资料'
        },
        qualityPromise: {
            field: 'qualityPromise',
            template: '产品质量承诺书原件'
        },
        acceptOther: {
            field: 'acceptOther',
            template: '其他材料（非必填）'
        },
        serviceQuality: {
            field: 'serviceQuality',
            template: '项目供货商供货服务满意度调查表'
        },
        template: `<div class="go-back-box">
                    <div class="red_outbor" id="{{purchaseDetail.formData.acceptOrder.taskKey}}">
                    <a href="javascript:void(0);" name="{{purchaseDetail.formData.acceptOrder.taskKey}}"></a>
                    <div class="content-list">
                        <span class="content-list-left">项目验收申请报告：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.acceptApplyDocument">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('项目验收申请报告',purchaseDetail.formData.acceptApplyDocument,'acceptApplyDocument',purchaseDetail.formData.acceptApplyDocumentTaskKey)">查看</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">学校供货一览表：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.providerGoodsTable">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('学校供货一览表',purchaseDetail.formData.providerGoodsTable,'providerGoodsTable')">查看</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">使用单位自检报告：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.unitSelfCheck">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('使用单位自检报告',purchaseDetail.formData.unitSelfCheck,'unitSelfCheck')">查看</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">项目验收单：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.acceptOrder">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('项目验收单',purchaseDetail.formData.acceptOrder,'acceptOrder')">查看</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">产品质量合格证明资料：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.qualifiedProve">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('产品质量合格证明资料',purchaseDetail.formData.qualifiedProve,'qualifiedProve')">查看</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">产品质量承诺书原件：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.qualityPromise">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('产品质量承诺书原件',purchaseDetail.formData.qualityPromise,'qualityPromise',purchaseDetail.formData.qualityPromiseTaskKey)">查看</button>
                        </span>
                    </div>
                    <div class="content-list">
                        <span class="content-list-left">项目供货商供货服务满意度调查表：</span>
                        <span class="content-list-right" ng-if="purchaseDetail.formData.serviceQuality">
                            <button class="btn_bd" ng-click="purchaseDetail.openExternalFormDialog('项目供货商供货服务满意度调查表',purchaseDetail.formData.serviceQuality,'serviceQuality')">查看</button>
                        </span>
                    </div>
                    <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.acceptOrder.taskKey)">返回审批操作 ＞＞</a>
                   </div>
                </div>`
    },
    uploadAcceptanceMaterial: { // 特殊节点10
        taskKey: ['usertask65', 'usertask97'],
        attachments: {
            acceptDocument: 'acceptDocument',
            providerGoods: 'providerGoods',
            selfCheckDocument: 'selfCheckDocument',
            acceptanceForm: 'acceptanceForm',
            businessCard: 'businessCard',
            productQuality: 'productQuality',
            acceptanceOther: 'acceptanceOther'
        },
        acceptDocument: {
            field: 'acceptDocument',
            template: '项目验收申请报告原件扫描件'
        },
        providerGoods: {
            field: 'providerGoods',
            template: '学校供货一览表原件（签字盖章）扫描件'
        },
        selfCheckDocument: {
            field: 'selfCheckDocument',
            template: '使用单位自检报告原件（签字盖章）扫描件'
        },
        acceptanceForm: {
            field: 'acceptanceForm',
            template: '项目验收单原件（签字盖章）扫描件'
        },
        businessCard: {
            field: 'businessCard',
            template: '公司营业资质原件（签字盖章）扫描件'
        },
        productQuality: {
            field: 'productQuality',
            template: '产品质量承诺书原件（签字盖章）扫描件'
        },
        acceptanceOther:{
            field: 'acceptanceOther'
        },
        template: `<div class="go-back-box">
                    <div class="red_outbor" id="{{purchaseDetail.formData.acceptDocumentTaskKey}}">
                    <a href="javascript:void(0);" name="{{purchaseDetail.formData.acceptDocumentTaskKey}}"></a>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.acceptDocument.length>1}">
                        <span class="content-list-left">项目验收申请报告原件（签字盖章）扫描件：</span>
                         <span class="content-list-right" ng-class="{'down':purchaseDetail.formData.acceptDocument.length>1}">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.acceptDocument" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.acceptDocument.length>1" download-zip="purchaseDetail.formData.acceptDocument" zip-name="项目验收申请报告原件（签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.providerGoods.length>1}">
                        <span class="content-list-left">学校供货一览表原件（签字盖章）扫描件：</span>
                         <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.providerGoods" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.providerGoods.length>1" download-zip="purchaseDetail.formData.providerGoods" zip-name="学校供货一览表原件（签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.selfCheckDocument.length>1}">
                        <span class="content-list-left">使用单位自检报告原件（签字盖章）扫描件：</span>
                         <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.selfCheckDocument" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.selfCheckDocument.length>1" download-zip="purchaseDetail.formData.selfCheckDocument" zip-name="使用单位自检报告原件（签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.acceptanceForm.length>1}">
                        <span class="content-list-left">项目验收单原件（签字盖章）扫描件：</span>
                         <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.acceptanceForm" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.acceptanceForm.length>1" download-zip="purchaseDetail.formData.acceptanceForm" zip-name="项目验收单原件（签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.businessCard.length>1}">
                        <span class="content-list-left">公司营业资质原件（签字盖章）扫描件：</span>
                         <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.businessCard" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.businessCard.length>1" download-zip="purchaseDetail.formData.businessCard" zip-name="公司营业资质原件（签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.productQuality.length>1}">
                        <span class="content-list-left">产品质量承诺书原件（签字盖章）扫描件：</span>
                         <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.productQuality" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.productQuality.length>1" download-zip="purchaseDetail.formData.productQuality" zip-name="产品质量承诺书原件（签字盖章）扫描件">打包下载</button>
                        </span>
                    </div>
                    <div class="content-list" ng-class="{'down':purchaseDetail.formData.acceptanceOther.length>1}">
                        <span class="content-list-left">其他材料（非必填）：</span>
                         <span class="content-list-right">
                            <pic-view class="attachment" sp="true" ng-repeat="data in purchaseDetail.formData.acceptanceOther" file-name="data.name" file-path="data.url"></pic-view>
                            <button class="btn_bd download-btn" ng-if="purchaseDetail.formData.acceptanceOther.length>1" download-zip="purchaseDetail.formData.acceptanceOther" zip-name="其他材料（非必填）">打包下载</button>
                        </span>
                    </div>
                        <a class="go-back" ng-click="purchaseDetail.goBackAudit(purchaseDetail.formData.acceptDocumentTaskKey)">返回审批操作 ＞＞</a>
                    </div>
                </div>`
    }
}
