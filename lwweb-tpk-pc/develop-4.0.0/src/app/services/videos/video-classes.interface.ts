import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, LwOauth2TokenService, ModuleCode} from '../../app.export';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class VideoClassesInterface {
	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				private oauthToken: LwOauth2TokenService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {

	}

	/**
	 * 根据园区找年级
	 * @param {gardenId: string}
	 * @returns {Observable<any>}
	 */
	getGradeUseGarden(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/grades', param);
	}

	/**
	 * 获取关注的年级
	 * @param {gardenId: string}
	 * @returns {Observable<any>}
	 */
	getAttentionGrade(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/attention/grades', param);
	}

	getTaskAttentionGrade(params?: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/permission/grades', params);
	}

	/**
	 * 获取班级列表
	 * @param param
	 * @returns {Observable<any>}
	 */
	getClassesList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/classes', param);
	}

	/**
	 * 获取年级下有权限且关注过的班级列表
	 * @param param
	 * @returns {Observable<any>}
	 */
	getAttentionClassesList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/attention/classes', param);
	}

	getTaskAttentionClassesList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/permission/classes', param);
	}


	/**
	 * 教师有权限观看直播的班级id集合
	 * @param param
	 * @returns {Observable<any>}
	 */
	getTeacherClass(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/live/teacher/class', param);
	}

	/**
	 * 获取直播详情页
	 * @param id
	 */
	getLiveDetails(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/live/course', {classId: id});
	}

	/**
	 * 获取摄像头列表
	 * @returns {Observable<any>}
	 * @param param
	 */
	getCamerasList(param: { gardenId?: string, id: string }) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/cameras/' + param.id, param);
	}

	/**
	 * 获取点赞列表
	 * @param param
	 */
	getFavourList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/favour', param);
	}

	/**
	 * 判断是否点赞
	 * @param param
	 * @returns {Observable<any>}
	 */
	getIsFavour(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/favour/isFavour', param);
	}

	/**
	 * 点赞
	 * @param param
	 * @returns {Observable<any>}
	 */
	postFavour(param) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/favour', param);
	}

	/**
	 * 取消赞
	 * @param param
	 * @returns {Observable<any>}
	 */
	deleteFavour(param) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/favour', param);
	}

	/**
	 * 获取当前学期的周列表
	 * @param param
	 * @returns {Observable<any>}
	 */
	getScheduleWeeks(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/weeks', param);
	}

	/**
	 * 获取常态课点播排行
	 * @param param
	 * @returns {Observable<any>}
	 */
	getCourseRank(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/index/course/rank', param, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/**
	 * 课程评价统计
	 * @param param
	 * @returns {Observable<any>}
	 */
	getCourseRecords(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/courseRecord/statistics/comment', param, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/**
	 * 获取学科列表
	 * @param param
	 * @returns {Observable<any>}
	 */
	getSubjectList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/used/subjects', param);
	}

	getTaskSubjectList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/configured/permission/subjects', param);
	}

	/**
	 * 获取老师列表
	 * @param id
	 * @returns {Observable<any>}
	 */
	getTeacherList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/used/teachers', param);
	}

	getTaskTeacherList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/configured/permission/teachers', param);
	}

	/*
	 *
	 * 获取点播列表
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getUnicastList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/permission', param, {observe: 'response'});
	}

	/*
	 *
	 * 获取教师有权限看到的点播列表
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getUnicastListForPermission(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/teacher/permission', param, {observe: 'response'});
	}

	getTaskUnicastListForPermission(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/permission/list', param, {observe: 'response'});
	}

	getActivityFilename(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/filename', param);
	}

	/*
	 *
	 * 获得点播视频地址详情
	 * @param id
	 * @returns {Observable<any>}
	 * */

	getUnicastPlayDetails(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/playurl/' + id);
	}

	/*
	 *
	 * 获得点播视频集
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getUnicastVideoInfos(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/videoInfos', param);
	}

	/*
	 *
	 * 获得课堂资源
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getPublishedList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/material/publishedItem', param);
	}

	/*
	 * 获得点播信息详情
	 *  @param id
	 *  @returns {Observable<any>}
	 * */
	getUnicastDetails(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/' + id);
	}

	/*
	 * 获得留言列表
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getMessage(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/message', param, {observe: 'response'});
	}

	/*
	 *
	 * 增加留言
	 * @param param
	 * @returns {Observable<any>}
	 * */
	addMessage(param) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/message', param);
	}

	/*
	 * 视频集中年级+班级的下拉数据
	 * @param id
	 * @returns {Observable<any>}
	 * */
	getClassesByTeacher(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/teacher/' + id);
	}

	/*
	 * 获得教学反思或者教学评价
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getComment(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/' + id);
	}

	/*
	 * 获取评价过我的讲师列表
	 *
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getCommentTeacher(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/teacher', param);
	}

	/*
	 * 获得反思
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getSelfComment(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/self', param);
	}

	/*
	 * 提交评价或反思
	 * @param param
	 * @returns {Observable<any>}
	 * */
	submitComment(param) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/self', param);
	}

	/**
	 * 获取教学反思模版
	 * @param param
	 */
	getCommentSelf(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template/self', param);
	}


	/*
	 *
	 * 获取导入模板下载地址
	 * @param param
	 * @returns {Observable<any>}
	 * */
	getCommentTemplateUrl(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/commentTemplate/downloadUrl', param);
	}


	/*
	 * 获得权限控制
	 * @param
	 * @returns {Observable<any>}
	 *
	 * */
	getValidate(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/tpk/permission/validate', param);
	}

	/**
	 * 绑定到课表大纲和课堂资源
	 * @returns {Observable<any>}
	 * @param param
	 */
	bindCourseWare(param) {
		// return this.httpService.get(this.moduleCode.TPK_WEB, '/courseware/courseResource', param);
		// 新接口获取备课资源
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/resource', param);
	}

	/**
	 *
	 * @param param 课堂资源
	 */
	classResource(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/course/material/resource', param);
	}

	/**
	 * 获得教学评价模版
	 * @returns {Observable<any>}
	 * @param param
	 */
	getCommentTemplate(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template/system', param);
	}

	exportFile(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/statistics/exportAnalysis', param);
	}

	/**
	 * 获得平均分
	 * @returns {Observable<any>}
	 * @param param
	 */
	getAverage(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/statistics/avgScore', param);
	}

	/*
	* 获得评课排行榜数据
	* @returns {Observable<any>}
	* @param param
	* */
	getStatisticsRankingList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/statistics/statisticsRankingList', param, {observe: 'response'}).map(response => {
			console.log(response);
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/*
	* 获得评课排行榜详情数据
	* @returns {Observable<any>}
	* @param param
	* */
	getStatisticsList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/statistics/statisticsList', param, {observe: 'response'}).map(response => {
			console.log(response);
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/*
	* 获得所有学科
	* @returns {Observable<any>}
	*
	* */
	getAllSubject(gardenId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/subjects/' + gardenId);
	}

	/*
	* 获得评价分析数据
	* @returns {Observable<any>}
	* @param param
	* */
	getCourseCommentAnalysis(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/statistics/courseCommentAnalysis', param);
	}

	/*
	* 获得点播详情
	* @returns {Observable<any>}
	* @param param
	* */
	getUnicastDetailByClassAndTime(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/class/time', param);
	}

	/*
	 * 上传分析图片
	 * @returns {Observable<any>}
	 * @param param
	 * */
	analysisDoc(param) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/statistics/analysisDoc', param);
	}

	// /*
	// * 获得上传文件的地址
	// * @param id
	// * @returns {Observable<any>}
	// * */
	// getUploadPath(gardenId) {
	// 	return this.httpService.get(this.moduleCode.TPK_WEB, '/streamMedia/uploadPath/' + gardenId);
	// }
	//
	//
	// getDownloadPath(gardenId, fileName) {
	// 	return this.httpService.get(this.moduleCode.TPK_WEB, `/streamMedia/downloadPath/${gardenId}?filename=${fileName}`);
	// }

	/*
	* 邀请我的评价活动
	* @returns {Observable<any>}
	* @param param
	* */
	getInvite(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/commentActivity/invite', param, {observe: 'response'}).map(response => {
			console.log(response);
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	/*
	 * 我发起的评价活动
	 * @returns {Observable<any>}
	 * @param param
	 * */
	getInitiated(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/commentActivity/initiated', param, {observe: 'response'}).map(response => {
			console.log(response);
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}

	getLiveGrades(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/permission/live/grades', param);
	}

	getLiveClasses(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/live/course/class', param);
	}

	/**
	 * 课堂回放的我的课列表
	 * @param {gardenId: string}
	 * @returns {Observable<any>}
	 */
	getMyClass(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/self', param);
	}

	/**
	 * 课堂回放的我关注的课
	 * @param {gardenId: string}
	 * @returns {Observable<any>}
	 */
	getMyFocusedClass(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/attention/course/grades', param);
	}

	/**
	 * 课堂直播班级列表
	 * @param {gardenId: string}
	 * @return {Observable<any>}
	 */
	getClassesLiveList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/permission/live/grades', param);
	}

	/**
	 * 课堂直播班级课程列表
	 * @param {gradeId: string}
	 * @return {Observable<any>}
	 */
	getClassesLiveCoursesList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/live/course/class', param);
	}

	/**
	 * 我的课二级页面--课程列表
	 * @param param {gardeId: string}
	 * @return {Observable<any>}
	 */

	getMyClassSubjectNameList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/self/subject', param);
	}

	/**
	 * 我的课二级页面--年级列表
	 * @param {gradeId: string, subjectCode: string}
	 * @return {Observable<any>}
	 */
	getMyClassesGradeList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/self/grade', param);
	}

	/**
	 * 我的课二级页面--班级列表
	 * @params {gardenId: string, subjectCode: string ,gradeId: string}
	 * @return {Observable<any>}
	 */
	getMyClassesClazzList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/self/class', params);
	}

	/**
	 * 我的课二级页面--lessones列表
	 * @params {gardenId: string, subjectCode: string ,gradeId: string, classId: string}
	 * @return {Observable<any>}
	 */
	getMyClassLessonList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/self/lesson', params, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});
	}
}


