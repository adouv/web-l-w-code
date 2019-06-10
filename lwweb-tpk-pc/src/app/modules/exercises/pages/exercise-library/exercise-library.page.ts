import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectChapterComponent} from '../../components/select-chapter/select-chapter';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ExercisesInterface} from '../../../../services/exercises/exercises.interface';
import {QuestionListParams} from '../../../../services/exercises/exercises.model';
import {LwStorageService} from '../../../../common/cache';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../services/account';
@Component({
	templateUrl: 'exercise-library.page.html',
	styleUrls: ['exercise-library.page.scss'],
})

export class ExerciseLibraryPage implements OnInit {

	searchType = 0;
	selectMode = 0;
	questionTypeList = [];
	questionList = [];
	outlineIds = [];
	exerciseIds = [];
	checkedExerciseIds = [];
	outlineExerciseIds = [];
	outlineName: string;
	typeCode = '';
	keyword = '';
	offset = 0;
	totalCount = 0;
	questionInfo = {};
	selectParams: any = {};
	initSelectParams: any = {};
	outlineParams = [];
	pageNo: string | number;
	tabIndex = 0;
	exerciseTotal = 0;
	isFromAdd: boolean;
	lessonId: any;
	lessonStage: any;
	lessonDate: any;
	classId: any;
	gradeId: any;
	selectedGarden: any;
	selectedYear: any;
	selectedSemester: any;
	selectedWeek: any;
	isloadComplete = false;
	constructor(private modalService: NzModalService,
				private storageService: LwStorageService,
				private messageService: NzMessageService,
				private activatedRoute: ActivatedRoute,
				private router: Router,
				private accountService: AccountService,
				private exercisesInterface: ExercisesInterface) {
		this.pageNo = 1;
		this.isFromAdd = false;
		this.initParams();
		this.getTypeListByCondition();
		this.getExerciseTotal();
		// this.getQuestionList(0);
	}

	ngOnInit(): void {
	}

	initParams() {
		this.activatedRoute.queryParams.subscribe(params => {
			this.initSelectParams.gradeCode = params.gradeCode;
			this.initSelectParams.subjectCode = params.subjectCode;
			this.initSelectParams.semesterCode = params.semesterCode;
			this.initSelectParams.classId = params.classId;
			const outlineId = params.outlineId ? params.outlineId : '';
			this.selectParams.gradeCode = params.gradeCode;
			this.selectParams.semesterCode = params.semesterCode;
			this.selectParams.subjectCode = params.subjectCode;
			this.selectParams.gradeCode = params.gradeCode;
			this.selectParams.classId = params.classId;
			this.lessonId = params.lessonId;
			this.lessonDate = params.lessonDate;
			this.lessonStage = params.lessonStage;
			this.classId = params.classId;
			this.gradeId = params.gradeId;
			this.typeCode = '';
			this.initSelectParams.single = true;
			this.outlineExerciseIds = [];
			this.selectedGarden = params.selectedGarden;
			this.selectedYear = params.selectedYear;
			this.selectedSemester = params.selectedSemester;
			this.selectedWeek = params.selectedWeek;
			if (params.tabIndex == null || params.tabIndex == '') {
				this.outlineExerciseIds.push(outlineId);
			}else{
				this.isFromAdd = true;
				// this.getExerciseIds(0, '');
			}
			this.getExerciseIds(0, '');
		});
	}

	/**
	 * 切换Tab页 章节/知识点
	 * @param event
	 */
	tabChange(event) {
		// this.initParams();
		this.tabIndex = event.index;
		this.outlineParams = [];
		this.outlineIds = [];
		this.outlineName = '';
		this.totalCount = 0;
		this.questionList = [];
		this.isFromAdd = false;
		this.keyword = '';
		this.checkedExerciseIds = [];
		this.selectMode = event.index;
		this.getExerciseIds(0, '');
	}

	// input搜索
	searchQuestionList(evt) {
		this.keyword = evt.trim();
		if (this.searchType === 1) {
			this.getExerciseIds(0, '');
		} else {
			this.getExerciseIds(0);
		}
		/*if (this.keyword !== '' || this.keyword !== undefined) {
			this.keyword = this.keyword && this.keyword.trim();
			this.checkedExerciseIds = [];
			if (this.searchType === 1 && this.keyword) {
				this.getExerciseIds(0, '');
			} else {
				this.getExerciseIds(0);
			}
		}*/
	}

	changeKeyword() {
		if (this.keyword.length > 40) {
			this.keyword = this.keyword.substr(0, 40);
		}
	}

	/**
	 * 切换右侧题型的类型
	 * @param code
	 */
	changeQuestionType(code) {
		this.typeCode = code;
		if (this.searchType === 1 && this.keyword) {
			this.getExerciseIds(0, '');
		} else {
			this.getExerciseIds(0);
		}
		this.checkedExerciseIds = [];
	}

	removeKnowledge(index) {
		this.outlineParams.splice(index, 1);
		this.outlineIds.splice(index, 1);
		// this.outlineIds = [];
		this.getExerciseIds(0);
	}

	outlineChange(event) {
		console.log(this.isFromAdd);
		if (event.outlineParams && event.outlineParams.length > 0) {
			if (event.outlineParams !== this.outlineParams ||
				event.selectParams !== this.selectParams) {
				this.onSingleChange(event);
			}
		} else if(!this.isFromAdd){
			// this.questionList = [];
			this.outlineParams = event.outlineParams;
			this.selectParams = event.selectParams;
		}else{
			// this.isFromAdd = false;
		}
	}

	knowledgeChange(event) {
		if (event) {
			this.questionList = [];
			if (event.selectParams.single) {
				this.onSingleChange(event);
			} else {
				this.onMultiChange(event);
			}
		}
	}

	/**
	 * 根据左侧大纲节点变化 渲染右侧题型列表
	 * @param event
	 */
	onSingleChange(event) {
		// 题型默认选中第一个 搜索类型默认选中第一种
		this.typeCode = this.questionTypeList[0].code;
		this.searchType = 0;
		this.outlineParams = event.outlineParams;
		this.selectParams = event.selectParams;
		this.outlineIds = [];
		this.keyword = '';
		this.pageNo = 1;
		if (this.selectParams) {
			this.outlineIds = this.outlineParams && this.outlineParams[0] ? this.outlineParams[0].id : [];
			this.getExerciseIds(0);
		}
	}

	onMultiChange(event) {
		this.typeCode = this.questionTypeList[0].code;
		this.searchType = 0;
		this.selectMode = 2;
		this.outlineParams = event.outlineParams;
		this.selectParams = event.selectParams;
		this.outlineIds = [];
		this.keyword = '';
		if (this.selectParams && this.outlineParams) {
			for (const data of this.outlineParams) {
				this.outlineIds.push(data.id);
			}
			this.getExerciseIds(0);
		}
	}

	// 切换右侧--章节/知识点单选框 获取试题列表
	changeType(event) {
		this.keyword = '';
		this.getExerciseIds(0);
	}

	/**
	 * 获取题型列表
	 */
	getTypeListByCondition() {
		this.exercisesInterface.getTypeListByCondition(this.initSelectParams).subscribe(data => {
			this.questionTypeList = data;
			this.questionTypeList.unshift({name: '全部', code: ''});
		});
	}

	/**
	 * 获取章节下所有已备习题支持题型条件 ids
	 *
	 */
	getExerciseIds(offset, outlineIds?) {
		const params = {
			lessonId: this.lessonId,
			lessonStage: this.lessonStage,
			date: this.lessonDate,
			designStatus: null,
			typeCode: null
		};
		this.exercisesInterface.getExistExerciseByMaterial(params).subscribe(data => {
			this.exerciseIds = data;
			this.getQuestionList(offset, outlineIds);
		});
	}

	/**
	 * 获取右侧试题列表
	 */
	getQuestionList(offset, outlineIds?) {
		this.isloadComplete = false;
		this.questionList = [];
		const currentOutlineId = typeof this.outlineIds === 'string' ? this.outlineIds : this.outlineIds.join(',');
		outlineIds = !this.searchType ? currentOutlineId : '';
		const params = {
			selectMode: this.selectMode,
			subjectCode: this.selectParams.subjectCode,
			gradeCode: this.selectParams.gradeCode,
			pointIds: this.selectMode !== 0 ? outlineIds : null,
			outlineIds: this.selectMode === 0 ? outlineIds : null,
			typeCode: this.typeCode,
			level: '',
			keyword: this.keyword,
			offset: offset || 0,
			size: 10,
			gardenId: this.accountService.getAccountId,
		};
		this.exercisesInterface.getQuestionList(params).subscribe(res => {
			this.totalCount = parseInt(res.totalCount, 0);
			this.isloadComplete = true;
			this.questionList = res.data && res.data.map(item => {
					if (this.checkedExerciseIds.includes(item.id)) {
						item.checked = true;
					}
					return item;
				});
		});
	}

	/**
	 * 分页
	 * @param event
	 */
	onPageChangedQuestion(event) {
		if (this.pageNo !== event) {
			this.pageNo = event;
			this.offset = (event - 1) * 10;
			this.getExerciseIds(this.offset);
		}
	}

	onSelectCheckbox(event, data) {
		const checkIndex = this.checkedExerciseIds.indexOf(data.id);
		if (checkIndex < 0) {
			this.checkedExerciseIds.push(data.id);
		} else {
			this.checkedExerciseIds.splice(checkIndex, 1);
		}
	}

	/**
	 * 单个加入课堂
	 */
	addJoinExercise(item) {
		const exerciseIds = [];
		exerciseIds.push(item.id);
		const params = {
			lessonId: this.lessonId,
			lessonStage: this.lessonStage,
			date: this.lessonDate,
			gardenId: this.storageService.getCurrentGarden().gardenId,
			exerciseIds: exerciseIds
		};
		// this.exercisesInterface.addJoinClass(params).subscribe(data => {
		// 	this.messageService.success('加入课堂成功！');
		// 	const index = this.checkedExerciseIds.indexOf(item.id);
		// 	this.checkedExerciseIds.splice(index, 1);
		// 	this.getExerciseIds(this.offset);
		// 	this.getExerciseTotal();
		// });
		this.exercisesInterface.addJoinClassByLesson(params).subscribe(data => {
			this.messageService.success('加入课堂成功！');
			const index = this.checkedExerciseIds.indexOf(item.id);
			this.checkedExerciseIds.splice(index, 1);
			this.getExerciseIds(this.offset);
			this.getExerciseTotal();
		})
	}

	/**
	 * 批量加入课堂
	 */
	checkedAllExercise() {
		if (this.checkedExerciseIds.length > 0) {
			const params = {
				lessonId: this.lessonId,
				lessonStage: this.lessonStage,
				date: this.lessonDate,
				gardenId: this.storageService.getCurrentGarden().gardenId,
				exerciseIds: this.checkedExerciseIds
			};
			// this.exercisesInterface.addJoinClass(params).subscribe(data => {
			// 	this.messageService.success('加入课堂成功！');
			// 	this.getExerciseIds(this.offset);
			// 	this.getExerciseTotal();
			// 	this.checkedExerciseIds = [];
			// });
			this.exercisesInterface.addJoinClassByLesson(params).subscribe(data => {
				this.messageService.success('加入课堂成功！');
				this.getExerciseIds(this.offset);
				this.getExerciseTotal();
				this.checkedExerciseIds = [];
			})
		}
	}

	/**
	 * 移除课堂
	 * @param data
	 * @param index
	 */
	removeExercise(data, index) {
		// const params = {
		// 	outlineId: this.outlineExerciseIds.join(','),
		// 	exerciseId: data.id,
		// 	gardenId: this.storageService.get('user').gardens[0].gardenId,
		// };
		this.exercisesInterface.delExerciseByMaterial({
			lessonId: this.lessonId,
			lessonStage: this.lessonStage,
			date: this.lessonDate,
			exerciseIds:  data.id,
		}).subscribe(res => {
			this.messageService.success('移出成功！');
			this.getExerciseIds(this.offset);
			this.getExerciseTotal();
		});
	}

	// 显示习题详解
	showExerciseInfo(data) {
		this.exercisesInterface.getQuestionInfo(data.id).subscribe(res => {
			if (data.showInfo) {
				data.showInfo = false;
			} else {
				for (const questionItem of this.questionList) {
					questionItem.showInfo = false;
				}
				data.showInfo = true;
			}
			this.questionInfo = res;
		});
	}

	removeOutline() {
		this.outlineParams = [];
		this.totalCount = 0;
		this.questionList = [];
		this.outlineIds = [];
		this.getExerciseIds(0);
	}

	goback() {
		// this.router.navigate(['/exercises/class']);
		this.router.navigate(['/course/prepare', this.lessonId, this.lessonDate], {
			queryParams: {
				selectedClass: this.classId,
				subjectCode: this.selectParams.subjectCode,
				gradeId: this.gradeId,
				selectedGarden: this.selectedGarden,
				selectedYear: this.selectedYear,
				selectedSemester: this.selectedSemester,
				selectedWeek: this.selectedWeek,
			}
		});
	}

	/**
	 * 获取已备题总数
	 */
	getExerciseTotal() {
		this.exercisesInterface.getExerciseTotalByMaterial({
			lessonId: this.lessonId,
			lessonStage: this.lessonStage,
			date: this.lessonDate,
			designStatus: null,
			typeCode: null,
		}).subscribe(res => {
			this.exerciseTotal = res;
		});
	}

	// 加入课堂章节弹窗
	selectChapterDialog() {
		this.modalService.open({
			title: '章节绑定',
			content: SelectChapterComponent,
			width: 800,
			class: 'select-chaper',
			footer: false,
			maskClosable: false,
			onCancel: () => {

			},
			componentParams: {}
		});
	}

	// 新建习题
	addQuestion() {
		this.router.navigate(['/exercises/add'], {
			queryParams: {
				gradeCode: this.selectParams.gradeCode,
				subjectCode: this.selectParams.subjectCode,
				semesterCode: this.selectParams.semesterCode,
				// outlineId: this.initSelectParams.outlineId,
				classId: this.classId,
				lessonId: this.lessonId,
				lessonDate: this.lessonDate,
				lessonStage: this.lessonStage,
				gradeId: this.gradeId,
				tabIndex: this.tabIndex,
				typeCode: this.typeCode,
				selectedGarden: this.selectedGarden,
				selectedYear: this.selectedYear,
				selectedSemester: this.selectedSemester,
				selectedWeek: this.selectedWeek,
				selectedClass: this.classId
			}
		});
	}
}
