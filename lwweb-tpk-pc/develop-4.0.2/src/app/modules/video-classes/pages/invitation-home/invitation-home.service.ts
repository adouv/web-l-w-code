import {Inject, Injectable} from '@angular/core';
import {
	EnvDefaultConfig,
	LW_MODULE_CODE,
	LwHttpService,
	LwOauth2TokenService,
	ModuleCode
} from '../../../../app.export';

@Injectable()
export class InvitationHomeService {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}


	/**
	 * 别人邀请我的 - 评课
	 * @param param
	 * @returns {Observable<{totalCount: any; data: any}>}
	 */
	getAppraise(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/appraise', param, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/**
	 * 别人邀请我的 - 被评课
	 * @param param
	 * @returns {Observable<{totalCount: any; data: any}>}
	 */
	getAppraised(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/appraised', param, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/**
	 * 我发起的邀请
	 * @param param
	 * @returns {Observable<{totalCount: any; data: any}>}
	 */
	getInitiated(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/initiation', param, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}
}