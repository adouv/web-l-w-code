import {Injectable, Inject} from '@angular/core';
import {LwHttpService, EnvDefaultConfig, LwOauth2TokenService, LW_MODULE_CODE, ModuleCode} from '../../app.export';

@Injectable()
export class CmsInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	startRecord(cameraId: string, name: string, client: string, videoId?: string) {
		return this.httpService.get(this.moduleCode.CMS, '/record/camera/start', {
			'cameraId': cameraId,
			'name': name,
			'clientId': client,
			'videoId': videoId
		});
	}

	pauseRecord(videoId: string) {
		return this.httpService.get(this.moduleCode.CMS, '/record/camera/pause', {'videoId': videoId});
	}

	stopRecord(videoId: string) {
		return this.httpService.get(this.moduleCode.CMS, '/record/camera/stop', {'videoId': videoId});
	}
}
