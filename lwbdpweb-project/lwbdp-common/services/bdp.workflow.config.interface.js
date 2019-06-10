/**
 * @Author hejialin
 * @Description 流程配置接口
 */

export default class WorkflowConfigInterface {
    constructor(DaoService, $config, ProcessAlias, ngDialog) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.ProcessAlias = ProcessAlias;
        this.ngDialog = ngDialog;
    }

    /**
     * 页面功能：系统工作流
     * 获取所有的流程定义
     * 返回值：[]
     */
    getWorkflowList(moduleCode, isAdd) {
        return this.DaoService.get(this.modules.ASSET, "/activiti/processDefinitions", {
            module: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            isLatest: isAdd
        });
    }

    /**
     * 页面功能：编辑详情页面流程基本信息
     * 获取流程基本信息
     * @param processConfigId
     * 返回值: {}
     * name 名称
     * status 有效性
     * processDefinitionId 流程定义id
     * gardens [] 园区数组
     */
    getConfigDetails(processConfigId) {
        return this.DaoService.get(this.modules.ASSET, "/processConfig/" + processConfigId);
    }
    /**
     * 页面功能：使用对象
     * 获取该流程定义已被配置到的园区
     * @param id
     * @return []
     * gardenId：园区ID
     * gardenName：园区名称
     */
    getConfigGardens(id) {
        return this.DaoService.get(this.modules.ASSET, '/processConfig/garden/' + id);
    }

    /**
     * 页面功能：获取流程的所有节点，画流程图
     * 获取流程图
     * @parame id 流程定义的ID
     * @return []
     * taskKey ：任务节点Key
     * taskName ：任务节点名称
     * taskType ：节点类型（userTask：用户任务/exclusiveGateway：网关）
     * outgoingList：流程流向{id: 流程线ID， target：连接点， condition：走向条件}
     */
    getFlowChartData(id) {
        return this.DaoService.get(this.modules.ASSET, "/activiti/flowInfo/" + id);
    }

    /**
     * 页面功能：在流程图上将已经配置的节点变绿，显示逾期天数
     * 获取已经配置的流程
     * @param processConfigId 流程ID
     * @return []
     * {taskKey:dueDay(逾期天数)}
     */
    getConfiguredTasks(processConfigId) {
        return this.DaoService.get(this.modules.ASSET, '/processConfig/task', {
            processConfigId: processConfigId
        })
    }

    /**
     * 获取该任务节点的配置
     * @param processConfigId 流程配置ID
     * @param taskKey 任务key
     * @return []
     * referentTaskKey：参考节点key
     * accountRelationType：用户关系类型1:绝对 2:相对
     * accountRelativeType：相对类型1:相对组 2:相对操作人
     * accountIds：该节点的人员
     * dueDay：逾期天数
     */
    getTaskConfig(taskKey, version) {
        return this.DaoService.get(this.modules.ASSET, '/processConfig/task/' + taskKey + '-' + version);
    }

    /**
     * 页面功能：获取流程配置列表
     * 流程配置列表
     * @return []
     * id：流程配置id
     * name：流程配置名称
     * processDefinitionId：流程定义id
     * status：有效性(有效：true，无效：false)
     * counts：使用对象数量
     * lastUpdateTime：最近更新时间
     * lastUpdatorName：最近更新人
     */
    getWorkflowConfigs(moduleCode, keywords, offset, size) {
        return this.DaoService.get(this.modules.ASSET, "/processConfig", {
            module: moduleCode,
            keywords: keywords,
            offset: offset,
            size: size
        });
    }

    /**
     * 	保存流程中节点配置
     * @param params 流程配置对象
     * name：流程配置名称
     * processDefinitionId：所属流程定义
     * status：有效性
     * gardenIds：所选园区,逗号分隔
     * processConfigTaskVoList：{taskKey：当前节点， referentTaskKey：参考节点key， accountRelationType：用户关系类型，accountRelativeType：相对类型， accountIds：用户id,逗号分隔，dueDay：逾期天数}
     */
    saveWorkflowConfig(moduleCode, params) {
        params.module = this.ProcessAlias.getProcessAliasByKey(moduleCode);
        return this.DaoService.post(this.modules.ASSET, '/processConfig', params)
    }

    /**
     * 更新流程配置
     * @param params 流程配置对象
     * id：流程配置id
     * name：流程配置名称
     * processDefinitionId：所属流程定义
     * status：有效性
     * gardenIds：所选园区,逗号分隔
     * processConfigTaskVoList：{taskKey：当前节点， referentTaskKey：参考节点key， accountRelationType：用户关系类型，accountRelativeType：相对类型， accountIds：用户id,逗号分隔，dueDay：逾期天数}
     */
    updateWorkflowConfig(moduleCode, params) {
        params.module = this.ProcessAlias.getProcessAliasByKey(moduleCode);
        return this.DaoService.put(this.modules.ASSET, '/processConfig', params);
    }

    /**
     * 页面功能：删除流程配置
     * 删除流程配置
     * @param params
     * ids：流程配置id,逗号分隔
     */
    deleteWorkflowConfigs(params) {
        return this.DaoService.delete(this.modules.ASSET, '/processConfig', params);
    }


    /**
     * 页面功能：设置有效性
     * 设置流程配置有效状态
     * @param params
     * id：流程配置id
     * status: 状态（true/false）
     */
    updateWorkflowConfigStatus(params) {
        return this.DaoService.put(this.modules.ASSET, '/processConfig/status', params);
    }

    /**
     *查询相对类型（流程配置）
     */
    getRelativeType() {
        return this.DaoService.get(this.modules.ASSET, '/dictionary/item/RELATIVE_TYPE');
    }

    /**
     *查询用户关系类型（流程配置）
     */

    getUserRelationshipType() {
        return this.DaoService.get(this.modules.ASSET, '/dictionary/item/USER_RELATIONSHIP_TYPE');
    }

    getGardens(gardenIds) {
        return this.DaoService.get(this.modules.GARDEN, '/garden/simple', {
            gardenIds: gardenIds
        })
    }
    /*
     * 查询使用对象视图
     * */
    getGardenView(module, keywords, offset, size) {
        return this.DaoService.get(this.modules.ASSET, '/processConfig/garden/configs', {
            module: module,
            keywords: keywords,
            offset: offset,
            size: size
        })
    }
    /* 预览流程图 */
    previewFlowChart(flowName, id, $event,previewFlowHTML) {
        if ($event.stopPropagation) {
            $event.stopPropagation();
        } else {
            $event.cancelBubble = true;
        }
        this.getFlowChartData(id).then(res => {
            this.ngDialog.open({
                closeByDocument: false,
                className: 'bdp layer_fixed preview-flow',
                template: previewFlowHTML,
                plain: true,
                controller: function ($scope) {
                    $scope.flowChartData = res.data;
                    $scope.currentFlowName = flowName;
                }
            })
        })
    }
}

WorkflowConfigInterface.$inject = ['DaoService', '$config', 'ProcessAlias', 'ngDialog'];