import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { KnowledgeService } from '../../../../services/knowledge/knowledge.service';
import { ExercisesService } from '../../../../services/exercises/exercises.service';
import { OutlineParams } from '../../../../services/exercises/exercises.model';
import { OrganizationInterface } from '../../../../services/organization/organization.interface';
import { EditionService } from '../../../../services/edition/edition.service';
import { AccountService } from '../../../../services/account';
import { FormControl } from '@angular/forms';


@Component({
	selector: 'select-course-chapter',
	templateUrl: 'select-chapter.html',
	styleUrls: ['./select-chapter.scss']
})

export class SelectCourseChapterComponent implements OnInit {
	_value: string;
	gradeList = [];
	subjectList = [];
	editionList = [];
	checkAry = [];
	openList = [];
	treeData: any;
	term = new FormControl();
	type: number;
	@Input() gradeCode: any;
	@Input() subjectCode: any;
	@Input() semesterCode: any;
	@Input() gradeId: any;
	@Input() checkList: any;
	@Input() openNodeList: any;
	@Input() maxLength: number;
	@Input() classId: any;
	selectParams: { gradeCode?: string; subjectCode?: string; semesterCode?: string, title?: string; gradeId?: string, classId?: string } = {};
	title = '';
	outlineParams: OutlineParams = { gradeCode: '', subjectCode: '', semesterCode: '', resource: 'exercise', };
	inputTimer: any;
	treeDataLoadComplete = false;
	currentGardenId: any;

	constructor(private accountService: AccountService,
		private subject: NzModalSubject,
		private knowledgeService: KnowledgeService,
		private exercisesService: ExercisesService,
		private organizationInterface: OrganizationInterface,
		private editionService: EditionService,
		) {
		this.treeData = [];
		this.type = 1;
		this.checkList = [];
		this.inputTimer = null;
		this.maxLength = -1;
	}

	ngOnInit() {
		this.selectParams.gradeCode = this.gradeCode;
		this.selectParams.subjectCode = this.subjectCode;
		this.selectParams.semesterCode = this.semesterCode;
		this.selectParams.gradeId = this.gradeId;
		this.selectParams.classId = this.classId;
		this.selectParams.title = '';
		this.getGradeList();
		this.getOutlineList();
		this.checkAry = Object.assign([], this.checkList);
	}

	getSubjectListByGradeId(gradeId) {
		this.organizationInterface.getSubjectListByGradeId(this.accountService.getCurrentGardenId(),
			gradeId, this.selectParams.classId).subscribe(data => {
				this.subjectList = data;
				this.selectParams.subjectCode = this.selectParams.subjectCode || (data[0] ? data[0].id : '');
				this.getEditionList(this.selectParams.gradeCode, this.selectParams.subjectCode);
			});
	}

	getEditionList(gradeCode, subjectCode) {
		this.editionService.getEditionList(gradeCode, subjectCode).subscribe(data => {
			this.editionList = data;
			this.selectParams.semesterCode = this.selectParams.semesterCode || (data[0] ? data[0].id : '');
			this.getOutlineList();
		});
	}

	getGradeList() {
		this.organizationInterface.getGradeList(this.accountService.getAccountId(), this.accountService.getCurrentGardenId()).subscribe(data => {
			this.gradeList = data;
			// TODO 修改
			if ((this.selectParams.gradeCode == null || this.selectParams.gradeCode === '') &&
				(this.selectParams.gradeId == null || this.selectParams.gradeId === '')) {
				this.selectParams.gradeCode = this.selectParams.gradeCode || data[0].gradeCode;
			}

			for (const grade of data) {
				if (grade.gradeCode == this.selectParams.gradeCode) {
					this.getSubjectListByGradeId(grade.id);
				}
				if (grade.id == this.selectParams.gradeId) {
					this.selectParams.gradeCode = grade.gradeCode;
					this.getSubjectListByGradeId(grade.id);
				}
			}

		});
	}

	changeGrade(event, key) {
		if (!event && this.outlineParams.gradeCode !== key) {
			this.selectParams.gradeCode = key;
			this.selectParams.subjectCode = null;
			this.selectParams.semesterCode = null;
			const code = this.gradeList.find(item => item.gradeCode === key).id;
			this.getSubjectListByGradeId(code);
		}
	}

	changeSubject(event, key) {
		if (!event && this.outlineParams.subjectCode !== key) {
			this.selectParams.semesterCode = null;
			this.getEditionList(this.selectParams.gradeCode, key);
		}
	}

	changeEdition(event, key) {
		if (!event && this.outlineParams.semesterCode !== key) {
			this.getOutlineList();
		}
	}

	onSearch(evt) {
		// this.treeData = [];
		this.selectParams.title = evt;
		if (this.inputTimer) {
			window.clearTimeout(this.inputTimer);
			this.inputTimer = setTimeout(() => {
				this.checkList = Object.assign([], this.checkAry);
				this.openNodeList = Object.assign([], this.openList);
				this.selectParams.title = this.selectParams.title.substring(0, 40);
				this.getOutlineList();
			}, 500);
		} else {
			this.inputTimer = setTimeout(() => {
				this.checkList = Object.assign([], this.checkAry);
				this.openNodeList = Object.assign([], this.openList);
				this.selectParams.title = this.selectParams.title.substring(0, 40);
				this.getOutlineList();
			}, 500);
		}
	}

	sure() {
		this.subject.next({
			data: {
				checkAry: this.checkAry,
				openList: this.openList
			}
		});
		this.subject.destroy('onOk');
	}

	cancel() {
		this.subject.destroy('onCancel');
	}

	checkClick($event) {
		if ($event.type == 0) {
			// 选中
			if ($event.isHave && !$event.data.checkStatus) {
				this.checkAry = this.deleteLi($event.data, this.checkAry);
			} else {
				this.checkAry.push($event.data);
			}
		} else {
			// 展开
			if ($event.isHave && !$event.data.status) {
				this.openList = this.deleteLi($event.data, this.openList);
			} else {
				this.openList.push($event.data);
			}

		}
	}

	deleteLi(td, ary) {
		const newAry = [];
		for (let i = 0; i < ary.length; i++) {
			if (ary[i].id !== td.id) {
				newAry.push(ary[i]);
			}
		}
		return newAry;
	}

	removeLi(td) {
		this.checkAry = this.deleteLi(td, this.checkAry);
	}

	// 获得章节
	getOutlineList() {
		this.treeDataLoadComplete = false;
		this.exercisesService.getOutlineList(Object.assign(this.outlineParams, this.selectParams,{gardenId: this.accountService.getCurrentGardenId})).subscribe(data => {
			data = data == null ? [] : data;
			this.treeData = data;
			// console.log(this.treeDataLoadComplete, 'getOutlineList', this.treeData);

			setTimeout(() => {
				this.treeDataLoadComplete = true;
			},500)
			this.title = this.selectParams.title;
			this.openList = Object.assign([], this.openNodeList);
		});
	}
}