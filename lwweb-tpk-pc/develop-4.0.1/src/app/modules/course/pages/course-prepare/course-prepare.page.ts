import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseMaterialService } from '../../services/material/CourseMaterialService';
import { CourseInterface } from '../../services/course.interface';
import { DateToWeekPipe } from './../../../../pipes/date/dateToWeek';
import { CoursewareHeaderComponent } from '../../components/courseware-header/courseware-header.component';
import { OrganizationInterface } from '../../../../services/organization/organization.interface';
import { ExercisesInterface } from '../../../../services/exercises/exercises.interface';
import { ExercisesGroupComponent } from '../../../../components/exercises-group/exercises-group.component';
import { DialogService } from './../../../../services/dialog/dialog.service';
import { SelectCourseChapterComponent } from '../../components/select-chapter/select-chapter';
import { DialogTimetableComponent } from '../../components/dialog-timetable/dialog-timetable.component';

@Component({
	templateUrl: './course-prepare.page.html',
	styleUrls: ['./course-prepare.page.scss']
})
export class CoursePreparePage implements OnInit {
	materialFileNames = [];
	resourceList = [];
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
	forceMsg: string;
	@ViewChild(ExercisesGroupComponent) exercisesGroup;
	@ViewChild(CoursewareHeaderComponent) coursewareHeader;
	@ViewChild('modalContent') modalContent;
	tabIndex: number;
	btnDebunce = true;

	constructor(private activedRoute: ActivatedRoute,
		private courseMaterialService: CourseMaterialService,
		private courseInterface: CourseInterface,
		private exercisesInterface: ExercisesInterface,
		private organizationInterface: OrganizationInterface,
		private router: Router,
		private dialogService: DialogService) {
		this.options = {};
		this.verificationFrom = {};
		this.courseMaterial = {};
		this.options.design = 'teaching_plan';
		this.exerciseType = '';
		this.leftTab = [];
		this.forceMsg = '';

	}

	ngOnInit() {

		this.initialParams();
		this.getCourseMaterials();
		this.getMaterialDesign();
		this.refreshPage();
		this.getTeachingPlan();
		this.courseMaterial.lessonType = '';
	}

	changeTab(tab) {
		this.options.design = tab.code;
		this.refreshCoursewareList();
	}

	getMaterialDesign() {
		this.courseInterface.getMaterialDesign().subscribe((data) => {
			//console.log(data);
			this.leftTab = data;
		});
	}

	onUploadSuccess(isCompelte) {
		this.isUploadCompelte = isCompelte;
		//console.log('onUploadSuccess', isCompelte);
		this.refreshCoursewareList();
	}

	canceUpload(isCompelte) {
		this.isUploadCompelte = isCompelte;
	}

	beforeUpload() {
		this.isUploadCompelte = false;
		this.verificationFrom.uploadListStatus = false;
	}

	getShowDownload(evt) {
		//console.log(this.coursewareHeader.isDownload);
		if (!this.coursewareHeader.isDownload) {
			this.coursewareHeader.getShowDownload(evt);
		}
	}

	checkedExercise() {
		this.selectExerciseIds = [];
		this.allChecked = false;
		for (const exercise of this.list) {
			if (exercise.checked === true) {
				this.selectExerciseIds.push(exercise.exerciseId);
			}
		}
		if (this.selectExerciseIds.length === this.list.length) {
			this.allChecked = true;
		}
	}

	nextCourseMaterial() {
		if (!this.isHaveTeachingPlan) {
			this.verificationFrom.uploadListStatus = true;
			this.dialogService.alertWarning('教学设计不能为空，请上传后再继续');
			return;
		}
		this.isHaveUpload(() => {
			this.coursewareHeader.cancelAll();
			this.current = 1;
		}, () => {
			this.current = 1;
		});
	}

	prevtCourseMaterial() {
		this.options.design = 'teaching_plan';
		this.getCourseMaterials();
		this.current = 0;
	}

	initialParams(): void {
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
		this.getCourseMaterial();
	}

	getLessonType() {
		this.courseInterface.getLessonType().subscribe((data) => {
			this.lessonTypes = data;
		});
	}

	getTeachingPlan() {
		this.courseMaterialService.getCourseMaterials(
			this.lessonId,
			this.lessonDate,
			1,
			'teaching_plan'
		).subscribe((data) => {
			this.isHaveTeachingPlan = data.length > 0;
		});
	}

	getCourseMaterials() {
		this.resourceListLoadComplete = false;
		this.courseMaterialService.getCourseMaterials(
			this.lessonId,
			this.lessonDate,
			1,
			this.options.design
		).subscribe((data) => {
			if (data) {
				this.resourceList = data;
				this.resourceListLoadComplete = true;
				if (this.options.design == 'teaching_plan') {
					this.isHaveTeachingPlan = data.length > 0;
				}
				this.materialFileNames = [];
				for (const material of data) {
					this.materialFileNames.push(material.name);
				}
			}
		});
	}

	checkStatus(event) {
		this.designStatus = event;
		this.getExerciseList();
	}

	saveHrefParams() {
		sessionStorage.prepare = JSON.stringify({
			design: this.options.design,
			current: this.current,
			designStatus: 0
		});
	}

	setHrefParams() {
		if (sessionStorage.prepare && sessionStorage.prepare != '') {
			let prepare = JSON.parse(sessionStorage.prepare);
			this.options.design = prepare.design;
			this.designStatus = prepare.designStatus;
		}
	}

	clearHrefParams() {
		sessionStorage.prepare = '';
	}

	refreshPage() {
		this.initialParams();
		this.getLessonType();
		this.setHrefParams();
		this.getTypeListByCondition();
		this.getCourseMaterials();
		this.getExerciseList();
	}

	refreshList() {
		this.selectExerciseIds = [];
		this.allChecked = false;
		// 刷新习题
		this.getExerciseList();
	}

	// 获得习题列表
	getExerciseList() {
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
		});
	}

	private getCourseMaterial() {
		// TODO:wuh 在接口返回值中需要扩展两个字段：学期和周次，还需要补上园区字段
		this.courseInterface.getMaterialDetail(this.lessonId, this.lessonDate).subscribe((data) => {
			if (data) {
				this.courseMaterial = data;
				this.checkClassList = data.courseMaterialSyncDtoList == null ? [] : data.courseMaterialSyncDtoList;
				const gradeName: string = data.gradeName;
				const className: string = data.className;
				// TODO
				const year: string = this.lessonDate.substr(0, 4) + '年';
				const weekName: string = '周' + new DateToWeekPipe().transform(data.week, true);
				const periodName: string = '第' + data.period + '节';
				const lessonName: string = '(' + data.subjectName + ')';
				this.classAllName = gradeName + className + ' ' + weekName + ' ' + periodName + ' ' + lessonName;
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
			data.map((item) => {
				this.checkOutLineList.push({
					id: item.outlineId,
					name: item.outlineName,
					isSelect: true,
				});
			});
		});
	}

	getDownloadList(data) {
		this.coursewareHeader.getDownloadList(data);
	}

	refreshCoursewareList() {
		this.getCourseMaterials();
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
		this.allChecked = false;
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
		this.exercisesGroup.setDesignCode(false, this.selectExerciseIds);
	}

	isHaveUpload(callback?: Function, errCallback?: Function) {
		if (!this.isUploadCompelte) {
			this.dialogService.openConfirm({
				title: '提示',
				content: '当前有正在上传的文件，跳转后将停止所有任务，是否继续？',
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
					this.coursewareHeader.cancelAll();
					if (callback) {
						callback();
					}
				},
				onCancel: () => {

				}
			});
			return;
		} else {
			if (errCallback)
				errCallback();
		}
	}

	linkLibrary() {
		this.isHaveUpload(() => {
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
						this.saveHrefParams();
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
		}, () => {
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
						this.saveHrefParams();
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
		});
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

	goHome() {
		if (!this.isUploadCompelte) {
			this.dialogService.openConfirm({
				title: '提示',
				content: '当前有正在上传中的文件，跳转后将停止所有任务，是否继续？',
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
					this.coursewareHeader.cancelAll();
					this.clearHrefParams();
					this.router.navigate(['/course/timetable']);
				},
				onCancel: () => {

				}
			});
			return;
		} else {
			this.clearHrefParams();
			this.router.navigate(['/course/timetable']);
		}
	}

	removeOutline(outline) {
		// 删除章节
		const result = [];
		this.checkOutLineList.map((item) => {
			if (outline.id !== item.id) {
				result.push(item);
			}
		});
		this.checkOutLineList = result;
	}

	removeClass(ct, index) {
		this.checkClassList.splice(index, 1);
	}

	goBack() {
		this.isHaveUpload(() => {
			// 返回时，需要保存页面信息
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
					this.clearHrefParams();
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
				this.clearHrefParams();
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
		}, () => {
			// 返回时，需要保存页面信息
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
					this.clearHrefParams();
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
				this.clearHrefParams();
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
		});

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
		return result;

	}

	courseMaterialClick() {
		if (!this.verification()) {
			this.dialogService.alertWarning('课情内容有必填项未填写！');
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
		this.btnDebunce = false;
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
				this.forceMsg = result.msg;
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
						
					}
				});
			} else if (result && result.code === 2) {
				this.dialogService.alertWarning('课情内容有必填项未填写！');
			} else {
				this.dialogService.alertSuccess(this.courseMaterial.publishStatus ? '取消发布成功！' : '课程发布成功！');

				if (!this.courseMaterial.publishStatus) {
					this.router.navigate(['/course/timetable'], {
						queryParams: {
							selectedGarden: this.selectedGarden,
							selectedYear: this.selectedYear,
							selectedSemester: this.selectedSemester,
							selectedWeek: this.selectedWeek,
							selectedClass: this.classId
						}
					});
				}
				this.refreshPage();
			}
		}, error => this.btnDebunce = true);

	}

	lessonTypeChange() {
		this.verificationFrom.lessonTypeStatus = false;
	}

}
