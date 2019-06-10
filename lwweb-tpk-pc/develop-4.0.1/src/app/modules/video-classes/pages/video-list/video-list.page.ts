import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LwHttpService} from '../../../../common/http/index';
import {LW_MODULE_CODE, ModuleCode} from '../../../../common/config/index';
import {InvitationHomeService} from '../invitation-home/invitation-home.service';
import {PageService} from '../../../../services/page/page.service';
import {ScrollEvent} from 'ngx-scroll-event';
import {LwStorageService} from '../../../../common/cache';


@Component({
	selector: 'video-list',
	templateUrl: 'video-list.page.html',
	styleUrls: ['video-list.page.scss'],
	providers: [InvitationHomeService]
})

export class VideoListPage implements OnInit {
	selectIndex: number;     // 0: 个人任务 1：全校任务
	index: number;           // 0:我收到的评课 1:评价我的课 2：我发起的评课
	requestParams: any = {};
	activityList: any[] = []; // 活动列表
	statusList: any[];
	stagesList: any[];
	typesList: any[];
	keyword: string;
	@ViewChild('inBox') in: ElementRef;
	@ViewChild('outBox') out: ElementRef;
	totalCount: number; // 总数
	pageIndex = 1;
	pageSize = 40;       // 每页大小
	isloadComplete = false; // 是否加载完成
	defaultMessage: any; // 缺省信息
	rank: any;
	promise = false;

	page = {
		offset: 0,
		size: 40,
		page: 1,
	};

	isScroll = true;

	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private httpService: LwHttpService,
				private invitationHomeService: InvitationHomeService,
				private lwStorageService: LwStorageService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
	) {
		this.index = 0;
		this.keyword = '';
	}

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.selectIndex = res.tabIndex;
		}, (error) => {
			console.log(error);
		});
		if (!this.selectIndex) {
			this.selectIndex = 0;
		}
		this.hasPermission();
		this.initCheckCondition();
		this.getActivityList(false);
	}

	initCheckCondition() {
		this.rank = {page: PageService.setPageParams(1, this.pageSize), list: [], loaded: false, total: 0};
		switch (this.index) {
			case 0:
				this.statusList = [{id: 0, text: '待评课', check: false}, {id: 1, text: '评课中', check: false}, {
					id: 2,
					text: '已评课',
					check: false
				}];
				this.stagesList = [{id: 1, text: '进行中', check: false}, {id: 2, text: '已过期', check: false}];
				this.typesList = [{id: 0, text: '研讨型', check: false}, {id: 1, text: '诊断型', check: false}];
				break;
			case 1:
				this.statusList = [{id: 0, text: '待评课', check: false}, {id: 2, text: '已评课', check: false}];
				this.stagesList = [{id: 1, text: '进行中', check: false}, {id: 2, text: '已过期', check: false}];
				this.typesList = [{id: 0, text: '研讨型', check: false}, {id: 1, text: '诊断型', check: false}];
				break;
			case 2:
				this.statusList = [{id: 0, text: '待评课', check: false}, {id: 2, text: '已评课', check: false}];
				this.stagesList = [{id: 0, text: '未开始', check: false}, {id: 1, text: '进行中', check: false}, {
					id: 2,
					text: '已过期',
					check: false
				}];
				this.typesList = [{id: 0, text: '研讨型', check: false}, {id: 1, text: '诊断型', check: false}];
				break;
		}

	}

	/**
	 * 获取活动列表数据
	 */
	getActivityList(isMore: Boolean) {
		// if (isMore) {  点击加载
		// 	this.requestParams.offset = this.activityList.length;
		// } else {
		// 	this.requestParams.offset = 0;
		// }
		// this.isloadComplete = false;
		// this.requestParams.size = this.pageSize;
		// switch (this.index) {
		// 	case 0:
		// 		this.getAppraise(isMore);
		// 		break;
		// 	case 1:
		// 		this.getAppraised(isMore);
		// 		break;
		// 	case 2:
		// 		this.getInitiated(isMore);
		// 		break;
		// 	default:
		// 		this.getAppraise(isMore);
		// }


		if (isMore) {   // 滚动加载
			this.requestParams.offset = this.rank.page.offset;
		} else {
			this.requestParams.offset = 0;
			this.rank.page = PageService.setPageParams(1, this.pageSize);
		}
		this.isloadComplete = false;
		this.requestParams.size = this.pageSize;
		// this.requestParams.gardenId = this.lwStorageService.getCurrentGarden().gardenId;
		switch (this.index) {
			case 0:
				this.getAppraise(isMore);
				break;
			case 1:
				this.getAppraised(isMore);
				break;
			case 2:
				this.getInitiated(isMore);
				break;
			default:
				this.getAppraise(isMore);
		}
	}

	/**
	 * 我收到的评课
	 */
	getAppraise(isMore: Boolean) {
		this.invitationHomeService.getAppraise(this.requestParams).subscribe((res) => {
			this.isloadComplete = true;
			if (isMore) {
				this.activityList = this.activityList.concat(res.data);
			} else {
				this.activityList = res.data;
			}
			this.rank.total = res.totalCount;
			this.isScroll = true;
		});
	}

	/**
	 * 评价我的课
	 */
	getAppraised(isMore: Boolean) {
		this.invitationHomeService.getAppraised(this.requestParams).subscribe((res) => {
			this.isloadComplete = true;
			if (isMore) {
				this.activityList = this.activityList.concat(res.data);
			} else {
				this.activityList = res.data;
			}
			this.rank.total = res.totalCount;
			this.isScroll = true;
		});
	}

	/**
	 * 我发起的评课
	 */
	getInitiated(isMore: Boolean) {
		this.invitationHomeService.getInitiated(this.requestParams).subscribe((res) => {
			this.isloadComplete = true;
			if (isMore) {
				this.activityList = this.activityList.concat(res.data);
			} else {
				this.activityList = res.data;
			}
			this.rank.total = res.totalCount;
			this.isScroll = true;
		});
	}

	// 选中状态改变
	statusCheck(event, index, item) {
		const status = [];
		this.statusList[index].check = event;
		this.statusList.forEach(element => {
			if (element.check) {
				status.push(element.id);
			}
		});
		this.requestParams.status = status;
		this.activityList = [];
		this.getActivityList(false);
	}

	// 选中阶段改变
	stagesCheck(event, index, item) {
		const stages = [];
		this.stagesList[index].check = event;
		this.stagesList.forEach(element => {
			if (element.check) {
				stages.push(element.id);
			}
		});
		this.requestParams.stages = stages;
		this.activityList = [];
		this.getActivityList(false);
	}

	// 选中类型改变
	typesCheck(event, index, item) {
		const types = [];
		this.typesList[index].check = event;
		this.typesList.forEach(element => {
			if (element.check) {
				types.push(element.id);
			}
		});
		this.requestParams.types = types;
		this.activityList = [];
		this.getActivityList(false);
	}

	// 切换评课维度
	checkType(index) {
		this.index = index;
		this.requestParams = {};
		this.keyword = '';
		this.activityList = [];
		this.initCheckCondition();
		this.activityList = [];
		this.getActivityList(false);
	}

	// 搜索
	onSearch(event) {
		this.requestParams.keyword = event;
		this.activityList = [];
		this.getActivityList(false);
	}

	// 加载更多
	loadMore($event?) {
		// console.log('加载更多');
		// if (this.rank.page.size < this.rank.total) {  // 点击加载更多
		// 	this.rank.page.size = this.rank.page.size + this.pageSize;
		// 	this.getActivityList(true);
		// }

		// 滚动加载
		this.rank.page = PageService.setPageParams(++this.rank.page.index, this.pageSize);
		this.getActivityList(true);
	}

	/**
	 * 切换tabs
	 */
	changeTabType(index) {
		if (this.selectIndex !== index) {
			console.log(this.selectIndex);
		}
	}

	changeClass(event) {
		this.selectIndex = event;
	}

	routerGo(item) {
		// debugger;
		// url:'invitation/detail'+acitvity.id+type+valuationStatus   type:0 别人邀请我  1 我邀请别人   valuationStatus:'1' 评课 '0' 被评课
		const url = '/invitation/detail/';
		switch (this.index) {  // 0:我收到的评课 1:评价我的课 2：我发起的评课
			case 0:
				this.router.navigate([url + item.id + '/0/1']);
				break;
			case 1:
				this.router.navigate([url + item.id + '/0/0']);
				break;
			case 2:
				this.router.navigate([url + item.id + '/1/1']);
				break;
		}
	}

	// 跳转量表管理
	goInvitationScale() {
		this.router.navigate(['/invitation/scale'], {
			queryParams: {
				tabIndex: this.selectIndex
			}
		});
	}

	// 跳转新建活动
	goInvitationAdd() {
		this.router.navigate(['/invitation/add'], {
			queryParams: {
				tabIndex: this.selectIndex
			}
		});
	}

	hasPermission() {
		let params: any = {};
		params.type = 5;
		params.gardenId = this.lwStorageService.getCurrentGarden().gardenId;
		this.httpService.get(this.moduleCode.TPK_WEB, '/tpk/permission/hasPermission', params).subscribe(response => {
			this.promise = response;
		});
	}

	goVideoBack() {
		this.router.navigate(['/video/index'], {});
	}


	handleScroll(event: ScrollEvent) {
		let sTop = event['currentTarget'].scrollTop;
		let cHeight = event['currentTarget'].clientHeight;
		let offsetHeight;
		let timer = null;
		if(this.promise) {
			offsetHeight = this.in.nativeElement.offsetHeight;
		}else {
			offsetHeight = this.out.nativeElement.offsetHeight;
		}
		if (offsetHeight - (sTop + cHeight) <= 30 && this.isScroll) {
			if ((Math.ceil(this.rank.total / 40)) == 1) {
				return;
			}
			if (this.rank.page.index < (Math.ceil(this.rank.total / 40))) {
				if(timer){
					window.setTimeout(timer);
				}else {
					window.setTimeout(() => {
						this.loadMore();
						this.isScroll = false;
					},500)
				}
				
			}
		}
	}
}
