import {Component} from '@angular/core';
import {PageService} from '../../../../services/page/page.service';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {AccountService} from '../../../../services/account/account.service';
import {DatePipe} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {InvitationHomeService} from './invitation-home.service';

@Component({
	selector: 'invitation-home',
	templateUrl: 'invitation-home.page.html',
	styleUrls: ['invitation-home.page.scss'],
	providers: [InvitationHomeService]
})

export class InvitationHomePage {
	selectIndex: any;
	invitationPage: any;
	inputKeyword: any;
	status: any;
	type: number; // 0 别人邀请我  1 我邀请别人
	checkInvitation: any;
	isHaveOption: boolean; // 是否有查询条件
	private routerParams: any;
	statusList = [
		{label: '全部', value: ''},
		{label: '待评', value: '0'},
		{label: '评课中', value: '1'},
		{label: '已评', value: '2'}
	];
	valuationStatus = '1'; // '1' 评课 '0' 被评课
	private gardenId: string;
	tabTitle: any;
	tabStatus: any;
	isClickLive: boolean;
	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				public datePipe: DatePipe,
				private videoClassesInterface: VideoClassesInterface,
				private accountService: AccountService,
				private invitationHomeService: InvitationHomeService) {
		this.selectIndex = 0;
		this.type = 0;
		this.invitationPage = {page: PageService.setPageParams(1, 10), list: [], loaded: false, total: 0};
		this.status = '';
		this.inputKeyword = '';
		this.isHaveOption = false;
		this.routerParams = {};
		this.tabStatus = 0;
		this.isClickLive = false;
		this.tabTitle = '查看直播';
		this.getRouteParam();
		if (!this.routerParams.type) {
			this.selectIndex = 0;
		} else {
			this.selectIndex = 1;
			if(this.routerParams.type=='live'){
				this.tabStatus = 1;
				this.isClickLive = true;
				this.tabTitle = '查看点播';
			}
		}
		this.gardenId = this.accountService.getGardenId();
		this.getData();
	}

	getData() {
		if (this.type === 0) {
			if (this.valuationStatus === '1') {
				this.getAppraise();
			} else {
				this.getAppraised();
			}
		} else {
			this.getInitiated();
		}
	}

	checkInvitationForList(data) {
		this.checkInvitation = data;
	}

	/**
	 * 切换别人邀请我/我发起的
	 */
	checkType(type) {
		this.type = type;
		this.isHaveOption = false;
		this.inputKeyword = '';
		this.invitationPage = {page: PageService.setPageParams(1, 10), list: [], loaded: false, total: 0};
		if (type === 1) {
			this.statusList.splice(2, 1);
		} else {
			this.statusList.splice(2, 1, {label: '评课中', value: '1'}, {label: '已评', value: '2'});
		}
		this.status = '';
		this.valuationStatus = '1';
		this.getData();
	}

	// 修改类型
	changeType(index) {
		if (this.selectIndex !== index) {
			console.log(this.selectIndex);
		}
	}

	goDetail() {
		if (this.checkInvitation) {
			this.router.navigate(['invitation/detail/' + this.checkInvitation.id + '/' + this.type + '/' + this.valuationStatus]);
		}
	}

	/**
	 * 切换评价过程的状态
	 * @param status
	 */
	checkStatus(status) {
		this.status = status;
		if (status !== '') {
			this.isHaveOption = true;
		}
		this.getData();
	}

	changeInvitationPageList($event, record) {
		if (record && record.page.size < record.total) {
			record.page.size = record.page.size + 10;
		}
		this.getData();
	}

	searchRanking($event) {
		this.inputKeyword = $event;
		this.getData();
	}

	/**
	 * 邀请我的-评价活动
	 */
	getAppraise() {
		this.invitationHomeService.getAppraise({
			// gardenId: this.gardenId,
			keyword: this.inputKeyword.trim(),
			status: this.status,
			...this.invitationPage.page
		}).subscribe((res) => {
			this.invitationPage.loaded = true;
			this.invitationPage.list = res.data;
			this.invitationPage.total = res.totalCount;
			this.checkInvitation = res.data[0];
		});
	}

	/**
	 * 邀请我的-被评价活动
	 */
	getAppraised() {
		this.invitationHomeService.getAppraised({
			// gardenId: this.gardenId,
			keyword: this.inputKeyword.trim(),
			status: this.status,
			...this.invitationPage.page
		}).subscribe((res) => {
			this.invitationPage.loaded = true;
			this.invitationPage.list = res.data;
			this.invitationPage.total = res.totalCount;
			this.checkInvitation = res.data[0];
		});
	}

	/**
	 * 我发起的评价活动
	 */
	getInitiated() {
		this.invitationHomeService.getInitiated({
			// gardenId: this.gardenId,
			keyword: this.inputKeyword.trim(),
			status: this.status,
			...this.invitationPage.page
		}).subscribe((res) => {
			this.invitationPage.loaded = true;
			this.invitationPage.list = res.data;
			this.invitationPage.total = res.totalCount;
			this.checkInvitation = res.data[0];
		});
	}

	/**
	 * 获取路由参数
	 */
	private getRouteParam() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.routerParams.type = res.type;
		}, (error) => {
			console.log(error);
		});
	}

	/**
	 * 切换评课/被评课状态
	 * @param status
	 */
	checkValuationStatus(status) {
		this.valuationStatus = status;
		this.inputKeyword = '';
		this.invitationPage.page = PageService.setPageParams(1, 10);
		this.status = '';
		if (this.valuationStatus === '0') {
			this.statusList.splice(2, 1);
		} else {
			this.statusList.splice(2, 1, {label: '评课中', value: '1'}, {label: '已评', value: '2'});
		}
		if (status === '1') {
			this.getAppraise();
		} else {
			this.getAppraised();
		}
	}
	goTab() {
		if(this.tabStatus == 0){
			this.tabStatus = 1;
			this.isClickLive = true;
			this.tabTitle = '查看点播';
		}else{
			this.tabStatus = 0;
			this.tabTitle = '查看直播';
		}
	}
	goBack() {
		this.router.navigate(['/video/index'], {});
	}
}
