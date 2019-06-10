import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {InvitationInterface} from '../../services/invitation.interface';
import {NzMessageService} from 'ng-zorro-antd';
import {AccountService} from '../../../../services/account';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'subjective-evaluation',
	templateUrl: 'subjective-evaluation.component.html',
	styleUrls: ['subjective-evaluation.component.scss']
})

export class SubjectiveEvaluationComponent implements OnChanges {

	@Input() data: any;

	@Input() isOutTime: boolean;

	@Input() account = this.accountService.getAccountId();

	@Input() banReply;

	@Output() changeSubmit = new EventEmitter();

	@Output() changeModel = new EventEmitter();

	edit = false;

	subjectList = [];

	allowSubmit = false;

	isCurrentAccount = true;

	btnDebunce = true;
	constructor(private invitationInterface: InvitationInterface,
				private messageService: NzMessageService,
				private accountService: AccountService,
				private router: ActivatedRoute) {
		setTimeout(() => {
			if (this.data) {
				this.getSubjectList();
			}
		}, 0);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.account && changes.account.previousValue !== changes.account.currentValue) {
			this.isCurrentAccount = changes.account.currentValue === this.accountService.getAccountId();
			this.invitationInterface.getEvaluationSubjective(this.data.id, changes.account.currentValue).subscribe((data) => {
				this.subjectList = data;
			});
		}
	}

	getSubjectList() {
		this.invitationInterface.getEvaluationSubjective(this.data.id, this.account).subscribe((data) => {
			if (data && data.length > 0) {
				this.edit = false;
				this.subjectList = data;
			} else {
				// 评课,不过期去请求模板
				this.router.params.subscribe((param) => {
					if (param.type === '0' && param.appraise === '1' && !this.isOutTime) {
						this.invitationInterface.getEvaluationSubjectiveTemplate(this.data.templateId).subscribe((res) => {
							if (res) {
								this.edit = true;
								this.subjectList = res;
							}
						});
					} else {
						this.subjectList = [];
					}
				});
			}
		});
	}

	submitReply(item) {
		this.btnDebunce = false;
		const params = {
			subjectiveId: item.id,
			content: item.replyContent,
			creatorId: this.account
		};
		this.invitationInterface.submitEvaluationSubjectiveMsg(params).subscribe(() => {
			this.messageService.success('提交成功！');
			this.changeModel.emit(false);
			this.getSubjectList();
		}, error => this.btnDebunce = true);
	}

	submitCommentMsg() {
		let flag = true;
		for (const item of this.subjectList) {
			item.templateItemId = item.id;
			if (!item.content) {
				item.isRequire = true;
				flag = false;
			}
		}
		if (flag) {
			const params = {
				activityId: this.data.id,
				items: this.subjectList
			};
			this.btnDebunce = false;
			this.invitationInterface.submitEvaluationSubjective(params).subscribe((data) => {
				this.messageService.success('主观评价提交成功！');
				this.getSubjectList();
				this.changeSubmit.emit();
				this.changeModel.emit(false);
			}, error => this.btnDebunce = true);
		} else {
			this.btnDebunce = true;
			this.messageService.warning('存在必填项未填写，请填写后提交！');
		}
	}

	emitModel(data) {
		this.changeModel.emit(!!data);
		this.checkSubmit();
	}

	checkSubmit() {
		this.allowSubmit = false;
		for (const item of this.subjectList) {
			if (item.content) {
				this.allowSubmit = true;
			}
		}
	}
}
