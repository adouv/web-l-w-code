import {Component, EventEmitter, Input, OnChanges, Output, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {AccountService} from '../../../../services/account';

interface CameraModel {
	pcPlayUrl: string;
	cameraName: string;
	displayName: string;
	defaultCamera: boolean;
}

@Component({
	selector: 'video-header',
	styleUrls: ['./video-header.component.scss'],
	templateUrl:'./video-header.component.html'
})

export class VideoHeadComponent implements OnInit ,OnChanges {
	@Input('videoDetails') videoDetails; // 视频详情页
	@Output('changeCamera') changeCamera = new EventEmitter<any>(); // 切换摄像头事件
	isUnicast: boolean; // 是否是点播页
	cameras: CameraModel[] = [];	// 摄像头列表
	checkedCamera: string;
	private classesId;  // 班级id
	private title = '';
	constructor(private router: Router, private activatedRoute: ActivatedRoute,
				private accountService: AccountService,
				private videoClassesInterface: VideoClassesInterface) {
		this.activatedRoute.params.subscribe(param => {
			this.classesId = param.id;
		});
		this.getPageType();
		this.getCamerasList();
	
	}

	ngOnInit() {
		if(this.isUnicast) { // 点播
			this.title = `${this.videoDetails.lessonTitle ? this.videoDetails.lessonTitle + '/' : ''}${this.videoDetails.teacherName?this.videoDetails.teacherName + '-':''}${this.videoDetails.subjectName?this.videoDetails.subjectName + '-':''}${this.videoDetails.gradeName?this.videoDetails.gradeName:''}${this.videoDetails.className&&this.videoDetails.className!=null&&this.videoDetails.className!='null'?this.videoDetails.className:''}${this.videoDetails.week?this.videoDetails.week:''}${this.videoDetails.period?'第' + this.videoDetails.period + '节':''}`
		}else { // 直播
			if(this.videoDetails.status == 1) {
				this.title = `${this.videoDetails.lessonTitle ? this.videoDetails.lessonTitle + '/' : ''}${this.videoDetails.teacherName?this.videoDetails.teacherName + '-':''}${this.videoDetails.subjectName?this.videoDetails.subjectName + '-':''}${this.videoDetails.gradeName?this.videoDetails.gradeName:''}${this.videoDetails.className?this.videoDetails.className:''}${this.videoDetails.week?this.videoDetails.week:''}${this.videoDetails.period?'第' + this.videoDetails.period + '节':''}`
			}else if(this.videoDetails.status == 0){
				this.title = `${this.videoDetails.lessonTitle ? this.videoDetails.lessonTitle + '/' : ''}${this.videoDetails.gradeName?this.videoDetails.gradeName:''}${this.videoDetails.className?this.videoDetails.className:''}-课间-${this.videoDetails.teacherName ? this.videoDetails.teacherName + '-' : ''}${this.videoDetails.subjectName ? this.videoDetails.subjectName + '-' : ''}${this.videoDetails.week?'周' + this.videoDetails.week:''}${this.videoDetails.period?'第' + this.videoDetails.period + '节':''}`
			}
		}
	}

	ngOnChanges(change): void {
		console.log('VideoHeadComponent ngOnChanges', change.videoDetails);
		// 如果课节信息发生改变，重新加载摄像头列表
		if (!change.videoDetails.firstChange
			&& JSON.stringify(change.videoDetails.previousValue) !== '{}') {
			console.log('课节信息改变，重新加载摄像头列表');
			this.getCamerasList();
			
		}
	}

	/**
	 * 切换摄像头下拉框
	 */
	onModelChange() {
		console.log(this.checkedCamera);
		for (const camera of this.cameras) {
			if (camera.pcPlayUrl === this.checkedCamera) {
				this.changeCamera.emit(camera);
			}
		}
	}

	/**
	 * 获得页面类型，是否是点播或者直播
	 */
	private getPageType() {
		this.isUnicast = this.router.url.indexOf('live') === -1;
		
	}

	/**
	 * 获取摄像头列表
	 */
	private getCamerasList() {
		this.videoClassesInterface.getCamerasList({
			gardenId: this.accountService.getCurrentGardenId(),
			id: this.classesId
		}).subscribe(res => {
			this.cameras = res.data;
			if (this.cameras && this.cameras.length > 0) {
				let hasDefault = false;
				for (const camera of this.cameras) {
					if (camera.defaultCamera) {
						hasDefault = true;
						this.checkedCamera = camera.pcPlayUrl;
						this.changeCamera.emit(camera);
						break;
					}
				}
				if (!hasDefault) {
					this.checkedCamera = this.cameras[0].pcPlayUrl;
					this.changeCamera.emit(this.cameras[0]);
				}
			}
		});
	}
}
