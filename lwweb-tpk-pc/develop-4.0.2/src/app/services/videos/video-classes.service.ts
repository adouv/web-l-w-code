import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {CourseImgPathPipe} from '../../pipes/image/courseImgPath';
import {DateToWeekPipe} from '../../pipes/date/dateToWeek';
import {VideoClassesInterface} from './video-classes.interface';

@Injectable()
export class VideoClassesService {
	private courseImgPathPipe: CourseImgPathPipe;
	private datePipe: DatePipe;
	private dateToWeekPipe: DateToWeekPipe;

	constructor(private videoClassesInterface: VideoClassesInterface) {
		this.courseImgPathPipe = new CourseImgPathPipe();
		this.datePipe = new DatePipe('en-US');
		this.dateToWeekPipe = new DateToWeekPipe();
	}

	/*
	 * 获得点播视频列表
	 * */
	getUnicastList(param, callback) {
		this.videoClassesInterface.getUnicastList(param).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body.data
			};
		}).subscribe(res => {
			if (res && res.data && callback) {
				if (typeof res.data === 'string') {
					res.data = {};
				}
				callback(this.buildCourseUnicastList(res.data), res.totalCount);
			}
		});
	}


	/*
	 * 获得有权限看到的点播视频列表
	 * */
	getUnicastListForPermission(param, callback) {
		this.videoClassesInterface.getUnicastListForPermission(param).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		}).subscribe(res => {
			if (res && res.data && callback) {
				if (typeof res.data === 'string') {
					res.data = {};
				}
				callback(this.buildCourseUnicastList(res.data), res.totalCount);
			}
		});
	}

	getTaskUnicastListForPermission(param, callback) {
		this.videoClassesInterface.getTaskUnicastListForPermission(param).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		}).subscribe(res => {
			if (res && res.data && callback) {
				if (typeof res.data === 'string') {
					res.data = {};
				}
				callback(this.buildCourseUnicastList(res.data), res.totalCount);
			}
		});
	}

	/*
	 * 获得点播视频详情
	 *
	 * */
	getUnicastDetails(id, callback) {
		this.videoClassesInterface.getUnicastDetails(id).subscribe(res => {
			if (res && res.data && callback) {
				callback(this.buildCourseUnicastList([res.data]));
			}
		});
	}

	/*
	 * 获得点播视频详情
	 *
	 * */
	getUnicastDetailsByClassAndTime(param, callback) {
		this.videoClassesInterface.getUnicastDetailByClassAndTime(param).subscribe(res => {
			if (res && callback) {
				callback(this.buildCourseUnicastList([res]));
			}
		});
	}

	private buildCourseUnicastList(data: Array<any>): Array<any> {
		const result = [];
		for (const item of data) {
			const videoItemModel: any = item;
			// 扩展值
			videoItemModel.classesname = item.gradeName + item.className + ' (' + item.subjectName + ')';
			videoItemModel.showImg = this.courseImgPathPipe.transform(item.subjectCode);
			if (item.courseStartTime) {
				videoItemModel.week = '周' + this.dateToWeekPipe.transform(item.courseStartTime);
				videoItemModel.periodtext = ' 第' + item.period + '节';
				videoItemModel.giveLessonTime = this.datePipe.transform(item.courseStartTime, 'yyyy-MM-dd HH:mm:ss');
				videoItemModel.teachStartTime = videoItemModel.giveLessonTime;
				videoItemModel.datetimetext = this.datePipe.transform(item.courseStartTime, 'yyyy/MM/dd') +
					'  周' + this.dateToWeekPipe.transform(item.courseStartTime) + ' 第' + item.period + '节';
			}
			videoItemModel.status = 1;
			result.push(videoItemModel);
		}
		return result;
	}

	isLessonBreak(data) {
		return data.teachStartTime;
	}


	// 课堂回放我的课查询
	getMyClasses(param) {
		return this.videoClassesInterface.getMyClass(param);
	}

	// 课堂回放我关注的课
	getMyFocusedClasses(param) {
		return this.videoClassesInterface.getMyFocusedClass(param);
	}

	// 我的课二级页面--课程列表
	getMyClassSubjectNameList(param) {
		return this.videoClassesInterface.getMyClassSubjectNameList(param);
	}

	// 我的课二级页面--年级列表
	getMyClassesGradeList(params) {
		return this.videoClassesInterface.getMyClassesGradeList(params);
	}

	// 我的课二级页面--班级列表
	getMyClassesClazzList(params) {
		return this.videoClassesInterface.getMyClassesClazzList(params);
	}

	// 我的课二级页面--lessons列表
	getMyClassLessonList(params) {
		return this.videoClassesInterface.getMyClassLessonList(params);
	}
}
