import {Component, Input, OnChanges, OnInit, SimpleChanges, ElementRef, ViewChild} from '@angular/core';
import {UploadFile} from '../dialog/dialog-upload-file/upload-file';
import {ShowUploadFile} from '../dialog/dialog-show-upload-file/show-upload-file';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../../../services/dialog/dialog.service';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {LwStorageService} from '../../../../app.export';
import {VideoClassesService} from '../../../../services/videos/video-classes.service';
import {DialogEvaluate} from '../dialog/dialog-evaluate/dialog-evaluate';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
	selector: 'tabs-footer',
	templateUrl: './tabs-footer.html',
	styleUrls: ['./tabs-footer.scss']
})

export class TabsFooter implements OnChanges {
	isUnicast: boolean;
	@Input() videoDetails: any;
	@ViewChild('tplFooter') tplFooter;
	isSelf: boolean;
	isValidate = false;
	routerParams: any = {};
	modalTitle: string;
	isUsed = true;
	commentState:boolean = true;
	gardenId: any;

	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private videoClassService: VideoClassesService,
				private videoClassesInterface: VideoClassesInterface,
				private dialogService: DialogService,
				private messageService: NzMessageService,
				private storageService: LwStorageService) {
		
		// 获取当前园区Id
		this.gardenId = this.storageService.getCurrentGarden().gardenId; 
		this.modalTitle = '教学反思';
		this.getCommentSelf(this.gardenId);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.videoDetails.currentValue) {
			const userId = this.storageService.get('user').accountId;
			this.getPageType();
			if (this.videoClassService.isLessonBreak(this.videoDetails)) {
				this.getValidate();
			}
			if (this.videoDetails.teacherId) {
				this.isSelf = this.videoDetails.teacherId.split(',').indexOf(userId) !== -1;
			}
		}
	}

	// 跳转统计详情
	goStatistics() {
		this.getRouteParam();
		this.router.navigate(['video/unicast/statistics/' + this.videoDetails.id], {
			queryParams: {
				classId: this.routerParams.classId,
				subjectCode: this.routerParams.subjectCode,
				teacherId: this.routerParams.teacherId,
				gradeId: this.routerParams.gradeId
			}
		});
	}

	/**
	 * 获取路由参数
	 */
	private getRouteParam() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.routerParams.teacherId = res.teacherId;
			this.routerParams.subjectCode = res.subjectCode;
			this.routerParams.classId = res.classId;
			this.routerParams.gradeId = res.gradeId;
		}, (error) => {
			console.log(error);
		});
	}

	showRelection() {
		
		this.modalTitle = '教学反思';
		this.getSelfComment((data)=> {
			console.log("反思模版",data)
			console.log(this.commentState);
			if (data == null) {
				if(this.commentState === false){
					this.messageService.warning('暂无教学反思模板，请联系学校管理员');
				}else{
					this.isUsed = false;
					// 没有反思过
					this.dialogService.openDialog({
						content: DialogEvaluate,
						class: 'evaluation',
						footer: false,
						closable: false,
						mask: false,
						maskClosable: false,
						componentParams: {
							type: 1,
							isUsed: false,
							commentdata: null,
							videoDetails: this.videoDetails
						}
					});
				}
				
				
			} else {
				this.isUsed = true;
				// 有反思
				this.dialogService.openDialog({
					content: DialogEvaluate,
					class: 'evaluation',
					footer: false,
					closable: false,
					mask: false,
					maskClosable: false,
					componentParams: {
						type: 1,
						isUsed: true,
						commentdata: data,
						videoDetails: this.videoDetails
					}
				});
			}
		})
		
		
	}


	alertEvaluationDialog() {
		this.modalTitle = '教学评价';
		this.getCommentTeacher((data)=> {
			if (data.length === 0) {
				this.isUsed = false;
				// 没有评价过
				this.dialogService.openDialog({
					content: DialogEvaluate,
					class: 'evaluation',
					footer: false,
					closable: false,
					mask: false,
					maskClosable: false,
					componentParams: {
						type: 0,
						isUsed: false,
						commentdata: null,
						videoDetails: this.videoDetails
					}
				});
			} else {
				// 评价过
				this.getComment(data[0].courseCommentId, (result)=> {
					this.isUsed = true;
					this.dialogService.openDialog({
						content: DialogEvaluate,
						class: 'evaluation',
						footer: false,
						closable: false,
						mask: false,
						maskClosable: false,
						componentParams: {
							type: 0,
							isUsed: true,
							commentdata: result,
							videoDetails: this.videoDetails
						}
					});
				})
			}
		})
	}

	// 获得教学评价或者教学反思
	private getComment(id, callback) {
		this.videoClassesInterface.getComment(id).subscribe(data => {
			if (callback) {
				callback(data);
			}
		});
	}

	// 获得页面类型，是否是点播或者直播
	private getPageType() {
		if (this.router.url.indexOf('live') !== -1) {
			this.isUnicast = false;
		} else {
			this.isUnicast = true;
		}
	}

	private getValidate() {
		this.videoClassesInterface.getValidate({
			gardenId: this.gardenId,
			classId: this.videoDetails.classId,
			subjectCode: this.videoDetails.subjectCode,
			type: 3 // 权限类型（1：常态课直播，2：常态课点播，3：评课）
		}).subscribe(res => {
			this.isValidate = res;
		});
	}

	private getCommentTeacher(callback) {
		this.videoClassesInterface.getCommentTeacher({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime,
			commentatorId: this.storageService.get('user').accountId
		}).subscribe((res)=> {
			callback(res);
		})
	}

	private getSelfComment(callback) {
		this.videoClassesInterface.getSelfComment({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime,
		}).subscribe((res)=> {
			callback(res);
		});
		
	}

	getCommentSelf(gardenId){
		this.videoClassesInterface.getCommentSelf({gardenId: gardenId}).subscribe((data)=>{
			this.commentState = true;
		}, (error) => {
			if(error.error.state === 404){
				this.commentState = false;
			}
		})
	}
}
