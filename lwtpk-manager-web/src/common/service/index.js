/**
 * @Author hejialin
 * @Description 公共服务模块
 */
import addressService from './address';
import dictionaryService from './dictionary';
import gardenService from './garden';
import departmentService from './department';
import accountService from './account';
import DaoService from './dao.service';
import permissionService from './permission';

export default angular.module('lw.common.service',[])
    .service('DaoService',DaoService)
    .service('lwAddressService',addressService)
    .service('lwDictionaryService',dictionaryService)
    .service('lwGardenService',gardenService)
    .service('lwDepartmentService',departmentService)
    .service('lwAccountService',accountService)
    .service('lwPermissionService',permissionService)
    .name;