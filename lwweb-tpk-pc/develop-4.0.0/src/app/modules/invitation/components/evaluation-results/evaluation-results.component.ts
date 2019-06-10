import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {InvitationInterface} from '../../services/invitation.interface';
import {AccountService} from '../../../../services/account';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
// import { truncateSync } from 'fs';

@Component({
	selector: 'evaluation-results',
	templateUrl: 'evaluation-results.component.html',
	styleUrls: ['evaluation-results.component.scss']
})

export class EvaluationResultsComponent implements OnChanges {

	@Input() data: any;

	@Input() isOutTime: boolean;

	@Input() account = this.accountService.getAccountId();

	@Input() type;

	@Output() changeSubmit = new EventEmitter();

	@Output() changeModel = new EventEmitter();

	edit = false;

	comment: any;

	isCurrentAccount = true;

	btnDebunce = true;

	constructor(private invitationInterface: InvitationInterface,
				private accountService: AccountService,
				private messageService: NzMessageService,
				private router: ActivatedRoute) {
		setTimeout(() => {
			if (this.data) {
				this.getAdviceOrResult();
			}
		}, 0);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.account && changes.account.previousValue !== changes.account.currentValue) {
			this.isCurrentAccount = changes.account.currentValue === this.accountService.getAccountId();
			this.invitationInterface.getAdviceOrResult(this.data.id, changes.account.currentValue).subscribe((data) => {
				this.comment = data ? data : null;
			});
		}
	}

	getAdviceOrResult() {
		this.invitationInterface.getAdviceOrResult(this.data.id, this.account).subscribe((data) => {
			if (data && data.comment) {
				this.edit = false;
				this.comment = data;
			} else {
				// 评课时可以编辑
				this.router.params.subscribe((param) => {
					if (param.type === '0' && param.appraise === '1' && !this.isOutTime) {
						this.edit = true;
					} else {
						this.comment = null;
					}
				});
			}
		});
	}

	submitCommentMsg() {
		this.btnDebunce = false;
		this.invitationInterface.submitAdviceOrResult({
			activityId: this.data.id,
			comment: this.comment
		}).subscribe(() => {
			const message = this.type ? '诊断结果' : '改进建议';
			this.messageService.success(message + '提交成功！');
			this.getAdviceOrResult();
			this.changeSubmit.emit();
			this.changeModel.emit(false);
		}, error => this.btnDebunce = true);
	}

	emitModel(data) {
		this.changeModel.emit(!!data);
	}
}
