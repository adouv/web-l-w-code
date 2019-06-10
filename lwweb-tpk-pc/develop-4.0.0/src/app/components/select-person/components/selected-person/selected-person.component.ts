import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../reducers';
import * as selectParsonAction from '../../actions/select-person.actions';
import { takeLast } from 'rxjs/operators';
@Component({
    selector: 'selected-person',
    templateUrl: './selected-person.component.html',
    styleUrls: ['./selected-person.component.scss']
})
export class SelectedPersonComponent implements OnInit, OnDestroy{
    inputPerson: any;
    selectedData: any; // 选中数据
    copySelectedData: any; // 用于查询
    selectTreeData: any;// 渲染数据
    searchStatus: boolean;
    gardenLength: any;
    subscribeSelectPersonState: any;
    constructor(private store: Store<fromRoot.State>) {
        this.inputPerson = '';
        this.selectTreeData = [];
        this.copySelectedData = [];
        this.selectedData = [];
        this.searchStatus = false;
    }
    ngOnDestroy() {
        this.subscribeSelectPersonState.unsubscribe();
    }
    ngOnInit() {
        this.subscribeSelectPersonState = this.store.select(fromRoot.getSelectPersonState).subscribe((data) => {
            this.selectedData = data.selectPersonData;
            this.gardenLength = parseInt(data.gardenLength);
            if(this.inputPerson == '' || this.inputPerson == null){
                this.copySelectedData = data.selectPersonData;
                this.selectTreeData = this.createSelectData(true);
                this.createGardenTree();
            }else{
                this.copySelectedData = [];
                this.selectedData.map((item) => {
                    if (item.name.indexOf(this.inputPerson) > -1) {
                        this.copySelectedData.push(item);
                    }
                });
                this.selectTreeData = this.createSelectData(false);
                this.createGardenTree();
            }
        });
    }
    searchPerson(evt) {
        this.inputPerson = evt;
        if (this.inputPerson == '' || this.inputPerson == null) {
            this.copySelectedData = this.selectedData;
            this.searchStatus = false;
            this.selectTreeData = this.createSelectData(true);
            this.createGardenTree();
        } else {
            this.searchStatus = true;
            this.copySelectedData = [];
            this.selectedData.map((item) => {
                if (item.name.indexOf(this.inputPerson) > -1) {
                    this.copySelectedData.push(item);
                }
            });
            this.selectTreeData = this.createSelectData(false);
            this.createGardenTree();
        }
    }
    deletePerson(p) {
        this.store.dispatch(new selectParsonAction.DeleteSelectPersonData(p));
    }

    // 创建学校类型下拉数据
    createSelectData(status) {
        let result = [];
        if (status) {
            this.selectedData.map((item) => {
                if (result.findIndex((r) => {
                    return r.gardenId == item.gardenId
                }) < 0) {
                    result.push({
                        gardenId: item.gardenId,
                        gardenName: item.gardenName
                    });
                }
            })
        } else {
            this.copySelectedData.map((item) => {
                if (result.findIndex((r) => {
                    return r.gardenId == item.gardenId
                }) < 0) {
                    result.push({
                        gardenId: item.gardenId,
                        gardenName: item.gardenName
                    });
                }
            })
        }
        return result;
    }
    // 创建可见园区树
    createGardenTree() {
        this.selectTreeData.map((item) => {
            item.list = [];
            this.copySelectedData.map((gd) => {
                if (gd.gardenId == item.gardenId) {
                    item.list.push(gd);
                }
            })
        })
    }
}
