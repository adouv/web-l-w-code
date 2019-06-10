import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, LwOauth2TokenService, ModuleCode} from '../app.export';

@Injectable()
export class OtherInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 获取当前时间
	 * @returns {Observable<any>}
	 */
	getCurrentTime() {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/time/current');
	}
}
