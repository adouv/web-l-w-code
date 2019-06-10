import {Component, Input, EventEmitter, Output} from '@angular/core';

export enum ExerciseSettingType {
	MAIN_EDIT,
	SUB_EDIT,
	DELETE,
	ASSIGN_GRADE,
	RELATION_INFO,
	COGNITION,
	DEGREE,
	ANSWER,
	MAIN_GRADE,
	SUB_GRADE,
}

@Component({
	selector: 'exercise-handle-tip',
	styles: [`
		.ex-hl-wrapper {
			display: none;
		}

		.ex-hl-wrapper ul {
			position: absolute;
			top: 5px;
			right: 10px;
			line-height: 26px;
			border: 1px solid #c4cfe3;
			border-radius: 3px;
			overflow: hidden;
			text-align: center;
			font-size: 16px;
			background-color: #fff;
			z-index: 10;
			padding: 6px 0;
		}

		.ex-hl-wrapper ul li {
			border-right: 1px solid #c4cfe3;
			cursor: pointer;
			padding: 0 20px;
			display: inline-block;
		}

		.ex-hl-wrapper ul li:last-child {
			border: 0;
		}

		.ex-hl-wrapper ul li a {
			text-decoration: none;
			color: #00a0e9;
		}
	`],
	template: `
		<div class="ex-hl-wrapper">
			<ul>
				<li class="flex-1" (click)="onClick(isSub?settingType.SUB_EDIT:settingType.MAIN_EDIT, item, (contentKey||'subjectHtml'))"><a
					href="javascript:void(0);">编辑</a></li>
				<li class="flex-1" (click)="onClick(settingType.DELETE, item, '', contentKey, subIndex)"><a
					href="javascript:void(0);">删除</a></li>
				<li class="flex-1" *ngIf="!contentKey" (click)="onClick(isSub?settingType.SUB_GRADE:settingType.MAIN_GRADE, item, 'score')">
					<a href="javascript:void(0);">赋分</a></li>
				<li class="flex-2" *ngIf="isSub" (click)="onClick(settingType.ANSWER, item, item.hasReference?'answerText':'answerHtml')"><a
					href="javascript:void(0);">设置标准答案</a></li>
				<!--<li class="flex-2"><a href="javascript:void(0);">关联知识点</a></li>-->
				<!--<li class="flex-2"><a href="javascript:void(0);">设置认知要求</a></li>-->
				<!--<li class="flex-2"><a href="javascript:void(0);">预设难度系数</a></li>-->
			</ul>
		</div>
	`
})
export class ExerciseHandleTip {

	@Output() setting = new EventEmitter<any>();

	@Input() item: any;

	@Input() isSub = false;

	@Input() subIndex: number;

	@Input() contentKey: string;

	settingType = ExerciseSettingType;

	onClick(type, item, key?: string, contentKey?: string, subIndex?: number) {
		this.setting.emit({type, item, subIndex, crudKey: key, cleanKey: contentKey});
	}
}
