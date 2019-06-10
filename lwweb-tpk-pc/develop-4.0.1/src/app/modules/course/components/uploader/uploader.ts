import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnChanges,
	OnInit,
	ViewChild,
	SimpleChanges,
	Inject
} from '@angular/core';
import {FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {
	UploaderItemEntity,
	FAILURE,
	SUCCESS,
	PROGRESS,
	FILE_ITEM_TYPE_UPLOAD
} from './file-item.entity';
import {FileUploaderOptionsExtend} from './uploader.options.extend';
import {LW_FILE_CODE, LW_MODULE_CODE, EnvDefaultConfig, LwOauth2TokenService} from '../../../../app.export';
import {MessageService} from 'primeng/components/common/messageservice';
import {CourseSpaceDto} from '../../services/material/dto/CourseSpaceDto';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {LwStorageService} from '../../../../common/cache';
import {FileInterface} from '../../../../services/file/file.interface';


@Component({
	selector: 'file-course-uploader',
	templateUrl: './uploader.html',
	styleUrls: ['./uploader.scss']
})
export class FileUploaderCourseComponent implements OnChanges, OnInit {

	@Output()
	onFileItemSuccess = new EventEmitter();
	@Output()
	onFileItemDelete = new EventEmitter();
	@Input()
	optionsExtend: FileUploaderOptionsExtend;
	@Input()
	existFileNames: Array<string>;
	@Input()
	courseSpace: CourseSpaceDto;
	@Input()
	displayStageName: string;

	private uploadList: UploaderItemEntity[] = [];
	private fileItems: FileItem[] = [];
	private options: FileUploaderOptions;
	private isCanClickConfirmButton: boolean;
	private lastUpdateProgressDate: number;
	private videoPattern: Array<string> = ['mp4', 'flv'];
	private countFile = 0;
	isUploader: boolean;
	uploader: FileUploader;

	private videoUploadPath: string;

	@ViewChild('selectFileView')
	selectFileView;

	constructor(private envDefaultConfig: EnvDefaultConfig,
				private modalService: NzModalService,
				private accessTokenService: LwOauth2TokenService,
				private fileInterface: FileInterface,
				private storageService: LwStorageService,
				@Inject(LW_FILE_CODE) private fileCode,
				@Inject(LW_MODULE_CODE) private moduleCode,
				private message: NzMessageService,
				private messageService: MessageService) {
		this.isCanClickConfirmButton = true;
		this.lastUpdateProgressDate = new Date().getTime();
		this.isUploader = false;
	}

	ngOnInit(): void {
		this.options = {
			url: this.envDefaultConfig.getServerUrl(this.fileCode.UPLOAD),
			method: 'POST',
			itemAlias: 'filedata'
		};
		this.uploader = new FileUploader(this.options);
		this.uploader.onAfterAddingAll = (fileItems: any) => {
			this.onAfterAddingAll(fileItems);
		};
		this.uploader.onAfterAddingFile = (fileItems: any) => {
			fileItems.withCredentials = false;
		};
		this.initVideoUploadPath();
	}

	ngOnChanges(changes: SimpleChanges): void {
		for (const propName in changes) {
			const changeProp = changes[propName];
			if (propName === 'optionsExtend' && changeProp.currentValue && this.uploader) {
				if (this.optionsExtend.directory) {
					this.uploader.options.url = this.options.url + '?folder=' + this.optionsExtend.directory;
				}
				break;
			}
		}
	}

	private initVideoUploadPath() {
		const gardenId = this.storageService.getCurrentGarden().gardenId;
		this.fileInterface.getUploadPath(gardenId).subscribe(res => {
			this.videoUploadPath = res.url + '?TOKEN=' + this.accessTokenService.getAccessToken();
		});
	}

	public openFileSelector() {
		this.selectFileView.nativeElement.click();
	}

	public fileSelectorCallBack(event: any) {
		this.uploader.uploadAll();
	}

	public fileDropOver(event) {
		this.uploader.uploadAll();
	}

	public cancelOne(index: number) {
		if (this.fileItems[index] != null) {
			this.fileItems[index].cancel();
			this.fileItems[index].remove();
		}
		this.fileItems.splice(index, 1);
		this.uploadList.splice(index, 1);
		if (this.uploadList.length === 0) {
			this.isCanClickConfirmButton = false;
		}
	}

	public deleteOne(index: number) {
		if (this.uploadList[index].path) {
			this.onFileItemDelete.emit({filePath: this.uploadList[index].path});
		}
		this.fileItems.splice(index, 1);
		this.uploadList.splice(index, 1);
		if (this.uploadList.length === 0) {
			this.isCanClickConfirmButton = false;
		}
	}

	public cancelAll() {
		this.uploader.cancelAll();
		this.uploader.clearQueue();
		this.fileItems = [];
		this.uploadList = [];
		this.isUploader = false;
	}

	onAfterAddingAll(fileItems: any) {
		this.isCanClickConfirmButton = false;
		if (this.isOverSpaceLimit(fileItems)) {
			this.message.create('warning', '上传文件超过空间大小限制！');
		} else {
			for (const fileItem of fileItems) {
				if (this.isIllegalFileName(fileItem.file.name)) {
					const result = new UploaderItemEntity(FILE_ITEM_TYPE_UPLOAD, this.getFileName(fileItem.file.name), 0, FAILURE, 0);
					this.message.create('warning', '不支持该种文件格式的上传！');
					// result.errorMsg = '不支持该种文件格式的上传!';
					this.uploader.removeFromQueue(fileItem);
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					continue;
				}
				if (this.optionsExtend.maxFileSize && fileItem.file.size > (this.optionsExtend.maxFileSize * 1024 * 1024)) {
					const result = new UploaderItemEntity(FILE_ITEM_TYPE_UPLOAD, this.getFileName(fileItem.file.name), 0, FAILURE, 0);
					this.message.create('warning', '不支持超过50M的单个文件上传！');
					// result.errorMsg = '不支持超过50M的单个文件上传。';
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(result);
					this.uploader.removeFromQueue(fileItem);
					continue;
				}
				if (this.fileItems.indexOf(fileItem) < 0) {
					this.fileItems.unshift(fileItem);
					this.uploadList.unshift(new UploaderItemEntity(
						FILE_ITEM_TYPE_UPLOAD,
						this.getFileName(fileItem.file.name),
						0, PROGRESS, fileItem.index));
					fileItem.onProgress = (progress: any) => {
						this.onProgress(fileItem, progress);
					};
					fileItem.onSuccess = (response: string, status: number, headers: ParsedResponseHeaders) => {
						this.countFile++;
						this.onSuccess(fileItem, status, response);
					};
					fileItem.onError = (response: string, status: number,
										headers: ParsedResponseHeaders) => {
						this.onError(fileItem, status, response);
					};
				}
				if (this.videoPattern.indexOf(this.getFileSuffix(fileItem)) > -1) {
					fileItem.alias = 'file';
					fileItem.url = this.videoUploadPath;
				}
			}
			this.openDialog();
		}
	}

	public isOverSpaceLimit(fileItems: any): boolean {
		let totalSize = 0;
		for (const fileItem of fileItems) {
			totalSize += fileItem.file.size;
		}
		if (this.courseSpace && (this.courseSpace.usedSpace + totalSize / (1024 * 1024) > this.courseSpace.totalSpace)) {
			for (const fileItem of fileItems) {
				this.uploader.removeFromQueue(fileItem);
			}
			return true;
		} else {
			return false;
		}
	}

	public getFileSuffix(fileItem) {
		const fileName = fileItem.file.name;
		return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length); // 后缀名
	}

	private getFileName(fileName: string): string {
		if (this.existFileNames.indexOf(fileName) !== -1) {
			const nameSplits = fileName.split('.');
			return this.getFileName(nameSplits[0] + '副本.' + nameSplits[1]);
		} else {
			return fileName;
		}
	}

	public onProgress(item: FileItem, progress: number) {
		if (item) {
			this.isCanClickConfirmButton = false;
			const index: number = this.fileItems.indexOf(item);
			const currTime = new Date().getTime();
			if (currTime - this.lastUpdateProgressDate >= 1000) {
				this.lastUpdateProgressDate = new Date().getTime();
				this.uploadList[index].progress = progress;
			}
		}
	}

	public onSuccess(item: FileItem, status: number, response: string) {
		if (item) {
			this.isCanClickConfirmButton = true;
			const index: number = this.fileItems.indexOf(item);
			const resp = response ? JSON.parse(response) : response;
			// 上传到ftp和文件服务器path不一样
			this.uploadList[index].path = resp.path || resp.newFileName;
			this.uploadList[index].size = item.file.size;
			/*this.uploadList[index].size = item.file.size;*/
			if (resp.guid) {
				this.uploadList[index].guid = resp.guid;
			}
			this.uploadList[index].state = SUCCESS;
			const fileServer = this.videoPattern.indexOf(this.getFileSuffix(item)) > -1 ? 1 : 0;
			this.onFileItemSuccess.emit({
				name: this.uploadList[index].name,
				path: this.uploadList[index].path,
				size: this.uploadList[index].size,
				videoGuid: this.uploadList[index].guid,
				fileServer: fileServer,
				isLast: this.uploader.queue.length === this.countFile
			});
			if (this.uploader.queue.length === this.countFile) {
				this.countFile = 0;
				this.uploader.clearQueue();
			}

		}
	}

	public onError(item: FileItem, status: number, response: string) {
		if (item) {
			this.countFile = 0;
			this.isCanClickConfirmButton = true;
			const index: number = this.fileItems.indexOf(item);
			this.uploadList[index].state = FAILURE;
			if (response) {
				this.uploadList[index].errorMsg = JSON.parse(response).error_description || '';
			}
		}
	}

	openDialog() {
		// TODO
		// const config = new MdDialogConfig();
		// config.panelClass = 'custom_dialog_class';
		// config.data = {items: this.uploadList, uploadFileView: this};
		// const dialogRef = this.dialog.open(UploaderDialogComponent, config);
	}

	// showModalForTemplate(titleTpl, contentTpl, footerTpl) {
	// 	this.currentModal = this.modalService.open({
	// 		title       : '文件上传',
	// 		content     : contentTpl,
	// 		footer      : footerTpl,
	// 		maskClosable: false,
	// 		onOk() {
	// 			console.log('Click ok');
	// 		}
	// 	});
	// }

	public isShowUploadBtn() {
		this.isUploader = false;
	}

	showUploadBtn() {
		this.isUploader = true;
	}

	public isIllegalFileName(fileName: string): boolean {
		if (!fileName || fileName.indexOf('.') === -1) {
			return true;
		}
		return false;
	}

}
