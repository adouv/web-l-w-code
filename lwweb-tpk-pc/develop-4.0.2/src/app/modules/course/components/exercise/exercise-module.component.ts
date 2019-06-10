import {Component, Input, ViewChild} from '@angular/core';
import {ExerciseSettingType} from './exercise-handle.component';
import {CourseInterface} from '../../services/course.interface';
import {MessageService} from 'primeng/components/common/messageservice';
import {UEditorComponent} from 'lw-ngx-ueditor';

@Component({
	selector: 'exercise-module',
	styles: [`
		.select-wrapper {
			height: 280px;
			font-size: 0.875rem;
			text-align: left;
			margin: 10px 0 0 20px;
		}

		.select-wrapper p {
			font-size: 0.875rem;
			color: #333;
			margin-bottom: 10px;
		}

		.score {
			margin-bottom: 20px;
		}

		.score span, .score input {
			display: inline-block;
			vertical-align: middle;
			margin-right: 6px;
			font-size: 0.875rem;
		}

		.grade-error-wrapper {
			font-size: 0.875rem;
			text-align: left;
			margin-left: 20px;
			color: red;
		}

		.explain {
			font-size: 0.875rem;
			color: #999;
			text-align: left;
			margin-left: 20px;
			margin-top: 10px;
		}
	`],
	template: `
		<exercise-topic *ngFor="let item of exerciseList; let i=index" [publishStatus]="publishStatus" [item]="item" [mainIndex]="i"
						(setting)="setting($event, i)"></exercise-topic>
		<p-dialog class="tpk-ui-confirmdialog" [contentStyle]="{'width':'62.5rem','height':'34rem'}" [draggable]="false"
				  header="{{editTitle||'编辑'}}"
				  [(visible)]="editDisplay" modal="modal" [responsive]="false" [draggable]="false">
			<ueditor #editfull *ngIf="editDisplay" style="height: 340px; " [(ngModel)]="editContent"></ueditor>
			<p-footer>
				<button type="button" pButton icon="fa-check" (click)="editDisplay=false" label="取消"></button>
				<button type="button" pButton icon="fa-close" (click)="sureSave()" label="确定"></button>
				<span class="grade-error-wrapper" style="position: absolute;" *ngIf="!editValid">输入不能为空！</span>
			</p-footer>
		</p-dialog>
		<p-dialog class="tpk-ui-confirmdialog" [draggable]="false"
				  [contentStyle]="{'width':referenceItemList.length==0?'62.5rem':'37.5rem','height':referenceItemList.length==0?'37.5rem':'22rem'}"
				  header="设置标准答案" [draggable]="false"
				  [(visible)]="answerDisplay" modal="modal" [responsive]="false">
			<div *ngIf="referenceItemList.length>0" class="select-wrapper">
				<span>本小题的标准答案为：</span>
				<p-dropdown *ngIf="!isMultiSelect" class="tpk-ui-select tpk-ui-select-black" [style]="{'width':'200px'}"
							placeholder="请选择" [options]="referenceItemList" [(ngModel)]="answerContent"></p-dropdown>
				<p-multiSelect *ngIf="isMultiSelect" class="tpk-ui-select black" [style]="{'width':'200px'}" selectedItemsLabel="已选{0}个"
							   defaultLabel="请选择" [options]="referenceItemList" [(ngModel)]="answerContent"></p-multiSelect>
			</div>
			<ueditor #answerfull *ngIf="answerDisplay" style="height: 340px;" [hidden]="referenceItemList.length!=0"
					 [(ngModel)]="answerHtml"></ueditor>
			<p-footer>
				<button type="button" pButton icon="fa-check" (click)="answerDisplay=false" label="取消"></button>
				<button type="button" pButton icon="fa-close" (click)="sureAnswer()" label="确定"></button>
			</p-footer>
		</p-dialog>
		<p-dialog class="tpk-ui-confirmdialog tpk-ui-exercise" [draggable]="false" [contentStyle]="{'width':'37.5rem','height':'22rem'}"
				  [draggable]="false"
				  header="{{isMain?'大题题干赋分':'小题题干赋分'}}"
				  [(visible)]="gradeDisplay" modal="modal" [responsive]="true">
			<div *ngIf="isMain" class="select-wrapper" style="height: auto;margin-top: 10px">
				<p>本大题下的每道小题的得分值为：</p>
				<div class='score'>
					<input class="default-input" type="text" [(ngModel)]="gradeContent"
						   (keyup)="numberInput(gradeContent)" hange placeholder="只允许输入小数点后1位的正实数（0~100之间）">
					<span>分</span>
				</div>
			</div>
			<div *ngIf="!isMain" class="select-wrapper " style="height: auto;margin-top: 10px">
				<p>本小题分值为：</p>
				<div class='score'>
					<input class="default-input" type="text" [(ngModel)]="gradeContent"
						   (keyup)="numberInput(gradeContent)" placeholder="只允许输入小数点后1位的正实数（0~100之间）">
					<span>分</span>
				</div>
			</div>
			<div class="grade-error-wrapper">
				<p *ngIf="gradeValidation.legal">输入不合法！</p>
				<p *ngIf="gradeValidation.minVal">分值不能为0！</p>
				<p *ngIf="gradeValidation.maxVal">分值不能大于100！</p>
			</div>
			<p *ngIf="isMain" class='explain'>说明：成功赋分后，该大题下的所有小题的分值都将变为此分值。</p>
			<p-footer>
				<button type="button" pButton icon="fa-check" (click)="gradeDisplay=false" label="取消"></button>
				<button type="button" pButton icon="fa-close" (click)="sureGrade()" label="确定"></button>
			</p-footer>
		</p-dialog>
	`
})
export class ExerciseModule {
	@Input() exerciseList: any;

	@Input() publishStatus = true;
	@ViewChild('editfull') editfull: UEditorComponent;
	@ViewChild('answerfull') answerfull: UEditorComponent;
	editContent: string;

	editTitle: string;

	editDisplay = false;

	answerDisplay = false;

	gradeDisplay = false;

	crudKey: string;

	isMultiSelect: boolean;

	answerContent: any;

	answerHtml: any;

	gradeContent: any;

	isMain: boolean;

	isGradeNull = false;

	editValid: boolean;

	referenceItemList: Array<any> = [];

	exerciseItem: { type: ExerciseSettingType, item: any, crudKey: string };

	gradeValidation: { minVal?: boolean, maxVal?: boolean, legal?: boolean } = {};

	constructor(private exerciseInterface: CourseInterface,
				private messageService: MessageService) {
	}

	htmlDeode(str) {
		const div = document.createElement('div');
		div.innerHTML = str;
		return div.innerHTML;
	}

	setting(e, index) {
		switch (e.type) {
			case ExerciseSettingType.DELETE:
				if (e.crudKey) {
					this.updateMainExercise(e.item);
				} else {
					this.exerciseList.splice(index, 1);
				}
				break;
			case ExerciseSettingType.MAIN_EDIT:
			case ExerciseSettingType.SUB_EDIT:
				this.editValid = true;
				this.editDisplay = true;
				this.editContent = this.htmlDeode(e.item[e.crudKey]);
				this.exerciseItem = e;
				break;
			case ExerciseSettingType.MAIN_GRADE:
			case ExerciseSettingType.SUB_GRADE:
				this.gradeValidation = {minVal: false, maxVal: false, legal: false};
				this.isMain = e.type === ExerciseSettingType.MAIN_GRADE;
				this.isGradeNull = !e.item[e.crudKey];
				this.gradeDisplay = true;
				this.gradeContent = this.isMain ? '' : e.item[e.crudKey];
				this.exerciseItem = e;
				break;
			case ExerciseSettingType.ANSWER:
				this.answerDisplay = true;
				if (e.item.hasReference) {
					this.isMultiSelect = e.item.multiAnswer || false;
					if (e.item[e.crudKey].length > 0 && !e.item[e.crudKey].includes(',')) {
						this.answerContent = e.item[e.crudKey].split('');
					} else {
						this.answerContent = e.item[e.crudKey] || null;
					}
					this.referenceItemList = e.item.referenceItems.map(item => {
						return {label: item.itemId, value: item.itemId};
					});
					if (!this.isMultiSelect) {
						this.referenceItemList.unshift({label: '请选择', value: ''});
					}
				} else {
					if (this.answerfull && this.answerfull.Instance.reset) {
						this.answerfull.Instance.reset();
					}
					this.referenceItemList = [];
					this.answerHtml = this.htmlDeode(e.item[e.crudKey]);
				}
				this.exerciseItem = e;
				break;
		}
	}

	sureSave() {
		// TODO 调用富文本框的方法
		const content = !this.editContent ? this.editContent :
			this.editContent.toString()
				.replace(/\s/g, '')
				.replace(/<p>/g, '')
				.replace(/<\/p>/g, '')
				.replace(/<br>/g, '');
		if (content) {
			switch (this.exerciseItem.type) {
				case ExerciseSettingType.MAIN_EDIT:
					const mainItem = Object.assign({}, this.exerciseItem.item);
					mainItem[this.exerciseItem.crudKey] = this.editContent;
					this.updateMainExercise(mainItem, () => {
						this.exerciseItem.item[this.exerciseItem.crudKey] = this.editContent;
						this.editDisplay = false;
					});
					break;
				case ExerciseSettingType.SUB_EDIT:
					const subItem = Object.assign({}, this.exerciseItem.item);
					subItem[this.exerciseItem.crudKey] = this.editContent;
					this.updateSubExercise(subItem, () => {
						this.editDisplay = false;
						this.exerciseItem.item[this.exerciseItem.crudKey] = this.editContent;
					});
					break;
			}
		} else {
			this.editValid = false;
		}
	}

	sureAnswer() {
		if (this.exerciseItem.item.hasReference) {
			this.exerciseItem.item[this.exerciseItem.crudKey] = this.isMultiSelect ? (this.answerContent || '').join('') : this.answerContent;
		} else {
			this.exerciseItem.item[this.exerciseItem.crudKey] = this.answerHtml;
		}
		this.updateSubExercise(this.exerciseItem.item);
		this.answerDisplay = false;
	}

	sureGrade() {
		if ((!this.isGradeNull || this.gradeContent) && this.validGrade()) {
			if (this.gradeContent.includes('.')) {
				this.gradeContent = parseFloat(this.gradeContent);
			}
			this.gradeDisplay = false;
			switch (this.exerciseItem.type) {
				case ExerciseSettingType.MAIN_GRADE:
					if (this.gradeContent) {
						this.exerciseItem.item[this.exerciseItem.crudKey] = this.gradeContent;
						this.updateMainExercise(this.exerciseItem.item);
						this.exerciseItem.item.exampleSubVoList.map(example => {
							example.score = this.gradeContent;
						});
					}
					break;
				case ExerciseSettingType.SUB_GRADE:
					this.exerciseItem.item[this.exerciseItem.crudKey] = this.gradeContent;
					this.updateSubExercise(this.exerciseItem.item);
					break;
			}
		}
		if (!this.gradeContent) {
			this.gradeDisplay = false;
		}
	}

	numberInput(price) {
		if (price) {
			price = price.replace(/[^\d.]/g, '');
			price = price.replace(/\.{2,}/g, '.');
			price = price.replace(/^(0+)(\d+)/g, '$2');
			price = price.replace(/(\.\d)\d+/g, '$1');
			this.gradeContent = price;
		}
	}

	validGrade() {
		if (this.gradeContent !== '') {
			if (this.gradeContent <= 0) {
				this.gradeValidation = {minVal: true};
				return false;
			}
			if (this.gradeContent > 100) {
				this.gradeValidation = {maxVal: true};
				return false;
			}
			if (Number.isNaN(parseFloat(this.gradeContent)) || this.gradeContent.match(/[^\d.]/)) {
				this.gradeValidation = {legal: true};
				return false;
			}
			this.gradeValidation = {minVal: false, maxVal: false, legal: false};
		}
		return true;
	}

	updateMainExercise(item, callback?) {
		return this.exerciseInterface.updateMainExercise(item).subscribe(res => {
			if (res && res.code === 1) {
				this.messageService.add({severity: 'warn', detail: res.msg});
			} else if (callback) {
				callback();
			}
		});
	}

	updateSubExercise(item, callback?) {
		return this.exerciseInterface.updateSubExercise(item).subscribe(res => {
			if (res && res.code === 1) {
				this.messageService.add({severity: 'warn', detail: res.msg});
			} else if (callback) {
				callback();
			}
		});
	}
}
