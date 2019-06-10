import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ExercisesInterface} from '../../../../services/exercises/exercises.interface';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {OrganizationInterface} from '../../../../services/organization/organization.interface';
import {EditionService} from '../../../../services/edition/edition.service';
import {ExercisesService} from '../../../../services/exercises/exercises.service';
import {LwStorageService} from '../../../../common/cache';
import {Router} from '@angular/router';

@Component({
	templateUrl: 'exercise-class.component.html',
	styleUrls: ['exercise-class.component.scss'],
})

export class ExerciseClassComponent implements OnInit, OnDestroy {
	@ViewChild('designCodeTep') designCodeTep;
	tabList = [
		{name: '已分类', designStatus: 1},
		{name: '未分类', designStatus: 0}
	];
	selectParams;
	outlineParams;

	currentTab = 0;
	questionDesignList: { code?: string, name: string; fontTone: string; backgroundTone: string }[] = [];
	questionTypeList = [];
	questionDesignCode: string;
	allChecked: boolean;
	exerciseList = [];
	selectExerciseIds = [];
	outlineIds = [];
	exerciseType = '';

	constructor(private exercisesInterface: ExercisesInterface,
				private modalService: NzModalService,
				private organizationInterface: OrganizationInterface,
				private editionService: EditionService,
				private exercisesService: ExercisesService,
				private messageService: NzMessageService,
				private rouer: Router,
				private storageService: LwStorageService) {

	}

	ngOnInit() {
		this.getOutlineDictionaryCache();
		this.getExerciseDesign();
	}

	/**
	 * 左侧大纲节点变化
	 * @param event
	 */
	onChange(event) {
		this.exerciseType = '';
		this.currentTab = 0;
		this.clearCheckedStatus();
		this.outlineParams = event.outlineParams ? event.outlineParams[0] : null;
		this.selectParams = event.selectParams;
		if (this.outlineParams && this.selectParams) {
			this.getExerciseList();
			this.getTypeListByCondition();
		}
	}

	ngOnDestroy(): void {
		if (this.outlineParams) {
			this.setOutlineIdsCache(this.outlineParams);
		}
	}

	setOutlineIdsCache(event) {
		let params;
		const doms = document.querySelectorAll('.ant-collapse-header[aria-expanded=true]');
		const str = [];
		for (let i = 0; i < doms.length; i++) {
			str.push(doms[i].children[1].getAttribute('id'));
		}
		params = {
			rootId: event.rootId,
			outlineIds: str.join(','),
			outlineId: event.id,
			resource: 'exercise'
		};
		this.organizationInterface.setClickOutlineId(params).subscribe((res) => {
			console.log(res);
		});
	}

	/**
	 * 清除选中的状态
	 */
	private clearCheckedStatus() {
		this.selectExerciseIds = [];
		this.allChecked = false;
	}

	/**
	 * 切换Tab页 已分类/未分类
	 * @param event
	 */
	tabChange(event) {
		this.exerciseType = '';
		this.currentTab = event.index;
		if (this.questionTypeList.length > 0) {
			this.getExerciseList({
				designStatus: this.tabList[this.currentTab].designStatus,
				typeCode: this.questionTypeList[0].code
			});
			this.setExerciseTypeList(this.questionTypeList[0]);
		}
		this.clearCheckedStatus();
	}

	/**
	 * 查看答案
	 */
	showAnswer(exerciseCurr) {
		if (exerciseCurr.showAnswer) {
			exerciseCurr.showAnswer = false;
		} else {
			for (const exerciseItem of this.exerciseList) {
				exerciseItem.exercise.content.showAnswer = false;
			}
			exerciseCurr.showAnswer = true;
		}
	}

	/**
	 * 获取设计标签
	 */
	getExerciseDesign() {
		this.exercisesInterface.getExerciseDesign().subscribe((data) => {
			this.questionDesignList = data;
		});
	}

	/**
	 * 设置题目设计类型
	 */
	setDesignCode(item?) {
		this.questionDesignCode = this.questionDesignList[0].code;
		this.modalService.open({
			width: 400,
			content: this.designCodeTep,
			maskClosable: false,
			onOk: () => {
				this.saveDesignCode(item);
			}
		});
	}

	/**
	 * 保存题目设计类型
	 */
	saveDesignCode(item?) {
		const params = {
			ids: item ? [item.id] : this.selectExerciseIds,
			designCode: this.questionDesignCode
		};
		this.exercisesInterface.setExerciseDesign(params).subscribe(() => {
			this.getExerciseList({designStatus: this.tabList[1].designStatus});
			this.clearCheckedStatus();
		});
	}

	/**
	 * 选题
	 */
	checkedExercise() {
		this.clearCheckedStatus();
		for (const exercise of this.exerciseList) {
			if (exercise.checked === true) {
				this.selectExerciseIds.push(exercise.id);
			}
		}
		if (this.selectExerciseIds.length === this.exerciseList.length) {
			this.allChecked = true;
		}
	}

	/**
	 * 全选
	 */
	checkedAllExercise(event) {
		this.allChecked = true;
		this.selectExerciseIds = [];
		for (const exercise of this.exerciseList) {
			exercise.checked = event;
			if (exercise.checked === true) {
				this.selectExerciseIds.push(exercise.id);
			}
		}
	}

	/**
	 * 获取题型列表
	 */
	getTypeListByCondition() {
		this.exercisesInterface.getTypeListByCondition(this.selectParams).subscribe((data) => {
			this.questionTypeList = data;
			this.questionTypeList.unshift({name: '全部', code: '', active: true});
		});
	}

	/**
	 * 根据题型获取习题列表
	 * @param type
	 */
	getExerciseListByType(type) {
		this.exerciseType = type.code;
		this.clearCheckedStatus();
		this.setExerciseTypeList(type);
		this.getExerciseList({typeCode: type.code});
	}

	/**
	 * 设置题型列表的状态
	 * @param type
	 */
	setExerciseTypeList(type) {
		for (const questionType of this.questionTypeList) {
			questionType.active = false;
		}
		type.active = true;
	}

	/**
	 * 获取习题列表
	 */
	getExerciseList(selectParam?) {
		const defaultParam = {
			outlineId: this.outlineParams.id,
			gardenId: this.storageService.get('user').gardens[0].gardenId,
			typeCode: '',
			designStatus: this.tabList[this.currentTab].designStatus,
			offset: '',
			size: '',
		};
		const params = Object.assign(defaultParam, selectParam);
		this.exercisesInterface.getExerciseList(params).subscribe((data) => {
			this.exerciseList = data;
			console.log(data);

		});
	}

	/**
	 * 移出习题
	 */
	delExercise(id) {
		this.exercisesInterface.delExercise({id: id}).subscribe((data) => {
			this.messageService.success('移出成功！');
			this.getExerciseList();
			this.clearCheckedStatus();
		});
	}

	/**
	 * 进入校本题库
	 */
	goLibrary() {
		if (this.selectParams) {
			this.rouer.navigate(['/exercises/library'], {
				queryParams: {
					gradeCode: this.selectParams.gradeCode,
					subjectCode: this.selectParams.subjectCode,
					semesterCode: this.selectParams.semesterCode,
					outlineId: this.outlineParams.id
				}
			});
		}
	}

	/**
	 * 查询缓存记录
	 */
	getOutlineDictionaryCache() {
		this.organizationInterface.getOutlineDictionaryCache('exercise').subscribe((data) => {
			this.selectParams = data;
		});
	}
}
