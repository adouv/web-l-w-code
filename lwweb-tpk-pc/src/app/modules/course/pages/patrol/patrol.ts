import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudHomeService} from '../../services/cloud-home.service';
import {ClassTabEntity} from '../../services/entity/ClassTabEntity';
import {ClassSheetEntity} from '../../services/entity/ClassSheetEntity';
import {LwHttpService} from '../../../../common/http/index';
import {LW_MODULE_CODE, ModuleCode} from '../../../../common/config/index';
import {AccountService} from '../../../../services/account/account.service';
import {LwStorageService } from '../../../../app.export';


@Component({
	selector: 'patrol',
	templateUrl: './patrol.html',
	styleUrls: ['./patrol.scss']
})
export class PatrolPage implements OnInit {
	selectIndex: number;
	isBannerShow = true; // 是否显示banner图
	hasYear = true; //是否有学年
	hasLesson = true;    // 是否有课表

	gardens: any[] = [];
	selectedGarden: string;
	years: any[] = [];
	selectedYear: string;
	semesters: any[] = [];
	selectedSemester: string;
	weeks: any[] = [];
	selectedWeek: string;
	newGrade: any[] = [];
	selectNewGrade: string;
	subject: any[] = [];
	selectSubject: string;
	classes: ClassTabEntity[] = [];
	selectedClass: string;
	selectedGradeId: any;
	lessons: ClassSheetEntity[] = [];
	currFilteData = {gardenId: '', year: '', semester: '', week: '', grdea: '', subject: '', classId: ''};

	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private cloudhomeProvider: CloudHomeService,
				private http: LwHttpService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
				private accountService: AccountService,
				private storageService: LwStorageService,
	) {
	}

	ngOnInit(): void {
		this.currFilteData.gardenId = this.storageService.get('s_gardenId');
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.selectedGarden = queryParams['selectedGarden'];
			this.selectedYear = queryParams['selectedYear'];
			this.selectedSemester = queryParams['selectedSemester'];
			this.selectedWeek = queryParams['selectedWeek'];
			this.selectSubject = (typeof (queryParams['selectNewGrade']) == 'undefined' ? '0' : queryParams['selectNewGrade']);
			this.selectedClass = queryParams['selectedClass'];
			this.getPatrolYearList();
		});
	}

	getPatrolYearList() {
		console.log('getPatrolYearList')
		console.log(this.storageService.get('s_gardenId'))
		this.currFilteData.gardenId = this.storageService.get('s_gardenId');
		this.cloudhomeProvider.getPatrolYears(this.currFilteData, this.selectedYear).subscribe((data) => {
			if (data) {
				this.years = data.items;
				this.selectedYear = data.curr ? data.curr.value : '';
				this.hasYear = this.years != null && this.years.length > 0;
				this.getPatrolSemesterList();
			} else {
				this.hasYear = false;
			}
		});
	}


	getPatrolSemesterList() {
		this.currFilteData.year = this.selectedYear;
		this.cloudhomeProvider.getSemesters(this.currFilteData, this.selectedSemester).subscribe((data) => {
			if (data) {
				this.semesters = data.items;
				this.selectedSemester = data.curr ? data.curr.value : '';
				this.getPatrolWeekList();
			} else {
				this.hasYear = false;
			}
		});
	}

	getPatrolWeekList() {
		this.currFilteData.semester = this.selectedSemester;
		this.cloudhomeProvider.getWeeks(this.currFilteData, this.selectedWeek).subscribe((data) => {
			if (data) {
				this.weeks = data.items;
				this.selectedWeek = data.curr ? data.curr.value : '';
				this.getPatrolGradeList();
			} else {
				this.hasYear = false;
			}
		});
	}

	getPatrolGradeList() {
		this.currFilteData.week = this.selectedWeek;
		let params: any = {};
		params.gardenId = this.currFilteData.gardenId;
		params.startDate = this.currFilteData.week.split('|')[0];
		params.endDate = this.currFilteData.week.split('|')[1];
		this.cloudhomeProvider.getPatrolGrade(params, this.selectNewGrade).subscribe(data => {
			if (data) {
				this.newGrade = data.items;
				this.selectNewGrade = data.curr ? data.curr.value : '';
				this.getPatrolSubjectList();
			} else {
				this.hasYear = false;
			}
			this.getPatrolClass();
			this.accountService.CreateComponent({id: 1});
		});
	}

	getPatrolSubjectList() {
		this.currFilteData.grdea = this.selectNewGrade;
		let params: any = {};
		params.gardenId = this.currFilteData.gardenId;
		params.gradeId = this.currFilteData.grdea;
		params.startDate = this.currFilteData.week.split('|')[0];
		params.endDate = this.currFilteData.week.split('|')[1];
		this.cloudhomeProvider.getPatrolSubject(params, this.selectSubject).subscribe(data => {
			if (data) {
				this.subject = data.items;
				this.selectSubject = data.curr ? data.curr.value : '';
			} else {
				this.hasYear = false;
			}
			this.getPatrolClass();
			this.accountService.CreateComponent({id: 1});
		});
	}

	subjectSelect() {
		this.currFilteData.subject = this.selectSubject;
		this.getPatrolClass();
		this.accountService.CreateComponent({id: 1});
	}

	getPatrolClass() {
		this.currFilteData.subject = this.selectSubject;
		let params: any = {};
		params.subjectCode = this.currFilteData.subject;
		params.gardenId = this.currFilteData.gardenId;
		params.gradeId = this.currFilteData.grdea;
		params.startDate = this.currFilteData.week.split('|')[0];
		params.endDate = this.currFilteData.week.split('|')[1];
		this.cloudhomeProvider.getPatrolClasses(params, this.selectedClass).subscribe((data) => {
			if (data && data.items && data.items.length > 0) {
				this.classes = data.items;
				this.currFilteData.classId = data.curr.code;
				this.selectedGradeId = data.curr.data.gradeId;
				this.selectedClass = this.currFilteData.classId;
				this.getPatrolLessons(data.curr ? data.curr : {});
			} else {
				this.classes = [];
				this.hasLesson = false;
			}
		});

	}

	getPatrolLessons(selectedClass: any) {
		let params: any = {};
		params.gardenId = selectedClass.data.gardenId;
		params.subjectCode = this.currFilteData.subject;
		params.startDate = this.currFilteData.week.split('|')[0];
		params.endDate = this.currFilteData.week.split('|')[1];
		params.classId = selectedClass.code;
		this.cloudhomeProvider.getPatrolLessons(params).subscribe((data) => {
			if (data) {
				this.lessons = data;
				this.hasLesson = this.lessons.length > 0;
			}
		});
	}

	closeBanner() {
		this.isBannerShow = false;
	}

	startPrepareLesson(lesson: ClassSheetEntity) {
		let params: any = {
			selectedGarden: this.selectedGarden,
			selectedYear: this.selectedYear,
			selectedSemester: this.selectedSemester,
			selectedWeek: this.selectedWeek,
			selectedClass: this.selectedClass,
			subjectCode: lesson.data.subjectCode,
			gradeId: this.selectedGradeId,
			tabIndex: 1
		};
		let past: boolean = lesson.data.isPast;
		let status: number = lesson.data.prepareStatus;
		switch (status) {
			case 0://未备课 灰色
				console.log(status);
				break;
			case 1://备课中  蓝色
				console.log(status);
				break;
			default://已备课 绿色
				this.router.navigate(['/course/patrol/info', lesson.data.id, lesson.data.date], {
					queryParams: params
				});
		}
		// if (lesson.data.prepareStatus == 1) {
		// 	this.router.navigate(['/course/patrol/info', lesson.data.id, lesson.data.date], {
		// 		queryParams: params
		// 	});
		// }

		//isPast - 是否已过期
		// if (lesson.data.isPast || lesson.data.prepareStatus == 2) {
		// 	///course/prepare/info 跳转详情
		// 	this.router.navigate(['/course/patrol/info', lesson.data.id, lesson.data.date], {
		// 		queryParams: params
		// 	});
		// } else {//状态为1
		// 	///course/prepare 跳转详情
		// 	this.router.navigate(['/course/patrol/Info', lesson.data.id, lesson.data.date], {
		// 		queryParams: params
		// 	});
		// }
	}

	// goBack() {
	// 	this.router.navigate(['/resource/home/-1']);
	// }

	changeClass(event) {

	}
}