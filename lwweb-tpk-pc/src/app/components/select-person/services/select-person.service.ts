import {Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {SelectPersonInterface} from './select-person.interface';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../reducers';
import * as selectParsonAction from '../actions/select-person.actions';

export interface Options {
	title?: string;
	class?: string;
	persons?: any;
	disablePersons?: any;
	gardenId?: any;
	component?: any;
	onOk?: (data?: any) => any;
	onCancel?: (data?: any) => any;
}

@Injectable()
export class SelectPersonService {
	options: Options;
	selectPersonData: Observable<any>;
	modalObject: any;
	selectPersonAry: any;
	defaultGardenId: any;
	openTreeArys: any;

	constructor(private selectPersonInterface: SelectPersonInterface,
				private modalService: NzModalService,
				private store: Store<fromRoot.State>) {
		this.options = {title: '请选择人员'};
		this.selectPersonData = this.store.select(fromRoot.getSelectPersonData);
		this.store.select(fromRoot.getSelectPersonData).subscribe((data) => {
			this.selectPersonAry = data;
		});
	}

	open(config?: Options) {
		if (config != null) {
			this.options = Object.assign({}, this.options, config);
		}
		this.openTreeArys = [];
		this.defaultGardenId = this.options.gardenId;
		this.store.dispatch(new selectParsonAction.ResetSelectPersonData); // 重置所有已选人员
		this.store.dispatch(new selectParsonAction.setSearchData({
			adressData: [],
			seletedData: []
		}));
		// this.store.dispatch(new selectParsonAction.setSelectGarden([]));
		if (this.options.persons && this.options.persons.length > 0) {
			this.selectPersonInterface.getDepartmentAccountByIds(this.options.persons.join(',')).subscribe((data) => {
				// this.getOpenIds(data, this.defaultGardenId);
				this.store.dispatch(new selectParsonAction.AddSelectPersonData(data));
			});
		}
		if (this.options.disablePersons && this.options.disablePersons.length > 0) {
			this.store.dispatch(new selectParsonAction.setDisablePersons(this.options.disablePersons));
		}
		this.modalObject = this.modalService.open({
			title: this.options.title,
			content: config.component,
			footer: null,
			width: 800,
			wrapClassName: 'select-person-modal',
			maskClosable: false,
			componentParams: {gardenId: this.options.gardenId},
			onOk: () => {
				if (this.options.onOk) {
					this.options.onOk(this.selectPersonAry);
				}
			},
			onCancel: () => {
				// 返回
				if (this.options.onCancel) {
					this.selectPersonData.subscribe((data) => {
						this.options.onCancel(data);
					});
				}
			}
		});
	}

	dataToTree(items, pid?: string) {
		if (items.length > 0) {
			var curPid = pid ? pid : ''; //pid=0，为最上层节点 ，即无父节点
			var parent = this.findChild(curPid, items);//数组
			return parent;
		} else {
			return [];
		}
	}

	getOpenIds(selectPersonData, gardenId, callback?: Function) {
		let accountIds = [];
		if (selectPersonData.length > 0) {
			selectPersonData.map((items) => {
				accountIds.push(items.id);
			});
			this.selectPersonInterface.getDepartmentAccountOpenIds(accountIds.join(','), gardenId).subscribe((data) => {
				this.openTreeArys = data;
				if (callback) callback();
			});
		} else {
			this.openTreeArys = [];
			if (callback) callback();
		}
	}

	private findChild(curPid, data) {
		var _arr = [];
		var items = data;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			if (items[i].pId == curPid) {
				var _obj = items[i];
				_obj.value = _obj.id;
				_obj.label = _obj.name;
				_obj.status = this.openTreeArys.findIndex((item) => {
					return item == _obj.id;
				}) > -1;
				_obj.children = this.findChild(_obj.id, data);
				if (_obj.departmentName != null && _obj.children.length == 0) {
					_obj.isLeaf = true;
				} else {
					_obj.isLeaf = false;
				}
				_arr.push(_obj);
			}
		}
		return _arr;
	}
}