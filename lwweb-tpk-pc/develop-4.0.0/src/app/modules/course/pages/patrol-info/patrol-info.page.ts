import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseMaterialService } from '../../services/material/CourseMaterialService';
import { ResourceClassesInterface } from '../../../../services/resource/resource-classes.interface';
import { CourseInterface } from '../../services/course.interface';
import { DateToWeekPipe } from '../../../../pipes/date/dateToWeek';
import { CoursewareHeaderComponent } from '../../components/courseware-header/courseware-header.component';
import { OrganizationInterface } from '../../../../services/organization/organization.interface';
import { ExercisesInterface } from '../../../../services/exercises/exercises.interface';
import { ExercisesGroupComponent } from '../../../../components/exercises-group/exercises-group.component';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { SelectCourseChapterComponent } from '../../components/select-chapter/select-chapter';
import { DialogTimetableComponent } from '../../components/dialog-timetable/dialog-timetable.component';

@Component({
	templateUrl: 'patrol-info.page.html',
	styleUrls: ['./patrol-info.page.scss']
})
export class PatrolInfoPage implements OnInit {
	materialFileNames = [];
	// resourceList = [];
	coursewareList = [];
	teachingPlanList = [];
	activityMaterialList = [];
	checkOutLineList = [];
	checkClassList = [];
	leftTab = [];
	selectExerciseIds = [];
	questionTypeList = [];
	list = [];
	openOutLineList = [];
	lessonTypes = [];
	options: any;
	lessonId: any;
	lessonDate: any;
	lessolessonDateId: any;
	selectedGarden: any;
	selectedYear: any;
	selectedSemester: any;
	selectedWeek: any;
	subjectCode: string;
	gradeId: string;
	semesterCode: string;
	classId: string;
	verificationFrom: any;
	courseMaterial: any;
	classAllName: string;
	designStatus = 1;
	selectTabset = 1;
	exerciseType: string;
	resourceListLoadComplete = false;
	listLoadComplete = false;
	allChecked = false;
	isForce = false;
	isUploadCompelte = true;
	isHaveTeachingPlan = false;
	current = 0;
	isDownload = false;
	isHaveContent = false;
	isHaveExercises = false;
	@ViewChild(ExercisesGroupComponent) exercisesGroup;
	@ViewChild(CoursewareHeaderComponent) coursewareHeader;
	@ViewChild('modalContent') modalContent;
	@Input() outlineId: any;
	@Input() courseTitle: any;
	@Input() gradeCode: any;
	exercisesCardConfig: any;
	detailsData: any;
	showDetails: boolean;
	detailsType: any;
	isSingle: boolean; // 是否是单点
	checkedAll: boolean;
	tabIndex: number;


	constructor(
		private resourceClassesInterface: ResourceClassesInterface,
		private activedRoute: ActivatedRoute,
		private courseMaterialService: CourseMaterialService,
		private courseInterface: CourseInterface,
		private exercisesInterface: ExercisesInterface,
		private organizationInterface: OrganizationInterface,
		private router: Router,
		private dialogService: DialogService
	) {
		this.exercisesCardConfig = {};
		this.detailsData = [];
		this.showDetails = false;
		this.isSingle = true;
		this.checkedAll = false;

		this.options = {};
		this.verificationFrom = {};
		this.courseMaterial = {};
		//this.options.design = 'teaching_plan';
		this.options.design = 'courseware';
		this.exerciseType = '';
		this.leftTab = [
			//	{
			// 	code: 'teaching_plan',
			// 	name: '教学设计'
			// }, 
			{
				code: 'courseware',
				name: '教学课件'
			}, {
				code: 'exercise',
				name: '课上练习'
			}, {
				code: 'activity_material',
				name: '活动材料'
			}];
	}

	ngOnInit() {

		this.initialParams();
		// this.getCourseMaterials();
		this.refreshPage();
	}

	changeTab(tab) {
		this.options.design = tab.code;
		this.refreshCoursewareList();
	}

	onUploadSuccess(isCompelte) {
		this.isUploadCompelte = isCompelte;
		this.refreshCoursewareList();
	}

	beforeUpload() {
		this.isUploadCompelte = false;
	}

	nextCourseMaterial() {
		if (!this.isUploadCompelte) {
			this.dialogService.alertError('有文件正在上传');
			return;
		}
		if (!this.isHaveTeachingPlan) {
			this.dialogService.alertError('请上传教学设计');
			return;
		}
		//console.log('next');
		this.current = 1;
	}

	prevtCourseMaterial() {
		this.options.design = 'teaching_plan';
		// this.getCourseMaterials();
		this.current = 0;
	}

	initialParams(): void {
		// this.courseSpace = new CourseSpaceDto(0, 0);
		// this.selectTabset = this.lessonStages[1].code;
		// this.lessonMethod = LESSON_METHOD.COURSEWARE;
		// this.LESSON_METHOD = LESSON_METHOD;
		// this.uploaderDisplayStageName = COURSE_NAME_UPLOAD.UPLOADER_DISPLAY_IN_STAGE;
		this.lessonId = this.activedRoute.snapshot.params['lessonId'];
		this.lessonDate = this.activedRoute.snapshot.params['lessonDate'];
		this.options.lessonId = this.lessonId;
		this.options.lessonDate = this.lessonDate;
		this.activedRoute.queryParams.subscribe(queryParams => {
			this.gradeId = queryParams['gradeId'];
			this.subjectCode = queryParams['subjectCode'];
			this.semesterCode = queryParams['selectedSemester'];
			this.classId = queryParams['selectedClass'];
			this.selectedGarden = queryParams['selectedGarden'];
			this.selectedYear = queryParams['selectedYear'];
			this.selectedSemester = queryParams['selectedSemester'];
			this.selectedWeek = queryParams['selectedWeek'];
			this.tabIndex = queryParams['tabIndex'];

		});

		this.exercisesCardConfig.data = {
			outlineId: this.outlineId,
			subjectCode: this.subjectCode,
			courseTitle: this.courseTitle,
			gradeCode: this.gradeCode
		};
		this.exercisesCardConfig.showExercises = true;
		this.getCourseMaterial();
	}

	getLessonType() {
		this.courseInterface.getLessonType().subscribe((data) => {
			this.lessonTypes = data;
			this.courseMaterial.lessonType = data[0].itemValue;
		});
	}

	getCourseMaterials(type, callback) {
		this.resourceListLoadComplete = false;
		this.courseMaterialService.getCourseMaterials(
			this.lessonId,
			this.lessonDate,
			1,
			type
		).subscribe((data) => {
			if (data) {
				// this.resourceList = data;
				callback(data);
				this.resourceListLoadComplete = true;
				if (this.options.design == 'teaching_plan') {
					this.isHaveTeachingPlan = data.length > 0;
				}
				// this.materialFileNames = [];
				// for (const material of data) {
				// 	this.materialFileNames.push(material.name);
				// }
			}
		});
	}

	checkStatus(event) {
		this.designStatus = event;
		this.exerciseType = '';
		this.setExerciseTypeList(this.questionTypeList[0]);
		this.getExerciseList();
	}

	refreshPage() {
		this.initialParams();
		this.getLessonType();
		// this.setHrefParams();
		this.getTypeListByCondition();
		this.getCourseMaterials('courseware', (data) => {
			this.coursewareList = data;
			if (data.length > 0) {
				this.isHaveContent = true;
			}
		});
		this.getCourseMaterials('teaching_plan', (data) => {
			this.teachingPlanList = data;
			if (data.length > 0) {
				this.isHaveContent = true;
			}
		});
		this.getCourseMaterials('activity_material', (data) => {
			this.activityMaterialList = data;
			if (data.length > 0) {
				this.isHaveContent = true;
			}
		});
		this.designStatus = 0;
		this.getExerciseList(() => {
			this.designStatus = 1;
			this.getExerciseList();
		});

		// this.headerScrollHeight = this.headerScroll.nativeElement.clientHeight + 20;
	}

	refreshList() {
		this.selectExerciseIds = [];
		this.allChecked = false;
		// 刷新习题
		this.getExerciseList();
	}

	// 获得习题列表
	getExerciseList(callback?: Function) {
		this.listLoadComplete = false;
		this.courseInterface.getExerciseList({
			lessonId: this.lessonId,
			lessonStage: this.selectTabset,
			date: this.lessonDate,
			designStatus: this.designStatus,
			typeCode: this.exerciseType
		}).subscribe((data) => {
			this.listLoadComplete = true;
			this.list = data;
			if (data.length > 0) {
				this.isHaveContent = true;
				this.isHaveExercises = true;
			}
			if (callback) callback();
		});
	}

	private getCourseMaterial() {
		// TODO:wuh 在接口返回值中需要扩展两个字段：学期和周次，还需要补上园区字段
		this.courseInterface.getMaterialDetail(this.lessonId, this.lessonDate).subscribe((data) => {
			if (data) {
				this.courseMaterial = data;
				if (this.courseMaterial.lessonType != null && this.courseMaterial.lessonType != '') {
					this.isHaveContent = true;
				}
				if (this.courseMaterial.syncCourseMaterialNames != null && this.courseMaterial.syncCourseMaterialNames != '') {
					this.isHaveContent = true;
				}
				this.checkClassList = data.courseMaterialSyncDtoList == null ? [] : data.courseMaterialSyncDtoList;
				// if (this.courseMaterial.lessonTitle != null && this.courseMaterial.lessonTitle != '') {
				// 	this.isHaveContent = true;
				// 	this.classAllName = this.courseMaterial.lessonTitle;
				// } else {
				const gradeName: string = data.gradeName;
				const className: string = data.className;
				// TODO
				const year: string = this.lessonDate.substr(0, 4) + '年';
				// console.log(data.week);
				const weekName: string = '周' + new DateToWeekPipe().transform(data.week, true);
				const periodName: string = '第' + data.period + '节';
				const lessonName: string = '(' + data.subjectName + ')';
				this.classAllName = gradeName + className + ' ' + weekName + ' ' + periodName + ' ' + lessonName;
				// }
				this.getOutlinePrepare();
			}
		});
	}

	getOutlinePrepare() {
		this.courseInterface.getOutlinePrepare({
			lessonId: this.lessonId,
			date: this.lessonDate
		}).subscribe((data) => {
			this.checkOutLineList = [];
			if (data.length > 0) {
				this.isHaveContent = true;
			}
			data.map((item) => {
				this.outlineId = item.outlineId;
				this.checkOutLineList.push({
					id: item.outlineId,
					name: item.outlineName,
					isSelect: true,
				});
			});
		});
	}

	getDownloadList(data) {
		// this.isDownload = true;
		// console.log('dddddd',data);
		this.coursewareHeader.getDownloadList(data);
	}
	openDownLoadDialog() {
		//console.log(this.coursewareHeader);
		this.coursewareHeader.openDownLoadDialog();
	}
	getShowDownload(evt) {
		this.isDownload = evt;
	}
	refreshCoursewareList() {
		// this.getCourseMaterials();
		this.coursewareHeader.refreshCoursewareList();
	}

	/**
	 * 获取题型列表
	 */
	getTypeListByCondition() {
		this.organizationInterface.getOrganizationById(this.gradeId).subscribe((res) => {
			this.exercisesInterface.getTypeListByCondition({
				gradeCode: res.data.gradeCode,
				subjectCode: this.subjectCode
			}).subscribe((data) => {
				this.questionTypeList = data;
				this.questionTypeList.unshift({ name: '全部', code: '', active: true });
			});
		});
	}

	/**
	 * 全选
	 */
	checkedAllExercise(event) {
		this.allChecked = true;
		this.selectExerciseIds = [];
		for (const exercise of this.list) {
			exercise.checked = event;
			if (exercise.checked === true) {
				this.selectExerciseIds.push(exercise.exerciseId);
			}
		}
	}

	/**
	 * 根据题型获取习题列表
	 * @param type
	 */
	getExerciseListByType(type) {
		// this.allChecked = fasle;
		this.checkedAll = false;
		this.detailsData = [];
		this.selectExerciseIds = [];
		this.exerciseType = type.code;
		this.setExerciseTypeList(type);
		this.getExerciseList();
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

	setDesignCode() {
		// console.log(this.selectExerciseIds);
		this.exercisesGroup.setDesignCode(false, this.selectExerciseIds);
	}

	linkLibrary() {
		if (!this.courseMaterial.publishStatus) {
			const checkOutLineList = [];
			this.checkOutLineList.map((item) => {
				checkOutLineList.push(item.id);
			});
			this.courseInterface.courseMaterial({
				lessonId: this.lessonId,
				date: this.lessonDate,
				publishStatus: false,
				lessonTitle: this.courseMaterial.lessonTitle,
				lessonType: this.courseMaterial.lessonType,
				outlineIds: checkOutLineList,
				courseMaterialSyncDtoList: this.checkClassList,
				isForce: this.isForce
			}).subscribe((result) => {
				this.organizationInterface.getOrganizationById(this.gradeId).subscribe((res) => {
					// this.saveHrefParams();
					this.router.navigate(['/exercises/library'], {
						queryParams: {
							gradeCode: res.data.gradeCode,
							subjectCode: this.subjectCode,
							classId: this.classId,
							lessonId: this.lessonId,
							lessonDate: this.lessonDate,
							lessonStage: this.selectTabset,
							gradeId: this.gradeId,
							selectedGarden: this.selectedGarden,
							selectedYear: this.selectedYear,
							selectedSemester: this.selectedSemester,
							selectedWeek: this.selectedWeek,
						}
					});
				});
			});
		}
	}

	selectChapter() {
		// 选择章节
		this.dialogService.openDialog({
			title: '请选择关联章节',
			content: SelectCourseChapterComponent,
			width: 800,
			class: 'select-chaper',
			footer: false,
			maskClosable: false,
			onCancel: () => {

			},
			componentParams: {
				gradeCode: null,
				subjectCode: this.subjectCode,
				// semesterCode: this.semesterCode,
				gradeId: this.gradeId,
				classId: this.classId,
				checkList: this.checkOutLineList,
				openNodeList: this.openOutLineList,
			}
		});
		this.dialogService.getModal().subscribe((data) => {
			if (data.data) {
				this.checkOutLineList = data.data.checkAry;
				this.openOutLineList = data.data.openList;
				this.verificationFrom.outlineIdsStatus = false;
			}
		});
	}

	goBack() {
		// 返回时，需要保存页面信息
		if (!this.courseMaterial.publishStatus) {
			const checkOutLineList = [];
			this.checkOutLineList.map((item) => {
				checkOutLineList.push(item.id);
			});
			//console.log(this.checkClassList);
			this.courseInterface.courseMaterial({
				lessonId: this.lessonId,
				date: this.lessonDate,
				publishStatus: false,
				lessonTitle: this.courseMaterial.lessonTitle,
				lessonType: this.courseMaterial.lessonType,
				outlineIds: checkOutLineList,
				courseMaterialSyncDtoList: this.checkClassList,
				isForce: this.isForce
			}).subscribe((result) => {
				// this.clearHrefParams();
				this.router.navigate(['/course/timetable'], {
					queryParams: {
						selectedGarden: this.selectedGarden,
						selectedYear: this.selectedYear,
						selectedSemester: this.selectedSemester,
						selectedWeek: this.selectedWeek,
						selectedClass: this.classId,
						tabIndex: this.tabIndex
					}
				});
			});
		} else {
			// this.clearHrefParams();
			this.router.navigate(['/course/timetable'], {
				queryParams: {
					selectedGarden: this.selectedGarden,
					selectedYear: this.selectedYear,
					selectedSemester: this.selectedSemester,
					selectedWeek: this.selectedWeek,
					selectedClass: this.classId,
					tabIndex: this.tabIndex
				}
			});
		}
	}

	alertTimetable() {
		// 同步课节
		this.dialogService.openDialog({
			title: '请选择同步节次',
			content: DialogTimetableComponent,
			width: 1000,
			class: 'dialog-timetable',
			footer: false,
			maskClosable: false,
			onCancel: () => {

			},
			componentParams: {
				lessonId: this.lessonId,
				date: this.lessonDate,
				selectList: this.checkClassList,
				selectedGarden: this.selectedGarden,
				selectedYear: this.selectedYear,
				selectedSemester: this.selectedSemester,
				selectedWeek: this.selectedWeek,
				selectedClass: this.classId
			}
		});
		this.dialogService.getModal().subscribe((result) => {
			//console.log(result);
			if (result.data) {
				this.checkClassList = Object.assign({}, result).data;
			}
		});
	}

	verification() {
		this.verificationFrom.uploadListStatus = false;
		let result = true;
		if (!this.courseMaterial.lessonTitle || this.courseMaterial.lessonTitle.trim() === '') {
			this.verificationFrom.lessonTitleStatus = true;
			result = false;
		}
		if ((this.courseMaterial.lessonType && this.courseMaterial.lessonType.trim() == '') || !this.courseMaterial.lessonType) {
			this.verificationFrom.lessonTypeStatus = true;
			result = false;
		}
		if (this.checkOutLineList.length == 0) {
			this.verificationFrom.outlineIdsStatus = true;
			result = false;
		}
		return result;

	}

	courseMaterialClick() {
		// if (!this.verification()) {
		// 	this.dialogService.alertError('当前课节课件或习题内容不完整！');
		// 	return;
		// }
		if (!this.courseMaterial.publishStatus) {
			return;
		}
		const checkOutLineList = [];
		this.checkOutLineList.map((item) => {
			checkOutLineList.push(item.id);
		});
		if (this.courseMaterial.publishStatus) {
			// 取消发布去掉同步课节信息
			this.checkClassList = [];
		}
		// 发布 取消发布
		this.courseInterface.courseMaterial({
			lessonId: this.lessonId,
			date: this.lessonDate,
			publishStatus: !this.courseMaterial.publishStatus,
			lessonTitle: this.courseMaterial.lessonTitle,
			lessonType: this.courseMaterial.lessonType,
			outlineIds: checkOutLineList,
			courseMaterialSyncDtoList: this.checkClassList,
			isForce: this.isForce
		}).subscribe((result) => {
			if (result && result.code === 1) {
				// this.forceMsg = result.msg;
				this.dialogService.openConfirm({
					title: '提示',
					content: this.modalContent,
					mask: false,
					zIndex: 1003,
					class: 'evaluation-confirm',
					wrapClassName: 'vertical-center-modal',
					cancelText: '否',
					okText: '是',
					closable: true,
					width: 400,
					showConfirmLoading: false,
					maskClosable: false,
					onOk: () => {
						this.isForce = true;
						this.courseMaterialClick();
					},
					onCancel: () => {
						this.refreshPage();
					}
				});
			} else if (result && result.code === 2) {
				// this.verificationFrom.uploadListStatus = true;
				this.dialogService.alertError('当前课节课件或习题内容不完整！');
			} else {
				this.dialogService.alertSuccess(this.courseMaterial.publishStatus ? '取消发布成功！' : '课程发布成功！');
				// this.clearHrefParams();
				this.router.navigate(['/course/prepare', this.lessonId, this.lessonDate], {
					queryParams: {
						selectedGarden: this.selectedGarden,
						selectedYear: this.selectedYear,
						selectedSemester: this.selectedSemester,
						selectedWeek: this.selectedWeek,
						selectedClass: this.classId,
						subjectCode: this.subjectCode,
						gradeId: this.gradeId
					}
				});
				// this.refreshPage();
			}
		});

	}
	btnClick() {
		this.showDetails = false;
		if (this.isSingle) {
			this.detailsData = [];
		}
	}
	statusChange($event) {
		this.isCheckAll();
		this.dealDetailsData();
	}

	checkedAllChange($event) {
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].status = $event;
		}
		this.dealDetailsData();
	}
	isCheckAll() {
		let status = true;
		for (let i = 0; i < this.list.length; i++) {
			if (!this.list[i].status) {
				status = false;
			}
		}
		if (status) {
			this.checkedAll = true;
		} else {
			this.checkedAll = false;
		}
	}
	dealDetailsData() {
		this.detailsData = [];
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i].status) {
				this.detailsData.push(this.list[i].id);
			}
		}
	}
	showExerciseDetails($event) {
		this.isSingle = true;
		// if(!this.isSingle)
		this.checkedAll = false;
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].status = false;
		}
		if ($event.type === 'showAnswer') {
			this.detailsData = [];
			this.detailsType = 0;
			this.detailsData.push($event.data.id);
			this.showDetails = true;
		} else {
			this.detailsData = [];
			this.detailsData.push($event.data.id);
			this.detailsType = 1;
			this.showDetails = true;
		}
	}
	// 做题 讲题
	doExercises(type) {
		this.dealDetailsData();
		if (this.detailsData.length === 0) {
			// this.messageService.warning('请选择习题！');
		} else {
			this.isSingle = false;
			this.detailsType = type;
			this.showDetails = true;
		}
	}
	lessonTypeChange() {
		this.verificationFrom.lessonTypeStatus = false;
	}

	goHome() {
		this.router.navigate(['/course/timetable'], {
			queryParams: {
				selectedGarden: this.selectedGarden,
				selectedYear: this.selectedYear,
				selectedSemester: this.selectedSemester,
				selectedWeek: this.selectedWeek,
				selectedClass: this.classId,
				tabIndex: this.tabIndex
			}
		});
	}
}
