import { Component, OnInit } from '@angular/core';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { PageService } from '../../../../services/page/page.service';
import { AnalysisInterface } from '../../services/analysis.interface';
import { AccountService } from '../../../../services/account';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LwStorageService } from '../../../../common/cache';


@Component({
	templateUrl: './analysis-list.page.html',
	styleUrls: ['./analysis-list.page.scss']
})
export class AnalysisListPageComponent implements OnInit {
	dateRange: any;
	gradeList: any;
	gradeId: any;
	selectData: any;
	subjectList: any;
	teacherList: any;
	rank: any;
	sortBy: any;
	startDate: any;
	endDate: any;
	firstStartDate: any;
	firstEndDate: any;
	nowDate: any;
	beforeDate: any;
	ellipticalTitle: any;
	ellipticalImg: any;
	currentGardenId: any;

	constructor(private videoClassesInterface: VideoClassesInterface,
		private accountService: AccountService,
		private router: Router,
		private datePipe: DatePipe,
		private activatedRoute: ActivatedRoute,
		private analysisInterface: AnalysisInterface,
		private lwStorageService: LwStorageService
	) {
		this.nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
		this.startDate = this.datePipe.transform(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
		this.beforeDate = this.datePipe.transform(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
		this.endDate = this.nowDate;
		this.dateRange = '';
		this.gradeList = [];
		this.subjectList = [];
		this.teacherList = [];
		this.selectData = {};
		this.rank = { page: PageService.setPageParams(1, 20), list: [], loaded: false, total: 0 };
		this.sortBy = 'DESC';
		this.getRouterParams();
		this.reloadElliptical();
	}

	ngOnInit() {
		// 多园区切换在重新选取当前园区id
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;
		this.getGradeUseGarden();
		this.getCourseMaterialList();
	}

	reloadElliptical() {
		if (this.isHaveFitter()) {
			this.ellipticalTitle = '暂无匹配的备课资源';
			this.ellipticalImg = 'no-search.png';
		} else {
			this.ellipticalTitle = '暂未上传备课资源';
			this.ellipticalImg = 'no-resource.png';
		}
	}

	dateFormat(time, format) {
		let t = new Date(time);
		let tf = function (i) { return (i < 10 ? '0' : '') + i };
		return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
			switch (a) {
				case 'yyyy':
					return tf(t.getUTCFullYear());
				case 'MM':
					return tf(t.getUTCMonth() + 1); // 返回 用世界时表示时的月份，该值是 0（一月） ~ 11（十二月） 之间中的一个整数。所以要加1
				case 'mm':
					return tf(t.getUTCMinutes());
				case 'dd':
					return tf(t.getUTCDate());
				case 'HH':
					return tf(t.getUTCHours());
				case 'ss':
					return tf(t.getUTCSeconds());
			};
		});
	}

	isHaveFitter() {
		let result = false;
		const haveGrade = this.selectData.gradeId && this.selectData.gradeId !== '';
		const haveSubject = this.selectData.subjectCode && this.selectData.subjectCode !== '';
		const haveTeacher = this.selectData.teacherId && this.selectData.teacherId !== '';
		if (haveGrade || haveSubject || haveTeacher) {
			result = true;
		}
		return result;
	}

	/**
	 * 根据园区找班级
	 */
	private getGradeUseGarden() {
		this.videoClassesInterface.getGradeUseGarden({ gardenId: this.currentGardenId }).subscribe(res => {
			this.gradeList = res.data;
			if (!this.gradeId) {
				this.gradeId = this.gradeList[0].id;
			}
			this.getSubjectList();
			this.getTeacherList();
		});
	}

	/*
    *
    * 获取学科列表
    *
    * */
	private getSubjectList() {
		const gardenId = this.accountService.getCurrentGardenId();
		this.analysisInterface.getSubjectList({
			gardenId: gardenId,
			gradeId: this.selectData.gradeId,
			teacherId: this.selectData.teacherId
		}).subscribe(res => {
			this.subjectList = res;
		});
	}

	/*
	*
	* 获取老师列表
	*
	* */
	private getTeacherList() {
		const gardenId = this.accountService.getCurrentGardenId();
		this.analysisInterface.getTeacherList({
			gardenId: gardenId,
			gradeId: this.selectData.gradeId,
			subjectCode: this.selectData.subjectCode
		}).subscribe(data => {
			this.teacherList = data;
			// for (const t of res.data) {
			//     this.teacherList.push({
			//         id: t.teacherId,
			//         name: t.teacherName
			//     });
			// }
			// this.teacherList = res.data;
		});
	}

	selectedGrade(event) {
		this.selectData.gradeId = event === '' ? '' : event.id;
		this.selectData.subjectCode = '';
		this.selectData.teacherId = '';
		this.getSubjectList();
		this.getTeacherList();
		this.getCourseMaterialList();
	}

	selectedSubject(event) {
		this.selectData.subjectCode = event === '' ? '' : event.id;
		this.getTeacherList();
		this.getCourseMaterialList();
	}

	selectedTeacher(event) {
		this.selectData.teacherId = event === '' ? '' : event.id;
		this.getSubjectList();
		this.getCourseMaterialList();
	}

	getCourseMaterialList() {
		this.analysisInterface.getCourseMaterialList({
			gradeId: this.selectData.gradeId,
			subjectCode: this.selectData.subjectCode,
			teacherId: this.selectData.teacherId,
			gardenId: this.currentGardenId,
			startDate: this.startDate,
			endDate: this.endDate,
			sortBy: this.sortBy,
			...this.rank.page
		}).subscribe((res) => {
			this.rank.loaded = true;
			this.rank.list = res.data;
			this.rank.total = res.totalCount;
			this.reloadElliptical();
		});
	}

	sortByChange() {
		this.sortBy = this.sortBy === 'DESC' ? 'ASC' : 'DESC';
		this.getCourseMaterialList();
	}

	changeList($event, record) {
		if (record && record.page.size < record.total) {
			record.page.size = record.page.size + 30;
		}
		this.getCourseMaterialList();
	}

	goHome() {
		this.router.navigate(['../home'], {
			queryParams: {
				startDate: this.firstStartDate,
				endDate: this.firstEndDate,
			},
			relativeTo: this.activatedRoute
		});
	}

	changeDate(event) {
		this.dateRange = event ? event : '';
		const dateArr = event.split(' ~ ');
		this.startDate = event ? dateArr[0] : this.beforeDate;
		this.endDate = event ? dateArr[1] : this.beforeDate;
		this.getCourseMaterialList();
	}

	getRouterParams() {
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.firstStartDate = queryParams.firstStartDate;
			this.firstEndDate = queryParams.firstEndDate;
			this.startDate = queryParams.startDate;
			this.endDate = queryParams.endDate;
			this.selectData.gradeId = queryParams.gradeId;
			this.selectData.subjectCode = queryParams.subjectCode;
			this.dateRange = !queryParams.startDate ||
				queryParams.startDate === this.beforeDate && queryParams.endDate === this.beforeDate
				? '' : this.startDate + ' ~ ' + this.endDate;
		});
	}

	goDetail(item) {
		this.router.navigate(['../details'], {
			queryParams: {
				startDate: this.startDate,
				endDate: this.endDate,
				firstStartDate: this.firstStartDate,
				firstEndDate: this.firstEndDate,
				gradeId: this.selectData.gradeId,
				subjectCode: this.selectData.subjectCode,
				detailsDate: this.datePipe.transform(item.giveLessonDate, 'yyyy-MM-dd'),
				lessonId: item.lessonId
			},
			relativeTo: this.activatedRoute
		});
	}
}
