/**
 * @Author hejialin
 * @Description 描述
 */
export default class purchaseInterface {
    constructor(DaoService, ProcessAlias, $config) {
        this.modules = $config.modules;
        this.DaoService = DaoService;
        this.ProcessAlias = ProcessAlias;
        this.templateType = {
            PURCHASE:'purchase',
            REPURCHASE:'rePurchase',
            APPROVALDEVICE:'approvalDevice',
            APPROVALFURNITURE:'approvalFurniture',
            APPROVALOUTCATALOG:'approvalOutCatalog',
            APPROVALSELFFURNITURE:'approvalSelfFurniture',
            APPROVALOUTCATALOGENQUIRY:'approvalOutCatalogEnquiry',
        }
    }

    /**
     * 获取所属配标类别
     */
    getProjectKind(){
        return this.DaoService.get(this.modules.PURCHASE,'/dictionary/item/PROJECT_PURCHASE_KIND');
    }
    
    /**
     * 保存采购项目
     */
    addApplication(json) {
        return this.DaoService.post(this.modules.PURCHASE, '/project/purchase', json)
    }

    /**
     * 更新采购项目
     */
    updateProject(json) {
        return this.DaoService.put(this.modules.PURCHASE, '/project/purchase', json)
    }
    
    //校验申请单名称
    validateName(type,projectName,projectId) {
        return this.DaoService.get(this.modules.PURCHASE, '/project/'+type+'/name', {
                name: projectName,
                id: projectId
        })
    }

    /**
     * 设备导入
     */
    importDevice(filedata){
        return this.DaoService.get(this.modules.PURCHASE,'/project/purchase/import',filedata)
    }

    /**
     * 获取项目目录
     */
    getProjectCatalog() {
        return this.DaoService.get(this.modules.PURCHASE, '/base_config/item/valid/simple/PROJECT_CATALOG');
    }

    /**
     * 保存资金文号节点信息
     * @param params
     */
    saveCapitalInfo(params){
        return this.DaoService.post(this.modules.PURCHASE,'/project/purchase/capital',params);
    }

    /**
     * 获取资金文号节点信息
     * @param params
     */
    getCapitalInfo(projectId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/purchase/capital',{projectId:projectId});
    }
    
    /**
     * 获取采购清单
     * @param params
     */
    getPurchaseList(projectId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/purchase/item',{projectId:projectId})
    }

    /**
     * 更新采购价格
     * @param projectId
     * @param purchaseList
     * @param reUpload
     * @param taskId
     * @param nextOperator
     * @param nextOperatorFiled
     */
    updatePurchasePrice(params){
        return this.DaoService.put(this.modules.PURCHASE,'/project/purchase/item',params);
    }

    /**
     * 获取导入Excel接口
     * @return {string}
     */
    getImportUrl(type){
        return type?this.modules.PURCHASE+"/project/purchase/import?templateType="+type:'';
    }

    /**
     * 获取材料导入接口
     * @return {string}
     */
    getMaterialImportUrl(){
        return this.modules.PURCHASE+'/project/purchase/approval/import';
    }
    
    /**
     * 保存立项材料
     * @param params
     */
    savePurchaseProject(params){
        return this.DaoService.post(this.modules.PURCHASE,'/project/purchase/approval',params);
    }

    getPurchaseApprovalProject(projectId,taskId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/purchase/approval/auditedNode',{projectId:projectId,taskId:taskId});
    }

    /**
     * 更新立项材料
     */
    updatePurchaseProject(params){
        return this.DaoService.put(this.modules.PURCHASE,'/project/purchase/approval',params);
    }

    /**
     * 获取立项材料
     * @param params
     */
    getPurchaseProject(projectId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/purchase/approval',{projectId:projectId});
    }
    
    /**
     * 获取所有采购方式
     */
    getPurchaseMethod(){
        return this.DaoService.get(this.modules.PURCHASE,'/dictionary/item/PURCHASE_METHOD');
    }

    /**
     * 获取详情页
     */
    getPurchaseDetail(projectId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/detail-form-data',{projectId:projectId});
    }

    /**
     * 获取详情页表单配置
     */
    getAuditConfig(projectId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/detail-form',{projectId:projectId});
    }

    /**
     * 获取节点和阶段的关系
     * @param projectId
     */
    getStageTask(projectId){
        return this.DaoService.get(this.modules.PURCHASE,'/project/stage/tasks',{projectId:projectId});
    }

    /**
     * 获取项目结构
     * @param id
     */
    getProjectStructure(id){
        return this.DaoService.get(this.modules.PURCHASE,'/project/purchase/structure/'+id);
    }

    /**
     * 下载采购模版
     */
    downloadTemplate(type){
        this.DaoService.export(this.modules.PURCHASE,'/project/purchase/item/template',{templateType:type});
    }


    getStatisticsCount(processConfigId,year) {
        return this.DaoService.get(this.modules.PURCHASE, '/project/purchase/statistics/count', {processConfigId, year});
    }

    getStatisticsList(conditions) {
        return this.DaoService.get(this.modules.PURCHASE, '/project/purchase/statistics', conditions);
    }

    export(conditions){
        return this.DaoService.export(this.modules.PURCHASE, '/project/purchase/statistics/export', conditions);
    }

    cleanAllDraft(){
        return this.DaoService.delete(this.modules.PURCHASE,'/project/purchase/all')
    }

}
purchaseInterface.$inject = ['DaoService', 'ProcessAlias', '$config'];
