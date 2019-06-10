import {Injectable, Inject} from '@angular/core';
import {LwHttpService, EnvDefaultConfig, LwOauth2TokenService, LW_MODULE_CODE, ModuleCode} from '../../app.export';

@Injectable()
export class ResourceClassesInterface {
	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 获取备课列表
	 * @param outlineId  大纲id
	 * @returns {Observable<any>}
	 */
	getCoursewareList(outlineId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/courseware/' + outlineId);
	}

	/**
	 * 获取课件
	 * @param params
	 * @returns {Observable<any>}
	 */
	getCourseFileList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/outline/item', params);
	}

	/**
	 * 新增课件
	 * @param params
	 * @returns {Observable<any>}
	 */
	addCoursewareList(params: { outlineId: string | number, name: string, size: number, path: string, fileServerType: string | number }) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/courseware', params);
	}

	/**
	 * 删除课件
	 * @param id         课件ID
	 * @param outlineId  大纲ID
	 * @returns {Observable<any>}
	 */
	delCoursewareList(id, outlineId) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/courseware', {id: id, outlineId: outlineId});
	}

	/**
	 * 打开课件
	 * @param outlineId  课标大纲id
	 * @param id         课件id
	 * @returns {Observable<any>}
	 */
	openCoursewareList(outlineId, id) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/courseware/courseResource', {
			outlineId: outlineId,
			id: id
		});
	}

	/**
	 * 获取大纲下课件总大小
	 * @param outlineId
	 * @returns {Observable<any>}
	 */
	getCourseSpace(outlineId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/courseware/space', {outlineId: outlineId});
	}

	/**
	 * 绑定到课表大纲和课堂资源
	 * @param classId
	 * @param giveLessonTime
	 * @param period
	 * @returns {Observable<any>}
	 */
	bindCourseWare(classId, giveLessonTime, period) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/courseware/courseResource', {
			classId: classId,
			giveLessonTime: giveLessonTime,
			period: period
		});
	}
	/*
	* 获取备课习题列表
	* @param params
	* @returns {Observable<any>}
	* */
	getExerciseOutline(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/outline', params, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/**
	 * 获取备课习题（新）
	 * @param params
	 * @returns {Observable<any>}
	 */
	getPrepareExerciseList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/outline/exercise', params);
	}

	/**
	 * 获取习题统计信息
	 * @param params
	 * @returns {Observable<any>}
	 */
	getExercisesDetails(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/record/statistics', params);
	}
	/*
	* 获取习题统计信息中的下拉列表
	* @param params
	* @returns {Observable<any>}
	* */
	getExerciseRecordTimes(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/record/times', params);
	}
	/*
	* 根据ID获取本身和子节点集合(习题页面下拉框)
	* @param params
	* @returns {Observable<any>}
	*
	* */
	getOneselfAndChild(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/outline/oneselfAndChild', params);
	}

	/**
	 * 根据一个或多个id获取做题列表
	 * @param params
	 * @returns {Observable<any>}
	 */
	getExerciseOutlineList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/exercise/listByIds', params);
	}
	/*
	* 获得习题类型
	* @param params
	* @returns {Observable<any>}
	* */
	getExerciseTypeList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/dictionaryType/typeList', params);
	}
	getCurrentOrNextLessonInfo(gradeId?: string, subjectCode?: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/currentOrNextLesson', {
			'gradeId': gradeId,
			'subjectCode': subjectCode
		});
	}
	// 删除课件
	deleteMaterial(id: any) {
		const params = {id: id};
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/course/material/item', params);
	}

	// 获得播放地址
	getPlayUrl(gardenId, filename) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/streamMedia/playPath/' + gardenId + '?filename=' + filename);
	}
}
