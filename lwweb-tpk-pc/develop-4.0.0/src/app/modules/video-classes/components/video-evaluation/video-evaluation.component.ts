import {Component, ElementRef, Input, OnInit, ViewChild, Inject} from '@angular/core';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {FileDownloadService} from '../../../../services/file/file-download.service';
import {LwStorageService} from '../../../../app.export';
@Component({
	selector: 'teaching-evaluation',
	templateUrl: './video-evaluation.component.html',
	styleUrls: ['./video-evaluation.component.scss']
})

export class VideoEvaluationComponent implements OnInit {
	selectedTeaching: any;
	@Input() videoDetails: any;
	@Input() type: number;
	oldSelectVal: any;
	defaultMessage: string; // 默认缺省信息
	isHaveContent = false; // 是否有内容导出或者打印
	private data: any;
	private currentData: any;
	commentdata: any;
	isUsed = true;
	isStatistics = true;
	isShow = true;
	@ViewChild('evaluationContent') evaluationContent: ElementRef;
	teachings: { label: string; value: string; }[] = [];

	constructor(private videoClassesInterface: VideoClassesInterface, private fileDownloadService: FileDownloadService, private storageService: LwStorageService) {

	}

	ngOnInit() {
		if (this.type === 0) {
			this.getCommentTeacher((data)=> {
				if (data == null || data.length === 0) {
					this.defaultMessage = '暂无老师完成教学评价';
					this.commentdata = null;
				} else {
					this.teachings = data;
					if (data.length > 0) {
						this.data = data;
						this.selectedTeaching = data[0];
						for (const d of data) {
							if (d.accountId === this.storageService.get('user').accountId) {
								this.selectedTeaching = d;
							}
						}
						this.getComment(data[0].courseCommentId, (result)=> {
							this.commentdata = result;
						});
					}
				}
			});
		} else {
			// this.defaultMessage = '教师尚未提交教学反思';
			this.selectedTeaching = {
				accountId: this.videoDetails.teacherId
			};
			this.getSelfComment((data)=> {
				if (data == null) {
					this.defaultMessage = '教师尚未提交教学反思';
					this.commentdata = null;
				} else {
					this.commentdata = data;
				}
			})
		}
	}

	// // 获得教学评价或者教学反思
	// private getComment(type) {
	// 	this.videoClassesInterface.getComment({
	// 		classId: this.videoDetails.classId,
	// 		giveLessonTime: this.videoDetails.giveLessonTime,
	// 		commentatorId: this.selectedTeaching.accountId,
	// 		type: type
	// 	}).subscribe(data => {
	// 		if (data.length > 0) {
	// 			this.isHaveContent = true;
	// 			this.currentData = data[0];
	// 			this.evaluationContent.nativeElement.innerHTML = data[0].commentHtml;
	// 		} else {
	// 			this.isHaveContent = false;
	// 		}
	// 	});
	// }

	// 获得评价过我的老师
	// private getCommentTeacher() {
	// 	this.videoClassesInterface.getCommentTeacher({
	// 		classId: this.videoDetails.classId,
	// 		giveLessonTime: this.videoDetails.giveLessonTime
	// 	}).subscribe(data => {
	// 		this.teachings = data;
	// 		if (data.length > 0) {
	// 			this.data = data;
	// 			this.selectedTeaching = data[0];
	// 			for (const d of data) {
	// 				if (d.accountId === this.storageService.get('user').accountId) {
	// 					this.selectedTeaching = d;
	// 				}
	// 			}
	// 			this.getComment(this.type);
	// 		}
	// 	});
	// }

	// 根据班级查询视频集
	searchTeaching($event) {
		if (this.selectedTeaching && this.oldSelectVal !== this.selectedTeaching) {
			this.oldSelectVal = this.selectedTeaching;
			console.log(this.selectedTeaching);
			this.getComment(this.selectedTeaching.courseCommentId, (result)=> {
				this.commentdata = result;
			});
		}
	}

	// 导出
	exportFile() {
		if (this.commentdata != null) {
			// const fileServerUrl = this.envDefaultConfig.getServerUrl(this.moduleCode.TPK_WEB) + encodeURIComponent('/comment/file?id=' + this.commentdata.id);
			this.fileDownloadService.downloadFile({name: this.commentdata.downloadName, path: '', title: '导出成功'}, '/comment/file?id=' + this.commentdata.id);

			// this.fileDownloadService.downloadFileByFullPath(this., '文件');
			// this.videoClassesInterface.exportFile(this.commentdata.id).subscribe((data)=> {
			// 	console.log(data);
			// })
		}

	}

	printView() {
		this.fileDownloadService.printView(this.evaluationContent.nativeElement.querySelector('dialog-evaluate').innerHTML);
	}

	private getCommentTeacher(callback) {
		this.videoClassesInterface.getCommentTeacher({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime
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

	// 获得教学评价或者教学反思
	private getComment(id, callback) {
		this.videoClassesInterface.getComment(id).subscribe(data => {
			if (callback) {
				callback(data);
			}
		});
	}
}
