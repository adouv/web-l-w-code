import { Inject, Injectable } from '@angular/core';
import { EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, ModuleCode } from '../../../app.export';

@Injectable()
export class AnalysisInterface {

	constructor(private httpService: LwHttpService,
		private envConfig: EnvDefaultConfig,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 备课总统计
	 * @param params
	 * @returns {Observable<any>}
	 */
	getStatisticsPrepareAll(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/statistics/prepare/all', {
			gardenId: params.gardenId,
			startDate: params.startDate,
			endDate: params.endDate
		});
	}

	/**
	 * 备课-学科统计
	 * @param params
	 * @returns {Observable<any>}
	 */
	getStatisticsPrepareSubject(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/statistics/prepare/subject', {
			gardenId: params.gardenId,
			startDate: params.startDate,
			endDate: params.endDate
		});
	}

	/**
	 * 备课-年级统计
	 * @param params
	 * @returns {Observable<any>}
	 */
	getStatisticsPrepareGrade(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/statistics/prepare/grade', {
			gardenId: params.gardenId,
			startDate: params.startDate,
			endDate: params.endDate
		});
	}

	/**
	 * 资源列表
	 * @param params
	 * @returns {Observable<any>}
	 */
	getCourseMaterialList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/list', params, { observe: 'response' }).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}
	/**
	 * 获取邀请人列表
	 * @returns {Observable<any>}
	 */
	getTeacherList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/used/teachers', params);
	}

	/**
	 * 获取学科列表
	 * @param param
	 * @returns {Observable<any>}
	 */
	getSubjectList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/used/subjects', params);
	}

	// 查询已有的备课材料
	getAllMaterials(lessonId: string, lessonDate: string) {
		const params = { lessonId: lessonId, date: lessonDate, lessonStage: 1 };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/item', params);
	}

	// 查询备课详情
	getMaterialDetail(lessonId: string, date: string) {
		const params = { lessonId: lessonId, date: date };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material', params);
	}
	// 查询备课详情
	getPlayUrl(gardenId, filename) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/streamMedia/playPath/' + gardenId + '?filename=' + filename);
	}
}
