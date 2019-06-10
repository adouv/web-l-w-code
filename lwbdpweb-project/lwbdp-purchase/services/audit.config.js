/**
 * @Author hejialin
 * @Description 审核配置
 */
export default {
    auditCategory:{ // 通用节点2
        kindCategory:{
            field:'kindCategory',
            name:'标配类别'
        }
    },
    uploadCapitalProve:{ // 通用节点8
        attachments:{
            capitalProve:'capitalProve'
        },
        capitalProve:{
            field:'capitalProve',
            template:'项目资金证明扫描件'
        }
    },
    auditFinance:{ // 通用节点14
        attachments:{
            auditFinance:'auditFinance'
        }
    },
    uploadContract:{ // 通用节点18
        attachments:{
            originalContract:'originalContract',
            contractProve:'contractProve',
            legalAdvice:'legalAdvice',
            recordNotice:'recordNotice',
            meetingMinutes:'meetingMinutes',
        },
        originalContract:{
            field:'originalContract',
            name:'项目合同原件（含签字盖章）扫描件'
        },
        contractProve:{
            field:'contractProve',
            name:'项目合同乙方资质证明原件扫描件'
        },
        legalAdvice:{
            field:'legalAdvice',
            name:'项目法律意见书原件扫描件'
        },
        recordNotice:{
            field:'recordNotice',
            name:'项目备案通知书原件扫描件'
        },
        meetingMinutes:{
            field:'meetingMinutes',
            name:'项目会议纪要原件扫描件'
        }
    },
    purchaseProject:{ // 特殊节点5

    },
    purchaseSupplier:{ //特殊节点6
        providerList:{
            field:'providerList'
        }
    },
    purchasePriceRecord:{ // 特殊节点7
        bidUnitGoodsList:{
            field:'bidUnitGoodsList'
        },
        bidGarden:{
            field:'bidGarden'
        },
        bidAmount:{  //中标价格
            field:'bidAmount'
        }
    },
    uploadTenderMaterial:{ // 特殊节点8
        attachments:{
            bidNotice:'bidNotice',
            bidEvaluate:'bidEvaluate',
            proxyAgree:'proxyAgree',
            expertOpinion:'expertOpinion',
            bidDocument:'bidDocument',
            publicBidMaterial:'publicBidMaterial',
        },
        bidGarden:{
            field:'bidGarden',
            name:'项目中标公司'
        },
        bidAmount:{
            field:'bidAmount',
            name:'项目中标金额'
        },
        bidDate:{
            field:'bidDate',
            name:'项目中标时间'
        },
        isOffline:{
            field:'isOffline',
            name:'标书线下是否送达'
        },
        bidGoodList:{
            field:'bidGoodList',
            name:'项目中标货物清单'
        }
    },
    uploadAcceptMaterial:{ // 特殊节点9
        attachments:{
            acceptOther:'acceptOther',
            providerSatisfy:'providerSatisfy',
            businessNature:'businessNature',
            
        },
        acceptApplyDocument:{
            field:'acceptApplyDocument',
            name:'项目验收申请报告'
        },
        providerGoodsTable:{
            field:'providerGoodsTable',
            name:'学校供货一览表'
        },
        unitSelfCheck:{
            field:'unitSelfCheck',
            name:'使用单位自检报告'
        },
        acceptOrder:{
            field:'acceptOrder',
            name:'项目验收单'
        },
        qualifiedProve:{
            field:'qualifiedProve',
            name:'产品质量合格证明资料'
        },
        qualityPromise:{
            field:'qualityPromise',
            name:'产品质量承诺书原件'
        },
        acceptOther:{
            field:'acceptOther',
            name: '其他材料（非必填）'
        },
        serviceQuality:{
            field:'serviceQuality',
            name:'项目供货商供货服务满意度调查表'
        }
    },
    uploadAcceptanceMaterial:{ // 特殊节点10
        attachments:{
            acceptDocument:'acceptDocument',
            providerGoods:'providerGoods',
            selfCheckDocument:'selfCheckDocument',
            acceptanceForm:'acceptanceForm',
            businessCard:'businessCard',
            productQuality:'productQuality',
            acceptanceOther:'acceptanceOther'
        },
        acceptDocument:{
            field:'acceptDocument',
            name:'项目验收申请报告原件扫描件'
        },
        providerGoods:{
            field:'providerGoods',
            name:'学校供货一览表原件（签字盖章）扫描件'
        },
        selfCheckDocument:{
            field:'selfCheckDocument',
            name:'使用单位自检报告原件（签字盖章）扫描件'
        },
        acceptanceForm:{
            field:'acceptanceForm',
            name:'项目验收单原件（签字盖章）扫描件'
        },
        businessCard:{
            field:'businessCard',
            name:'公司营业资质原件（签字盖章）扫描件'
        },
        qualifiedProve1:{
            field:'qualifiedProve1',
            name:'产品质量合格证明资料'
        },
        productQuality:{
            field:'productQuality',
            name:'产品质量承诺书原件（签字盖章）扫描件'
        }
    }
}