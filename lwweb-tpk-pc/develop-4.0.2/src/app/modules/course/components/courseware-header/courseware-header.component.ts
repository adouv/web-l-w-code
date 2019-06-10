import { Component, OnInit, Inject, ViewChild, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';

import { FileUploaderComponent } from '../../../../components/upload-file/upload-file';
import { DownloadFileComponent } from '../../../../components/download-file/download-file';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { NzMessageService, NzModalSubject } from 'ng-zorro-antd';
import { ResourceClassesService } from '../../../../services/resource/resource-classes.service';
import { ResourceClassesInterface } from '../../../../services/resource/resource-classes.interface';
import { FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { EnvDefaultConfig, LW_FILE_CODE, LwClientService, LwOauth2TokenService } from '../../../../app.export';
import { CourseMaterialService } from '../../services/material/CourseMaterialService';
import { AccountService } from '../../../../services/account/account.service';
import { FileInterface } from '../../../../services/file/file.interface';
import { OrganizationInterface } from '../../../../services/organization/organization.interface';
import {
	CourseSpaceModel,
	FileUploaderModel,
	FAILURE,
	FILE_ITEM_TYPE_UPLOAD,
	MAX_FILE_SIZE,
	PROGRESS,
	SUCCESS, UploaderItemModel
} from '../../../../services/resource/resource-prepare.model';
import { CloudHomeService } from '../../services/cloud-home.service';

@Component({
	selector: 'courseware-header',
	templateUrl: './courseware-header.component.html',
	styleUrls: ['./courseware-header.component.scss']
})
export class CoursewareHeaderComponent implements OnInit, OnDestroy, OnChanges {
	courseSpace: CourseSpaceModel = {};
	uploader: FileUploader;
	fileItems: FileItem[] = [];
	unfinishedBtn: boolean;
	uploadList: UploaderItemModel[] = [];
	downloadList: UploaderItemModel[] = [];
	optionsExtend: FileUploaderModel = {};
	lastUpdateProgressDate: number;
	onFileItemSuccess: any = {};
	outlineId: string | number;
	resourceList: UploaderItemModel[] = [];
	@ViewChild('selectFileView')
	selectFileView;
	@ViewChild('uploadDialogTitle') uploadDialogTitle;
	@ViewChild('downloadTitle') downloadTitle;
	isUploader = false;
	isDownload = false;
	idList: any = [];
	videoUploadPath: string;
	temporarySpace: any;
	@Input() options: any;
	@Output() onUploadSuccess = new EventEmitter();
	@Output() linkLibrary = new EventEmitter();
	@Output() beforeUpload = new EventEmitter();
	@Output() canceUpload = new EventEmitter();
	@Input() existFileNames = [];
	@Input() verification: any;
	@Input() showUploadBtn = true;
	accept = [];
	acceptPostfix = [];
	isHaveSpace = true;
	private videoPattern: Array<string> = ['mp4', 'flv'];

	constructor(
		@Inject(LW_FILE_CODE) private fileCode,
		private message: NzMessageService,
		private resourceClassesInterface: ResourceClassesInterface,
		private resourceService: ResourceClassesService,
		private dialogService: DialogService,
		private cloudHomeService: CloudHomeService,
		private accountService: AccountService,
		private fileInterface: FileInterface,
		private subject: NzModalSubject,
		private accessTokenService: LwOauth2TokenService,
		private courseMaterialService: CourseMaterialService,
		private envDefaultConfig: EnvDefaultConfig) {
		this.optionsExtend.maxFileSize = MAX_FILE_SIZE;
		this.lastUpdateProgressDate = new Date().getTime();
		// this.courseSpace.usedSpace = 0;
		this.verification = {};
		this.courseSpace = this.resourceService.courseSpace(0, 100);

		this.accept = [];
		this.acceptPostfix = [];

	}
	ngOnDestroy() {
		if (this.dialogService.getModal())
			this.dialogService.getModal().destroy('onCancel');
	}
	ngOnChanges() {
		this.initaccept();
	}
	initaccept() {
		if (this.options.design == 'teaching_plan') {
			this.accept = ['application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/xml-dtd', 'application/vnd.ms-powerpoint', 'application/pdf', 'image/*', 'text/plain'];
			this.acceptPostfix = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp'];
		} else {
			this.accept = [];
			this.acceptPostfix = [];
		}
	}
	ngOnInit() {
		this.initaccept();
		this.initVideoUploadPath();
		this.initUploader();
		this.refreshCoursewareList();
	}
	/** 课件相关逻辑 */
	/**
	 * 上传初始化
	 */
	private initUploader() {
		const fileServerUrl = this.envDefaultConfig.getServerUrl(this.fileCode.UPLOAD);
		this.uploader = new FileUploader({
			url: fileServerUrl,
			method: 'POST',
			itemAlias: 'filedata',
			autoUpload: false,
			removeAfterUpload: true,
			additionalParameter: {
				folder: 'courseware'
			}
		});
		this.uploader.onAfterAddingFile = (fileItems: any) => {
			fileItems.withCredentials = false;
		};
		this.uploader.onAfterAddingAll = (fileItems: any) => {
			this.onAfterAddingAll(fileItems);
		};
	}

	public getFileSuffix(fileItem) {
		const fileName = fileItem.file.name;
		return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length); // 后缀名
	}

	/**
	 * 添加上传文件
	 * @param fileItems
	 */
	private onAfterAddingAll(fileItems: any) {
		this.initaccept();
		this.beforeUpload.emit();
		this.unfinishedBtn = false;
		if (this.resourceService.isOverSpaceLimit(fileItems) && this.isHaveSpace) {
			this.message.create('warning', '上传文件超过空间大小限制！');
		} else {
			for (const fileItem of fileItems) {
				const errorParams = {
					type: FILE_ITEM_TYPE_UPLOAD,
					name: fileItem.file.name,
					progress: 0,
					state: FAILURE,
					index: 0
				};
				// console.log(this.acceptPostfix.indexOf(this.getFileSuffix(fileItem)));
				if (this.resourceService.isIllegalFileName(fileItem.file.name)) {
					const result = this.resourceService.uploaderItem(errorParams);
					result.errorMsg = '不支持该种文件格式的上传!';
					this.unfinishedBtn = true;
					this.uploader.removeFromQueue(fileItem);
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					this.uploadComplete();
					continue;
				}
				if (this.options.design == 'teaching_plan' && this.acceptPostfix.indexOf(this.getFileSuffix(fileItem)) < 0) {
					const result = this.resourceService.uploaderItem(errorParams);
					result.errorMsg = '不支持该种文件格式的上传!';
					this.unfinishedBtn = true;
					this.uploader.removeFromQueue(fileItem);
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					this.uploadComplete();
					continue;
				}
				if (this.optionsExtend.maxFileSize && fileItem.file.size > (this.optionsExtend.maxFileSize * 1024 * 1024)) {
					const result = this.resourceService.uploaderItem(errorParams);
					result.errorMsg = '不支持超过50M的单个文件上传!';
					this.unfinishedBtn = true;
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					this.uploader.removeFromQueue(fileItem);
					this.uploadComplete();
					continue;
				}
				const fileServer = this.videoPattern.indexOf(this.getFileSuffix(fileItem)) > -1 ? 1 : 0;
				if (this.videoPattern.indexOf(this.getFileSuffix(fileItem)) > -1) {
					fileItem.alias = 'file';
					fileItem.url = this.videoUploadPath;
				}
				if (this.fileItems.indexOf(fileItem) < 0) {
					this.fileItems.unshift(fileItem);
					fileItem.design = this.options.design;
					this.uploadList.unshift(this.resourceService.uploaderItem({
						type: FILE_ITEM_TYPE_UPLOAD,
						name: fileItem.file.name,
						progress: 0,
						state: PROGRESS,
						index: fileItem.index,
						design: this.options.design
					}));
					this.fileUpload(fileItem);
				}
			}
			this.openUploadDialog();
		}
	}

	// private getFileName(fileName: string): string {
	// 	if (this.existFileNames.indexOf(fileName) !== -1) {
	// 		return this.getFileName(fileName.substring(0, fileName.lastIndexOf('.')) + '-副本' + fileName.substring(fileName.lastIndexOf('.'), fileName.length));
	// 	} else {
	// 		return fileName;
	// 	}
	// }
	/**
	 * 上传文件弹窗
	 */
	private openUploadDialog() {
		this.dialogService.openDialog({
			title: this.uploadDialogTitle,
			content: FileUploaderComponent,
			class: 'popover-file',
			wrapClassName: 'popover',
			footer: false,
			maskClosable: false,
			onCancel: () => {
				this.cancelAll();
				this.isUploader = false;
				this.uploadComplete();
			},
			componentParams: {
				title: '上传',
				uploadFileView: this,
				uploadList: this.uploadList
			}
		});
	}
	/**
		 * 取消某个文件上传
		 * @param {number} index
		 */
	private cancelOne(index) {
		if (this.fileItems[index] != null) {
			this.fileItems[index].cancel();
			this.fileItems[index].isUploading = false;
		}
		this.fileItems.splice(index, 1);
		this.uploadList.splice(index, 1);
		if (this.uploadList.length === 0) {
			this.unfinishedBtn = true;
		}
		this.uploadComplete();
	}
	delete(index) {
		if (this.uploadList[index] != null && this.uploadList[index].fileid) {
			this.resourceClassesInterface.deleteMaterial(this.uploadList[index].fileid).subscribe(() => {
				this.dialogService.alertSuccess('删除文件成功！');
				let isComplete = true;
				this.uploadList.splice(index, 1);
				this.uploadList.map((data) => {
					if (data.state == 0) {
						isComplete = false;
					}
				})
				this.onUploadSuccess.emit(isComplete);
				this.refreshCoursewareList();
			});
		} else {
			this.uploadList.splice(index, 1);
		}
	}
	uploadComplete() {
		let isComplete = true;
		this.uploadList.map((data) => {
			if (data.state == 0) {
				isComplete = false;
			}
		})
		this.canceUpload.emit(isComplete);
	}
	private fileUpload(fileItem) {
		fileItem.onProgress = (progress: any) => {
			this.onProgress(fileItem, progress);
		};
		fileItem.onSuccess = (response: string, status: number, headers: ParsedResponseHeaders) => {
			this.onSuccess(fileItem, status, response);
		};
		fileItem.onError = (response: string, status: number,
			headers: ParsedResponseHeaders) => {
			this.onError(fileItem, status, response);
		};
	}

	private initVideoUploadPath() {
		const gardenId = this.accountService.getCurrentGardenId();
		this.fileInterface.getUploadPath(gardenId).subscribe(res => {
			this.videoUploadPath = res.url + '?TOKEN=' + this.accessTokenService.getAccessToken();
		});
	}

	/**
	 * 进度条
	 * @param {FileItem} item
	 * @param {number} progress
	 */
	private onProgress(item: FileItem, progress: number) {
		if (item) {
			this.unfinishedBtn = false;
			const index = this.fileItems.indexOf(item);
			const currTime = new Date().getTime();
			if (currTime - this.lastUpdateProgressDate >= 1000) {
				this.lastUpdateProgressDate = new Date().getTime();
				this.uploadList[index].progress = progress;
			}
		}
	}

	private onSuccess(item: FileItem, status: number, response: string) {
		if (item) {

			const index = this.fileItems.indexOf(item);
			const resp = response ? JSON.parse(response) : response;
			this.uploadList[index].path = resp.path ? resp.path : resp.newFileName;
			this.uploadList[index].size = item.file.size;
			if (resp.guid) {
				this.uploadList[index].guid = resp.guid;
			}
			this.uploadList[index].state = SUCCESS;
			this.uploadList[index].msg = this.resourceService.getMsg(1);
			this.onFileItemSuccess = { ...this.uploadList[index], outlineId: this.outlineId };
			const fileServer = this.videoPattern.indexOf(this.getFileSuffix(item)) > -1 ? 1 : 0;
			this.cloudHomeService.uploadMaterial(
				this.options.lessonId,
				this.options.lessonDate,
				'1',
				this.onFileItemSuccess.name,
				this.onFileItemSuccess.path,
				this.onFileItemSuccess.size,
				this.uploadList[index].guid,
				this.uploadList[index].design,
				fileServer
			).subscribe((res) => {
				if (res.code === 1) {
					this.uploadList[index].state = 2;
					this.uploadList[index].msg = res.msg;
					this.uploadList[index].errorMsg = '';
					let isComplete = true;
					this.unfinishedBtn = true;
					this.uploadList.map((data, indexData) => {
						if (data.state === 0) {
							data.state = 2;
							this.fileItems[indexData].cancel();
							data.msg = res.msg;
							data.errorMsg = '';
						}
					})

					this.uploadList.map((data) => {
						if (data.state === 0) {
							isComplete = false;
							this.unfinishedBtn = false;
						}
					})
					console.log(isComplete, res);
					this.unfinishedBtn = true;
					this.onUploadSuccess.emit(isComplete);
					this.refreshCoursewareList();
				} else {
					this.uploadList[index].fileid = res.id;
					let isComplete = true;
					this.unfinishedBtn = true;
					this.uploadList.map((data) => {
						if (data.state === 0) {
							isComplete = false;
							this.unfinishedBtn = false;
						}
					})
					this.onUploadSuccess.emit(isComplete);
					this.refreshCoursewareList();
				}
			});
			// this.addCoursewareList(this.onFileItemSuccess, () => {
			// 	this.refreshCoursewareList();
			// });

		}
	}

	private onError(item: FileItem, status: number, response: string) {
		if (item) {
			this.unfinishedBtn = true;
			const index = this.fileItems.indexOf(item);
			this.uploadList[index].state = FAILURE;
			this.uploadList[index].msg = this.resourceService.getMsg(2);
			if (response) {
				this.uploadList[index].errorMsg = JSON.parse(response).error_description;
			}
			this.uploadComplete();
		}
	}

	/**
	 * 新增备课列表
	 */
	addCoursewareList(item, callback?) {
		const param = {
			outlineId: this.outlineId,
			name: item.name,
			size: item.size,
			path: item.path,
			fileServerType: item.fileServerType
		};
		this.resourceClassesInterface.addCoursewareList(param).subscribe(data => {
			if (callback) {
				callback();
			}
		}, (err) => {
			console.log(err.error.developer_message);
		});
	}

	/**
	 * 重新刷新列表
	 */
	refreshCoursewareList() {
		this.getCourseSpace();
	}

	/**
	 * 取消所有文件的上传
	 */
	public cancelAll() {
		console.log('取消所有文件的上传........');
		this.uploader.cancelAll();
		this.uploader.clearQueue();
		this.fileItems = [];
		this.uploadList = [];
	}

	/**
	 * 大纲下课件总大小
	 */
	getCourseSpace() {
		// this.resourceClassesInterface.getCourseSpace(this.outlineId).subscribe(data => {
		// });
		this.courseMaterialService.getCourseSpace(
			this.options.lessonId, this.options.lessonDate
		).subscribe((data) => {
			if (data) {
				this.courseSpace = this.resourceService.courseSpace(data.usedSpace, data.totalSpace);
				// this.courseSpace = data;
			}
		});
	}

	/**
	 * 上传最小化弹窗
	 */
	uploadMinimize() {
		this.dialogService.getModal().destroy('onOk');
		this.isUploader = true;
	}

	/**
	 * 下载最小化弹窗
	 */
	downloadMinimize() {
		this.isDownload = true;
		this.dialogService.getModal().destroy('onOk');
	}

	/**
	 * 上传文件按钮
	 */
	openFileSelector() {
		this.selectFileView.nativeElement.click();
	}

	/**
	 * 上传完成
	 */
	fileSelectorCallBack(event: any) {
		this.uploader.uploadAll();
	}

	/**
	 * 打开下载弹窗
	 */
	openDownLoadDialog() {
		this.dialogService.openDialog({
			title: this.downloadTitle,
			content: DownloadFileComponent,
			// width: 600,
			wrapClassName: 'popover',
			class: 'popover-file',
			footer: false,
			maskClosable: false,
			onCancel: () => {
				this.isDownload = false;
				this.idList = [];
				this.downloadList = [];
			},
			componentParams: {
				title: '下载',
				downloadFileView: this,
				downloadList: this.downloadList
			}
		});
	}

	/**
	 * 获取下载的文件
	 * @param data
	 */
	getDownloadList(data) {
		this.isDownload = true;
		if (this.idList.indexOf(data.id) < 0) {
			this.idList.push(data.id);
			this.downloadList.unshift(data);
		}
	}

	getShowDownload(evt) {
		this.isDownload = evt;
	}
	/**
	 * 进入校本题库
	 */
	goLibrary() {
		this.linkLibrary.emit();
	}
}
