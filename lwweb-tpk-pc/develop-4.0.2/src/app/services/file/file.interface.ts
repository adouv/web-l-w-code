import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, LwOauth2TokenService, ModuleCode} from '../../app.export';

@Injectable()
export class FileInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/*
	* 获得上传文件的地址
	* @param id
	* @returns {Observable<any>}
	* */
	getUploadPath(gardenId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/streamMedia/uploadPath/' + gardenId);
	}


	/**
	 * 获得下载文件的地址
	 * @param gardenId
	 * @param fileName
	 * @returns {Observable<any>}
	 */
	getDownloadPath(gardenId, fileName) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/streamMedia/downloadPath/${gardenId}?filename=${fileName}`);
	}

}
