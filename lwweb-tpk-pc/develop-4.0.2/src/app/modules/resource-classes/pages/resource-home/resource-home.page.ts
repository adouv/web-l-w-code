import {Component, OnInit} from '@angular/core';
import {ResourceHomeInterface} from '../../../../services/resource/resource-home.interface';
import {AccountService} from '../../../../services/account';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {LwClientService} from '../../../../common/client';
import {OrganizationInterface} from '../../../../services/organization/organization.interface';
import { LwStorageService } from '../../../../common/cache/storage.service';


@Component({
	selector: 'app-resource-home',
	templateUrl: './resource-home.page.html',
	styleUrls: ['./resource-home.page.scss']
})
export class ResourceHomePage implements OnInit {
	panels: any[];
	grades: any[] = [];
	selectGrade: any;
	selectClass: any;
	oldSelectClass: any;
	oldSelectGeade: any;
	subjects: any[] = [];
	selectSubjects: any = {};
	oldSelectSubjects: any = {};
	editions: any[] = [];
	selectEdition: any;
	oldSelectEdition: any;
	semesters: any[] = [];
	selectSemester: any;
	oldSelectSemester: any;
	clickId: any;
	cacheDict: any;
	isCurrent: boolean;
	isLoadComplete = false;
	type: any;
	typeConfigs: any;
	collapseConfig: any;
	resources: any; // 资源数组
	resource: string;
	ellipticalTitle: any;
	classes: any[] = [];
	isPending = true;
	gradesLoadComplete = false;
	classesLoadComplete = false;
	subjectsLoadComplete = false;
	semestersLoadComplete = false;
	currentGardenId: any;

	constructor(private router: Router,
				private clientService: LwClientService,
				private activatedRoute: ActivatedRoute,
				private resourceHomeInterface: ResourceHomeInterface,
				private accountService: AccountService,
				private originationInterface: OrganizationInterface,
				private resourceClassesInterface: ResourceClassesInterface,
				private lwStorageService: LwStorageService,
				) {
		this.resources = ['resource', 'courseware', 'qualityCourse', 'exercise'];
		this.cacheDict = {};
		this.isCurrent = false;
		this.type = this.activatedRoute.snapshot.params['type'] || -1; // -1: 云资源 0 : 云备课 1：云微课
		this.type = this.type === 'home' ? -1 : this.type;
		this.typeConfigs = [
			{
				manager: true,
				prepare: false,
				exercises: false,
			},
			{
				manager: false,
				prepare: true,
				exercises: false,
			}
		];
		this.type = parseInt(this.type, 0);
		this.ellipticalTitle = '暂无相应课程安排，请联系管理员';
		if (this.type >= 0) {
			this.collapseConfig = this.typeConfigs[this.type];
			this.isCurrent = false;
		} else {
			this.isCurrent = true;
		}
		this.resource = this.resources[this.type + 1];
		this.getOutlineDictionaryCache();
	}

	ngOnInit() {
		this.getGrades();
		const timer = setTimeout(() => {
			this.clientService.setCurrentWindowOpacity(1);
			clearTimeout(timer);
		}, 100);
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id
	}

	// 年级改变事件
	gradeChange() {
		if (this.selectGrade && this.oldSelectGeade !== this.selectGrade) {
			this.oldSelectGeade = this.selectGrade;
			this.panels = [];
			this.isLoadComplete = false;
			this.getClasses();
		}
	}

	// 班级改变事件
	classesChange() {
		if (this.selectClass && this.oldSelectClass !== this.selectClass) {
			this.oldSelectClass = this.selectClass;
			this.isLoadComplete = false;
			this.panels = [];
			this.getSubjects();
		}
	}

	// 学科改变事件
	subjectsChange() {
		if (this.selectSubjects && this.oldSelectSubjects !== this.selectSubjects) {
			this.oldSelectSubjects = this.selectSubjects;
			this.panels = [];
			this.isLoadComplete = false;
			// this.getEditionList();
			this.getSemesterList();
		}
	}

	// // 教材版本改变事件
	// editionsChange() {
	// 	if (this.selectEdition && this.oldSelectEdition !== this.selectEdition) {
	// 		this.oldSelectEdition = this.selectEdition;
	// 		this.panels = [];
	// 		this.getSemesterList();
	// 	}
	// }

	// 学期改变事件
	semesterChange() {
		if (this.selectSemester && this.oldSelectSemester !== this.selectSemester) {
			this.oldSelectSemester = this.selectSemester;
			this.panels = [];
			this.isLoadComplete = false;
			this.getList();
		}
	}

	getList() {
		this.panels = [];
		if (this.selectGrade && this.selectClass.id && this.selectSubjects.id && this.selectSemester.id) {
			// this.getCurrentOrNextLessonInfo();
			this.resourceHomeInterface.getList({
				gradeCode: this.selectGrade.gradeCode,
				classId: this.selectClass.id,
				subjectCode: this.selectSubjects.id,
				// editionCode: this.selectEdition.id,
				semesterCode: this.selectSemester.id,
				resource: this.resource,
				gardenId: this.accountService.getCurrentGardenId,
			}).subscribe((res) => {
				this.panels = res;
				this.isPending = false;
				this.isLoadComplete = true;
				this.cacheDict = {};
				if (this.panels.length > 0) {
					this.getClickOutlineId();
				}
			});
		}
	}

	getGrades() {
		this.panels = [];
		this.selectGrade = null;
		this.oldSelectGeade = null;
		this.gradesLoadComplete = false;
		this.originationInterface.getGradeListByTeacherId(
			this.accountService.getAccountId(),
			this.currentGardenId
		).subscribe((res) => {
			this.grades = res;
			this.gradesLoadComplete = true;
			if (res.length > 0) {
				this.selectGrade = res[0];
				this.oldSelectGeade = this.selectGrade;
				for (let i = 0; i < this.grades.length; i++) {
					if (this.grades[i].gradeCode === this.cacheDict.gradeCode) {
						this.selectGrade = this.grades[i];
						this.oldSelectGeade = this.selectGrade;
					}
				}
				this.getClasses();
			} else {
				this.ellipticalTitle = '暂无相应年级安排，请联系管理员';
				this.isPending = false;
				this.isLoadComplete = true;
				this.subjectsLoadComplete = true;
				this.classesLoadComplete = true;
				this.semestersLoadComplete = true;
				this.selectClass = null;
				this.selectSubjects = null;
				this.selectSemester = null;
				this.semesters = [];
				this.classes = [];
				this.subjects = [];
			}
		});
	}

	getClasses() {
		this.classesLoadComplete = false;
		this.resourceHomeInterface.getClasses({gradeId: this.selectGrade.id}).subscribe(data => {
			this.classesLoadComplete = true;
			this.selectClass = null;
			if (data.length > 0) {
				this.classes = data;
				this.selectClass = data[0];
				this.oldSelectClass = this.selectClass;
				this.getSubjects();
			} else {
				this.ellipticalTitle = '暂无相应课程安排，请联系管理员';
				this.isPending = false;
				this.classes = [];
				this.isLoadComplete = true;
				this.subjectsLoadComplete = true;
				this.semestersLoadComplete = true;
				this.subjects = [];
				this.selectSubjects = null;
				this.selectSemester = null;
				this.subjects = [];
				this.semesters = [];
			}

		});
	}

	getSubjects() {
		this.selectSubjects = null;
		this.oldSelectSubjects = null;
		this.selectEdition = null;
		this.selectSemester = null;
		this.subjects = [];
		this.semesters = [];
		this.editions = [];
		this.subjectsLoadComplete = false;
		if (this.selectGrade) {
			this.originationInterface.getSubjectListByGradeId(
				this.accountService.getCurrentGardenId(),
				this.selectGrade.id,
				this.selectClass.id).subscribe((res) => {
				this.subjects = res;
				this.subjectsLoadComplete = true;
				if (res.length > 0) {
					this.selectSubjects = res[0];
					this.oldSelectSubjects = this.selectSubjects;
					for (let i = 0; i < this.subjects.length; i++) {
						if (this.subjects[i].id === this.cacheDict.subjectCode) {
							this.selectSubjects = this.subjects[i];
							this.oldSelectSubjects = this.selectSubjects;
						}
					}
					// this.getEditionList();
					this.getSemesterList();
				} else {
					this.ellipticalTitle = '暂无相应课程安排，请联系管理员';
					this.isPending = false;
					this.isLoadComplete = true;
					this.semestersLoadComplete = true;
					this.semesters = [];
					this.selectSemester = null;
				}
			});
		}
	}

	// getEditionList() {
	// 	this.selectEdition = null;
	// 	this.selectSemester = null;
	// 	this.oldSelectEdition = null;
	// 	this.editions = [];
	// 	this.semesters = [];
	// 	if (this.selectGrade && this.selectSubjects) {
	// 		this.resourceHomeInterface.getEditionList({
	// 			gradeCode: this.selectGrade.gradeCode,
	// 			subjectCode: this.selectSubjects.id
	// 		}).subscribe((res) => {
	// 			this.editions = res;
	// 			if (res.length > 0) {
	// 				this.selectEdition = res[0];
	// 				this.oldSelectEdition = this.selectEdition;
	// 				for (let i = 0; i < this.editions.length; i++) {
	// 					if (this.editions[i].id === this.cacheDict.editionCode) {
	// 						this.selectEdition = this.editions[i];
	// 						this.oldSelectEdition = this.selectEdition;
	// 					}
	// 				}
	// 				this.getSemesterList();
	// 			} else {
	// 				this.isLoadComplete = true;
	// 			}
	// 		});
	// 	}
	// }

	getSemesterList() {
		this.selectSemester = null;
		this.oldSelectSemester = null;
		this.semesters = [];
		this.semestersLoadComplete = false;
		if (this.selectSubjects && this.selectGrade) {
			this.resourceHomeInterface.getSemesterList({
				gradeCode: this.selectGrade.gradeCode,
				subjectCode: this.selectSubjects.id,
				gardenId: this.currentGardenId
				// editionCode: this.selectEdition.id
			}).subscribe((res) => {
				this.semesters = res;
				this.semestersLoadComplete = true;
				if (res.length > 0) {
					this.selectSemester = res[0];
					this.oldSelectSemester = this.selectSemester;
					for (let i = 0; i < this.semesters.length; i++) {
						if (this.semesters[i].id === this.cacheDict.semesterCode) {
							this.selectSemester = this.semesters[i];
							this.oldSelectSemester = this.selectSemester;
						}
					}
					this.getList();
				} else {
					this.isPending = false;
					this.isLoadComplete = true;
					this.ellipticalTitle = '尚未配置版本，请联系管理员';
				}
			});
		}
	}

	getClickOutlineId() {
		this.resourceHomeInterface.getClickOutlineId({
			rootOutlineId: this.panels[0].rootId,
			resource: this.resource
		}).subscribe((res) => {
			this.clickId = res.clickOutlineId;
		});
	}

	getOutlineDictionaryCache() {
		this.resourceHomeInterface.getOutlineDictionaryCache(this.resource).subscribe((res) => {
			this.cacheDict = res;
		});
	}

	// 獲得是否在上課
	private getCurrentOrNextLessonInfo() {
		this.resourceClassesInterface.getCurrentOrNextLessonInfo(this.selectGrade.id, this.selectSubjects.id).subscribe((data) => {
			if (data) {
				const currentTime = new Date().getTime();
				const startTime = data['startTimestamp'];
				const endTime = data['endTimestamp'];
				// 如果课程未开始，设置课程开始时录像按钮可点击
				if ((startTime && startTime > currentTime) || (endTime && endTime < currentTime)) {
					this.isCurrent = false;
				} else {
					this.isCurrent = true;
				}
			} else {
				this.isCurrent = false;
			}
		});
	}

	nodeClick($event) {
		this.goToPageByType($event.type, $event.data);
	}

	private goToPageByType(type, data) {
		switch (type) {
			case -1:
				// 行点击
				if (this.type === -1) {
					this.rowClick(data);
				} else {
					this.goToPageByType(this.type, data);
				}
				break;
			case 0:
				// 备课
				this.goPrepare(data);
				break;
			case 1:
				// 精品课
				this.goManager(data);
				break;
			case 2:
				this.goExercises(data);
				break;
			default:
				break;
		}
	}

	// 点击精品课
	private goManager(data) {
		if (this.type === -1) {
			this.router.navigate(['resource/home/' + this.type + '/info', data.id], {
				queryParams: {
					subjectCode: data.subjectCode,
					title: data.title,
					gradeCode: this.selectGrade.gradeCode,
					type: 3,
					classId: this.selectClass.id
				}
			});
		} else {
			this.router.navigate(['resource/home/' + this.type + '/manager', data.id], {
				queryParams: {
					subjectCode: data.subjectCode,
					title: data.title,
					classId: this.selectClass.id
				}
			});
		}
	}

	// 点击备课
	private goPrepare(data) {
		if (this.type === -1) {
			this.router.navigate(['resource/home/' + this.type + '/info', data.id], {
				queryParams: {
					subjectCode: data.subjectCode,
					title: data.title,
					classId: this.selectClass.id,
					gradeCode: this.selectGrade.gradeCode,
					type: 0
				}
			});
		} else {
			this.router.navigate(['resource/home/' + this.type + '/prepare', data.id], {
				queryParams: {
					title: data.title
				}
			});
		}

	}

	// 点击习题
	private goExercises(data) {
		if (this.type === -1) {
			this.router.navigate(['resource/home/' + this.type + '/info', data.id], {
				queryParams: {
					subjectCode: data.subjectCode,
					title: data.title,
					classId: this.selectClass.id,
					gradeCode: this.selectGrade.gradeCode,
					type: 1
				}
			});
		}

	}

	// 点击整行
	private rowClick(data) {
		this.router.navigate(['resource/home/' + this.type + '/info', data.id], {
			queryParams: {
				subjectCode: data.subjectCode,
				title: data.title,
				gradeCode: this.selectGrade.gradeCode,
				classId: this.selectClass.id
			}
		});
	}

}
