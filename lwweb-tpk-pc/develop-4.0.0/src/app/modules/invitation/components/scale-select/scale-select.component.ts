import {Component, OnInit, Input} from '@angular/core';
import {NzModalSubject} from 'ng-zorro-antd';
import {InvitationInterface} from '../../services/invitation.interface';
import {AccountService} from '../../../../services/account/account.service';
import {DatePipe} from '@angular/common';

@Component({
	selector: 'scale-select',
	templateUrl: 'scale-select.component.html',
	styleUrls: ['scale-select.component.scss']
})

export class ScaleSelectComponent implements OnInit {
	@Input()
	selectScaleModel: any;
	keyword: any;
	scaleDatas: Array<any>;
	timerObj: any;

	constructor(private datePipe: DatePipe, private subject: NzModalSubject, private invitationInterface: InvitationInterface, private accountService: AccountService) {
		this.selectScaleModel = null;
		this.keyword = '';
		this.scaleDatas = [];
		this.timerObj = null;
	}

	ngOnInit() {
		this.getScales();
	}

	onSearch(evt) {
		this.keyword = evt;
		this.getScales();
	}

	onCancel() {
		this.subject.destroy('onCancel');
	}

	onOk() {
		this.subject.destroy('onOk');
		this.subject.next({
			type: 'ok',
			selectScaleModel: this.selectScaleModel
		});
	}

	selectScale(event, d) {
		this.selectScaleModel = d;
	}

	getScales() {
		this.invitationInterface.getTemplates({
			gardenId: this.accountService.getCurrentGardenId(),
			keyword: this.keyword,
			type:0,
			effectiveness:true
		}).subscribe((result) => {
			console.log(result);
			this.scaleDatas = result.data;
		});
	}
}