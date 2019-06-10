import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LwHttpService} from '../../../../common/http/index';
import {LW_MODULE_CODE, ModuleCode} from '../../../../common/config/index';
import {ResponseActivity} from '../../../../dto/response/ResponseActivity.Dto';
import {VideoClassesService} from '../../../../services/videos/video-classes.service';
import {NzMessageService, NzModalService, NzModalSubject} from 'ng-zorro-antd';
import {VideoFollowPage} from '../video-follow/video-follow.page';
import {AccountService} from '../../../../services/account';

@Component({
	selector: 'video-index',
	templateUrl: 'video-index.page.html',
	styleUrls: ['video-index.page.scss']
})

export class VideoIndexPage implements OnInit, OnDestroy {
	/**
	 * 评课活动列表
	 */
	activityList: any[] = [];

	activityRequestParams: any = {};
	activityResponseItem: ResponseActivity;
	// 点播视频列表
	unicastList: any[] = [];
	isShowButton = true;
	@ViewChild('unicastListEle') unicastListEle: ElementRef;
	load = false;
	followBox: any;

	//@ViewChild(VideoLivePage) livePage: VideoLivePage;
	constructor(private router: Router,
				private httpService: LwHttpService,
				private videoClassesService: VideoClassesService,
				private accountService: AccountService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
				private modalService: NzModalService,
				private subject: NzModalSubject,
				private message: NzMessageService) {
	}

	ngOnInit() {
		this.getActivityList();
		this.getUnicastList();
		// this.checkHasAttention();
	}

	/**
	 * 页面销毁调用
	 */
	ngOnDestroy() {
		if (this.followBox) {
			this.followBox.destroy('onCancel');
		}
		// console.log(document.getElementsByTagName("nz-modal"));
		// console.log(document.querySelectorAll("nz-modal"));
	}

	/**
	 * 切换活动面板
	 * @param item
	 * @param $event 0
	 */
	switchActivityTabs(item, $event) {
		this.activityResponseItem = item;
	}

	/**
	 * 获取活动列表
	 */
	getActivityList() {
		this.activityResponseItem = {id: 0, initiatorName: '', appraiseeName: '', startTime: '', endTime: '', name: ''};
		this.activityRequestParams.offset = 0;
		this.activityRequestParams.size = 5;
		console.log(this.activityRequestParams);
		this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/appraise', this.activityRequestParams).subscribe(response => {
			if (response) {
				this.activityList = response;
				this.activityResponseItem = this.activityList[0];
			}
			setTimeout(() => {
				this.load = false;
			}, 1000);
		});
	}

	/**
	 * 获取点播视频列表
	 */
	getUnicastList() {
		this.videoClassesService.getUnicastListForPermission({
			offset: 0,
			size: 15,
			gardenId: this.accountService.getCurrentGardenId(),
		}, (data, totalCount) => {
			this.unicastList = data;
			setTimeout(() => {
				this.load = false;
			}, 1000);
		});
	}

	/**
	 * 跳转点播视频详情
	 */
	goVideoDetail(video) {
		this.router.navigate(['video/unicast/' + video.id]);
	}

	goActivityDetail(activity) {
		// url:'invitation/detail'+acitvity.id+type+valuationStatus   type:0 别人邀请我  1 我邀请别人   valuationStatus:'1' 评课 '0' 被评课
		this.router.navigate(['invitation/detail/' + activity.id + '/0/1']);
	}

	// 弹出关注弹框
	btnFollow(closable) {
		this.followBox = this.modalService.open({
			title: '设置关注标签',
			content: VideoFollowPage,
			footer: null,
			width: 800,
			class: 'ad-model',
			wrapClassName: 'follow-modal',
			maskClosable: false,
			closable: closable,
			onOk: () => {
				// this.getActivityList();
				this.getUnicastList();
				this.checkHasAttention();
				this.accountService.CreateComponent('1');
			}
		});
	}

	// 是否显示关注按钮，1：有可以关注的数据，2：没有进行过关注
	checkHasAttention(): void {
		const params: any = {};
		params.gardenId = this.accountService.getCurrentGardenId();
		params.accountId = this.accountService.getAccountId();
		this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/attention/sourceList', params).subscribe(res => {
			if (res.length <= 0) {
				this.isShowButton = false;
			} else {
				// 没有关注过强制弹框关注
				this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/attention/checkHasAttention', params).subscribe(response => {
					if (!response) {
						this.btnFollow(false);
					}
				});
			}
		});

	}

	goInvitationAdd() {
		this.router.navigate(['/invitation/add'], {
			queryParams: {
				tabIndex: -1
			}
		});
	}

	// 跳转量表管理
	goInvitationScale() {
		this.router.navigate(['/invitation/scale'], {
			queryParams: {
				tabIndex: 0
			}
		});
	}

	// 跳转查看任务页面
	goVodeoList() {
		this.router.navigate(['/video/list']);
	}
}
