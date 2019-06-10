import {Injectable, Inject} from '@angular/core';
import {LwHttpService, EnvDefaultConfig, LwOauth2TokenService, LW_MODULE_CODE, ModuleCode} from '../../app.export';
import {QualityCoursesModel} from './quality-courses.model';

export interface AddQualityCourse {
	outlineIds: Array<string>;
	name: string;
	subjectCode: string;
	size: string;
	path: string;
	source: number;
	gradeName: string;
	className: string;
	duration?: string;
	gardenId?: any;
	cover?: string;
	createTime?: string;  // 录像开始时间，格式yyyy-MM-dd HH:mm:ss
	classId?: string;
	gradeId?: string;
	gradeCode?: string;
	period?: string;
	week?: string;
}

@Injectable()
export class QualityCourseInterface {
	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 获取精品课列表
	 * @param {string} outlineId 大纲id
	 * @returns {Observable<any>}
	 */
	getQualityCourseList(outlineId: string, gardenId: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/qualityCourse', {outlineId, gardenId});
	}

	/**
	 * 删除精品课
	 * @param qualityCourseId
	 * @param {string} outlineId
	 * @returns {Observable<any>}
	 */
	delQualityCourseList(qualityCourseId: string, outlineId: string, gardenId: any) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/qualityCourse', {
			id: qualityCourseId,
			outlineId: outlineId,
			gardenId: gardenId
		});
	}

	/**
	 * 更新精品课
	 * @param {string} qualityCourseId
	 * @param {string} name
	 * @param outlineIds
	 * @returns {Observable<any>}
	 */
	updateQualityCourse(qualityCourseId: string, name: string, outlineIds: string[]) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/qualityCourse', {
			id: qualityCourseId,
			name: name,
			outlineIds: outlineIds,
		});
	}

	/**
	 * 设置是否显示
	 * @param {string} qualityCourseId
	 * @param {string} outlineId
	 * @returns {Observable<any>}
	 */
	isShowQualityCourse(qualityCourseId: string, outlineId: string) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/qualityCourse/isShow', {
			id: qualityCourseId,
			outlineId
		});
	}

	/**
	 * 添加精品课
	 * @param {AddQualityCourse} addQualityCourse[]
	 * @returns {Observable<any>}
	 */
	addQualityCourse(addQualityCourse) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/qualityCourse', addQualityCourse);
	}

	/**
	 * 精品课排序
	 * @param {QualityCoursesModel[]} params
	 * @returns {Observable<any>}
	 */
	sortQualityCourse(params: QualityCoursesModel[]) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/qualityCourse/sort', params);
	}

	/**
	 * 根据精品课id查找大纲id数组
	 * @param id
	 * @returns {Observable<any>}
	 */
	getOutlineIds(id: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/qualityCourse/outlineIds', {id: id});
	}
}
