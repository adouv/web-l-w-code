import { Inject, Injectable } from '@angular/core';
import { LwHttpService } from '../../../common';
import { LW_MODULE_CODE, ModuleCode } from '../../../common/config';

@Injectable()
export class SelectPersonInterface {

    constructor(private http: LwHttpService,
        @Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
    }
    getAddressPosition() {
        return this.http.get(this.moduleCode.GARDEN, '/address/position');
    }
    getGardenDistrict() {
        return this.http.get(this.moduleCode.GARDEN, '/garden/garden-district', { isUserControlStrategy: false });
    }
    getDepartmentAccount(id) {
        return this.http.get(this.moduleCode.GARDEN, '/department/tree/department-account/' + id);
    }
    getDepartmentAccountBySearch(id, searchKey) {
        return this.http.get(this.moduleCode.GARDEN, '/department/tree/department-account/search/' + id + '?searchKey=' + searchKey);
    }
    getDepartmentAccountByIds(accountIds) {
        return this.http.get(this.moduleCode.GARDEN, '/account/accountDepartment', { accountIds: accountIds });
    }
    getDepartmentAccountOpenIds(accountIds, gardenId) {
        return this.http.get(this.moduleCode.GARDEN, '/department/tree/department-account/openIds', { accountIds: accountIds ,gardenId: gardenId });
    }
}
