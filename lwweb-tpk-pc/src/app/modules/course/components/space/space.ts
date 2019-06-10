import {Component, Input, Output, EventEmitter, ViewChild, Inject} from '@angular/core';
import {EnvDefaultConfig, LW_FILE_CODE, LwOauth2TokenService} from '../../../../app.export';
import {MaterialItemDto} from '../../services/material/dto/MaterialItemDto';
import {CourseSpaceDto} from '../../services/material/dto/CourseSpaceDto';
import {CloudHomeService} from '../../services/cloud-home.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {LwClientService} from '../../../../common/client';
import {CourseDialogService} from '../exercise/dialog.service';
import {ConfirmationService} from 'primeng/primeng';
import {FileDownloadService} from '../../../../services/file/file-download.service';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {LwStorageService} from '../../../../common/cache';
import {NotificationService} from '../../../../extend/notification/notification.service';
import {FileInterface} from '../../../../services/file/file.interface';

@Component({
	selector: 'course-space',
	templateUrl: './space.html',
	styleUrls: ['./space.scss']
})
export class CourseSpaceComponent {
	@Input()
	lessonStage: string;

	@Input()
	publishStatus: boolean;

	@Input()
	courseMaterials: Array<MaterialItemDto> = [];

	@Input()
	courseSpace: CourseSpaceDto;

	@Output()
	private onRefreshMaterialItem = new EventEmitter();

	@Output()
	private onSetMainCourse = new EventEmitter();

	isDouble: boolean;

	downloads: Array<MaterialItemDto> = [];

	previews: Array<MaterialItemDto> = [];

	deletes: Array<MaterialItemDto> = [];

	timer;

	@ViewChild('music') music;

	isAndroid = false;
	allowWordType: Array<string>; // word 支持预览的类型
	allowImgType: Array<string>; // image 支持预览的类型

	isPreviewDialog = false;
	imgData: any = {};
	title: string;

	constructor(private cloudhomeProvider: CloudHomeService,
				private fileDownloadService: FileDownloadService,
				private clientService: LwClientService,
				private storageService: LwStorageService,
				private messageService: MessageService,
				@Inject(LW_FILE_CODE) private fileCode,
				private fileInterface: FileInterface,
				private accessTokenService: LwOauth2TokenService,
				private message: NzMessageService,
				private modalService: NzModalService,
				private confirmationService: ConfirmationService,
				private dialogService: CourseDialogService,
				private notification: NotificationService,
				private envDefaultConfig: EnvDefaultConfig) {
		this.isDouble = false;
		this.allowWordType = ['DOC', 'PPT', 'PPTX', 'DOCX', 'XLSX', 'XLS', 'PDF'];
		this.allowImgType = ['JPG', 'JPEG', 'PNG', 'GIF'];
	}

	private delete(data: MaterialItemDto) {
		this.stopPropagation();
		const id = data.id;
		const path = data.path;
		const that = this;

		const title = '提示';
		const content = '确认要删除图片文件吗？';
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			this.cloudhomeProvider.deleteMaterial(id, path).subscribe(() => {
				that.message.create('success', '删除文件成功！');
				that.onRefreshMaterialItem.emit();
			});
		}, null, 'confirmDialogDelImg');

		/*this.modalService.open({
			title: '提示',
			content: '确认要删除图片文件吗？',
			closable: true,
			showConfirmLoading: false,
			onOk() {
				that.cloudhomeProvider.deleteMaterial(id, path).subscribe(() => {
					that.message.create('success', '删除文件成功！');
					that.onRefreshMaterialItem.emit();
				});
			},
			onCancel() {
			}
		});*/
	}

	// 对数据进行筛选，取出只是图片的数据
	private getImages(data: Array<MaterialItemDto>): Array<MaterialItemDto> {
		const images: Array<MaterialItemDto> = [];
		data.forEach(m => {
			const type = m.path.substring(m.path.lastIndexOf('.') + 1).toUpperCase();
			if (this.allowImgType.indexOf(type) !== -1) {
				images.push(m);
			}
		});
		return images;
	}

	download(data: MaterialItemDto) {
		this.stopPropagation();
		if (data) {
			if (data.fileServer === 1) {
				const gardenId = this.storageService.getCurrentGarden().gardenId;
				this.fileInterface.getDownloadPath(gardenId, data.path).subscribe((res) => {
					const downloadPath = res.url + '&TOKEN=' + this.accessTokenService.getAccessToken();
					this.fileDownloadService.downloadFileByFullPath(downloadPath, data.name);
				});
			} else {
				this.fileDownloadService.downloadFile({
					name: data.name,
					path: data.path
				});
			}
		}
	}

	previewImg(data: MaterialItemDto) {
		if (data) {
			const type = data.path.substring(data.path.lastIndexOf('.') + 1).toUpperCase();
			if (this.allowImgType.indexOf(type) !== -1) {
				// 如果是图片类型
				const images = this.getImages(this.courseMaterials);
				this.isPreviewDialog = true;
				// 图片预览
				this.imgData = {
					currentImg: data,
					listImg: images,
					matchRule: 'id'
				};
			}
		}
	}

	downloadAndPreviewImg(data: MaterialItemDto) {
		this.timer = setTimeout(() => {
			if (!this.isDouble) {
				this.previewImg(data);
			} else {
				this.isDouble = false;
			}
		}, 300);
	}

	doubleClickItem(data: MaterialItemDto) {
		if (data.fileServer === 1) {// 预览视频
			const gardenId = this.storageService.getCurrentGarden().gardenId;
			this.fileInterface.getDownloadPath(gardenId, data.path).subscribe((res) => {
				const downloadPath = res.url + '&TOKEN=' + this.accessTokenService.getAccessToken();
				this.clientService.previewFile(downloadPath, data.name.replace(/ /g, '')).subscribe(preview => {
					console.log(preview);
				}, err => {
					console.log(err);
					this.notification.error('预览失败', '暂不支持该格式文件');
				});
			});
		} else {
			const defaultDownloadPath = this.envDefaultConfig.getHttpServerUrl(this.fileCode.SHOW_IMG) + encodeURIComponent(data.path);
			const type = data.name.substring(data.name.lastIndexOf('.') + 1).toUpperCase();
			if (this.allowImgType.indexOf(type) === -1) {
				this.clientService.previewFile(defaultDownloadPath, data.name.replace(/ /g, '')).subscribe(preview => {
					console.log(preview);
				}, err => {
					this.notification.error('预览失败', '暂不支持该格式文件');
				});
			} else {
				this.downloadAndPreviewImg(data);
			}
		}

	}

	getBorder(i: number): any {
		if (this.lessonStage !== '1') {
			return;
		}
		let style: any;
		if (this.courseMaterials[i].isMain) {
			style = {
				'border': '1px solid #226cfb'
			};
			return style;
		}
		if (this.courseMaterials[i].isSetMainAble) {
			// style = {'position': 'static', 'border': '1px solid #c4cfe3'};
			style = {
				'border': '1px solid #c4cfe3'
			};
		}
		return style;
	}

	closeDialog(event) {
		this.isPreviewDialog = event;
	}

	/**
	 * 阻止默认行为
	 */
	stopPropagation() {
		window.event ? window.event.cancelBubble = true : event.stopPropagation();
	}
}
