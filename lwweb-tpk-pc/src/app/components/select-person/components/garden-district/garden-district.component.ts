import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SelectPersonInterface } from '../../services/select-person.interface';
import { SelectPersonService } from '../../services/select-person.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../reducers';
import * as selectParsonAction from '../../actions/select-person.actions';
@Component({
    selector: 'garden-district',
    templateUrl: './garden-district.component.html',
    styleUrls: ['./garden-district.component.scss']
})
export class GardenDistrictComponent implements OnInit, OnDestroy{
    searchData: any;
    gardenData: any;
    copyGardenData: any;
    selectData: any;
    selectGardenData: any;
    @Input() gardenId: any;
    subscription:any;
    constructor(
        private selectPersonInterface: SelectPersonInterface,
        private selectPersonService: SelectPersonService,
        private store: Store<fromRoot.State>
    ) {
        this.gardenData = [];
        this.selectData = [];
        this.copyGardenData = [];
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    ngOnInit() {
        this.gardenId = this.selectPersonService.defaultGardenId;
        this.subscription = this.store.select(fromRoot.getSearchData).subscribe((data) => {
            this.searchData = data;
            if (this.gardenData && this.gardenData.length > 0&&((data.adressData&&data.adressData.length>0)||(data.seletedData&&data.seletedData.length>0))) {
                this.getDataBySearch();
            }else{
                this.getGardenDistrict();
            }
        });
        
    }
    // 选中园区
    selectGarden(data) {
        this.selectGardenData = data;
        this.store.dispatch(new selectParsonAction.setSelectGarden(data));
    }
    // 对数据进行过滤
    getDataBySearch() {
        if (this.gardenData == null || this.gardenData.length == 0) return;
        this.copyGardenData = [];
        if (this.gardenData != null && this.gardenData.length > 0) {
            this.fiterAddress();// 过滤掉行政区域条件
            this.filterSelect();// 过滤掉学校类型条件
            this.selectGardenData = null;
            this.store.dispatch(new selectParsonAction.setSelectGarden({}));
            this.copyGardenData.map((item) => {
                if (item.id == this.selectPersonService.defaultGardenId) {
                    this.selectGardenData = item
                    this.store.dispatch(new selectParsonAction.setSelectGarden(item));
                }
            })
            this.selectData = this.createSelectData((!this.searchData.adressData || this.searchData.adressData.length == 0) && (!this.searchData.seletedData || this.searchData.seletedData.length == 0));// 获得过滤掉之后数据的树
            this.createGardenTree(); // 创建可见园区树
        }
    }
    // 获得数据
    getGardenDistrict() {
        this.selectPersonInterface.getGardenDistrict().subscribe((data) => {
            this.gardenData = data;
            this.copyGardenData = this.gardenData;
            this.selectData = this.createSelectData(true);
            this.createGardenTree();
            this.gardenData.map((item) => {
                if (item.id == this.gardenId) {
                    this.selectGardenData = item;
                    console.log('--------getGardenDistrict---------');
                    this.store.dispatch(new selectParsonAction.setSelectGarden(item));
                }
            })
            this.store.dispatch(new selectParsonAction.setGardenLength(data.length));
            this.store.dispatch(new selectParsonAction.setSelectData(this.selectData));
        })
    }
    // 对行政区域进行过滤
    fiterAddress() {
        this.gardenData.map((data) => {
            if (this.searchData.adressData && this.searchData.adressData.length > 0) {
                if (this.searchData.adressData.length == 3) {
                    if (data.districtId == this.searchData.adressData[2]) {
                        this.copyGardenData.push(data);
                    }
                } else if (this.searchData.adressData.length == 2) {
                    if ('city_' + data.cityId == this.searchData.adressData[1]) {
                        this.copyGardenData.push(data);
                    }
                } else if (this.searchData.adressData.length == 1) {
                    if ('province_' + data.provinceId == this.searchData.adressData[0]) {
                        this.copyGardenData.push(data);
                    }
                }
            } else {
                this.copyGardenData = this.gardenData;
            }
        })
    }
    // 对学校类型进行过滤
    filterSelect() {
        let result = [];
        if (this.searchData.seletedData && this.searchData.seletedData.length > 0) {
            this.searchData.seletedData.map((data) => {
                this.copyGardenData.map((item) => {
                    if (item.gardenTypeId == data) {
                        result.push(item);
                    }
                })
            })
            this.copyGardenData = result;
        }
    }
    // 创建学校类型下拉数据
    createSelectData(status) {
        let result = [];
        if (status) {
            this.gardenData.map((item) => {
                if (result.findIndex((r) => {
                    return r.gardenTypeId == item.gardenTypeId
                }) < 0) {
                    result.push({
                        gardenTypeId: item.gardenTypeId,
                        gardenTypeName: item.gardenTypeName,
                        value: item.gardenTypeId,
                        label: item.gardenTypeName
                    });
                }
            })
        } else {
            this.copyGardenData.map((item) => {
                if (result.findIndex((r) => {
                    return r.gardenTypeId == item.gardenTypeId
                }) < 0) {
                    result.push({
                        gardenTypeId: item.gardenTypeId,
                        gardenTypeName: item.gardenTypeName,
                        value: item.gardenTypeId,
                        label: item.gardenTypeName
                    });
                }
            })
        }
        return result;
    }
    // 创建可见园区树
    createGardenTree() {
        this.selectData.map((item) => {
            item.list = [];
            this.copyGardenData.map((gd) => {
                if (gd.gardenTypeId == item.gardenTypeId) {
                    item.list.push(gd);
                }
            })
        })
    }

}
