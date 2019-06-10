import { Inject, Injectable } from '@angular/core';
import {
	EnvDefaultConfig,
	LW_FILE_CODE,
	LwClientService,
	LwOauth2TokenService,
	LW_MODULE_CODE,
	ModuleCode
} from '../../app.export';

import { NotificationService } from '../../extend/notification/notification.service';
import { FileInterface } from './file.interface';
import { NotificationMessage } from '../../components/notification-message/notification-message';
import { LwStorageService } from '../../common/cache';
import { summaryFileName } from '@angular/compiler/src/aot/util';

@Injectable()
export class FileDownloadService {
	constructor(private clientService: LwClientService,
		@Inject(LW_FILE_CODE) private fileCode,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
		private accessTokenService: LwOauth2TokenService,
		private notification: NotificationService,
		private fileInterface: FileInterface,
		private storageService: LwStorageService,
		private envDefaultConfig: EnvDefaultConfig) {
	}

	/*
	 * file:{path,name}
	 *
	 * */
	downloadFile(file: { name: string, path: string, title?: string }, serverUrl?: string) {
		if (file.path == null) {
			this.notification.error(file.title ? file.title : '下载失败', '文件地址信息为空');
		} else {
			if (serverUrl == null || serverUrl == '') {
				const fileServerUrl = this.envDefaultConfig.getHttpServerUrl(this.fileCode.DOWNLOAD) + encodeURIComponent(file.path);
				this.downloadFileByFullPath(fileServerUrl, file.name, file.title);
			} else {
				serverUrl = serverUrl.indexOf('?') > -1 ? serverUrl + '&token=' + this.storageService.get('token').access_token : serverUrl + '?token=' + this.storageService.get('token').access_token;
				const fileServerUrl = this.envDefaultConfig.getHttpModuleUrl(this.moduleCode.TPK_WEB) + serverUrl;
				this.downloadFileByFullPath(fileServerUrl, file.name, file.title);
			}
		}
	}
	existsLocalFile(fileNames) {
		//return this.clientService.isFileExistList(fileDirectory,fileNames);
		return this.clientService.changeFileName(fileNames);
	}
	
	downloadFileByFullPath(fullPath: string, fileName: string, title?: string) {
		try {
			this.clientService.download(fullPath, this.clientService.getAppPath().download + fileName).subscribe(data => {
				console.log(data);
				this.notification.success(title ? title : '下载成功', NotificationMessage, {
					componentParams: {
						filename: fileName,
						filePath: data,
						type: 'success'
					}
				});
			}, err => {
				if(err.message.substring(0,36) == 'EBUSY: resource busy or locked, open'){
					this.notification.error('下载失败', '文件正在使用，请关闭该文件并重新下载');
				}else{
					this.notification.error('下载失败', '网络原因，请稍后重试');
				}
			});
		} catch (e) {
			console.log(e);
			this.notification.error('下载失败', '网络原因，请稍后重试');
		}
	}

	/*
	 *
	 * file:{path,name}
	 *
	 * */
	previewFile(file: { name?: string, path: string }, gardenId?: string) {
		const allowType = ['mp4', 'flv'];
		file.name = file.name.replace(/ /g, '');
		console.log(file.name);
		if (allowType.indexOf(file.path.substring(file.path.lastIndexOf('.') + 1, file.path.length)) !== -1) {
			console.log(file.path.substring(file.path.lastIndexOf('.') + 1, file.path.length));
			this.fileInterface.getDownloadPath(gardenId, file.path).subscribe((res) => {
				const downloadPath = res.url + '&TOKEN=' + this.accessTokenService.getAccessToken();
				const observe = this.clientService.previewFile(downloadPath, file.name);
				observe.subscribe(data => {
					console.log(data);
				}, err => {
					this.notification.error('预览失败', '暂不支持该格式文件');
				});
			});
		} else {
			const fileServerUrl = this.envDefaultConfig.getHttpServerUrl(this.fileCode.DOWNLOAD) + encodeURIComponent(file.path);
			const observe = this.clientService.previewFile(fileServerUrl, file.name);
			if (observe != null) {
				observe.subscribe(data => {
					// this.dialogService.alertSuccess('文件地址: ' + data);
					console.log(data);
				}, err => {
					this.notification.error('预览失败', '暂不支持该格式文件');
				});
			} else {
				this.notification.error('预览失败', '暂不支持该格式文件');
			}
		}
	}

	/*
	 *
	 * 打印
	 *
	 * */
	printView(html) {
		const newWindow = document.createElement('iframe');
		newWindow.style.cssText = 'display:none;';
		document.body.insertBefore(newWindow, document.body.firstChild);
		const style = newWindow.contentDocument.createElement('style');
		style.type = 'text/css';
		style.appendChild(newWindow.contentDocument.createTextNode('@page{size: auto;margin: 0mm;} html{margin: 0px;width:100%;height:100%;} body{margin:0 auto;text-align;center;width:100%;height:100%;}'));
		newWindow.contentDocument.body.innerHTML = '<div style="padding:10px 100px;">' + html + '</div>';
		newWindow.contentDocument.body.appendChild(style);
		console.log(newWindow.contentDocument.body.innerHTML);
		newWindow.contentWindow.print();
		setTimeout(() => {
			document.body.removeChild(newWindow);
		}, 300);
	}
}