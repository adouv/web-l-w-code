/**
 * Created by wuhao on 2017/7/1.
 */
export default class projectInterface {
    constructor(DaoService, ProcessAlias, $config) {
        this.modules = $config.modules;
        this.DaoService = DaoService;
        this.ProcessAlias = ProcessAlias;
    }

    /**
     * 获取我的项目、我的审批（资产处置）
     * 返回值：
     * projectId：项目id
     * projectName：项目名称
     * projectGarden：	项目所属园区
     * category： 项目分类
     * categoryName：分类名称
     * applyAccount：申请人
     * createTime：创建时间
     * currTaskId: 当前任务id
     * currTaskName: 当前任务名称
     * currTaskKey: 当前任务节点
     * currTaskAssign: 当前办理人
     * currTaskStageName: 阶段名称
     * reason：理由
     * applyYear：申请年份
     * content：内容
     * lastUpdateTime：最后更新时间
     * projectStatus: 项目状态
     * projectStatusName：项目状态名称（显示用）
     * stageCompleteTime： 阶段完成时间
     * stage： 阶段
     * taskStatus： 任务状态
     * taskStatusName： 任务状态名称（显示用）
     * taskCount： 任务次数
     * stageStatus： 阶段状态(0:已完成不通过:1:正常进行中2:已完成通过)
     * stageStatusName：阶段状态名称 （显示用）
     * assetTypeName：资产大类名称
     * isElectronic：是否是电子类
     * disposeTypeName：处置形式名称
     * assetTypeName：	资产类型名称
     * isElectronic：	是否是电子类（true/false）
     * disposeTypeName：	处置形式名称
     */
    getApplication(moduleCode, processConfigId, projectStatus, stage, taskType, taskKey, taskStatus, gardenIds, categoryList, keywords, accountName, offset, size, applyYearStart, applyYearEnd, createTimeStart, createTimeEnd, taskTimeStart, taskTimeEnd) {
        return this.DaoService.get(this.modules.REPAIR, '/project', {
            processConfigId: processConfigId,
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            status: projectStatus,
            stage: stage,
            taskType: taskType,
            taskKey: taskKey,
            taskStatus: taskStatus,
            gardenIds: gardenIds,
            categoryList: categoryList,
            keywords: keywords,
            accountName: accountName,
            offset: offset,
            size: size,
            applyYearStart: applyYearStart,
            applyYearEnd: applyYearEnd,
            createTimeStart: createTimeStart,
            createTimeEnd: createTimeEnd,
            taskTimeStart: taskTimeStart,
            taskTimeEnd: taskTimeEnd
        })
    }


    /**
     * 获取全单位申请
     * 返回值：
     * projectId：项目id
     * projectName：项目名称
     * projectGarden：	项目所属园区
     * category： 项目分类
     * categoryName：分类名称
     * applyAccount：申请人
     * createTime：创建时间
     * currTaskId: 当前任务id
     * currTaskName: 当前任务名称
     * currTaskKey: 当前任务节点
     * currTaskAssign: 当前办理人
     * currTaskStageName: 阶段名称
     * reason：理由
     * applyYear：申请年份
     * content：内容
     * lastUpdateTime：最后更新时间
     * projectStatus: 项目状态
     * projectStatusName：项目状态名称（显示用）
     * assetTypeName：	资产类型名称
     * isElectronic：	是否是电子类（true/false）
     * disposeTypeName：	处置形式名称
     */
    getAllApplication(moduleCode, accountId, status, taskKey, gardenIds, categoryList, keywords, offset, size, createTimeStart, createTimeEnd, accountName) {
        return this.DaoService.get(this.modules.ASSET, '/project/all', {
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            accountId: accountId,
            status: status,
            taskKey: taskKey,
            gardenIds: gardenIds,
            categoryList: categoryList,
            keywords: keywords,
            offset: offset,
            size: size,
            createTimeStart: createTimeStart,
            createTimeEnd: createTimeEnd,
            accountName: accountName
        })
    }

    /**
     * 获取草稿箱列表(资产处置)
     * 返回值：
     * projectId：项目id
     * projectName：项目名称
     * projectGarden：	项目所属园区
     * category： 项目分类
     * categoryName：分类名称
     * applyAccount：申请人
     * createTime：创建时间
     * reason：理由
     * applyYear：申请年份
     * content：内容
     * lastUpdateTime：最后更新时间
     * assetTypeName：资产大类名称
     * isElectronic：是否是电子类
     * disposeTypeName：处置形式名称
     */
    getDraftList(moduleCode, processConfigId, categoryList, keywords, offset, size) {
        return this.DaoService.get(this.modules.REPAIR, '/project/draft', {
            processConfigId: processConfigId,
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            categoryList: categoryList,
            keywords: keywords,
            offset: offset,
            size: size
        })
    }

    /**
     * 获取项目库
     */
    getProjectLibrary(moduleCode, processConfigId, projectStatus, stage, taskKey, gardenIds, categoryList, keywords, offset, size, accountId, applyYearStart, applyYearEnd, stageCompleteStart, stageCompleteEnd, createTimeStart, createTimeEnd, accountName) {
        return this.DaoService.get(this.modules.REPAIR, '/project/library', {
            processConfigId: processConfigId,
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            status: projectStatus,
            stage: stage,
            taskKey: taskKey,
            gardenIds: gardenIds,
            categoryList: categoryList,
            keywords: keywords,
            offset: offset,
            size: size,
            accountId: accountId,
            applyYearStart: applyYearStart,
            applyYearEnd: applyYearEnd,
            stageCompleteStart: stageCompleteStart,
            stageCompleteEnd: stageCompleteEnd,
            createTimeStart: createTimeStart,
            createTimeEnd: createTimeEnd,
            accountName: accountName
        })
    }

    exportCharExcel(moduleCode, processConfigId, gardenIds, stage, categoryList, taskKey, accountId, applyYearStart, applyYearEnd) {
        this.DaoService.export(this.modules.REPAIR, '/project/lineChart/excel', {
            type: moduleCode,
            processConfigId,
            gardenIds,
            stage,
            categoryList,
            taskKey,
            accountId,
            applyYearStart,
            applyYearEnd
        })
    }

    /**
     * 获取折线图
     */
    getLineChart(processConfigId, stage, categoryList, gardenIds, accountId, applyYearStart, applyYearEnd) {
        return this.DaoService.get(this.modules.REPAIR, '/project/lineChart', {
            processConfigId: processConfigId,
            stage: stage,
            categoryList: categoryList,
            gardenIds: gardenIds,
            accountId: accountId,
            applyYearStart: applyYearStart,
            applyYearEnd: applyYearEnd
        })
    }

    /**
     * 删除草稿
     *
     */
    deleteDraft(moduleCode, projectIds) {
        return this.DaoService.delete(this.modules.REPAIR, '/project/' + this.ProcessAlias.getProcessAliasByKey(moduleCode), {
            ids: projectIds
        });
    }

    /**
     * 删除所有草稿
     */
    deleteAllDraft(moduleCode) {
        return this.DaoService.delete(this.modules.REPAIR, '/project/' + this.ProcessAlias.getProcessAliasByKey(moduleCode) + '/all');
    }

    /**
     * 获取申请详情
     */
    getApplicationDetail(moduleCode, id) {
        return this.DaoService.get(this.modules.REPAIR, '/project/' + this.ProcessAlias.getProcessAliasByKey(moduleCode) + '/' + id)
    }

    /**
     * 保存修缮项目
     */
    addApplication(moduleCode, json) {
        return this.DaoService.post(this.modules.REPAIR, '/project/' + this.ProcessAlias.getProcessAliasByKey(moduleCode), json)
    }

    /**
     * 更改修缮项目（草稿箱）
     */
    updateApplication(moduleCode, json) {
        return this.DaoService.put(this.modules.REPAIR, '/project/' + this.ProcessAlias.getProcessAliasByKey(moduleCode), json)
    }

    /**
     * 导出PDF
     * @param id 申请单id
     * @param order boolean类型，true：导出申请单，false：不导出申请单
     * @param evidence boolean类型，true：导出材料，false：不导出材料
     */
    exportPdf(moduleCode, id, order, evidence,signature) {
        return this.DaoService.export(this.modules.ASSET, '/project/' + this.ProcessAlias.getProcessAliasByKey(moduleCode) + '/pdf/' + id, {
            order: order,
            evidence: evidence,
            signature:signature
        })
    }

    /**
     * 获取审核步骤表单
     * @param id taskid 任务id
     * @return @html
     */
    getTaskForm(taskId) {
        return this.DaoService.get(this.modules.REPAIR, '/activiti/taskForm/' + taskId)
    }

    /**
     * 获取审核步骤表单数据（打回重新处理）
     */
    getTaskFormData(taskId) {
        return this.DaoService.get(this.modules.REPAIR, '/activiti/extend/formData/' + taskId)
    }

    /**
     * 获取下一审核步骤信息（审核名称、及截止时间等）
     */
    getNextTaskAudit(processConfigId, taskId, gardenId, key, value, nextStepCount) {
        return this.DaoService.get(this.modules.REPAIR, '/processConfig/task/nextAuditTaskInfo', {
            processConfigId: processConfigId,
            taskId: taskId,
            gardenId: gardenId,
            key: key,
            value: value,
            nextStepCount: nextStepCount
        })
    }

    /**
     * 办理任务
     */
    transactTask(json) {
        return this.DaoService.post(this.modules.REPAIR, '/activiti/extend/task', json)
    }

    /**
     * 获取审核信息
     */
    getTaskTransactInfo(id, isMultiAudit) {
        return this.DaoService.get(this.modules.REPAIR, '/bdp/activiti/auditInfo/' + id, {
            isMultiAudit: isMultiAudit
        })
    }

    /**
     * 通过业务id获取task信息
     */
    getTaskInfoById(id, taskId) {
        return this.DaoService.get(this.modules.ASSET, '/activiti/task', {
            id: id,
            taskId: taskId
        });
    }

    /**
     * 获取修缮每个阶段的任务
     */
    getStageTasks(stageId) {
        return this.DaoService.get(this.modules.REPAIR, '/processConfig/stage/task/' + stageId)
    }

    /**
     * 获取附件
     * 根据项目ID获取附件
     * wuh:现在只有修缮调用，后面把资产处置也切换过来
     */
    getAttachment(projectId) {
        return this.DaoService.get(this.modules.REPAIR, '/project/attachment', {
            id: projectId
        })
    }

    /**
     * 获取下的所有节点
     * 根据项目ID获取名称
     * 
     */
    getStageName(stageId) {
        return this.DaoService.get(this.modules.REPAIR, '/processConfig/stage/' + stageId)
    }

    /**
     * 导出excel(我的项目、审批)
     */
    exportExcel(moduleCode, processConfigId, categoryList, keywords, stage, projectStatus, taskKey, taskType, taskStatus, gardenIds, condition) {
        this.DaoService.export(this.modules.REPAIR, '/project/excel', {
            processConfigId: processConfigId,
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            categoryList: categoryList,
            keywords: keywords,
            stage: stage,
            status: projectStatus,
            taskKey: taskKey,
            taskType: taskType,
            taskStatus: taskStatus,
            gardenIds: gardenIds,
            condition: condition,
        })
    }

    /**
     * 导出excel(我的项目库)
     */
    exportLibraryExcel(moduleCode, processConfigId, categoryList, keywords, stage, projectStatus, taskKey, taskStatus, gardenIds, condition) {
        this.DaoService.export(this.modules.REPAIR, '/project/library/excel', {
            processConfigId: processConfigId,
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            categoryList: categoryList,
            keywords: keywords,
            stage: stage,
            status: projectStatus,
            taskKey: taskKey,
            taskStatus: taskStatus,
            gardenIds: gardenIds,
            condition: condition,
        })
    }

    /**
     * 导出excel(全单位申请)
     */
    exportAllExcel(moduleCode, keywords, taskKey, taskStatus, gardenIds, condition) {
        this.DaoService.export(this.modules.REPAIR, '/project/all/excel', {
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            keywords: keywords,
            taskKey: taskKey,
            taskStatus: taskStatus,
            gardenIds: gardenIds,
            condition: condition,
        })
    }

    /**
     * 查询设备项目所属类别
     */
    getProjectType(id) {
        return this.DaoService.get(this.modules.REPAIR, '/base_config/item/valid/simple/' + id);
    }

    /**
     * 查询设备配标类别
     */
    getKindType() {
        return this.DaoService.get(this.modules.REPAIR, '/dictionary/item/PROJECT_PURCHASE_KIND');
    }

    /**
     * 查询项目阶段
     */
    getProjectStage(stageId) {
        return this.DaoService.get(this.modules.REPAIR, '/processConfig/stage/task/' + stageId)
    }

    /**
     * 查询项目状态
     */
    getProjectStatus() {
        return this.DaoService.get(this.modules.REPAIR, '/dictionary/item/PROJECT_STATUS');
    }

    /**
     * 查询项目优先级
     */
    getPriority() {
        return this.DaoService.get(this.modules.REPAIR, '/base_config/item/valid/simple/REPAIR_PRIORITY');
    }

    /**
     * 获取手机号
     */
    getPersonPhone(accoundId) {
        return this.DaoService.get(this.modules.GARDEN, '/contact/' + accoundId)
    }

    /**
     * 验证资金文号
     * @param name
     */
    getCapitalNumber(name) {
        return this.DaoService.get(this.modules.BILL, '/capital/name', {
            name: name
        });
    }

    /**
     * 资金性质
     */
    getCapitalNature() {
        return this.DaoService.get(this.modules.BILL, '/dictionary/item/CAPITAL_NATURE')
    }

    /**
     * 资金类别
     */
    getCapitalCategory() {
        return this.DaoService.get(this.modules.BILL, '/dictionary/item/CAPITAL_CATEGORY')
    }

    /**
     * 资金来源
     */
    getCapitalSourceType() {
        return this.DaoService.get(this.modules.BILL, '/dictionary/item/CAPITAL_SOURCE_TYPE')
    }

    /**
     * 审批意见归类字典(设备采购用)
     */
    getAuditOpinionCateGory(dictionaryId) {
        return this.DaoService.get(this.modules.PURCHASE, '/dictionary/item/' + dictionaryId)
    }

    /**
     * 获取使用数据
     * @param id
     */
    getUsefulData(id) {
        return this.DaoService.get(this.modules.PURCHASE, '/project/usefulVars/' + id);
    }
    /******    相对原型用户  */
    //有关项目
    getProjectType(baseConfigId) {
        return this.DaoService.get(this.modules.ASSET, "/base_config/item/valid/simple/" + baseConfigId);
    }

    /**
     * 校验申请单名称
     */
    validateName(type, projectName, projectId) {
        return this.DaoService.get(this.modules.PURCHASE, '/project/' + type + '/name', {
            name: projectName,
            id: projectId
        })
    }

    downloadFile(module, fileName, downloadName) {
        if (!downloadName) {
            downloadName = fileName;
        }
        return this.DaoService.export(this.modules.PURCHASE, '/project/' + module + '/file', {
            fileName: fileName,
            downloadName: downloadName
        })
    }

    /**
     * 所有代办任务数
     */
    getAllTodoTaskCount(module, keywords) {
        return this.DaoService.get(this.modules.ASSET, '/project/task/all/count', {
            type: module,
            keywords: keywords
        })
    }

    /**
     * 所有代办任务列表
     */
    getAllTodoTaskList(module, keywords, offset, size) {
        return this.DaoService.get(this.modules.ASSET, '/project/task/all', {
            type: module,
            keywords,
            offset,
            size
        })
    }
    /**
     * 获取使用帮助文档文件
     */
    getInstrctionsList(moduleCode){
        return this.DaoService.get(this.modules.LOGISTICS, '/helpDocument/' + moduleCode);
    }
}
projectInterface.$inject = ['DaoService', 'ProcessAlias', '$config'];
