/**
 * @Author quanfeihu
 * @Description 后勤月采购单相关接口
 */
export default class logisticsOnlineRepairInterface {

    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    getJspIndex() {
        return this.DaoService.get(this.modules.ONLINEREPAIR, '/repair/repairOrder/index')
    }

}
logisticsOnlineRepairInterface.$inject = ['DaoService', '$config']
