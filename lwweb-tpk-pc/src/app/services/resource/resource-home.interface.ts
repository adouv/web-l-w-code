import {LwHttpService, EnvDefaultConfig, LwOauth2TokenService, LW_MODULE_CODE, ModuleCode} from '../../app.export';
import {Inject, Injectable} from '@angular/core';


@Injectable()
export class ResourceHomeInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}


	/**
	 *
	 * @param params
	 * @returns {Observable<any>}
	 */
	getList(params) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outline/outlineList', params);
	}

	/**
	 *
	 * 获取年级
	 * @param param {gardenId: string}
	 * @returns {Observable<any>}
	 */
	getGrades(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/teacher/professor/grades', param);
	}

	/**
	 *
	 * 获取讲师教授的班级
	 * @param params 年级ID
	 * @returns {Observable<any>}
	 */
	getClasses(params) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/organization/teacher/professor/classes', params);
	}

	/**
	 *
	 * 获取科目
	 * @param params
	 * @returns {Observable<any>}
	 */
	getSubjects(params) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outlineDictionary/subjectList', params);
	}

	/**
	 *
	 * 获取教材版本
	 * @param params
	 * @returns {Observable<any>}
	 */
	getEditionList(params) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outlineDictionary/editionList', params);
	}

	/**
	 *
	 * 获取学期
	 * @param params
	 * @returns {Observable<any>}
	 */
	getSemesterList(params) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outlineDictionary/semesters/' + params.gradeCode + '/' + params.subjectCode, {gardenId: params.gardenId});
	}


	/**
	 * 根据节点ID获取最末级的节点list
	 * @param {string} outlineId
	 * @returns {Observable<any>}
	 */
	getLastOutlineList(outlineId: string) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outline/lastListAndParent', {id: outlineId});
	}

	/**
	 * 根据节点ID获取最末级的节点list
	 * @param {string} outlineId
	 * @returns {Observable<any>}
	 */
	getOneselfAndChild(outlineId: string) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outline/oneselfAndChild', {id: outlineId});
	}

	/**
	 *
	 * 设置缓存
	 * @param params
	 * @returns {Observable<any>}
	 */
	setOutlineIdsCache(params) {
		return this.httpService.post(this.moduleCode.RESOURCE_WEB, '/outline/outlineIdsCache', params);
	}

	/**
	 *
	 * 设置缓存
	 * @param params
	 * @returns {Observable<any>}
	 */
	getClickOutlineId(params) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outline/clickOutlineId', params);
	}

	/**
	 *
	 * 获得缓存
	 * @param params
	 * @returns {Observable<any>}
	 */
	getOutlineDictionaryCache(resource) {
		return this.httpService.get(this.moduleCode.RESOURCE_WEB, '/outlineDictionary/cache', {resource: resource});
	}

	// 删除课件
	deleteMaterial(id: string) {
		const params = {id: id};
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/course/material/item', params);
	}
}
