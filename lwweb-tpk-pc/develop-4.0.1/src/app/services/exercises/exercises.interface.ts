import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, ModuleCode} from '../../app.export';
import {ExerciseListParams, OutlineParams, QuestionListParams} from './exercises.model';

@Injectable()
export class ExercisesInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 获取大纲列表
	 * @returns {Observable<any>}
	 */
	getOutlineList(params: OutlineParams) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/outline/outlineList', params);
	}


	/**
	 * 获取教学设计标签
	 * @returns {Observable<any>}
	 */
	getExerciseDesign() {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/design');
	}

	/**
	 * 设置教学设计标签
	 * @returns {Observable<any>}
	 * @param params
	 */
	setExerciseDesign(params: { ids: string | string[], designCode: string }) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/exercise/outline/designCode', params);
	}
	/**
	 * 设置教学设计标签
	 * @returns {Observable<any>}
	 * @param params
	 */
	setExerciseDesignByMaterial(params) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/course/material/exercise/design', params);
	}

	/**
	 * 对应年级和学科绑定的题型列表
	 * @returns {Observable<any>}
	 * @param params
	 */
	getTypeListByCondition(params: { gradeCode: string, subjectCode: string, semesterCode?: string }) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/dictionaryType/typeList', params);
	}


	/**
	 * 获取习题列表
	 * @returns {Observable<any>}
	 */
	getExerciseList(params: ExerciseListParams) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/outline', params);
	}

	/**
	 * 移除习题
	 */
	delExercise(params: { id: string } | { outlineId: string, exerciseId: string, gardenId: string }) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/exercise/outline', params);
	}
	/**
	 * 移除习题
	 */
	delExerciseByMaterial(params) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/course/material/exercise', params);
	}

	/**
	 * 获取试题列表
	 * @param params
	 * @returns {Observable<any>}
	 */
	getQuestionList(params: QuestionListParams) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/question', params, {observe: 'response'}).map(res => {
			return {
				totalCount: res.headers.get('x-record-count'),
				data: res.body
			};
		});
	}

	/**
	 * 习题详情
	 * @param id
	 * @returns {Observable<any>}
	 */
	getQuestionInfo(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/question/content/' + id);
	}

	/**
	 * 加入课堂
	 * @param params
	 * @returns {Observable<any>}
	 */
	addJoinClass(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/exercise/outline', params);
	}
	/**
	 * 加入课堂
	 * @param params
	 * @returns {Observable<any>}
	 */
	addJoinClassByLesson(params: {
		gardenId?: any,
		lessonId: any,
		lessonStage: any,
		date: any,
		exerciseIds: any,
		accountId?: any,
		designCode?: any
	}){
		return this.httpService.post(this.moduleCode.TPK_WEB, '/course/material/exercise', params);
	}
	/**
	 * 获取章节下所有已备习题支持题型条件
	 * @param params
	 * @returns {Observable<any>}
	 */
	getExistExercise(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/outline/existExerciseIds', params);
	}
	
	getExistExerciseByMaterial(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/exercise/idList', params);
	}
	/*
	* 新建习题获得题目类型
	* @param params
	* @returns {Observable<any>}
	* */
	gettypeList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/dictionaryType/typeList', params);
	}
	/**
	 * 获取备课习题列表总数
	 * @param params
	 * @returns {Observable<any>}
	 */
	getExerciseTotal(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/exercise/outline/count', params);
	}
	
	/**
	 * 获取备课习题列表总数
	 * @param params
	 * @returns {Observable<any>}
	 */
	getExerciseTotalByMaterial(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/exercise/count', params);
	}
	/*
	* 添加试题
	* @param params
	* @returns {Observable<any>}
	*
	* */
	addQuestion(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/question', params);
	}

	// 获得播放地址
	getPlayUrl(gardenId, filename) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/streamMedia/playPath/' + gardenId + '?filename=' + filename);
	}
}
