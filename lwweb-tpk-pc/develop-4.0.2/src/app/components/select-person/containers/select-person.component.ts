import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {NzModalSubject} from 'ng-zorro-antd';
import {SelectPersonInterface} from '../services/select-person.interface';
import {SelectPersonService} from '../services/select-person.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as selectParsonAction from '../actions/select-person.actions';

@Component({
	selector: 'lw-select-person',
	templateUrl: './select-person.component.html',
	styleUrls: ['./select-person.component.scss']
})
export class SelectPersonComponent implements OnInit, OnDestroy {
	public values: any[] = null;
	singleValue = 'a10';
	addressPositions: any;
	selectData = [];
	seletedData: any;
	gardenLength: number;
	@Input() gardenId: any;
    subscribeGardenLength: any;
    subscribeSelectPersonState: any;
	constructor(
		private selectPersonService: SelectPersonService,
		private subject: NzModalSubject,
		private store: Store<fromRoot.State>,
		private selectPersonInterface: SelectPersonInterface) {
		this.gardenLength = 1;
		document.documentElement.classList.add('lw-person');
	}

	ngOnInit() {
		this.getAddressPosition();
		this.subscribeGardenLength = this.store.select(fromRoot.getGardenLength).subscribe((data) => {
			this.gardenLength = parseInt(data);
		});
		this.subscribeSelectPersonState = this.store.select(fromRoot.getSelectPersonState).subscribe((data) => {
			this.selectData = data.selectData;
		})
	}

	getAddressPosition() {
		// this.store.dispatch(new selectParsonAction.getAddressPositionData);
		this.selectPersonInterface.getAddressPosition().subscribe((data) => {
			data.map((item) => {
				item.departmentName = 'aaaa';
			});
			this.addressPositions = this.selectPersonService.dataToTree(data);
		})
	}

	onCancel() {
		this.subject.destroy('onCancel');
	}

	onOk() {
		this.subject.destroy('onOk');
		return false;
	}

	selectAddress(evt) {
		this.store.dispatch(new selectParsonAction.setSearchData({
			adressData: evt
		}));
	}

	selectDataChange($event) {
		if (this.seletedData != $event) {
			this.store.dispatch(new selectParsonAction.setSearchData({
				seletedData: $event
			}));
		}
	}

	ngOnDestroy(): void {
        document.documentElement.classList.remove('lw-person');
        this.subscribeGardenLength.unsubscribe();
        this.subscribeSelectPersonState.unsubscribe();
	}
}
