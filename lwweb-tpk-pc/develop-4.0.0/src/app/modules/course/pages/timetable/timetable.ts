import {Component, OnInit,Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudHomeService} from '../../services/cloud-home.service';
import {ClassTabEntity} from '../../services/entity/ClassTabEntity';
import {ClassSheetEntity} from '../../services/entity/ClassSheetEntity';
import {LwClientService} from '../../../../common/client';
import {AccountService} from '../../../../services/account/account.service';
import {LwStorageService} from '../../../../common/cache';
import {LwHttpService} from '../../../../common/http/index';
import {LW_MODULE_CODE, ModuleCode} from '../../../../common/config/index';


@Component({
	selector: 'course-timetable',
	templateUrl: './timetable.html',
	styleUrls: ['./timetable.scss']
})
export class CourseTimetablePage implements OnInit {
	selectIndex: number;
	isBannerShow = false; // 是否显示banner图
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
	classes: ClassTabEntity[] = [];
	selectedClass: string;
	selectedGradeId: any;
	lessons: ClassSheetEntity[] = [];
	currFilteData = {gardenId: '', year: '', semester: '', week: '', classId: ''};
	promise: boolean = false;
	currentGardenId: any;

	constructor(private router: Router,
				private clientService: LwClientService,
				private activatedRoute: ActivatedRoute,
				private cloudhomeProvider: CloudHomeService,
				private lwStorageService: LwStorageService,
				private accountService: AccountService,
				private httpService: LwHttpService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {

	}

	ngOnInit(): void {
		this.getGardenId();
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.selectedGarden = queryParams['selectedGarden'];
			this.selectedYear = queryParams['selectedYear'];
			this.selectedSemester = queryParams['selectedSemester'];
			this.selectedWeek = queryParams['selectedWeek'];
			this.selectedClass = queryParams['selectedClass'];
			this.selectIndex = queryParams['tabIndex'];
		});
	
		const timer = setTimeout(() => {
			this.clientService.setCurrentWindowOpacity(1);
			clearTimeout(timer);
		}, 100);
	}


	// 获取园区Id
	getGardenId() {
		this.httpService.get(this.moduleCode.ACCOUNT, '/garden/simple/group-strategy', {isUserControlStrategy: false}).subscribe(out => {
				let allGardens = this.lwStorageService.get('AllGardens');
				let bool = allGardens.some(item => item.gardenId == localStorage.getItem('s_gardenId'));
				if(!bool) {
					localStorage.setItem('s_gardenId', this.lwStorageService.get('user').gardens[0].gardenId);
				}
				this.currentGardenId = this.lwStorageService.get('s_gardenId');
				this.currFilteData.gardenId = this.currentGardenId;
				this.hasPermission();
				this.getYear();
			});
	}

	getYear() {
		this.cloudhomeProvider.getYears({gardenId: this.currentGardenId, curr: this.selectedYear}).subscribe((data) => {
			if (data) {
				this.years = data.items;
				this.selectedYear = data.curr ? data.curr.value : '';
				this.hasYear = this.years.length > 0;
				this.getSemesterList();
			} else {
				this.hasYear = false;
			}
		});
	}


	getSemesterList() {
		this.currFilteData.year = this.selectedYear;
		this.cloudhomeProvider.getSemesters(this.currFilteData, this.selectedSemester).subscribe((data) => {
			if (data) {
				this.semesters = data.items;
				this.selectedSemester = data.curr ? data.curr.value : '';
				this.getWeekList();
			} else {
				this.hasYear = false;
			}
		});
	}

	getWeekList() {
		this.currFilteData.semester = this.selectedSemester;
		this.cloudhomeProvider.getWeeks(this.currFilteData, this.selectedWeek).subscribe((data) => {
			if (data) {
				this.weeks = data.items;
				this.selectedWeek = data.curr ? data.curr.value : '';
				this.getClassList();
			} else {
				this.hasYear = false;
			}
		});
	}

	getClassList() {
		this.currFilteData.week = this.selectedWeek;
		this.cloudhomeProvider.getClasses(this.currFilteData, this.selectedClass).subscribe((data) => {
			if (data && data.items && data.items.length > 0) {
				this.classes = data.items;
				this.getLessons(data.curr ? data.curr : {});
			} else {
				this.classes = [];
				this.hasLesson = false;
			}
		});
	}

	getLessons(selectedClass: any) {
		this.currFilteData.classId = selectedClass.code;
		this.selectedGradeId = selectedClass.data.gradeId;
		this.selectedClass = selectedClass.code;
		this.cloudhomeProvider.getLessons(this.currFilteData).subscribe((data) => {
			if (data) {
				this.lessons = data;
				this.hasLesson = this.lessons.length > 0;
			}
			this.accountService.CreateComponent({id: 0});
		});
	}

	closeBanner() {
		this.isBannerShow = false;
	}

	startPrepareLesson(lesson: ClassSheetEntity) {
		console.log('lesson', lesson);
		//isPast - 是否已过期
		if (lesson.data.isPast || lesson.data.prepareStatus == 2) {
			///course/prepare/info 跳转详情
			this.router.navigate(['/course/prepare/info', lesson.data.id, lesson.data.date], {
				queryParams: {
					selectedGarden: this.selectedGarden,
					selectedYear: this.selectedYear,
					selectedSemester: this.selectedSemester,
					selectedWeek: this.selectedWeek,
					selectedClass: this.selectedClass,
					subjectCode: lesson.data.subjectCode,
					gradeId: this.selectedGradeId,
					tabIndex: 0
				}
			});
		} else {//状态为1
			///course/prepare 跳转详情
			this.router.navigate(['/course/prepare', lesson.data.id, lesson.data.date], {
				queryParams: {
					selectedGarden: this.selectedGarden,
					selectedYear: this.selectedYear,
					selectedSemester: this.selectedSemester,
					selectedWeek: this.selectedWeek,
					selectedClass: this.selectedClass,
					subjectCode: lesson.data.subjectCode,
					gradeId: this.selectedGradeId,
					tabIndex: 0
				}
			});
		}
	}

	goBack() {
		this.router.navigate(['/resource/home/-1']);
	}

	changeClass(event) {

	}

	///tpk/permission/hasPermission
	hasPermission() {
		let params: any = {};
		params.type = 4;
		params.gardenId = this.currentGardenId;
		this.cloudhomeProvider.getPromise(params).subscribe(response => {
			this.promise = response;
		});
	}
}