import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseInterface } from '../../services/course.interface';
import { DateToWeekPipe } from '../../../../pipes/date/dateToWeek';
import { resolve } from 'url';
import { reject } from 'q';

@Component({
	templateUrl: 'prepare-info-one.page.html',
	styleUrls: ['./prepare-info-one.page.scss']
})
export class PrepareInfoOnePage implements OnInit {
	classAllName: string;
	requestParams: any = {};
	checkOutLineList = [];
	isHaveContent = false;
	courseMaterial: any;
	constructor(
		private activedRoute: ActivatedRoute,
		private router: Router,
		private courseInterface: CourseInterface
	) {
	}

	ngOnInit() {
		//获取路由参数
		this.requestParams.lessonId = this.activedRoute.snapshot.params['lessonId'];
		this.requestParams.lessonDate = this.activedRoute.snapshot.params['lessonDate'];
		this.activedRoute.queryParams.subscribe(params => {
			this.requestParams.gradeId = params['gradeId'];
			this.requestParams.subjectCode = params['subjectCode'];
			this.requestParams.semesterCode = params['selectedSemester'];
			this.requestParams.classId = params['selectedClass'];
			this.requestParams.selectedGarden = params['selectedGarden'];
			this.requestParams.selectedYear = params['selectedYear'];
			this.requestParams.selectedSemester = params['selectedSemester'];
			this.requestParams.selectedWeek = params['selectedWeek'];
		});
		//获取课程资料
		this.getCourseMaterial();
	}

	/**
	 * 获取课程资料
	 */
	getCourseMaterial() {
		// TODO:wuh 在接口返回值中需要扩展两个字段：学期和周次，还需要补上园区字段
		this.courseInterface.getMaterialDetail(this.requestParams.lessonId, this.requestParams.lessonDate).subscribe(response => {
			if (response) {
				this.courseMaterial = response;

				if (response.lessonTitle != null && response.lessonTitle != '') {
					this.isHaveContent = true;
				}
				if (response.lessonType != null && response.lessonType != '') {
					this.isHaveContent = true;
				}
				if (response.syncCourseMaterialNames != null && response.syncCourseMaterialNames != '') {
					this.isHaveContent = true;
				}

				this.classAllName = response.gradeName;
				this.classAllName += response.className + ' ';
				this.classAllName += '周' + new DateToWeekPipe().transform(response.week, true) + ' ';
				this.classAllName += '第' + response.period + '节 ';
				this.classAllName += '(' + response.subjectName + ')';

				this.getOutlinePrepare();
			}
		});

	}

	getOutlinePrepare() {
		this.courseInterface.getOutlinePrepare({
			lessonId: this.requestParams.lessonId,
			date: this.requestParams.lessonDate
		}).subscribe((response) => {
			this.checkOutLineList = [];
			if (response.length > 0) {
				this.isHaveContent = true;
			}
			response.map((item) => {
				this.checkOutLineList.push({
					id: item.outlineId,
					name: item.outlineName,
					isSelect: true,
				});
			});
		});
	}
	goBack() {
		this.router.navigate(['/course/timetable']);
	}
	goHome() {
		this.router.navigate(['/course/timetable']);
	}
}
