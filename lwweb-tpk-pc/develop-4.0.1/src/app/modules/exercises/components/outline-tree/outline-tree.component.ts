import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ExercisesService} from '../../../../services/exercises/exercises.service';
import {OrganizationInterface} from '../../../../services/organization/organization.interface';
import {EditionService} from '../../../../services/edition/edition.service';
import {OutlineParams} from '../../../../services/exercises/exercises.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../services/account';
import {CollapseTreeService, TreeAction, TreeType} from '../../../../components/collapse-tree/collapse-tree.service';

@Component({
	selector: 'outline-tree',
	templateUrl: 'outline-tree.component.html',
	styleUrls: ['outline-tree.component.scss']
})

export class OutlineTreeComponent implements OnChanges {

	outlineNodes = [];

	gradeList = [];

	subjectList = [];

	editionList = [];
	isLoadComplete = false;
	@Input() selectedNodes = [];

	@Input()
	selectParams: { gradeCode?: string; subjectCode?: string; semesterCode?: string, title?: string; gradeId?: string, classId?: string } = {};

	@Input()
	optionDisable;

	outlineParams: OutlineParams = {gradeCode: '', subjectCode: '', semesterCode: '', resource: 'exercise',};
	@Output() change = new EventEmitter();

	@Output() changeCollapse = new EventEmitter();

	@Input() clickId;

	treeType = TreeType.OUTLINE_TREE;

	selectedNode$ = this.collapseTreeService.getSubject(this.treeType);

	constructor(private exercisesService: ExercisesService,
				private editionService: EditionService,
				private activatedRoute: ActivatedRoute,
				private collapseTreeService: CollapseTreeService,
				private accountService: AccountService,
				private organizationInterface: OrganizationInterface,
				private router: Router) {
		this.onChangeTree();
		this.getGradeList();
	}

	getOutlineList(outlineParams) {
		// 解决校本题库和随堂习大纲同步的问题
		if (this.router.url.indexOf('library') > -1) {
			this.outlineParams.resource = 'bank';
		}
		this.isLoadComplete = false;
		outlineParams = Object.assign({}, {gardenId: this.accountService.getCurrentGardenId})
		this.exercisesService.getOutlineList(outlineParams).subscribe(data => {
			this.outlineNodes = data;
			this.isLoadComplete = true;
			this.selectedNode$.action({type: TreeAction.ASSIGN, item: []});
			// if (this.router.url.indexOf('class') > -1 && data && data[0]) {
			// 	this.getClickOutlineId(data[0]);
			// }
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.selectedNodes && changes.selectedNodes.previousValue !== changes.selectedNodes.currentValue) {
			this.selectedNode$.action({type: TreeAction.ASSIGN, item: this.selectedNodes});
		}
	}

	onChangeTree() {
		this.selectedNode$.change().subscribe(data => {
			this.selectedNodes = data;
			this.change.emit({
				outlineParams: data,
				selectParams: this.selectParams
			});
		});
	}

	getGradeList() {
		this.organizationInterface.getGradeList(this.accountService.getAccountId(), this.accountService.getCurrentGardenId()).subscribe(data => {
			this.gradeList = data;
			// TODO 修改
			this.selectParams.gradeCode = this.selectParams.gradeCode || data[0].gradeCode;
			for (const grade of data) {
				if (grade.gradeCode === this.selectParams.gradeCode) {
					this.getSubjectListByGradeId(grade.id);
				}
			}
		});
	}

	getSubjectListByGradeId(gradeId) {
		this.organizationInterface.getSubjectListByGradeId(
			this.accountService.getCurrentGardenId(),
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
			// this.change.emit({
			// 	outlineParams: [],
			// 	selectParams: this.selectParams
			// });
			this.getOutlineList(Object.assign(this.outlineParams, this.selectParams));
		});
	}

	changeGrade(event, key) {
		if (!event && this.outlineParams.gradeCode !== key) {
			this.selectParams.gradeCode = key;
			this.selectParams.subjectCode = null;
			this.selectParams.semesterCode = null;
			const code = this.gradeList.find(item => item.gradeCode === key).id;
			this.getSubjectListByGradeId(code);
			// this.change.emit({
			// 	outlineParams: [],
			// 	selectParams: this.selectParams
			// });
		}
	}

	changeSubject(event, key) {
		if (!event && this.outlineParams.subjectCode !== key) {
			this.selectParams.semesterCode = null;
			this.getEditionList(this.selectParams.gradeCode, key);
			// this.change.emit({
			// 	outlineParams: [],
			// 	selectParams: this.selectParams
			// });
		}
	}

	changeEdition(event, key) {
		if (!event && this.outlineParams.semesterCode !== key) {
			this.getOutlineList(Object.assign(this.outlineParams, this.selectParams));
			this.selectedNode$.action({type: TreeAction.ASSIGN, item: []});
			// this.change.emit({
			// 	outlineParams: null,
			// 	selectParams: this.selectParams
			// });
		}
	}

	getClickOutlineId(data) {
		this.organizationInterface.getClickOutlineId({
			rootOutlineId: data.rootId,
			resource: this.outlineParams.resource
		}).subscribe((res) => {
			this.clickId = res.clickOutlineId ? res.clickOutlineId : data.id;
		});
	}

}
