import { GARDEN_ID } from './../../../../services/account/account.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeavingMessageComponent, VideoListComponent } from '../../components';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { VideoClassesService } from '../../../../services/videos/video-classes.service';
import { LwStorageService } from '../../../../app.export';
import { VideoResourceComponent } from '../../../../components/video-resource/video-resource.component';
import { AccountService } from '../../../../services/account/account.service';
import { SussService } from '../../../../common/suss';

@Component({
	selector: 'page-video-detail',
	templateUrl: 'video-unicast-detail.page.html',
	styleUrls: ['./video-unicast-detail.page.scss']
})

export class VideoUnicastDetailPage implements OnInit {
	source: any;
	isVideoSource: boolean;
	videoLiveDetails: any;
	routerParams: any = {};
	videoTabs: any[] = [
		{ label: '课节切换', component: VideoListComponent },
		{ label: '备课资源', component: VideoResourceComponent },
		{ label: '留言', component: LeavingMessageComponent }
	];
	tabInputs: Array<any>;
	tabIndex: number = 0;
	playType = "video";
	videoSets = [];
	unicastId;
	from;//从哪个页面进入的
	type: any;
	loadComplete = false;
	noSource = false;
	constructor(private activatedRoute: ActivatedRoute,
		private videoClassesInterface: VideoClassesInterface,
		private router: Router,
		private storageService: LwStorageService,
		public accountService: AccountService,
		private videoClassesService: VideoClassesService, private suss: SussService) {
	}

	ngOnInit() {
		this.from = window.localStorage.getItem("from");
		this.getRouteParam();
		this.unicastId = this.activatedRoute.snapshot.params['id'];
		if (this.from == "focusLessons") {
			// 获取视频集
			this.getUnicastList();
		} else {
			this.getUnicastPlayDetails(this.unicastId);//点播记录id
			//获取点播信息
			this.getUnicastDetails(this.unicastId);
		}
		/* 	this.source = [{ pcPlayUrl: "http://111.207.101.79:81/2019/01/24/15/20190124154003240907860767426408.mp4" },
						{pcPlayUrl:"http://111.207.101.79:81/2019/01/24/15/20190124154003272777521121349779.mp4"},
						// {pcPlayUrl:"http://111.207.101.79:81/2019/01/24/15/20190124154003272777521121349779.mp4"},
						// {pcPlayUrl:"http://localhost:8080/3.mp4"}
					] */
		this.suss.subscriptionMessage().subscribe(res => {
			if (res.key === 'vd1') {
				this.videoLiveDetails = res.val;
				this.routerParams.teacherId = res.val.teacherId;
				this.routerParams.subjectCode = res.val.subjectCode;
				this.routerParams.classId = res.val.classId;
				this.routerParams.gradeId = res.val.gradeId;
				console.log(this.videoLiveDetails);
				this.getUnicastPlayDetails(res.val.id);
			}

		})
	}


	// 获得视频集
	private getUnicastList() {
		let params = {
			classId: this.routerParams.classId,
			subjectCode: this.routerParams.subjectCode,
			// teacherId: this.routerParams.teacherId,
			gradeId: this.routerParams.gradeId,
			gardenId: this.storageService.getCurrentGarden().gardenId,
			accountId: this.accountService.getAccountId()
		}
		this.videoClassesService.getUnicastList(params, (data) => {
			console.log("详情页获取视频集，", data, "getUnicastList更新unicastId：", this.unicastId);
			this.videoSets = data;
			if (data.length > 0) {
				this.unicastId = this.unicastId == "0" ? data[0].id : this.unicastId;
				this.getUnicastPlayDetails(this.unicastId);//获取点播视频地址
				//获取详情基本信息
				this.getUnicastDetails(this.unicastId);
			}
		});
	}

	// 获得点播地址
	private getUnicastPlayDetails(id) {
		this.source=[];
		this.loadComplete = false;
		this.noSource=false;
		this.videoClassesInterface.getUnicastPlayDetails(id).subscribe(res => {
			console.log("点播地址接口返回：", res);
			this.loadComplete = true;
			this.source = res.data;
			this.isVideoSource = !this.source || this.source && this.source.length > 0 && this.source[0].errorMsg == 1;
			if (this.source && this.source.length > 0) {
				let count = 0;
				this.source.forEach(element => {
					if (element.pcPlayUrl == null || element.pcPlayUrl == "" || !element.pcPlayUrl) {
						count++;
					}
				});
				if (this.source.length == count) {
					this.noSource = true;
				}
			}
		});
	}

	goJump() {
		this.router.navigate(['video/unicast/'], {
			queryParams: {
				classId: this.routerParams.classId,
				subjectCode: this.routerParams.subjectCode,
				teacherId: this.routerParams.teacherId,
				gradeId: this.routerParams.gradeId
			}
		});
	}

	// 跳转评
	goVideoIndex() {
		this.router.navigate(['video/index']);
	}

	// 返回
	goInvitation() {
		if (this.from == "playBack") {//课程回放
			this.router.navigate(['video/invitation'], {
				queryParams: {
					type: 'unicast',
					classId: this.routerParams.classId,
					subjectCode: this.routerParams.subjectCode,
					teacherId: this.routerParams.teacherId,
					gradeId: this.routerParams.gradeId
				}
			});
		} else if (this.from == "myLessons") {//我的课二级页面
			this.router.navigate(['video/myclass/'], {
				queryParams: {
					classId: this.routerParams.classId,
					subjectCode: this.routerParams.subjectCode,
					teacherId: this.routerParams.teacherId,
					gradeId: this.routerParams.gradeId
				}
			});
		} else {//我关注的课
			this.goVideoIndex();
		}

	}

	/**
	 * 获取路由参数
	 */
	private getRouteParam() {
		this.activatedRoute.queryParams.subscribe(res => {
			console.log("获取到查询参数：", res);
			this.routerParams.teacherId = res.teacherId;
			this.routerParams.subjectCode = res.subjectCode;
			this.routerParams.classId = res.classId;
			this.routerParams.gradeId = res.gradeId;
			this.tabIndex = res.tabIndex;
		}, (error) => {
			console.log(error);
		});
	}

	//获取详情基本信息
	private getUnicastDetails(id) {
		this.videoClassesService.getUnicastDetails(id, (data) => {
			this.videoLiveDetails = data[0];
			this.tabInputs = [
				{
					videoDetails: this.videoLiveDetails,
					type: 'video'
				},
				{
					videoDetails: this.videoLiveDetails,
					type: 'video'
				},
				{
					videoDetails: this.videoLiveDetails,
					type: 'video'
				}
			];
		});
	}

}
