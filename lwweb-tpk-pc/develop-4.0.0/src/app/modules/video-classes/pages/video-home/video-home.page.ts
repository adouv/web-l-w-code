import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {Router} from '@angular/router';
import {PageService} from '../../../../services/page/page.service';
import {LwClientService} from '../../../../common/client';
import {AccountService} from '../../../../services/account/account.service';
interface HomeListModel {
	tabType: string;
	page: any;
	total: number;
	list: Array<any>;
	loaded: boolean;
}

interface WeekItemModel {
	endDate: string;
	isDefault: false;
	startDate: string;
	weekNo: number;
}

@Component({
	selector: 'video-home',
	templateUrl: 'video-home.page.html',
	styleUrls: ['video-home.page.scss']
})

export class VideoHomePage implements OnInit {
	weeks: WeekItemModel[] = [];  // 第几周下拉框
	rankWeekChecked: number; // 排行榜中周的选中项
	ranks: HomeListModel[];
	records: HomeListModel[];
	recordTypes: { value: number, label: string }[]; // 统计类型下拉框
	recordTypeChecked = 0; // 统计类型的选中项
	recordWeekChecked = 0; // 统计表中周的选中项
	statisticsDetail: any; // 排行榜详情
	loadStatisticsList = false; // 排行榜是否是详情页
	subjects: any; // 所有学科
	subjectsChecked: any; // 选中学科
	oldSubject: any;
	average = 0;
	teacherName = '';
	averageDefault = {
		img: 'no-course.png',
		title: '暂无听课评课活动'
	};
	@ViewChildren('videoContainer') private videoContainer: QueryList<ElementRef>;

	constructor(private videoClassesInterface: VideoClassesInterface,
				private clientService: LwClientService,
				private accountService: AccountService,
				private router: Router) {
	}

	ngOnInit() {
		this.paramInit();
		this.getScheduleWeeks();
		this.getAllCourseRank();
		this.getAllCourseRecords();
		this.getAverage();
		this.getStatisticsRankingList();
		this.getStatisticsList();
		this.getAllSubject();
		const timer = setTimeout(() => {
			this.clientService.setCurrentWindowOpacity(1);
			clearTimeout(timer);
		}, 300);
	}

	/**
	 * 参数初始化
	 */
	private paramInit() {
		this.weeks = [{} as WeekItemModel];
		this.recordTypes = [{value: 0, label: '评课'}, {value: 1, label: '被评课'}];
		this.records = [
			{tabType: 'all', page: PageService.setPageParams(1, 30), list: [], loaded: false, total: 0},
			{tabType: 'week', page: PageService.setPageParams(1, 30), list: [], loaded: false, total: 0},
			{tabType: 'average', page: PageService.setPageParams(1, 30), list: [], loaded: false, total: 0}
		];
		this.statisticsDetail = {
			tabType: 'details',
			page: PageService.setPageParams(1, 90),
			list: [],
			loaded: false,
			total: 0
		}
		this.ranks = [
			{tabType: 'all', page: PageService.setPageParams(1, 90), list: [], loaded: false, total: 0},
			{tabType: 'week', page: PageService.setPageParams(1, 90), list: [], loaded: false, total: 0},
			{tabType: 'average', page: PageService.setPageParams(1, 90), list: [], loaded: false, total: 0},
		];
	}

	/**
	 * 获取当前学期的周列表
	 */
	private getScheduleWeeks() {
		this.videoClassesInterface.getScheduleWeeks({past: true, gardenId: this.accountService.getCurrentGardenId}).subscribe(res => {
			if (res.length > 0) {
				this.weeks = res.reverse();
				this.rankWeekChecked = this.weeks[0].weekNo;
				this.recordWeekChecked = this.weeks[0].weekNo;
				this.getWeekCourseRank();
				this.getWeekCourseRecords();
			} else {
				this.ranks[1].loaded = true;
				this.records[1].loaded = true;
			}
		});
	}

	/**
	 * 获取选中周的开始时间和结束时间
	 * @param weeks
	 * @param weekChecked
	 * @returns {{startDate: string | any; endDate: string | any}}
	 */
	getWeekTime(weeks, weekChecked) {
		const index = weeks.length - weekChecked;
		return {
			startDate: weeks[index] ? weeks[index].startDate : '',
			endDate: weeks[index] ? weeks[index].endDate : '',
		};
	}

	/**
	 * 改变排行榜列表
	 * @param pageIndex
	 * @param currentRank
	 */
	changeRankList(pageIndex, currentRank) {
		currentRank.page = PageService.setPageParams(pageIndex, 90);
		if (currentRank.tabType === 'all') {
			this.getAllCourseRank();
			// 分页时滚动条回顶
			this.videoContainer.first.nativeElement.scrollTo(0, 0);
		} else if (currentRank.tabType === 'week'){
			this.getWeekCourseRank();
			this.videoContainer.last.nativeElement.scrollTo(0, 0);
		}else {
			this.getStatisticsRankingList();
		}
	}

	/**
	 * 获取总排行
	 */
	private getAllCourseRank() {
		let param = Object.assign({}, this.ranks[0].page, {gardenId: this.accountService.getCurrentGardenId})
		// this.ranks[0].page   // 添加gardenId前的参数
		this.videoClassesInterface.getCourseRank(param).subscribe(res => {
			this.ranks[0].loaded = true;
			this.ranks[0].total = res.totalCount;
			this.ranks[0].list = res.data;
		});
	}

	/**
	 * 获取周排行
	 */
	private getWeekCourseRank() {
		const param = {
			...this.ranks[1].page,
			...this.getWeekTime(this.weeks, this.rankWeekChecked),
			gardenId: this.accountService.getCurrentGardenId,
		};
		this.videoClassesInterface.getCourseRank(param).subscribe(res => {
			this.ranks[1].loaded = true;
			this.ranks[1].total = res.totalCount;
			this.ranks[1].list = res.data;
		});
	}

	/**
	 * 跳转到详情
	 * @param item
	 */
	goDetail(item) {
		if (item.hasPermission) {
			this.router.navigate(['video/unicast/' + item.id]);
		}
	}

	/**
	 * 获取课程统计周列表
	 */
	private getWeekCourseRecords() {
		const param = {
			...this.getWeekTime(this.weeks, this.recordWeekChecked),
			...this.records[1].page,
			type: this.recordTypeChecked,
		};
		this.videoClassesInterface.getCourseRecords(param).subscribe(res => {
			this.records[1].loaded = true;
			this.records[1].list = res.data;
			this.records[1].total = res.totalCount;
		});
	}

	/**
	 * 获取课程统计总列表
	 */
	private getAllCourseRecords() {
		const param = {
			...this.records[0].page,
			type: this.recordTypeChecked,
		};
		this.videoClassesInterface.getCourseRecords(param).subscribe(res => {
			this.records[0].loaded = true;
			this.records[0].list = res.data;
			this.records[0].total = res.totalCount;
		});
	}

	/**
	 * 改变记录列表(切换标签,切换类型/ 点击加载更多,切换周)
	 * @param changeTab
	 * @param record
	 */
	changeRecordList($event, changeTab?, record?) {
		if (changeTab) { // 切换总/周的标签页时, 默认选中当前周
			this.recordWeekChecked = this.weeks[0].weekNo;
		}
		if (record && record.page.size < record.total) {
			record.page.size = record.page.size + 30;
		}
		this.getAllCourseRecords();
		this.getWeekCourseRecords();
		this.getStatisticsList();
	}
	changeRecordDetailList($event, changeTab?, record?, item?) {
		if (record && record.page.size < record.total) {
			record.page.size = record.page.size + 30;
		}
		this.getStatisticsDeatilList({
			gardenId: record.gardenId,
			teacherId: record.teacherId,
			subjectCode: record.subjectCode,
		})
	}

	/*
	 * 获得平均分
	 *
	 * */
	getAverage() {
		this.videoClassesInterface.getAverage({
			teacherId: this.accountService.getAccountId(),
			gardenId: this.accountService.getGardenId()
		}).subscribe((data)=> {
			console.log(data);
			this.average = data.data;
		})
	}

	// 获得排行榜数据
	getStatisticsRankingList() {
		this.teacherName = this.teacherName.trim();
		const param = {
			...this.ranks[2].page,
			subjectCode: this.subjectsChecked || '',
			teacherName: this.teacherName || '',
		};
		this.videoClassesInterface.getStatisticsRankingList(param).subscribe((res)=> {
			if(this.teacherName == '') {
				this.averageDefault = {
					img: 'no-course.png',
					title: '暂无听课评课活动'
				};
			}else{
				this.averageDefault = {
					img: 'no-search-default.png',
					title: '您的筛选条件无结果，请重新选择'
				};
			}
			this.ranks[2].loaded = true;
			this.ranks[2].list = res.data;
			this.ranks[2].total = res.totalCount;
		});
	}

	/*
	 * 查询评课排行榜
	 *
	 * */
	searchRanking(event) {
		if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13
			|| event.key === 'Enter' || event.code === 'NumpadEnter') {
			this.getStatisticsRankingList();
		}
	}

	// 获得排行榜详情数据
	getStatisticsList() {
		const param = {
			...this.records[2].page,
			subjectCode: '',
			gardenId: this.accountService.getGardenId(), // this.accountService.getGardenId
			teacherId: this.accountService.getAccountId()
		};
		this.videoClassesInterface.getStatisticsList(param).subscribe((res)=> {
			this.records[2].loaded = true;
			this.records[2].list = res.data;
			this.records[2].total = res.totalCount;
		});
	}

	getStatisticsDeatilList(params) {
		const param = {
				...this.statisticsDetail.page,
				subjectCode: params.subjectCode || '',
				gardenId: params.gardenId, // this.accountService.getGardenId
				teacherId: params.teacherId
			};
		this.videoClassesInterface.getStatisticsList(param).subscribe((res)=> {
			this.statisticsDetail.loaded = true;
			this.statisticsDetail.list = res.data;
			this.statisticsDetail.total = res.totalCount;
		});
	}

	// 跳转排行榜详情
	goStatisticsDetail(item) {
		// this.statisticsDetail.loaded = false;
		// this.statisticsDetail.list = [];
		// this.statisticsDetail.total = 0;
		this.loadStatisticsList = true;
		this.statisticsDetail = {
			tabType: 'details',
			page: PageService.setPageParams(1, 30),
			list: [],
			loaded: false,
			total: 0,
			hasPermission: item.hasPermission,
			subjectName: item.subjectName,
			teacherName: item.teacherName,
			gardenId: item.gardenId,
			teacherId: item.teacherId,
			subjectCode: item.subjectCode
		}
		this.getStatisticsDeatilList({
			gardenId: item.gardenId,
			teacherId: item.teacherId,
			subjectCode: item.subjectCode,
		});
	}

	// 切换左侧tab页
	changeTab($event) {
		if ($event.index != 2) {
			this.loadStatisticsList = false;
		}
	}

	// 返回到排行榜
	cancelRankingList() {
		this.loadStatisticsList = false;
	}

	// 跳转到点播详情
	goVideoStatistics(item) {
		// console.log(this.statisticsDetail.hasPermission);
		// if(!this.statisticsDetail.hasPermission){return;}
		this.router.navigate(['video/unicast/statistics/home'], {
			queryParams: {
				classId: item.classId,
				giveLessonTime: item.giveLessonTime
			}
		});
		console.log(item);
	}

	// 获得所有学科
	getAllSubject() {
		this.subjects = [];
		this.videoClassesInterface.getAllSubject(this.accountService.getGardenId()).subscribe((res)=> {
			this.subjects = res.data;
			this.subjects.unshift({
				id: '',
				name: '学科'
			})
		})
	}

	// 学科改变事件
	subjectChange() {
		console.log(this.subjectsChecked);
		if (this.oldSubject !== this.subjectsChecked) {
			this.oldSubject = this.subjectsChecked;
			this.getStatisticsRankingList();
		}
	}
}
