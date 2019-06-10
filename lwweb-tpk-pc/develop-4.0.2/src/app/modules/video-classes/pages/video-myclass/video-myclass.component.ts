import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoClassesService } from '../../../../services/videos/video-classes.service';
import { LwStorageService } from '../../../../common/cache';
import { ScrollEvent } from 'ngx-scroll-event';
import { Observable, Subscription } from 'rxjs/Rx';


@Component({
	selector: 'video-myclass',
	templateUrl: './video-myclass.component.html',
	styleUrls: ['./video-myclass.component.scss']
})
export class VideoMyclass implements OnInit {
	//组件全部加载 判断列表是否显示
	isloadComplete = false;
	//是否加载年级
	isloadGradePart = false;
	//是否加载班级
	isloadClassPart = false;
	//当前选中的园区
	currentGardenId: any;
	//路由参数对象
	routeObj = {
		currentSubjectCode: '',
		gradeId: '',
		classId: '',
		isRouter: true
	};
	//分页对象
	page = {
		offset: 0,
		size: 40,
		page: 1,
	};
	//第一次加载
	firstLoad = {
		firsrLoadGrade: true,
		firstLoadClass: true
	};
	//第一次跳入当前页面
	firstLoadSubject = true;
	//当前选中的学科
	currentSubjectCode: string;
	//选中的学科下表
	selectTabIndex: number = -1;
	//选中的学科对象
	selectTab: any = {};
	//学科列表
	mySubjectsList: any = [];
	//当前选中的年级
	selectedGrade: any;
	myGradesList: any = [];

	selectedClazz: any;
	myClazzList: any = [];

	lessons: any = [];
	//多次加载限制条件
	isScroll = false;

	// 当前条件下的我的课总条数
	currentTotal: any = 0;
	lessonsTotal: any = 0;
	@ViewChild('inBox') in: ElementRef;

	subscription: Subscription = null;
	timer = true;

	constructor(
		private router: Router,
		private activeRoute: ActivatedRoute,
		private lwStorageService: LwStorageService,
		private videoClassesService: VideoClassesService,
	) {
		this.activeRoute.queryParams.subscribe(out => {
			this.routeObj['currentSubjectCode'] = out.subjectCode;
			this.routeObj['gradeId'] = out.gradeId;
			this.routeObj['classId'] = out.classId;
		});
	}

	ngOnInit(): void {
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id
		// this.getLessons(this.routeObj);  // 详情页返回
		this.getMyclassesSubjectNameList();

	}

	// 获取tab我的课列表
	getMyclassesSubjectNameList() {
		let params = {
			gardenId: this.currentGardenId,
			gradeId: this.routeObj.gradeId,
			classId: this.routeObj.classId,
			subjectCode: this.routeObj.currentSubjectCode,
			offset: 0,
			size: 40,
			page: 1,
		};
		//如果条件下只有一个课节，且没有播放地址，进入详情后从详情跳转到列表，该课节会隐藏，这是需要选中到学科列表的第一个学科，加载信息
		let lessons = this.videoClassesService.getMyClassLessonList(params);
		let tabList = this.videoClassesService.getMyClassSubjectNameList({ gardenId: this.currentGardenId });
		Observable.forkJoin(lessons, tabList).subscribe(out => {
			out[1].forEach((item, index) => {
				if (item.subjectCode === this.routeObj.currentSubjectCode) {
					if (out[0].data.length == 0) {
						this.selectTabIndex = 0;
						this.routeObj.classId = '';
						this.routeObj.gradeId = '';
					} else {
						this.selectTabIndex = index;
					}
				}
			});
			this.mySubjectsList = out[1];
			if (this.mySubjectsList.length > 0) {
				this.changeClass(this.selectTabIndex);
			} else {
				this.isloadComplete = true;
			}
		});
	}

	// 切换我的课
	changeClass(tabIndex?) {
		if (tabIndex == 0 && this.selectTabIndex == 0) {
			tabIndex = 0;
		} else if (tabIndex == 0 && this.selectTabIndex != 0) {
			if (this.firstLoadSubject) {
				tabIndex = this.selectTabIndex;
			}
			this.firstLoadSubject = false;
		}
		this.firstLoadSubject = false;
		this.selectTab = this.mySubjectsList[tabIndex];
		this.currentTotal = 0;
		this.currentTotal = this.selectTab.total;
		if (this.selectTab.subjectCode !== this.routeObj.currentSubjectCode) {
			this.routeObj.currentSubjectCode = this.selectTab.subjectCode;
			this.routeObj.classId = '';
			this.routeObj.gradeId = '';
		}
		this.firstLoad = {
			firsrLoadGrade: true,
			firstLoadClass: true
		};
		this.lessons = [];
		this.isloadComplete = false;
		this.isloadGradePart = false;
		this.selectedGrade = {};
		this.page = {
			offset: 0,
			size: 40,
			page: 1,
		};
		this.getClassGradeList(this.selectTab);
	}

	// 查询课的年级列表
	getClassGradeList(currentTab) {
		let params = {};
		params['gardenId'] = this.currentGardenId;
		params['subjectCode'] = currentTab.subjectCode;
		this.videoClassesService.getMyClassesGradeList(params).subscribe(out => {
			this.myGradesList = out.map(item => {
				return Object.assign({}, { name: item.gradeName, active: item.gradeId }, item);
			});
			this.myGradesList.forEach(item => {
				if (item.gradeId == this.routeObj.gradeId) {
					this.selectedGrade = item;
				}
				this.isloadGradePart = false;
			});
			if (this.firstLoad.firsrLoadGrade) {
				this.getClassGradeClazzList(this.routeObj);
				this.firstLoad.firsrLoadGrade = false;
			}
		});
	}

	// 接收选中的当前年级
	selectedGradeFn(currentSelectedGrade) {
		if (!currentSelectedGrade) {  // 全部情况
			currentSelectedGrade = {};
			currentSelectedGrade['gradeId'] = '';
			currentSelectedGrade['subjectCode'] = this.routeObj.currentSubjectCode;
			this.routeObj.gradeId = '';
		}
		this.lessons = [];
		this.selectedGrade = currentSelectedGrade;
		this.currentTotal = 0;
		this.currentTotal = this.selectedGrade.total;
		this.firstLoad.firstLoadClass = true;
		this.routeObj.classId = '';
		this.isloadComplete = false;
		this.isloadClassPart = true;
		this.page = {
			offset: 0,
			size: 40,
			page: 1,
		};
		this.getClassGradeClazzList(this.selectedGrade);

	}

	// 查询课的年级下的班级列表
	getClassGradeClazzList(currentGrade) {
		let params = {};
		if (currentGrade.isRouter) {
			params['gradeId'] = currentGrade.gradeId;
			params['subjectCode'] = currentGrade.currentSubjectCode;
		} else {
			params['gradeId'] = currentGrade.gradeId;
			params['subjectCode'] = this.selectedGrade.subjectCode;
		}
		params['gardenId'] = this.currentGardenId;

		this.videoClassesService.getMyClassesClazzList(params).subscribe(out => {
			this.myClazzList = out.map(item => {
				return Object.assign({}, { name: item.className, active: item.classId }, item);
			});
			this.isloadClassPart = false;
			if (this.firstLoad.firstLoadClass) {
				if (this.selectedGrade && this.routeObj.gradeId != this.selectedGrade.gradeId) {
					this.routeObj.gradeId = this.selectedGrade.gradeId;
				}
				this.firstLoad.firstLoadClass = false;

				this.getLessons(this.routeObj);
			}

		});
	}

	// 接收选中的班级
	selectedClazzFn(currentSelectedClazz) {
		if (!currentSelectedClazz) {
			currentSelectedClazz = {};
			currentSelectedClazz['gradeId'] = '';
			currentSelectedClazz['calssId'] = '';
			this.routeObj.classId = '';
			if (this.selectedGrade && this.selectedGrade.gradeId) {
				currentSelectedClazz['gradeId'] = this.selectedGrade.gradeId;
			} else {
				currentSelectedClazz['gradeId'] = '';
			}
		} else {
			this.routeObj.classId = currentSelectedClazz.classId;
		}

		this.lessons = [];
		this.selectedClazz = currentSelectedClazz;
		this.currentTotal = 0;
		this.currentTotal = this.selectedClazz.total;
		this.isloadComplete = false;
		this.page = {
			offset: 0,
			size: 40,
			page: 1,
		};
		this.getLessons(this.selectedClazz);
	}

	// 获取当前科目，当前年级，当前班级下的lessons
	getLessons(currentSelectedClass) {
		let params = {};
		if (currentSelectedClass.isRouter) {
			params['subjectCode'] = currentSelectedClass.currentSubjectCode;
			if (!currentSelectedClass.gradeId) {
				params['gradeId'] = this.selectedGrade.gradeId;
			} else {
				params['gradeId'] = currentSelectedClass.gradeId;
			}
		} else {
			params['subjectCode'] = this.selectedGrade.subjectCode;
			params['gradeId'] = this.selectedGrade.gradeId;
		}
		params['gardenId'] = this.currentGardenId;
		params['classId'] = currentSelectedClass.classId;
		params = Object.assign({}, params, this.page);
		this.videoClassesService.getMyClassLessonList(params).subscribe(out => {
			if (this.lessons.length == 0) {
				this.isloadComplete = true;
			}
			this.currentTotal = 0;
			this.currentTotal = out.totalCount;
			let temp = out.data;
			this.lessons.push(...temp);
			this.lessons = this.lessons.map(item => {
				return item = Object.assign({}, item, {
					gradeClass: `${item.gradeName}${item.className}`,
					detailTime: `周${item.week}第${item.period}节`
				});
			});
			this.lessonsTotal = this.lessons.length;
			this.isScroll = false;
		});
	}

	// 面包屑跳转
	goVideoIndex() {
		this.router.navigate(['/video/index']);
	}

	// 详情页跳转
	goDetail(video) {
		if (video.hasPermission) {
			this.router.navigate(['video/unicast/' + video.id], {
				queryParams: {
					teacherId: video.teacherId,
					classId: video.classId,
					subjectCode: video.subjectCode,
					gradeId: video.gradeId,
					from: 'myLessons'
				}
			});
			window.localStorage.setItem('from', 'myLessons');
		}
	}

	// getScroll(evt) {
	// 	this.handleScroll(evt)
	// }

	// 翻页加载
	changePage() {
		this.page.page++;
		this.page.offset = (this.page.page + 1) * this.page.size;
		return this.page;
	};


	handleScroll(event) {

		// let sTop = event['currentTarget'].scrollTop;
		// let cHeight = event['currentTarget'].clientHeight;
		// let offsetHeight = this.in.nativeElement.offsetHeight;
		// if (offsetHeight - (event) <= 30 && this.isScroll) {
		// 	if ((Math.ceil(this.currentTotal / 40)) == 1) {
		// 		return;
		// 	}
		// 	if (this.page.page < (Math.ceil(this.currentTotal / 40))) {
		// 			this.isScroll = false;
		// 			setTimeout(_ => {
		// 				let page = this.changePage();
		// 				this.getLessons(this.routeObj);
		// 			},500)

		// 	}
		// }

		this.isScroll = true;
		let page = this.changePage();
		this.getLessons(page);

	}

}

