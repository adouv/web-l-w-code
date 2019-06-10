import {Injectable} from '@angular/core';
import {
	CourseSpaceModel, FAILURE, PROGRESS, SUCCESS, FAILURE_MESSAGE, PROGRESS_MESSAGE, SUCCESS_MESSAGE,
	UploaderItemModel
} from './resource-prepare.model';
import {FileInterface} from '../../services/file/file.interface';
import {LwOauth2TokenService} from '../../app.export';
import {LwStorageService} from '../../common/cache';
import {FileUploader} from 'ng2-file-upload';

@Injectable()
export class ResourceClassesService {
	uploader: FileUploader;
	course: any;
	constructor(private accessTokenService: LwOauth2TokenService,
				private fileInterface: FileInterface,
				private storageService: LwStorageService) {
	}

	/**
	 * 内存空间使用情况
	 * @param usedSpace
	 * @param totalSpace
	 * @returns
	 */
	courseSpace(usedSpace?: number, totalSpace?: number) {
		let usedRatio = 0;
		if (usedSpace && totalSpace && totalSpace !== 0) {
			usedRatio = Math.round(usedSpace * 100 / totalSpace);
		} else {
			usedRatio = 0;
		}
		this.course =  {usedSpace: usedSpace, totalSpace: totalSpace, usedRatio: usedRatio};
		return this.course;
	}

	/**
	 * 内存空间使用情况
	 * @param fileItems
	 * @returns {boolean}
	 */
	isOverSpaceLimit(fileItems: any): boolean {
		let totalSize = 0;
		for (const fileItem of fileItems) {
			totalSize += fileItem.file.size;
		}
		return this.course && (this.course.usedSpace + totalSize / (1024 * 1024) > this.course.totalSpace);
	}

	/**
	 *  获取ftp服务器视频地址
	 */
	initVideoUploadPath(callback) {
		let videoUploadPath = '';
		const gardenId = this.storageService.getCurrentGarden().gardenId;
		this.fileInterface.getUploadPath(gardenId).subscribe(res => {
			videoUploadPath = res.url + '?TOKEN=' + this.accessTokenService.getAccessToken();
			callback(videoUploadPath);
		});
	}

	/**
	 * 处理上传文件信息
	 * @param {UploaderItemModel} uploaderItem
	 * @returns {UploaderItemModel}
	 */
	uploaderItem(uploaderItem: UploaderItemModel) {
		uploaderItem.msg = this.getMsg(uploaderItem.state);
		return uploaderItem;
	}

	getMsg(state: number): string {
		if (state === PROGRESS) {
			return PROGRESS_MESSAGE;
		} else if (state === SUCCESS) {
			return SUCCESS_MESSAGE;
		} else if (state === FAILURE) {
			return FAILURE_MESSAGE;
		} else {
			return '';
		}
	}

	/**
	 * 判断是不是文件名称，带有后缀名
	 * @param {string} fileName
	 * @returns {boolean}
	 */
	isIllegalFileName(fileName: string): boolean {
		return !fileName || fileName.indexOf('.') === -1;
	}
}