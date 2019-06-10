import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LwHttpService } from '../../../common/http/http.service';
import { EnvDefaultConfig } from '../../../common/config/env-default.config';
import { LwOauth2TokenService } from '../../../common/oauth2/oauth2-token.service';
import { LW_MODULE_CODE } from '../../../common/config/module.config';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class CourseInterface {

	EXERCISE_ADD_MODULE: string = this.defaultConfig.getModuleUrl(this.moduleCode.TPK_WEB) + '/course/material/example';
	EXERCISE_TEMPLATE: string = this.defaultConfig.getModuleUrl(this.moduleCode.TPK_WEB) + '/example/template';

	constructor(private httpService: LwHttpService,
		private defaultConfig: EnvDefaultConfig,
		private accessToken: LwOauth2TokenService,
		@Inject(LW_MODULE_CODE) private moduleCode) {
	}

	// 上传课件
	uploadMaterial(lessonId: string, date: string, lessonStage: string, name: string
		, path: string, size: number, videoGuid: string, courseMaterialDesign: string, fileServer?: number) {
		const params = {
			lessonId: lessonId,
			date: date,
			lessonStage: lessonStage,
			name: name,
			path: path,
			size: size,
			videoGuid: videoGuid,
			fileServer: fileServer,
			courseMaterialDesign: courseMaterialDesign
		};
		return this.httpService.post(this.moduleCode.TPK_WEB, '/course/material/item', params);
	}

	deleteMaterial(id: string) {
		const params = { id: id };
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/course/material/item', params);
	}

	// 刪除文件服务器的文件
	deleteFileServerFile(filePath: string) {
		const params = { fileName: filePath };
		return this.httpService.delete(this.moduleCode.FILE_SERVER, '/fs/file/remove', params);
	}

	// 下载文件服务器文件
	downLoadFileServerFile(filePath: string) {
		// return this.httpService.download(this.moduleCode.FILE_SERVER, '/fs/file/download?fileName=' + filePath);
	}


	// 查询备课详情
	getMaterialDetail(lessonId: string, date: string) {
		const params = { lessonId: lessonId, date: date };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material', params);
	}

	// 查询已有的备课材料
	getAllMaterials(lessonId: string, lessonDate: string, lessonStage: string | number, courseMaterialDesign: string) {
		const params = { lessonId: lessonId, date: lessonDate, lessonStage: lessonStage, courseMaterialDesign: courseMaterialDesign };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/item', params);
	}

	// 查询备课空间使用情况
	getLessonSpace(lessonId: string, lessonDate: string) {
		const params = { lessonId: lessonId, date: lessonDate };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/space', params);
	}

	// 主课件（设置/取消）
	setMainMaterial(id: string, status: boolean) {
		const params = { id: id, status: status };
		return this.httpService.put(this.moduleCode.TPK_WEB, '/course/material/item/main', params);
	}

	// （发布/取消）备课
	publishCourseMaterial(lessonId: string, lessonDate: string, status: boolean) {
		let params: any = { lessonId: lessonId, date: lessonDate, status: status };
		params = new HttpParams({ fromObject: <any>params });
		return this.httpService.put(this.moduleCode.TPK_WEB, '/course/material/status', params);
	}

	// 校验是否有主课件
	validationMainMaterial(lessonId: string, date: string) {
		const params = { lessonId: lessonId, date: date };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/validation', params);
	}


	// 获取园区列表
	getGardens() {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/gardens');
	}
	getPatrolGardens() {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/manager/gardens');
	}

	// 获取年列表
	getYears(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/years', params);
	}
	getPatrolYears(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/manager/years', params);
	}

	// 获取学期
	getSemesters(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/semesters', params);
	}

	// 获取周列表
	getWeeks(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/weeks', params);
	}
	//获取年纪
	getPatrolGrdea(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/manager/grades', params);
	}
	//获取学科
	getPatrolSubject(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/manager/subjects', params);
	}
	// 获取班级
	getClasses(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/classes', params);
	}
	getPatrolClasses(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/manager/classes', params);
	}

	// 获取课表
	getLessons(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/lessons', params);
	}

	getPatrolLessons(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/manager/lessons', params);
	}
	// 同步课表
	getSyncLessons(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/teacher/lessons/sync', params);
	}

	// 获取备课详情
	getPreparation(lessonId: string, date: string) {
		const params = { lessonId: lessonId, date: date };
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/preparation', params);
	}

	// 获取单节课空间使用情况
	getSpace(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/preparation/space', params);
	}

	// 获取当前正在上的课的课件
	getLessonIngMaterial(dateTime?: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/lesson/lessonIngMaterial', {
			date: dateTime
		});
	}

	/**
	 * 通过ID查询习题
	 * @param {string} id
	 * @returns {Promise<any>}
	 */
	getExerciseListById(id: string): Observable<any> {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/example/' + id);
	}

	getDownloadTemplatePath() {
		return this.defaultConfig.getHttpModuleUrl(this.moduleCode.TPK_WEB) + '/example/template?TOKEN=' + this.accessToken.getAccessToken();
	}

	/**
	 * 获取当前课程所有的习题模块
	 * @param {{lessonId: string; date: string; lessonStage: string}} params
	 * @returns {Promise<any>}
	 */
	getExerciseModules(params: { lessonId: string, date: string, lessonStage: string }): Observable<any> {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/example', params);
	}

	deleteExerciseModuleById(id: string): Observable<any> {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/course/material/example', { id: id });
	}

	deleteMainExerciseById(id: string): Observable<any> {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/example/main/' + id);
	}

	deleteSubExerciseById(id: string) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/example/sub/' + id);
	}

	updateMainExercise(params: { totalScore?: string, subjectHtml: string, description?: string, id: string }): Observable<any | null> {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/example/main', new HttpParams({ fromObject: <any>params }));
	}

	updateSubExercise(params: {
		score?: string,
		troubleLevel?: string,
		subjectHtml: string,
		answerHtml?: string,
		id: string
	}): Observable<any | null> {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/example/sub', params);
	}
	// 更新备课（发布和取消发布使用）
	courseMaterial(params: {
		lessonId: string,
		date: string,
		publishStatus: boolean,
		lessonTitle?: string,
		lessonType: any,
		outlineIds: Array<any>,
		isForce: boolean,
		courseMaterialSyncDtoList?: Array<{
			lessonId: string,
			date: string,
			name: string
		}>
	}) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/course/material', params);
	}
	// 课节类型
	getLessonType() {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/dictionary/item/lesson_type');
	}
	getOutlinePrepare(params: {
		lessonId: string,
		date: string
	}) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/outline/prepare', params);
	}

	getExerciseList(params: {
		lessonId: string | number,
		lessonStage: string | number,
		date: string | number,
		designStatus?: string | number,
		typeCode?: any
	}) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/exercise/list', params);
	}

	getCourseValidation(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/validation', params);
	}

	getMaterialDesign() {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/design');
	}

	getPromise(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/tpk/permission/hasPermission', params);
	}
}

