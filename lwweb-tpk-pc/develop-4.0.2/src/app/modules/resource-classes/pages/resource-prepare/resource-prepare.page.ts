import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '../../../../services/dialog/dialog.service';
// import {FileUploaderComponent, DownloadFileComponent} from '../../components';
import {FileUploaderComponent} from '../../../../components/upload-file/upload-file';
import {DownloadFileComponent} from '../../../../components/download-file/download-file';
import {FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {EnvDefaultConfig, LW_FILE_CODE, LwClientService} from '../../../../app.export';
import {NzMessageService, NzModalSubject} from 'ng-zorro-antd';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';
import {ResourceClassesService} from '../../../../services/resource/resource-classes.service';
import {
	CourseSpaceModel,
	FileUploaderModel,
	FAILURE,
	FILE_ITEM_TYPE_UPLOAD,
	MAX_FILE_SIZE,
	PROGRESS,
	SUCCESS, UploaderItemModel
} from './resource-prepare.model';
import {FileDownloadService} from '../../../../services/file/file-download.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
	selector: 'app-resource-prepare',
	templateUrl: './resource-prepare.page.html',
	styleUrls: ['./resource-prepare.page.scss']
})

export class ResourcePreparePage implements OnInit {

	uploader: FileUploader;
	fileItems: FileItem[] = [];
	unfinishedBtn: boolean;
	courseSpace: CourseSpaceModel = {};
	existFileNames: Array<string> = [];
	uploadList: UploaderItemModel[] = [];
	downloadList: UploaderItemModel[] = [];
	resourceList: UploaderItemModel[] = [];
	optionsExtend: FileUploaderModel = {};
	lastUpdateProgressDate: number;
	onFileItemSuccess: any = {};
	outlineId: string | number;
	filePath: string;
	prepaerTitle: string;
	isUploader = false;
	isDownload = false;
	idList: any = [];

	@ViewChild('selectFileView')
	selectFileView;
	@ViewChild('uploadDialogTitle') uploadDialogTitle;
	@ViewChild('downloadTitle') downloadTitle;

	constructor(private dialogService: DialogService,
				@Inject(LW_FILE_CODE) private fileCode,
				private message: NzMessageService,
				private subject: NzModalSubject,
				private fileDownloadService: FileDownloadService,
				private resourceClassesInterface: ResourceClassesInterface,
				private resourceService: ResourceClassesService,
				private activatedRoute: ActivatedRoute,
				private router: Router,
				private envDefaultConfig: EnvDefaultConfig) {
		this.unfinishedBtn = true;
		this.lastUpdateProgressDate = new Date().getTime();
		this.courseSpace = this.resourceService.courseSpace(0, 100);
		this.optionsExtend.maxFileSize = MAX_FILE_SIZE;
	}

	ngOnInit() {
		this.initParam();
		this.initUploader();
		this.refreshCoursewareList();
	}

	initParam() {
		this.outlineId = this.activatedRoute.snapshot.params['id'];
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.prepaerTitle = queryParams.title;
		}, (error) => {
			console.log('error', error);
		});
	}

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
		this.uploader.onAfterAddingAll = (fileItems: any) => {
			this.onAfterAddingAll(fileItems);
		};
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
	 * 取消所有文件的上传
	 */
	private cancelAll() {
		this.uploader.cancelAll();
		this.uploader.clearQueue();
		this.fileItems = [];
		this.uploadList = [];
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
	}

	/**
	 * 添加上传文件
	 * @param fileItems
	 */
	private onAfterAddingAll(fileItems: any) {
		this.unfinishedBtn = false;
		if (this.resourceService.isOverSpaceLimit(fileItems)) {
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
				if (this.resourceService.isIllegalFileName(fileItem.file.name)) {
					const result = this.resourceService.uploaderItem(errorParams);
					result.errorMsg = '不支持该种文件格式的上传!';
					this.unfinishedBtn = true;
					this.uploader.removeFromQueue(fileItem);
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					continue;
				}
				if (this.optionsExtend.maxFileSize && fileItem.file.size > (this.optionsExtend.maxFileSize * 1024 * 1024)) {
					const result = this.resourceService.uploaderItem(errorParams);
					result.errorMsg = '不支持超过50M的单个文件上传!';
					this.unfinishedBtn = true;
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					this.uploader.removeFromQueue(fileItem);
					continue;
				}
				if (this.fileItems.indexOf(fileItem) < 0) {
					this.fileItems.unshift(fileItem);

					this.uploadList.unshift(this.resourceService.uploaderItem({
						type: FILE_ITEM_TYPE_UPLOAD,
						name: fileItem.file.name,
						progress: 0,
						state: PROGRESS,
						index: fileItem.index
					}));
					this.fileUpload(fileItem);
				}
			}
			this.openUploadDialog();
		}
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
			},
			componentParams: {
				title: '上传',
				uploadFileView: this,
				uploadList: this.uploadList
			}
		});
	}

	private onSuccess(item: FileItem, status: number, response: string) {
		if (item) {
			this.unfinishedBtn = true;
			const index = this.fileItems.indexOf(item);
			const resp = response ? JSON.parse(response) : response;
			this.uploadList[index].path = resp.path;
			this.uploadList[index].size = item.file.size;
			if (resp.guid) {
				this.uploadList[index].guid = resp.guid;
			}
			this.uploadList[index].state = SUCCESS;
			this.uploadList[index].msg = this.resourceService.getMsg(1);
			this.onFileItemSuccess = {...this.uploadList[index], outlineId: this.outlineId};
			this.addCoursewareList(this.onFileItemSuccess, () => {
				this.refreshCoursewareList();
			});

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
		}
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
	 * 获取下载的文件
	 * @param data
	 */
	getDownloadList(data) {
		// this.isDownload = data.isDownload;
		if (this.idList.indexOf(data.id) < 0) {
			this.idList.push(data.id);
			this.downloadList.unshift(data);
			// this.message.success('下载成功！', {nzDuration: 2000});
		}
	}

	getShowDownload(evt) {
		this.isDownload = evt;
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
	 * 重新刷新列表
	 */
	refreshCoursewareList() {
		this.getCoursewareList();
		this.getCourseSpace();
	}

	/**
	 * 获取备课列表
	 */
	getCoursewareList() {
		this.resourceClassesInterface.getCoursewareList(this.outlineId).subscribe(data => {
			this.resourceList = data;
		});
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
	 * 大纲下课件总大小
	 */
	getCourseSpace() {
		this.resourceClassesInterface.getCourseSpace(this.outlineId).subscribe(data => {
			this.courseSpace = this.resourceService.courseSpace(data, 100);
		});
	}

	goBack() {
		this.router.navigate(['resource/home/0']);
	}
}

