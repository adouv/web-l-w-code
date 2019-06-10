import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {InvitationInterface} from '../../services/invitation.interface';
import {AccountService} from '../../../../services/account';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'objective-evaluation',
	templateUrl: 'objective-evaluation.component.html',
	styleUrls: ['objective-evaluation.component.scss']
})

export class ObjectiveEvaluationComponent implements OnChanges {

	@Input() data: any;

	@Input() isOutTime: boolean;

	@Input() account = this.accountService.getAccountId();

	@Output() changeSubmit = new EventEmitter();

	@Output() changeModel = new EventEmitter();

	edit = false;

	objectiveList;

	allowSubmit = false;

	isCurrentAccount = true;

	isShowTime;

	btnDebunce = true;
	constructor(private invitationInterface: InvitationInterface,
				private accountService: AccountService,
				private messageService: NzMessageService,
				private router: ActivatedRoute) {
		setTimeout(() => {
			if (this.data) {
				this.getObjectList();
			}
		}, 0);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.account && changes.account.previousValue !== changes.account.currentValue) {
			this.isCurrentAccount = changes.account.currentValue === this.accountService.getAccountId();
			this.invitationInterface.getEvaluationObjective(this.data.id, changes.account.currentValue).subscribe((data) => {
				this.objectiveList = data;
			});
		}
	}

	getObjectList() {
		this.invitationInterface.getEvaluationObjective(this.data.id, this.account).subscribe((data) => {
			if (data) {
				this.edit = false;
				this.objectiveList = data;
			} else {
				// 评课,不过期去请求模板
				this.router.params.subscribe((param) => {
					if (param.type === '0' && param.appraise === '1' && !this.isOutTime) {
						this.invitationInterface.getEvaluationObjectiveTemplate(this.data.templateId).subscribe(res => {
							if (res) {
								this.objectiveList = res;
								this.edit = true;
							}
						});
					} else {
						this.objectiveList = null;
					}
				});
			}
		});
	}

	numChange() {
		this.objectiveList['totalObtainedScore'] = 0;
		this.objectiveList['items'].forEach(item => {
			item.childItems.forEach(data => {
				let val = data.obtainedScore;
				val = isNaN(val) ? 0 : val;
				this.objectiveList['totalObtainedScore'] = (val * 100 + this.objectiveList['totalObtainedScore'] * 100) / 100;
			});
		});
	}

	private getObjectiveParams() {
		for (const item of this.objectiveList) {
			item.templateItemId = item.id;
			if (item.childItems) {
				for (const cItem of item.childItems) {
					cItem.templateItemId = cItem.id;
				}
			}
		}
		this.objectiveList['activityId'] = this.data.id;
	}

	submitCommentMsg() {
		let flag = true;
		for (const item of this.objectiveList['items']) {
			if (item.childItems) {
				for (const cItem of item.childItems) {
					if (!(cItem.obtainedScore || parseInt(cItem.obtainedScore, 0) === 0)) {
						cItem.isRequire = true;
						flag = false;
					}
				}
			}
		}
		if (flag) {
			this.btnDebunce = false;
			this.getObjectiveParams();
			this.invitationInterface.submitEvaluationObjective(this.objectiveList).subscribe(() => {
				this.messageService.success('客观评价提交成功！');
				this.getObjectList();
				this.changeSubmit.emit();
				this.changeModel.emit(false);
				this.isShowTime = true;
			},error => this.btnDebunce = true);
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
		for (const item of this.objectiveList['items']) {
			if (item.childItems) {
				for (const cItem of item.childItems) {
					if (cItem.obtainedScore || parseInt(cItem.obtainedScore, 0) === 0 && cItem.obtainedScore !== null) {
						this.allowSubmit = true;
					}
				}
			}
		}
	}

	checkNumber(data) {
		const num = data['obtainedScore'], max = data['score'];
		if (isNaN(num)) {
			data['obtainedScore'] = 0;
		}
		if (num >= max) {
			data['obtainedScore'] = max;
		}
		/*if (isNaN(parseInt(num, 0))) {
			data['obtainedScore'] = 0;
		} else if (parseInt(num, 0) >= parseInt(max, 0)) {
			data['obtainedScore'] = parseInt(max, 0);
		} else if (parseInt(num, 0) <= 0) {
			data['obtainedScore'] = 0;
		}* else {
			data['obtainedScore'] = parseInt(num, 0);
		}*/
	}

	clearNumber(event, data) {
		let num = event.target.value;
		num = num.replace(/[^\d.]/g, '');  // 清除“数字”和“.”以外的字符
		num = num.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
		num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
		num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
		if (num.indexOf('.') < 0 && num !== '') {// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			num = parseFloat(num);
		}
		data['obtainedScore'] = num;
	}
}
