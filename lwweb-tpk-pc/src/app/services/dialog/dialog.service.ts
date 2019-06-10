import {Injectable} from '@angular/core';
import {NzModalService, NzMessageService} from 'ng-zorro-antd';
@Injectable()
export class DialogService {
	private modal: any;
	constructor(private modalService: NzModalService, private messageService: NzMessageService) {}
	openDialog(config) {
		this.modal = this.modalService.open(config);
	}
	openConfirm(config) {
		this.modalService.confirm(config);
	}
	getModal() {
		return this.modal;
	}
	alertSuccess(msg: string) {
		this.messageService.create('success', msg);
	}
	alertError(msg: string) {
		this.messageService.create('error', msg, {nzDuration: 2000});
	}
	alertWarning(msg: string) {
		this.messageService.create('warning', msg, {nzDuration: 2000});
		return false;
	}
	_create(type: string, msg: string, options?: any) {
		this.messageService.create(type, msg, options);
	}
}
