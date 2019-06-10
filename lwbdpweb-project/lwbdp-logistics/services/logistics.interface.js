/**
 * @Author guoyaru
 * @Description 后勤运维模块 接口封装
 */
export default class logisticsInterface {
    constructor(DaoService, $config) {
        this.modules = $config.modules;
        this.DaoService = DaoService;
    }

    /**
     * 获取列表页
     * @param boxType 类型（receive：邮件箱,send:发件箱,all:全单位通知）
     * @param type 通知类别
     * @param urgencyLevel 紧急程度（EMERGENCY:非常紧急,URGENCY:紧急,NORMAL:正常）
     * @param gardenIds 园区id集合（多个以逗号分隔）
     * @param publishStatus 发布状态（0：未发布,1:发布中，2:已撤回）
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param condition 查询条件字符串
     * @param keywords 关键字
     * @param offset
     * @param size
     */
    getNoticeList(boxType, type, urgencyLevel, gardenIds, publishStatus, startTime, endTime, condition, keywords, gardenName, accountId, dealStatus, accountName, offset, size) {
        return this.DaoService.get(this.modules.LOGISTICS, "/pc/notice", {
            boxType: boxType,
            type: type,
            urgencyLevel: urgencyLevel,
            gardenIds: gardenIds,
            publishStatus: publishStatus,
            startTime: startTime,
            endTime: endTime,
            condition: condition,
            keywords: keywords,
            gardenName: gardenName,
            accountId: accountId,
            dealStatus: dealStatus,
            accountName: accountName,
            offset: offset,
            size: size
        })
    }

    /**
     * 导出excel
     * @param boxType 类型（receive：邮件箱,send:发件箱,all:全单位通知）
     * @param type 通知类别
     * @param urgencyLevel 紧急程度（EMERGENCY:非常紧急,URGENCY:紧急,NORMAL:正常）
     * @param gardenIds 园区id集合（多个以逗号分隔）
     * @param publishStatus 发布状态（0：未发布,1:发布中，2:已撤回）
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param condition 查询条件字符串
     */
    exportNoticeExcel(boxType, type, urgencyLevel, gardenIds, publishStatus, startTime, endTime, condition, accountId,accountName) {
        this.DaoService.export(this.modules.LOGISTICS, "/pc/notice/excel", {
            boxType: boxType,
            type: type,
            urgencyLevel: urgencyLevel,
            gardenIds: gardenIds,
            publishStatus: publishStatus,
            startTime: startTime,
            endTime: endTime,
            condition: condition,
            accountId:accountId,
            accountName:accountName
        })
    }

    /**
     *
     */
    exportNoticeReply(id,flag){
        this.DaoService.export(this.modules.LOGISTICS, "/pc/notice/reply", {
            id: id,
            flag: flag
        })
    }

    /**
     * 获取图表统计数据
     * @param urgencyLevel 紧急程度（EMERGENCY:非常紧急,URGENCY:紧急,NORMAL:正常）
     * @param gardenIds 园区id集合（多个以逗号分隔）
     * @param publishStatus 发布状态（0：未发布,1:发布中，2:已撤回）
     * @param accountId 账户id
     * @param startTime 开始时间
     * @param endTime 结束时间
     */
    getChart(urgencyLevel, gardenIds, publishStatus, accountId, startTime, endTime, accountName,gardenName) {
        return this.DaoService.get(this.modules.LOGISTICS, "/pc/notice/chart", {
            urgencyLevel: urgencyLevel,
            gardenIds: gardenIds,
            publishStatus: publishStatus,
            accountId: accountId,
            startTime: startTime,
            endTime: endTime,
            accountName:accountName,
            gardenName:gardenName
        })
    }

    /**
     * 通知详情接口
     * @param id 通知id
     * @param boxType 类型（receive：收件箱,send:发件箱,all:全单位通知）
     */
    getNoticeInfo(id, boxType) {
        return this.DaoService.get(this.modules.LOGISTICS, "/pc/notice/" + id, {boxType: boxType})
    }

    /**
     * 阅读统计
     * @param id 通知id
     * @param flag 是否阅读 true/false
     * @param offset
     * @param size
     */
    getReadStatistics(id, flag, offset, size) {
        return this.DaoService.get(this.modules.LOGISTICS, "/pc/notice/readStatistics", {
            id: id,
            flag: flag,
            offset: offset,
            size: size
        })
    }

    /**
     * 处理统计
     * @param id 通知id
     * @param flag 是否阅读 true/false
     * @param offset
     * @param size
     */
    getDealStatistics(id, flag, keywords,offset, size) {
        return this.DaoService.get(this.modules.LOGISTICS, "/pc/notice/dealStatistics", {
            id: id,
            flag: flag,
            keywords: keywords,
            offset: offset,
            size: size
        })
    }

    /**
     * 添加通知
     */
    addNotice(params) {
        return this.DaoService.post(this.modules.LOGISTICS, "/pc/notice", params)
    }

    /**
     * 更新通知
     */
    updateNotice(params) {
        return this.DaoService.put(this.modules.LOGISTICS, "/pc/notice", params)
    }

    /**
     * 修改通知状态
     * @param id 通知id
     */
    updateStatus(id) {
        return this.DaoService.put(this.modules.LOGISTICS, "/pc/notice/status" + id)
    }

    /**
     * 回复通知
     */
    replyNotice(params) {
        return this.DaoService.post(this.modules.LOGISTICS, "/pc/notice/reply", params)
    }

    /**
     * 撤回已经发布的通知
     * @param ids 多个id以逗号分隔
     */
    recallNotice(ids) {
        return this.DaoService.put(this.modules.LOGISTICS, "/pc/notice/recall", {ids: ids})
    }

    /**
     * 删除通知
     * @param ids 多个id以逗号分隔
     */
    deleteNotice(ids) {
        return this.DaoService.delete(this.modules.LOGISTICS, "/pc/notice", {ids: ids})
    }

    /**
     * 获取预警类别
     */
    getWarningType() {
        return this.DaoService.get(this.modules.LOGISTICS, "/base_config/item/valid/simple/WARNING_TYPE");
    }

    /**
     * 获取通知级别
     */
    getNoticeUrgencyLevel() {
        return this.DaoService.get(this.modules.LOGISTICS, '/dictionary/item/NOTICE_URGENCY_LEVEL');
    }




}
logisticsInterface.$inject = ['DaoService', '$config'];
