import { Observable } from 'rxjs/Observable';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectPersonInterface } from '../../services/select-person.interface';
import { SelectPersonService } from '../../services/select-person.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as selectParsonAction from '../../actions/select-person.actions';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { timeout } from 'rxjs/operator/timeout';
@Component({
    selector: 'organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit, OnDestroy{
    inputPerson: any;
    treeData: any = [];
    gardenData: any;
    personData: any;
    disablePersons: any;
    gardenId: any;
    selectPersonData: any;
    selectGardenDataState : Observable<any>;
    subscriptionGardenDataState: any;
    subscriptiongetDisablePersons: any;
    subscriptionSelectPersonData: any;
    constructor(private selectPersonInterface: SelectPersonInterface, private selectPersonService: SelectPersonService, private store: Store<fromRoot.State>) {
        this.inputPerson = '';
        this.personData = [];
        this.disablePersons = [];
        this.selectPersonData = [];
        this.gardenId = null;
        this.selectGardenDataState = this.store.select(fromRoot.getSelectGardenData);
    }
    ngOnDestroy() {
        this.subscriptionGardenDataState.unsubscribe();
        // this.subscriptiongetDisablePersons.unsubscribe();
        // this.subscriptionSelectPersonData.unsubscribe();
    }
    ngOnInit() {
        this.subscriptionGardenDataState = this.selectGardenDataState.subscribe((data) => {
            this.gardenId = data.id;
            if (data.id) {
                this.gardenData = data;
                this.getDepartmentAccount(data.id);
                this.inputPerson = '';
                this.personData = [];
            } else {
                this.personData = [];
                this.treeData = [];
                this.store.dispatch(new selectParsonAction.setTreeData(this.treeData));
            }
        });
        this.subscriptiongetDisablePersons = this.store.select(fromRoot.getDisablePersons).subscribe((data) => {
            this.disablePersons = data;
        })
        this.subscriptionSelectPersonData = this.store.select(fromRoot.getSelectPersonData).subscribe((data) => {
            this.selectPersonData = data;
        })
    }
    searchPerson(evt) {
        this.inputPerson = evt;
        this.personData = [];
        if (this.gardenData && this.gardenData.id) {
            if (this.inputPerson == null || this.inputPerson.trim() == '') {
                this.getDepartmentAccount(this.gardenData.id);
            } else {
                this.getDepartmentAccountBySearch(this.gardenData.id, this.inputPerson);
            }
        }
    }
    getDepartmentAccount(id) {
        this.selectPersonInterface.getDepartmentAccount(id).subscribe((data) => {
            let result = [];
            data.map((item) => {
                if (this.disablePersons.findIndex((dp) => {
                    return dp == item.id;
                }) < 0) {
                    result.push(item);
                }
            })
            this.selectPersonService.getOpenIds(this.selectPersonData, this.gardenId, () => {
                this.treeData = this.selectPersonService.dataToTree(result, 'd_parent');
                this.treeData = [this.treeData];
                this.store.dispatch(new selectParsonAction.setTreeData(this.treeData));
            });
        })
    }
    checkPerson(p) {
        p.checked = !p.checked;
        if (p.checked) {
            this.store.dispatch(new selectParsonAction.AddSelectPersonData([p]));
        } else {
            this.store.dispatch(new selectParsonAction.DeleteSelectPersonData(p));
        }
    }
    getDepartmentAccountBySearch(id, searchKey) {
        this.selectPersonInterface.getDepartmentAccountBySearch(id, searchKey).subscribe((data) => {
            this.personData = [];
            data.accountList.map((item) => {
                if (this.disablePersons.findIndex((dp) => {
                    return dp == item.id;
                }) < 0) {
                    this.personData.push(item);
                }
            })
            this.treeData = [];
            data.departmentTreeList.map((itemTree) => {
                let result = [];
                itemTree.map((itemData) => {
                    if (this.disablePersons.findIndex((dp) => {
                        return dp == itemData.id;
                    }) < 0) {
                        result.push(itemData);
                    }
                })
                this.treeData.push(this.selectPersonService.dataToTree(result, 'd_parent'));
            });
            this.store.dispatch(new selectParsonAction.setTreeData(this.treeData));
            this.store.select(fromRoot.getSelectPersonData).subscribe((data) => {
                this.personData.map((person) => {
                    person.checked = data.findIndex((item) => {
                        return item.id == person.id;
                    }) > -1;
                })
            })
        })
    }
}
