import {Component, Input, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {VideoClassesInterface} from '../../../../../services/videos/video-classes.interface';
import {FileDownloadService} from '../../../../../services/file/file-download.service';
import {DialogService} from '../../../../../services/dialog/dialog.service';
import {FileUploader, FileUploaderOptions, FileItem} from 'ng2-file-upload';
import {NzModalSubject} from 'ng-zorro-antd';
import {LW_FILE_CODE, EnvDefaultConfig, LwStorageService} from '../../../../../app.export';

@Component({
	selector: 'dialog-evaluation',
	templateUrl: './upload-file.html',
	styleUrls: ['./upload-file.scss']
})

export class UploadFile implements OnInit {
	_type: number;
	@Input() set type(value: number) {
		this._type = value;
}

	@Input() videoDetails: any;
	fileUploader: FileUploader;
	fileConfig: any;
	wordFile: any;
	downURL: any;
	@ViewChild('fileUploadEle') fileUploadEle: ElementRef;
	constructor(private videoClassesInterface: VideoClassesInterface,
				@Inject(LW_FILE_CODE) private fileCode,
				private fileDownloadService: FileDownloadService,
				private subject: NzModalSubject,
				private dialogService: DialogService,
				private storageService: LwStorageService,
				private envDefaultConfig: EnvDefaultConfig) {
		this.wordFile = {
			progress: 0,
			isComplete: false
		};
		this.fileConfig = {
			maxFileSize: 1 * 1024 * 1024,
			allowTypes: ['doc']
		};
	}

	ngOnInit() {
		this.getCommentTemplateUrl();
		this.initUploader();
	}
	private initUploader() {
		const fileServerUrl = this.envDefaultConfig.getServerUrl(this.fileCode.UPLOAD);
		this.fileUploader = new FileUploader({
			url: fileServerUrl,
			method: 'POST',
			itemAlias: 'filedata',
			maxFileSize: this.fileConfig.maxFileSize,
			removeAfterUpload: true
		});
		this.fileUploader.onAfterAddingFile = ((fileitem: FileItem) => {
			fileitem.withCredentials = false;
		});
	}
	// 获得模版下载地址
	private getCommentTemplateUrl() {
		this.videoClassesInterface.getCommentTemplateUrl({
			gardenId: this.videoDetails.gardenId
		}).subscribe(data => {
			this.downURL = data;
			console.log(data);
		});
	}

	// 下载模版
	downTemplate() {
		this.fileDownloadService.downloadFile({
			name: this.downURL.name,
			path: this.downURL.fileName
		});
	}

	// 删除上传文件
	deleteUploadFile() {
		this.fileUploadEle.nativeElement.value = '';
		this.wordFile.isComplete = false;
		this.wordFile.progress = 0;
		this.wordFile.file = null;
		this.wordFile.filename = null;
		this.wordFile.sourceFileName = null;
		this.fileUploader.clearQueue();
		this.dialogService.alertSuccess('删除成功');
	}

	// 上传文件改变
	selectedFileOnChanged(e) {
		const files = e.target.files, queueItemList = this.fileUploader.queue;
		this.wordFile.isComplete = false;
		this.wordFile.isOverMaxSize = files.length > 0 && files[0].size > this.fileConfig.maxFileSize;
		this.wordFile.file = files[0];
		const fileExt = files[0].name && files[0].name.substring(files[0].name.lastIndexOf('.') + 1);
		this.wordFile.isNotAllowedExt = this.fileConfig.allowTypes.indexOf(fileExt) < 0;
		if (!this.wordFile.isNotAllowedExt && !this.wordFile.isOverMaxSize && queueItemList.length > 0) {
			this.wordFile.filename = files[0].name;
			queueItemList[queueItemList.length - 1].upload();
			queueItemList[queueItemList.length - 1].onSuccess = (response, status, headers) => {
				// 上传文件成功
				if (status === 200) {
					// 上传文件后获取服务器返回的数据
					const tempRes = JSON.parse(response);
					this.wordFile.sourceFileName = tempRes.path;
					this.wordFile.fileName = tempRes.name;
					this.wordFile.progress = 100;
					this.wordFile.isComplete = true;
					this.dialogService.alertSuccess('上传成功');
				}
			};
			queueItemList[queueItemList.length - 1].onError = (err) => {
				this.dialogService.alertError('上传失败,请检查网络链接。重新尝试上传');
			};
			queueItemList[queueItemList.length - 1].onProgress = (progress) => {
				if (progress === 100) {
					this.wordFile.progress = 99;
				}
			};
		}
	}

	// 提交评价或者反思
	submitFile() {
		if (this.wordFile.isComplete) {
			this.videoClassesInterface.submitComment({
				gradeId: this.videoDetails.gradeId,
				classId: this.videoDetails.classId,
				subjectCode: this.videoDetails.subjectCode,
				teacherId: this.videoDetails.teacherId,
				giveLessonTime: this.videoDetails.giveLessonTime,
				period: this.videoDetails.period,
				gardenId: this.videoDetails.gardenId,
				filePath: this.wordFile.sourceFileName
			}).subscribe(data => {
				if (data == null) {
					this.dialogService.alertSuccess('提交成功！');
					this.subject.next({
						success: true
					});
					this.subject.destroy('onCancel');
				} else {
					this.dialogService.alertError('网络原因，请稍后重试');
				}

			}, err => {
				this.dialogService.alertError('网络原因，请稍后重试');
			});
		} else {
			// this.dialogService.alertError('请选择文件，进行上传');
		}
	}

}
