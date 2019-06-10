import {Component, OnDestroy, OnInit} from '@angular/core';
import {AddQualityCourse, QualityCourseInterface} from '../../../../services/resource/quality-course.interface';
import {QualityCoursesModel} from '../../components/quality-courses/quality-courses.model';
import {QualityCoursesComponent} from '../../components';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';
import {ResourceListModel} from '../../../../components/resource-list/resource-list.model';
import {ResourceListComponent} from '../../../../components/resource-list/resource-list.component';
import {ActivatedRoute} from '@angular/router';
import {CmsInterface} from '../../../../services/resource/cms.interface';
import {QualityCourseEditComponent} from '../../components';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {ResourceHomeInterface} from '../../../../services/resource/resource-home.interface';
import {OtherInterface} from '../../../../services/other.interface';
import {ExercisesComponent} from '../../components/exercises/exercises.component';
import {AccountService} from '../../../../services/account';



@Component({
	templateUrl: './resource-info.page.html',
	styleUrls: ['./resource-info.page.scss']
})
export class ResourceInfoPage implements OnInit, OnDestroy {
	private outlineId = '';   // 大纲项id
	courseTitle = '';         // 大纲项名称
	videoId = '';             // 录像视频id
	private lessonInfo: any;  // 当前课程信息
	enableRecord = false;     // 是否可以录像
	recordTime = 0;           // 录像计时，单位毫秒
	private recordInterval;   // 录像计时器
	private startTimeout;    // 课程开始定时器
	private endTimeout;      // 课程结束定时器
	subjectCode: string;
	gradeCode: string;
	classId: string;
	selectedIndex: number;
	tabList = [
		{
			title: '教学课件',
			component: ResourceListComponent
		},
		{
			title: '课上练习',
			component: ExercisesComponent
		},
		{
			title: '活动材料',
			component: ResourceListComponent
		},
		{
			title: '微课',
			component: QualityCoursesComponent
		},
	];
	tabInputs = [
		{
			resourceList: [] as Array<ResourceListModel>,
			ellipticalTitle: '暂无教学课件',
			showDownload: false,
			showDeleteBtn: false
		},
		{
			outlineId: '',
			classId: '',
			gradeCode: '',
			subjectCode: ''
		},
		{
			resourceList: [] as Array<ResourceListModel>,
			ellipticalTitle: '暂无活动材料',
			showDownload: false,
			showDeleteBtn: false
		},
		{
			qualityCoursesList: [] as Array<QualityCoursesModel>
		}
	];

	constructor(private qualityCourseInterface: QualityCourseInterface,
				private resourceClassesInterface: ResourceClassesInterface,
				private cmsInterface: CmsInterface,
				private activatedRoute: ActivatedRoute,
				private modalService: NzModalService,
				private datePipe: DatePipe,
				private message: NzMessageService,
				private resourceHomeInterface: ResourceHomeInterface,
				private otherInterface: OtherInterface,
				private account: AccountService) {
	}

	ngOnInit() {
		this.getRouteParam();
		if (this.outlineId) {
			console.log(this.classId);
			this.tabInputs[1] = {
				outlineId: this.outlineId,
				classId: this.classId,
				gradeCode: this.gradeCode,
				subjectCode: this.subjectCode
			};
			this.getCourseWareList();
			this.getActivityMaterialList();
			this.getQualityCourseList();
			this.getCurrentOrNextLessonInfo();
		}
	}

	ngOnDestroy() {
		this.stopRecord();
		clearTimeout(this.startTimeout);
		clearTimeout(this.endTimeout);
	}

	/**
	 * 获取大纲id
	 */
	private getRouteParam() {
		this.outlineId = this.activatedRoute.snapshot.params['id'];
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.subjectCode = queryParams.subjectCode;
			this.courseTitle = queryParams.title;
			this.gradeCode = queryParams.gradeCode;
			this.classId = queryParams.classId;
			this.selectedIndex = queryParams.type;
		});
	}

	/**
	 * 获取课件列表
	 */
	private getCourseWareList() {
		console.log(this.classId);
		this.resourceClassesInterface.getCourseFileList({
			outlineId: this.outlineId,
			classId: this.classId,
			subjectCode: this.subjectCode,
			courseMaterialDesign: 'courseware'
		}).subscribe((data) => {
			this.tabInputs[0] = {
				resourceList: data,
				ellipticalTitle: '暂无教学课件',
				showDownload: false,
				showDeleteBtn: false
			};
		});
	}

	/**
	 * 获取活动材料
	 */
	private getActivityMaterialList() {
		this.resourceClassesInterface.getCourseFileList({
			outlineId: this.outlineId,
			classId: this.classId,
			subjectCode: this.subjectCode,
			courseMaterialDesign: 'activity_material'
		}).subscribe((data) => {
			this.tabInputs[2] = {
				resourceList: data,
				ellipticalTitle: '暂无活动材料',
				showDownload: false,
				showDeleteBtn: false
			};
		});
	}


	/**
	 * 获取精品课列表
	 */
	private getQualityCourseList() {
		this.qualityCourseInterface.getQualityCourseList(this.outlineId,this.account.getCurrentGardenId).subscribe((data) => {
			this.tabInputs[3] = {
				qualityCoursesList: data
			};
		});
	}

	/**
	 * 获取老师当前上课信息
	 */
	private getCurrentOrNextLessonInfo() {
		this.resourceClassesInterface.getCurrentOrNextLessonInfo().subscribe((data) => {
			if (data) {
				this.lessonInfo = data;
				this.otherInterface.getCurrentTime().subscribe(res => {
					let currentTime = new Date().getTime();
					if (res) {
						currentTime = res.datetime;
					}
					const startTime = data['startTimestamp'];
					const endTime = data['endTimestamp'];
					// 如果课程未开始，设置课程开始时录像按钮可点击
					if (startTime && startTime > currentTime) {
						console.log('课程未开始');
						this.startTimeout = setTimeout(() => {
							console.log('课程开始定时任务执行');
							this.enableRecord = true;
						}, startTime - currentTime);
					} else if (startTime) {
						console.log('课程进行中');
						this.enableRecord = true;
					}
					// 显示课程结束时录像按钮不可点击
					if (endTime && endTime > currentTime) {
						this.endTimeout = setTimeout(() => {
							console.log('课程结束定时任务执行');
							this.enableRecord = false;
							this.stopRecord();
							// 下课之后获取下节课信息
							setTimeout(() => {
								console.log('获取下节课上课信息');
								this.getCurrentOrNextLessonInfo();
							}, 60000);
						}, endTime - currentTime);
					}
				});
			}
		});
	}

	/**
	 * 开始录制
	 */
	startRecord() {
		if (this.lessonInfo) {
			const currentTime = new Date().getTime();
			const startTime = this.lessonInfo['startTimestamp'];
			const endTime = this.lessonInfo['endTimestamp'];
			const cameraId = this.lessonInfo['cameraId'];
			if (this.enableRecord && cameraId && startTime && endTime && startTime <= currentTime && endTime >= currentTime) {
				const name = this.courseTitle + '(' + this.lessonInfo['gradeName'] + this.lessonInfo['className']
					+ this.lessonInfo['teacherName'] + '-' + this.lessonInfo['subjectName'] + ')';
				const clientId = this.lessonInfo['gardenId'];
				this.cmsInterface.startRecord(cameraId, name, clientId, this.videoId).subscribe((data) => {
					this.enableRecord = false;
					this.videoId = data['videoId'];
					console.log('开始录像返回值：' + this.videoId);
					this.startTiming();
				});
			}
		}
	}

	// 录像计时
	private startTiming() {
		this.recordInterval = setInterval(() => {
			this.recordTime = this.recordTime + 1000;
			if (this.recordTime === 900000) {
				this.message.warning('单次录制时间最长不超过20分钟，请注意提前保存!', {nzDuration: 3000});
			}
			if (this.recordTime === 1200000) {
				console.log('录像时间达到20分钟，自动停止');
				// 组织计时往后走，在此处清理计时器
				clearInterval(this.recordInterval);
				this.stopRecord();
			}
		}, 1000);
	}

	/**
	 * 暂停录制
	 */
	pauseRecord() {
		if (this.videoId) {
			this.cmsInterface.pauseRecord(this.videoId).subscribe((data) => {
				console.log('录像已暂停');
				this.enableRecord = true;
				clearInterval(this.recordInterval);
			});
		}
	}

	/**
	 * 保存录像
	 */
	stopRecord() {
		if (this.videoId) {
			this.cmsInterface.stopRecord(this.videoId).subscribe((data) => {
				console.log('录像停止成功!返回数据：' + data);
				this.videoId = '';
				this.enableRecord = true;
				this.recordTime = 0;
				clearInterval(this.recordInterval);   // 清理录像计时
				if (data) {
					this.resourceHomeInterface.getOneselfAndChild(this.outlineId).subscribe((outline) => {
						// 当前知识点有子节点，弹框
						if (outline && outline['childOutlineList'] && outline['childOutlineList'].length > 0) {
							this.saveCourse(this.buildQualityCourse(data));
						} else {
							// 没有子节点直接保存
							this.qualityCourseInterface.addQualityCourse([this.buildQualityCourse(data)]).subscribe((result) => {
								this.message.success('保存成功!');
								this.getQualityCourseList();
							});
						}
					});
				} else {
					this.message.error('因网络原因导致录像失败！');
				}
			});
		}
	}

	private buildQualityCourse(data) {
		const startTime = this.datePipe.transform(data['createTime'], 'yyyy-MM-dd HH:mm:ss');
		return {
			'outlineIds': [this.outlineId],
			'name': this.courseTitle,
			'subjectCode': this.subjectCode,
			'gradeId': this.lessonInfo['gradeId'],
			'gradeName': this.lessonInfo['gradeName'],
			'classId': this.lessonInfo['classId'],
			'className': this.lessonInfo['className'],
			'period': this.lessonInfo['period'],
			'week': this.lessonInfo['week'],
			'size': data['size'],
			'path': data['playUrl'],
			'source': 0,
			'cover': data['coverUrl'],
			'createTime': startTime,
			'gardenId': this.account.getCurrentGardenId,
		};
	}

	/**
	 * 保存精品课
	 * @param data
	 */
	saveCourse(data: AddQualityCourse) {
		this.modalService.open({
			title: '精品课保存',
			content: QualityCourseEditComponent,
			width: 600,
			footer: false,
			maskClosable: false,
			componentParams: {
				addQualityCourse: data,
				outlineId: this.outlineId,
				type: 'save'
			},
			onOk: () => {
				this.message.success('保存成功!');
				this.getQualityCourseList();
			},
			onCancel() {
				console.log('取消保存');
			},
		});
	}
}
