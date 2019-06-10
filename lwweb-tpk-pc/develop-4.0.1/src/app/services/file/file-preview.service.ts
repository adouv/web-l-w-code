import { ResourceClassesInterface } from './../resource/resource-classes.interface';
import { VideoClassesInterface } from './../videos/video-classes.interface';
import { Inject, Injectable } from '@angular/core';
import { EnvDefaultConfig } from '../../common/config';
import { Lightbox } from '@ngx-gallery/lightbox';
import { Gallery, ImageItem } from '@ngx-gallery/core';
import { NzModalService } from 'ng-zorro-antd';
import { VideoPlayerComponent } from '../../components/video-player/video-player';
import 'hammerjs';
import { LW_FILE_CODE } from '../../app.export';
import { LwClientService } from '../../common/client';
import { NotificationService } from '../../extend/notification/notification.service';
import { AccountService } from '../account';

@Injectable()
export class FilePreviewService {
	private allowImgType: string[];
	private videoType: string[];

	constructor(private lightbox: Lightbox, private gallery: Gallery,
		private modalService: NzModalService,
		private envDefaultConfig: EnvDefaultConfig, 
		private accountService: AccountService,
		private resourceClassesInterface: ResourceClassesInterface,
		private videoClassesInterface: VideoClassesInterface,
		@Inject(LW_FILE_CODE) private fileCode,
		private clientService: LwClientService,
		private notification: NotificationService) {
		this.allowImgType = ['jpg', 'jpeg', 'png', 'gif'];
		this.videoType = ['mp4', 'rmvb', 'avi', 'flv', 'wmv'];
	}

	private initLightBox(list) {
		this.gallery.ref('lightbox').reset();
		for (const item of list) {
			this.gallery.ref('lightbox').add(
				new ImageItem(this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG) + item.path,
					this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG) + item.path)
			);
		}
	}

	/**
	 * 图片大图预览
	 * @param list
	 * @param i
	 */
	imgPreview(list, i) {
		this.initLightBox(list);
		console.log(i);
		this.lightbox.open(i);
	}

	/**
	 * 视频预览
	 * @param src
	 * @param title
	 */
	videoPreview(src, title?: string) {
		const subscription = this.modalService.open({
			title: title || '精品课预览',
			content: VideoPlayerComponent,
			width: 960,
			footer: false,
			componentParams: {
				source: [{ "pcPlayUrl": src }]
			},
			class: 'video-preview'
		});
		subscription.subscribe(result => {
			console.log(result);
		});
	}


	/**
	 * 文件预览
	 * @param data
	 * @param list
	 */
	filePreview(data, list?, resourcePath?) {
		const imgLists = this.getImages(list),
			ids = this.getIds(imgLists),
			type = this.getSuffixName(data.name),
			filePath = this.envDefaultConfig.getHttpServerUrl(this.fileCode.SHOW_IMG) + encodeURIComponent(data.path);
		let videoPath = this.envDefaultConfig.getHttpServerUrl(this.fileCode.SHOW_IMG) + data.path;
		if (resourcePath) {
			videoPath = resourcePath;
		}
		let index = 0;

		if (this.videoType.indexOf(type) > -1) {  // 预览视频 mp4、flv
			this.getVideoUrl(data.path, (data) => {
				this.videoPreview(data.pcPlayUrl, '视频预览');
			})
		}
		else if (this.allowImgType.indexOf(type) > -1) {  // 预览图片
			for (const item of ids) {
				if (item === data.id) {
					index = ids.indexOf(item);
				}
			}
			this.imgPreview(imgLists, index);
		} else {
			this.clientService.previewFile(filePath, data.name.replace(/ /g, '')).subscribe(preview => {
				console.log(preview);
			}, (err) => {
				console.log(err);
				this.notification.error('预览失败', '暂不支持该格式文件');
			});
		}
	}

	private getVideoUrl(url, callback) {
		this.resourceClassesInterface.getPlayUrl(this.accountService.getCurrentGardenId(), url).subscribe((data) => {
			callback(data);
		})
	}

	private getSuffixName(name: string) {
		return name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
	}

	getIds(list) {
		const ids = [];
		for (const data of list) {
			ids.push(data.id);
		}
		return ids;
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


}
