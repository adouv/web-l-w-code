import {Component, Input, OnInit} from '@angular/core';
import {QualityCoursesModel} from '../quality-courses/quality-courses.model';
import {AddQualityCourse, QualityCourseInterface} from '../../../../services/resource/quality-course.interface';
import {NzMessageService, NzModalSubject} from 'ng-zorro-antd';
import {ResourceHomeInterface} from '../../../../services/resource/resource-home.interface';
import {AccountService} from '../../../../services/account';

@Component({
	templateUrl: 'quality-course-edit.component.html',
	styleUrls: ['quality-course-edit.component.scss']
})

export class QualityCourseEditComponent implements OnInit {
	@Input() qualityCourseItem: QualityCoursesModel;
	@Input() addQualityCourse: AddQualityCourse;    // 添加使用
	@Input() outlineId: string;
	@Input() type: string;                          // save：添加
	newName: string;
	knowledgeOptions: any[] = [];
	outlineIds: string[];
	validModel: any = {};

	constructor(private qualityCourseInterface: QualityCourseInterface,
				private subject: NzModalSubject,
				private messageService: NzMessageService,
				private resourceHomeInterface: ResourceHomeInterface,
				private account: AccountService) {
	}

	ngOnInit() {
		setTimeout(() => {
			if (this.qualityCourseItem) {
				this.newName = this.qualityCourseItem.name;
			} else if (this.addQualityCourse) {
				this.newName = this.addQualityCourse.name;
			}
			this.getLastOutlineList();
		}, 0);
	}

	handleCancel() {
		this.subject.destroy('onCancel');
	}

	validate() {
		let flag = true;
		if (!this.outlineIds || this.outlineIds.length === 0) {
			this.validModel.errOutlineId = true;
			flag = false;
		} else {
			this.validModel.errOutlineId = false;
		}
		if (!this.newName || !this.newName.trim()) {
			this.validModel.name = true;
			flag = false;
		} else {
			this.validModel.name = false;
		}
		return flag;
	}

	/**
	 * 更新精品课
	 */
	updateQualityCourse() {
		if (!this.validate()) {
			this.messageService.warning('存在必填项未填写，请填写后提交！',{nzDuration: 2000});
			return;
		}
		if (this.type === 'save') {
			this.addQualityCourse.name = this.newName;
			this.addQualityCourse.outlineIds = this.outlineIds;
			this.addQualityCourse.gardenId = this.account.getCurrentGardenId;
			this.qualityCourseInterface.addQualityCourse([this.addQualityCourse]).subscribe(() => {
				this.subject.next('传出');
				this.subject.destroy('onOk');
			}, () => {
				this.subject.destroy('onCancel');
			});
		} else {
			this.qualityCourseInterface.updateQualityCourse(this.qualityCourseItem.id, this.newName,
				this.outlineIds).subscribe(() => {
				this.subject.next('传出');
				this.subject.destroy('onOk');
			}, () => {
				this.subject.destroy('onCancel');
			});
		}
	}

	/**
	 * 获取知识点下拉列表
	 */
	getLastOutlineList() {
		this.resourceHomeInterface.getLastOutlineList(this.outlineId).subscribe((data) => {
			this.knowledgeOptions = data;
			this.getOutlineIds();
		});
	}

	/**
	 * 获取当前精品课id查找大纲id
	 */
	getOutlineIds() {
		if (this.type === 'save') {
			this.outlineIds = [this.outlineId];
		} else {
			this.qualityCourseInterface.getOutlineIds(this.qualityCourseItem.id).subscribe((data) => {
				this.outlineIds = data;
			});
		}
	}
}
