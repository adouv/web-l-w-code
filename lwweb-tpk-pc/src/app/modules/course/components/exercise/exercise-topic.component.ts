import {Component, Input, EventEmitter, Output} from '@angular/core';
import {CourseInterface} from '../../services/course.interface';
import {ConfirmationService} from 'primeng/primeng';
import {CourseDialogService} from './dialog.service';
import {ExerciseSettingType} from './exercise-handle.component';

@Component({
	selector: 'exercise-topic',
	styles: [`
		.flex-box {
			display: flex;
		}

		.topic-wrapper.flex-box .ex-wrapper-one:hover {
			background: #e7f1fb;
		}

		.ex-wrapper.flex-box:hover, .ex-main.ex-smallMain:hover, .ex-wrapper.ex-wrapper-smallMain:hover {
			background: #e7f1fb;
		}

		.ex-wrapper {
			position: relative;
		}

		.ex-wrapper-one, .flex-box.flex-box-left {
			margin-bottom: 12px;
			padding: 0 10px;
		}

		.ex-wrapper.ex-wrapper-smallMain {
			padding: 0 10px;
		}

		.flex-1 {
			flex: 1;
			font-size: 20px;
		}

		.main-title {
			line-height: 30px;
			float: left;
		}

		.ex-tmp {
			text-align: left;
		}

		.item-title {
			position: relative;
			top: 2px;
		}
	`],
	template: `
		<div class="topic-wrapper flex-box">
			<div class="flex-1">
				<div class="ex-wrapper ex-wrapper-one">
					<div class="item-title ex-tmp main-title">{{mainIndex + 1 | numberToUpperCase}}、</div>
					<div class="ex-tmp ex-main ex-bigMain" [dynamicHtml]="item.subjectHtml"></div>
					<exercise-handle-tip *ngIf="publishStatus" (setting)="mainExercise($event)" [item]="item"></exercise-handle-tip>
				</div>
				<div class="ex-wrapper ex-wrapper-smallMain" *ngIf="item.description">
					<div class="ex-tmp ex-main ex-smallMain" [dynamicHtml]="item.description"></div>
					<exercise-handle-tip *ngIf="publishStatus" (setting)="mainExercise($event)" contentKey="description"
										 [item]="item"></exercise-handle-tip>
				</div>
				<div class="ex-wrapper flex-box flex-box-left"
					 *ngFor="let subitem of item.exampleSubVoList; let i = index;">
					<div class="ex-tmp item-title">{{i + 1}}.</div>
					<div class="ex-tmp flex-1" [dynamicHtml]="subitem.subjectHtml"></div>
					<exercise-handle-tip *ngIf="publishStatus" (setting)="subExercise($event)" [isSub]="true" [item]="subitem"
										 [subIndex]="i"></exercise-handle-tip>
				</div>
			</div>
		</div>
	`
})
export class ExerciseTopic {
	@Input() item: any;

	@Input() mainIndex: number;

	@Input() publishStatus: boolean;

	@Output() setting = new EventEmitter<any>();

	constructor(private exerciseInterface: CourseInterface,
				private confirmationService: ConfirmationService,
				private dialogService: CourseDialogService) {
	}

	mainExercise(e) {
		switch (e.type) {
			case ExerciseSettingType.MAIN_EDIT:
				this.updateMainExercise(e.item, e.type, e.crudKey);
				break;
			case ExerciseSettingType.MAIN_GRADE:
				this.updateMainExercise(e.item, e.type, e.crudKey);
				break;
			case ExerciseSettingType.DELETE:
				if (e.cleanKey) {
					this.deleteStuffExercise(e.item, e.type, e.cleanKey);
				} else {
					this.deleteMainExercise(e.item.id, e.type);
				}
				break;
		}
	}

	subExercise(e) {
		switch (e.type) {
			case ExerciseSettingType.SUB_EDIT:
				this.updateSubExercise(e.item, e.type, e.crudKey);
				break;
			case ExerciseSettingType.SUB_GRADE:
				this.updateSubExercise(e.item, e.type, e.crudKey);
				break;
			case ExerciseSettingType.DELETE:
				this.deleteSubExercise(e.item.id, e.subIndex, e.type);
				break;
			case ExerciseSettingType.ANSWER:
				this.setAnswer(e.item, e.type, e.crudKey);
				break;
		}
	}

	updateMainExercise(item, type, crudKey) {
		this.setting.emit({item, type, crudKey});
	}

	updateSubExercise(item, type, crudKey) {
		this.setting.emit({item, type, crudKey});
	}

	deleteStuffExercise(item, type, crudKey) {
		const title = '提示';
		const content = '删除后将不可恢复，是否继续？';
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			item[crudKey] = '';
			this.updateMainExercise(item, type, crudKey);
		}, null, 'confirmDialogKey2');
	}

	deleteMainExercise(id: string, type) {
		const title = '提示';
		const content = '本操作将删除本大题题干及其下面包含的所有小题，删除后将不可恢复，继续此操作吗？';
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			this.exerciseInterface.deleteMainExerciseById(id).subscribe(res => {
				this.setting.emit({type});
			});
		}, null, 'confirmDialogKey2');
	}

	deleteSubExercise(id: string, subIndex: number, type) {
		const title = '提示';
		const content = '删除后将不可恢复，是否继续？';
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			this.exerciseInterface.deleteSubExerciseById(id).subscribe(res => {
				this.item.exampleSubVoList.splice(subIndex, 1);
			});
		}, null, 'confirmDialogKey2');
	}

	setAnswer(item: any, type, crudKey) {
		this.setting.emit({item, type, crudKey});
	}
}
