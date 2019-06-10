import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceListModel } from './resource-list.model';
import { DialogService } from '../../services/dialog/dialog.service';
import { ResourceClassesInterface } from '../../services/resource/resource-classes.interface';
import { FilePreviewService } from '../../services/file/file-preview.service';
import { EnvDefaultConfig, fileCode } from '../../common/config';
import { LwClientService } from '../../common/client';
import { NotificationService } from '../../extend/notification/notification.service';
import { LwStorageService } from '../../common/cache';
import { FileInterface } from '../../services/file/file.interface';
import { ResourceClassesService } from '../../services/resource/resource-classes.service';
import { DownloadFileComponent } from '../../components/download-file/download-file';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account/account.service';

@Component({
	selector: 'resource-list',
	templateUrl: './resource-list.component.html',
	styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, OnChanges {

	@Input()
	resourceList: Array<ResourceListModel>;
	@Output()
	onRefreshResourceItem = new EventEmitter();
	@Output()
	downloadList = new EventEmitter();
	@Output()
	showDownloadBtn = new EventEmitter();
	@Input()
	showDeleteBtn = true;
	@Input()
	showDownload = true;
	@Input() ellipticalTitle = '暂无教学课件';
	@ViewChild(DownloadFileComponent)
	private downloadFileComponent: DownloadFileComponent;

	allowImgType: Array<string>;
	videoType: Array<string>;
	outlineId: string | number;
	unfinishedBtn = false;

	constructor(private dialogService: DialogService,
		private envDefaultConfig: EnvDefaultConfig,
		private clientService: LwClientService,
		private notification: NotificationService,
		private storageService: LwStorageService,
		private fileInterface: FileInterface,
		private activatedRoute: ActivatedRoute,
		private accountService: AccountService,
		private resourceClassesService: ResourceClassesService,
		private resourceClassesInterface: ResourceClassesInterface,
		private filePreviewService: FilePreviewService) {
		this.allowImgType = ['jpg', 'jpeg', 'png', 'gif'];
		this.videoType = ['mp4', 'flv'];
	}

	ngOnInit() {
		this.initParam();
	}

	initParam() {
		this.outlineId = this.activatedRoute.snapshot.params['id'];
	}


	ngOnChanges(): void {
		for (const item of this.resourceList) {
			const len = item.name.lastIndexOf('.');
			const suffixName = this.getSuffixName(item.name);
			const prefixName = item.name.substring(0, len);
			item.name = prefixName + '.' + suffixName;
		}
	}

	/**
	 * 绑定到课表大纲和课堂资源
	 * @param courseId
	 * @param outlineId
	 */
	private bindCourseWare(outlineId, courseId) {
		this.resourceClassesInterface.openCoursewareList(outlineId, courseId).subscribe(() => {

		});
	}

	/**
	 * 预览图片
	 * @param data
	 */
	openImg(data: ResourceListModel) {
		this.bindCourseWare(this.outlineId, data.id);
		const imgLists = this.getImages(this.resourceList),
			ids = this.getIds(imgLists),
			type = this.getSuffixName(data.name),
			filePath = this.envDefaultConfig.getHttpServerUrl(fileCode.SHOW_IMG) + encodeURIComponent(data.path),
			videoPath = this.envDefaultConfig.getHttpServerUrl(fileCode.SHOW_IMG) + data.path;
		let index = 0;

		if (this.videoType.indexOf(type) > -1) {  // 预览视频 mp4、flv
			this.getVideoUrl(data.path, (data) => {
				this.filePreviewService.videoPreview(data.pcPlayUrl, '视频预览');
			})
			// this.filePreviewService.videoPreview(videoPath, '视频预览');
		} else if (this.allowImgType.indexOf(type) > -1) {  // 预览图片
			for (const item of ids) {
				if (item === data.id) {
					index = ids.indexOf(item);
				}
			}
			this.filePreviewService.imgPreview(imgLists, index);
		} else {
			this.previewFile(filePath, data.name);
		}
	}
	private getVideoUrl(url, callback) {
		this.resourceClassesInterface.getPlayUrl(this.accountService.getCurrentGardenId(), url).subscribe((data) => {
			callback(data);
		})
	}
	getIds(list) {
		const ids = [];
		for (const data of list) {
			ids.push(data.id);
		}
		return ids;

	}

	/**
	 * 预览文件
	 * @param path
	 * @param name
	 */
	private previewFile(path, name) {
		if (this.clientService.previewFile(path, name.replace(/ /g, ''))) {
			this.clientService.previewFile(path, name.replace(/ /g, '')).subscribe(preview => {
				console.log(preview);
			}, err => {
				this.notification.error('预览失败', '暂不支持该格式文件');
			});
		} else {
			this.dialogService.alertWarning('请在客户端上预览！');
		}

	}

	/**
	 *  删除文件
	 * @param {ResourceListModel} data
	 */
	delete(data: ResourceListModel) {
		this.stopPropagation();
		const id = data.id || null;
		const path = data.path;
		this.dialogService.openConfirm({
			title: '提示',
			content: '您确定要删除此文件吗？',
			mask: false,
			zIndex: 1003,
			class: 'evaluation-confirm',
			wrapClassName: 'vertical-center-modal',
			cancelText: '否',
			okText: '是',
			closable: true,
			width: 400,
			showConfirmLoading: false,
			maskClosable: false,
			onOk: () => {
				this.resourceClassesInterface.deleteMaterial(id).subscribe(() => {
					this.dialogService.alertSuccess('删除文件成功！');
					this.onRefreshResourceItem.emit();
				});
			},
			onCancel: () => {
				console.log('cancel');
			}
		})
		// this.dialogService.openDialog({
		// 	class: 'modal-confirm',
		// 	title: '提示',
		// 	content: '您确定要删除此文件吗？',
		// 	closable: true,
		// 	width: 400,
		// 	showConfirmLoading: false,
		// 	okText: '是',
		// 	cancelText: '否',
		// 	maskClosable: false,
		// 	onCancel: () => {
		//
		// 	},
		// 	onOk: () => {
		// 		this.resourceClassesInterface.delCoursewareList(id, this.outlineId).subscribe(() => {
		// 			this.dialogService.alertSuccess('删除文件成功！');
		// 			this.onRefreshResourceItem.emit();
		// 		});
		// 	}
		// });
	}

	/**
	 * 下载
	 * @param {ResourceListModel} data
	 */
	download(data) {
		const fileServerUrl = this.envDefaultConfig.getHttpServerUrl(fileCode.DOWNLOAD) + encodeURIComponent(data.path);
		this.showDownloadBtn.emit(true);
		data.success = false;
		data.downloading = true;
		this.downloadList.emit(data);
		try {
			this.clientService.download(fileServerUrl, this.clientService.getAppPath().download + data.name).subscribe(res => {
				data.filePath = res;
				data.success = true;
				data.downloading = false;
				this.dialogService.alertSuccess('下载成功！');
				this.downloadList.emit(data);
			}, err => {
				data.downloading = false;
				this.dialogService.alertWarning('当前网络不稳定，下载失败！');
				//this.dialogService.alertWarning('网络原因，请稍后重试');
				this.downloadList.emit(data);
			});
		} catch (e) {
			data.downloading = false;
			this.dialogService.alertWarning(e.message);
			this.downloadList.emit(data);
		}
	}

	/**
	 * 获取图片名称
	 * @param list
	 * @returns {any[]}
	 */
	private getImages(list) {
		const imgList = [];
		for (const item of list) {
			const type = this.getSuffixName(item.name);
			if (this.allowImgType.indexOf(type) > -1) {
				imgList.push(item);
			}
		}
		return imgList;
	}

	private getSuffixName(name: string) {
		return name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
	}

	/**
	 * 阻止默认行为
	 */
	private stopPropagation() {
		window.event ? window.event.cancelBubble = true : event.stopPropagation();
	}
}
