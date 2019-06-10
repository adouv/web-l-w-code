import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import {OrganizationInterface} from '../../../../services/organization/organization.interface';
import {KnowledgeService} from '../../../../services/knowledge/knowledge.service';
import {AccountService} from '../../../../services/account';
import {CollapseTreeService, TreeAction, TreeType} from '../../../../components/collapse-tree/collapse-tree.service';

@Component({
	selector: 'knowledge-tree',
	templateUrl: 'knowledge-tree.component.html',
	styleUrls: ['knowledge-tree.component.scss']
})

export class KnowledgeTreeComponent implements OnChanges,OnDestroy {

	gradeList = [];
	subjectList = [];
	knowledgeList = [];
	isloadComplete = false;
	@Input() classId: string;
	@Input() selectedNodes: any = [];
	@Input()
	selectParams: { single: boolean; subjectCode?: string; gradeCode?: string } = {
		single: true,
		subjectCode: '',
		gradeCode: ''
	};
	@Input()
	optionDisable;
	params: any = {};
	@Output() change = new EventEmitter();

	treeType = TreeType.KNOWLEDGE_TREE;

	selectedNode$ = this.collapseTreeService.getSubject(this.treeType);
	subjectNode: any;
	constructor(private organizationInterface: OrganizationInterface,
				private accountService: AccountService,
				private collapseTreeService: CollapseTreeService,
				private knowledgeService: KnowledgeService) {
		this.onChangeTree();
	}

	ngOnDestroy() {
		this.subjectNode.unsubscribe();
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.selectedNodes&&changes.selectedNodes.previousValue !== changes.selectedNodes.currentValue) {
			this.selectedNode$.action({type: TreeAction.ASSIGN, item: this.selectedNodes});
		}
		if (changes.classId&&changes.classId.previousValue === undefined &&
			changes.classId.previousValue !== changes.classId.currentValue) {
			this.isloadComplete = false;
			this.getGradeList();
		}
	}

	onChangeTree() {
		this.subjectNode = this.selectedNode$.change().subscribe(data => {
			if (this.selectParams.single && (!data || data.length === 0)) {
				return;
			}
			this.change.emit({
				outlineParams: data,
				selectParams: this.selectParams
			});
		});
	}

	getGradeList() {
		this.organizationInterface.getGradeList(this.accountService.getAccountId(), this.accountService.getCurrentGardenId()).subscribe(data => {
			this.gradeList = data;
			this.selectParams.gradeCode = this.selectParams.gradeCode || data[0].gradeCode;
			for (const grade of data) {
				if (grade.gradeCode === this.selectParams.gradeCode) {
					this.getSubjectListByGradeId(data[0].id);
				}
			}
		});
	}

	getSubjectListByGradeId(gradeId) {
		this.organizationInterface.getSubjectListByGradeId(this.accountService.getGardenId(), gradeId, this.classId).subscribe(data => {
			this.subjectList = data;
			this.selectParams.subjectCode = this.selectParams.subjectCode || (data[0] ? data[0].id : '');
			this.getKnowledgeList(this.selectParams.gradeCode, this.selectParams.subjectCode);
		});
	}

	getKnowledgeList(gradeCode, subjectCode) {
		this.params = {gradeCode, subjectCode};
		this.isloadComplete = false;
		this.knowledgeService.getKnowledgeList(gradeCode, subjectCode).subscribe(data => {
			this.isloadComplete = true;
			this.knowledgeList = data;
		});
	}

	changeGrade(event, key) {
		if (!event && this.params.gradeCode !== this.selectParams.gradeCode) {
			this.selectParams.gradeCode = key;
			this.selectParams.subjectCode = null;
			const code = this.gradeList.find(item => item.gradeCode === key).id;
			this.getSubjectListByGradeId(code);
		}
	}

	changeSubject(event, key) {
		if (!event && this.params.subjectCode !== key) {
			this.getKnowledgeList(this.selectParams.gradeCode, key);
			this.change.emit({
				outlineParams: null,
				selectParams: this.selectParams
			});
		}
	}

	toggleModel() {
		this.selectParams.single = !this.selectParams.single;
		this.selectedNode$.action({type: TreeAction.ASSIGN, item: []});
		this.change.emit({
			outlineParams: [],
			selectParams: this.selectParams
		});
	}

}
