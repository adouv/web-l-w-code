import { AccountService } from './../../../../services/account/account.service';
import { VideoLiveDetailService } from './../../../../services/videos/video-live-detail.service';
import { VideoSwitchClassComponent } from './../../../../components/video-switch-class/video-switch-class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LwStorageService } from '../../../../app.export';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { LeavingMessageComponent } from '../../components';
import { VideoResourceComponent } from '../../../../components/video-resource/video-resource.component';
import { SussService } from '../../../../common/suss';


export interface VideoDetailModel {
	teacherName: string;
	subjectName: string;
	gradeName: string;
	className: string;
	totalClicks: number;
	classId: string;
	teachDate: string;
	teachStartTime: string;
	teachEndTime: string;
	gardenId: string;
	giveLessonTime: string;
	gradeId: string;
	subjectCode: string;
	teacherId: string;
	period: string;
	pcPlayUrl: string;
	status: number; // 0课间 1课中
	countDownTime: number; // 距课间或开始上课的时间
	type: any;

}

@Component({
	selector: 'page-video-detail',
	templateUrl: 'video-live-detail.page.html',
	styleUrls: ['./video-live-detail.page.scss']
})

export class VideoLiveDetailPage implements OnInit {
	videoNum;
	source: any;
	// testUrl=["rtmp://media3.sinovision.net:1935/live/livestream","rtmp://ns8.indexforce.com/home/mystream","rtmp://58.200.131.2:1935/livetv/hunantv"]
	playType = "live";
	noSource = false;
	testUrl = [
		"http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4",
		"http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4",
		"http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4"
	]
	// 右侧切换的组件
	tabsComponents: any[] = [
		{ label: '班级切换', component: VideoSwitchClassComponent },
		{ label: '备课资源', component: VideoResourceComponent },
		{ label: '留言', component: LeavingMessageComponent }
	];
	classesId: string; // 班级id
	gradeId: string; // 年级id
	videoLiveDetails: VideoDetailModel; // 详情页数据
	tabInputs: Array<any>; // 传入右侧组件的数据
	isValidate = false; // 是否有权限评价
	isCamera: boolean;
	curentGardenId: any;
	loadComplete = false;
	constructor(private activatedRoute: ActivatedRoute, private suss: SussService,
		private storageService: LwStorageService,
		private router: Router, private accountService: AccountService,
		private videoClassesInterface: VideoClassesInterface, private videoLiveDetailService: VideoLiveDetailService) {
		this.videoLiveDetails = {} as VideoDetailModel;
	}

	ngOnInit() {

		// 获取当前园区Id
		this.curentGardenId = this.storageService.getCurrentGarden().gardenId;
		this.videoLiveDetailService.changeClass.subscribe((classId) => {
			this.classesId = classId;
			this.getLiveDetails();
		});
		this.getRouterParam();
		this.getLiveDetails();
		this.getLiveUrl(this.curentGardenId, this.classesId);
		/* 	this.source = [{ pcPlayUrl: "rtmp://ns8.indexforce.com/home/mystream" },
					   {pcPlayUrl:"rtmp://ns8.indexforce.com/home/mystream"},
					   // {pcPlayUrl:"rtmp://ns8.indexforce.com/home/mystream"},
					   // {pcPlayUrl:"http://localhost:8080/3.mp4"}
				   ]  */


		this.suss.subscriptionMessage().subscribe(res => {
			console.log(res);
			this.videoLiveDetails = res.val;
			this.getLiveUrl(this.curentGardenId, res.val.classId);
		});
	}

	/**
	 * 获取直播地址
	 */
	getLiveUrl(gardenId, id) {
		this.source = null;
		let param = { gardenId: gardenId, id: id };
		this.videoClassesInterface.getCamerasList(param).subscribe((res) => {
			console.log("直播详情获取视频地址：", res);
			this.loadComplete = true;
			if (res && res.data) {
				this.source = res.data;
				this.videoNum = this.source.length;
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
			}
		});
	}
	/**
	 * 获取路由参数
	 */
	private getRouterParam() {
		this.activatedRoute.params.subscribe(param => {
			this.classesId = param.id;
		});
	}

	/**
	 * 切换摄像头
	 */
	changeCamera(event) {
		console.log('切换摄像头', event);
		// this.source = event;
		this.isCamera = true;
	}

	/**
	 * 跳转
	 */
	goJump(classesId?, gradeId?) {
		if (classesId && gradeId) {
			this.router.navigate(['video/live/'], { queryParams: { classesId: classesId, gradeId: gradeId } });
		} else {
			this.router.navigate(['video/live/']);
		}
	}

	/**
	 * 获取直播详情
	 */
	private getLiveDetails() {
		this.videoClassesInterface.getLiveDetails(this.classesId).subscribe((res) => {
			console.log("直播详情接口返回：", res);
			this.videoLiveDetails = res.data;
			this.gradeId = this.videoLiveDetails.gradeId;
			// this.source = this.videoLiveDetails;
			this.isCamera = (!this.videoLiveDetails) || (this.videoLiveDetails && this.videoLiveDetails.pcPlayUrl == null);
			if (this.videoLiveDetails.teachDate && this.videoLiveDetails.teachStartTime) {
				this.videoLiveDetails.giveLessonTime = this.videoLiveDetails.teachDate + ' ' + this.videoLiveDetails.teachStartTime;
			}
			this.tabInputs = [
				{ videoDetails: this.videoLiveDetails, type: 'live' },
				{ videoDetails: this.videoLiveDetails, type: 'live' },
				{ videoDetails: this.videoLiveDetails, type: 'live' }
			];
			this.controlDisplay(this.videoLiveDetails);
			this.getValidate();
		});
	}

	/**
	 * 控制基本信息,点赞和课堂资源显示隐藏
	 * @param videoDetails
	 */
	private controlDisplay(videoDetails) {
		if (videoDetails.countDownTime) {
			setTimeout(() => {
				videoDetails.status = 1;
				this.getLiveDetails();
			}, videoDetails.countDownTime);
		}
	}

	// 获得评价权限
	private getValidate() {
		if (this.videoLiveDetails.classId && this.videoLiveDetails.subjectCode) {
			// this.videoClassesInterface.getValidate({
			// 	classId: this.videoLiveDetails.classId,
			// 	subjectCode: this.videoLiveDetails.subjectCode,
			// 	type: 3 // 权限类型（1：常态课直播，2：常态课点播，3：评课）
			// }).subscribe(res => {
			// 	const isSelf = this.videoLiveDetails.teacherId.split(',').indexOf(this.storageService.get('user').accountId) !== -1;
			// 	this.isValidate = res && !isSelf;
			// });
			this.videoClassesInterface.getValidate({
				gardenId: this.curentGardenId,
				classId: this.videoLiveDetails.classId,
				subjectCode: this.videoLiveDetails.subjectCode,
				type: 3 // 权限类型（1：常态课直播，2：常态课点播，3：评课）
			}).subscribe(res => {
				const isSelf = this.videoLiveDetails.teacherId.split(',').indexOf(this.storageService.get('user').accountId) !== -1;
				this.isValidate = res && !isSelf;
			});
		}
	}

	// goInvitation() {
	// 	this.router.navigate(['video/invitation'], {
	// 		queryParams: {
	// 			type: 'live'
	// 		}
	// 	});
	// }

	goVideoIndex() {
		/* 	this.router.navigateByUrl("video/index").then(() => {
				this.router.navigate(['video/live/2']);
			  }); */
		this.router.navigate(['/video/index']);
	}
}
