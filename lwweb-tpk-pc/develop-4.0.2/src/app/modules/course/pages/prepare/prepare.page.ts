import { DateToWeekPipe } from './../../../../pipes/date/dateToWeek';
import { DialogService } from './../../../../services/dialog/dialog.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NumberToUpperCasePipe } from '../../../../pipes/number/numberToUpperCase.pipe';
import { SelectDataItem } from '../../services/entity/select-data-item';
import { ActivatedRoute, Router } from '@angular/router';
import {
	COURSE_NAME, COURSE_STATUE, LESSON_METHOD, COURSE_NAME_UPLOAD,
} from './courseware.const';
import { ExercisesInterface } from '../../../../services/exercises/exercises.interface';
import { CourseMaterialService } from '../../services/material/CourseMaterialService';
import { CourseInterface } from '../../services/course.interface';
import { SelectCourseChapterComponent } from '../../components/select-chapter/select-chapter';
import { DialogTimetableComponent } from '../../components/dialog-timetable/dialog-timetable.component';
import { CoursewareHeaderComponent } from '../../components/courseware-header/courseware-header.component';
import { OrganizationInterface } from '../../../../services/organization/organization.interface';
import { ExercisesGroupComponent } from '../../../../components/exercises-group/exercises-group.component';
import { FileUploaderComponent } from '../../../../components/upload-file/upload-file';
@Component({
	templateUrl: './prepare.page.html',
	styleUrls: ['./prepare.page.scss']
})
export class PreparePage implements OnInit {
	list: any;
	questionTypeList = [];
	selectTabset: string | number;
	selectTab: number;
	affixStatus: boolean;
	@ViewChild('headerScroll') headerScroll: ElementRef;
	@ViewChild('modalContent') modalContent;
	@ViewChild(CoursewareHeaderComponent) coursewareHeader;
	@ViewChild(ExercisesGroupComponent) exercisesGroup;
	@ViewChild(FileUploaderComponent) fileUploader;
	headerScrollHeight: number;
	currStageCode: string;
	lessonStages: SelectDataItem[] = [];
	lessonMethod: string;
	LESSON_METHOD: any;
	uploaderDisplayStageName: string;
	lessonId: string;
	lessonDate: string;
	options: any;
	resourceList = [];
	subjectCode: string;
	gradeId: string;
	semesterCode: string;
	classId: string;
	checkOutLineList = [];
	openOutLineList = [];
	checkClassList = [];
	lessonTypes = [];
	selectedLessonType;
	lessonTitle: string;
	classAllName: string;
	courseMaterial: any;
	verificationFrom: any;
	designStatus = 1;
	exerciseType: any;
	isForce: boolean;
	forceMsg: string;
	allChecked = false;
	selectExerciseIds = [];
	selectedGarden: any;
	selectedYear: any;
	selectedSemester: any;
	selectedWeek: any;
	materialFileNames = [];
	listLoadComplete = false;
	resourceListLoadComplete = false;
	tabIndex: number;
	constructor(private router: Router,
		private dialogService: DialogService,
		private exercisesInterface: ExercisesInterface,
		private courseInterface: CourseInterface,
		private organizationInterface: OrganizationInterface,
		private courseMaterialService: CourseMaterialService,
		private activedRoute: ActivatedRoute) {
		this.courseMaterial = {};
		this.selectTabset = 1;
		this.selectTab = 0;
		this.affixStatus = false;
		this.headerScrollHeight = 1000;
		this.options = { lessonId: '', lessonDate: '' };
		this.list = [];
		this.exerciseType = '';
		this.isForce = false;
		this.forceMsg = '';
		this.verificationFrom = {
			lessonTitleStatus: false,
			lessonTypeStatus: false,
			outlineIdsStatus: false,
			uploadListStatus: false
		};
	}
	ngOnInit() {
		this.refreshPage();
	}
	saveHrefParams() {
		sessionStorage.prepare = JSON.stringify({
			selectTabset: this.selectTabset,
			selectTab: this.selectTab,
			designStatus: 0
		});
	}
	setHrefParams() {
		if (sessionStorage.prepare && sessionStorage.prepare != '') {
			let prepare = JSON.parse(sessionStorage.prepare);
			this.selectTabset = prepare.selectTabset;
			this.selectTab = prepare.selectTab;
			this.designStatus = prepare.designStatus;
		}
	}
	clearHrefParams() {
		sessionStorage.prepare = '';
	}
	refreshPage() {
		this.getLessonType();
		this.defaultParams();
		this.initialParams();
		this.setHrefParams();
		this.getTypeListByCondition();
		this.getCourseMaterials();
		this.getExerciseList();
		this.headerScrollHeight = this.headerScroll.nativeElement.clientHeight + 20;
	}

	changeTabSet(index) {
		this.selectTabset = index;
		this.options.currStageCode = this.selectTabset;
		this.allChecked = false;
		this.selectExerciseIds = [];
		this.getCourseMaterials();
		this.getExerciseList();
		this.verificationFrom.uploadListStatus = false;
	}

	changeTab(index) {
		this.selectTab = index;
	}

	checkStatus(event) {
		this.designStatus = event;
		this.getExerciseList();
	}

	onAffixChange(status: boolean) {
		this.affixStatus = status;
		console.log(this.affixStatus);
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

	initialParams(): void {
		// this.courseSpace = new CourseSpaceDto(0, 0);
		this.selectTabset = this.lessonStages[1].code;
		this.lessonMethod = LESSON_METHOD.COURSEWARE;
		this.LESSON_METHOD = LESSON_METHOD;
		this.uploaderDisplayStageName = COURSE_NAME_UPLOAD.UPLOADER_DISPLAY_IN_STAGE;
		this.lessonId = this.activedRoute.snapshot.params['lessonId'];
		this.lessonDate = this.activedRoute.snapshot.params['lessonDate'];
		this.options.lessonId = this.lessonId;
		this.options.lessonDate = this.lessonDate;
		this.options.currStageCode = this.selectTabset;
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
				console.log(data.week);
				const weekName: string = '周' + new DateToWeekPipe().transform(data.week, true);
				const periodName: string = '第' + data.period + '节';
				const lessonName: string = '(' + data.subjectName + ')';
				this.classAllName = gradeName + className + ' ' + weekName + ' ' + periodName + ' ' + lessonName;
				this.getOutlinePrepare();
			}
		});
	}

	defaultParams(): void {
		this.lessonStages = [
			new SelectDataItem(
				COURSE_STATUE.COURSE_BEFORE,
				COURSE_NAME.UPLOADER_DISPLAY_PRE_STAGE
			),
			new SelectDataItem(
				COURSE_STATUE.COURSE_DURING,
				COURSE_NAME.UPLOADER_DISPLAY_IN_STAGE
			),
			new SelectDataItem(
				COURSE_STATUE.COURSE_AFTER,
				COURSE_NAME.UPLOADER_DISPLAY_LAST_STAGE
			)
		];
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
			console.log(result);
			if (result.data) {
				this.checkClassList = Object.assign({}, result).data;
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
			console.log(this.checkClassList);
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
	}

	onUploadSuccess() {
		// 刷新列表
		this.getCourseMaterials();
		this.verificationFrom.uploadListStatus = false;
	}

	refreshList() {
		this.selectExerciseIds = [];
		this.allChecked = false;
		// 刷新习题
		this.getExerciseList();
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

	/**
	 * 进入校本题库
	 */
	goLibrary() {
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

	getShowDownload(evt) {
		this.coursewareHeader.getShowDownload(evt);
	}
	lessonTypeChange() {
		this.verificationFrom.lessonTypeStatus = false;
	}
	verification() {
		this.verificationFrom.uploadListStatus = false;
		return this.getCourseValidation().map((data) => {
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
			if (!data.canPublish) {
				result = false;
				this.verificationFrom.uploadListStatus = true;
			}
			return result;
		});

	}
	getCourseValidation() {
		return this.courseInterface.getCourseValidation({
			lessonId: this.lessonId,
			date: this.lessonDate
		})
	}
	courseMaterialClick() {
		this.verification().subscribe((result) => {
			console.log(result, this.verificationFrom);
			if (!result) {
				this.dialogService.alertError('当前课节课件或习题内容不完整！');
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
							this.refreshPage();
						}
					});
				} else if (result && result.code === 2) {
					// this.verificationFrom.uploadListStatus = true;
					this.dialogService.alertError('当前课节课件或习题内容不完整！');
				} else {
					this.dialogService.alertSuccess(this.courseMaterial.publishStatus ? '取消发布成功！' : '课程发布成功！');
					this.clearHrefParams();
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
			});
		})

	}

	goHome() {
		this.router.navigate(['/resource/home/-1']);
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
	setDesignCode() {
		// console.log(this.selectExerciseIds);
		this.exercisesGroup.setDesignCode(false, this.selectExerciseIds);
	}
	/**
	 * 获取下载的文件
	 * @param data
	 */
	// getDownloadList(data) {
	// 	// this.isDownload = data.isDownload;
	// 	if (this.idList.indexOf(data.id) < 0) {
	// 		this.idList.push(data.id);
	// 		this.downloadList.unshift(data);
	// 		this.message.success('下载成功！', {nzDuration: 2000});
	// 	}
	// }
	removeOutline(outline) {
		console.log(outline);
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

	getCourseMaterials() {
		this.resourceListLoadComplete = false;
		this.courseMaterialService.getCourseMaterials(
			this.lessonId,
			this.lessonDate,
			this.selectTabset.toString(),
			'courseware'
		).subscribe((data) => {
			if (data) {
				this.resourceList = data;
				this.resourceListLoadComplete = true;
				this.materialFileNames = [];
				for (const material of data) {
					this.materialFileNames.push(material.name);
				}
				console.log(this.materialFileNames);
			}
		});
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
	getLessonType() {
		this.courseInterface.getLessonType().subscribe((data) => {
			this.lessonTypes = data;
			this.courseMaterial.lessonType = data[0].itemValue;
		});
	}
}
