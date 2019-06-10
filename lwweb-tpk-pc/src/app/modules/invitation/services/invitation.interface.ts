import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, LwStorageService, ModuleCode} from '../../../app.export';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {LwOauth2TokenService, DEFAULT_OAUTH2_MODE, Oauth2Model} from '../../../common/oauth2';
import {HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class InvitationInterface {
	oauthModel: Oauth2Model;

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
				private tokenService: LwOauth2TokenService,
				private storageService: LwStorageService) {
		this.oauthModel = DEFAULT_OAUTH2_MODE;
	}

	/**
	 * 获取年级列表
	 * @param {gardenId: string}
	 * @returns {Observable<any>}
	 */
	getGradeList(param) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/grades', param);
	}

	/**
	 * 获取班级列表
	 * @param {string} gradeId
	 * @returns {Observable<any>}
	 */
	getClassList(gradeId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/classes', {gradeId: gradeId});
	}

	/**
	 * 获取学科列表
	 * @param {string} classId
	 * @returns {Observable<any>}
	 */
	getSubjectList(classId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/configured/subject', {classId: classId});
	}

	/**
	 * 获取教师列表
	 * @param {string} classId
	 * @param {string} subjectCode
	 * @returns {Observable<any>}
	 */
	getTeacherList(classId: string, subjectCode: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/schedule/configured/teacher', {classId: classId, subjectCode: subjectCode});
	}

	/**
	 * 获取视频列表
	 * @returns {Observable<any>}
	 * @param params
	 */
	getVideoList(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/course/permission', params);
	}


	/**
	 * 获取邀请人列表
	 * @returns {Observable<any>}
	 */
	getInviteeList() {
		const gardenId = this.storageService.get('user').gardens[0].gardenId;
		return this.httpService.get(this.moduleCode.GARDEN, `/account/garden/${gardenId}`);
	}

	/**
	 * 获取邀请人列表
	 * @returns {Observable<any>}
	 */
	getDepartmentAccountByIds(accountIds) {
		return this.httpService.get(this.moduleCode.GARDEN, '/account/accountDepartment', {accountIds: accountIds});
	}

	/**
	 * 新建评价邀请
	 * @param params
	 * @returns {Observable<any>}
	 */
	addActivity(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/activity', params);
	}

	/**
	 * 修改评价邀请
	 * @param params
	 * @returns {Observable<any>}
	 */
	editActivity(params) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/comment/activity', params);
	}

	/**
	 * 评课邀请详情
	 * @param {string} id
	 * @returns {Observable<any>}
	 */
	getInvitationDetail(id, gardenId) {
		if (id) {
			return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/' + id, {gardenId});
		} else {
			return Observable.of({});
		}
	}

	/**
	 * 获取对应的授课列表
	 * @param {string} id
	 * @returns {Observable<any>}
	 */
	getInvitationListById(id: string, gardenId: string) {
		if (id) {
			return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/course', {
				id: id,
				gardenId: gardenId
			});
		} else {
			return Observable.of({});
		}
	}

	/**
	 * 获得点播视频地址详情
	 * @returns {Observable<any>}
	 * @param classId
	 * @param startTime
	 */
	getUnicastPlayUrl(classId: string, startTime: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/unicast/course/playUrl`, {
			courseStartTime: startTime,
			classId: classId
		});
	}


	/**
	 * 获取评价该课程的邀请人
	 * @param {string} id
	 * @param {string} status
	 * @returns {Observable<any>}
	 */
	getCommentatorById(id: string, status?: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/commentator', {id: id, status: status});
	}

	/**
	 * 上传教学评价模版
	 * @param templateFile  模版文件
	 */
	uploadTemplateFile(templateFile?) {
		return this.envConfig.getModuleUrl(this.moduleCode.TPK_WEB) + '/comment/template/templateFile?TOKEN='
			+ this.tokenService.getAccessToken();
	}

	/**
	 * 保存教学评价模版
	 * @param params
	 */
	saveTemplate(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/template', params);
	}

	/**
	 * 删除教学评价模版
	 * @param id  模版id
	 */
	delTemplate(id) {
		return this.httpService.delete(this.moduleCode.TPK_WEB, '/comment/template/' + id);
	}

	/**
	 * 修改教学评价模版
	 * @param params
	 */
	exitTemplate(params) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/comment/template', params);
	}

	/**
	 * 校验当前启用模版是否有冲突
	 * @param params
	 */
	checkConflict(gardenId: string, ignoreId?: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template/checkConflict', {gardenId: gardenId, ignoreId: ignoreId});
	}

	/**
	 * 修改量表有效性
	 */
	updateEffectiveness(params: { id: string, effectiveness: string, resolvingConflicts?: string }) {
		const oauthModel = new HttpParams({fromObject: {...params}});
		const header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
		return this.httpService.put(this.moduleCode.TPK_WEB, '/comment/template/effectiveness', oauthModel, {headers: header});
	}

	/**
	 * 启用或停用模版
	 * @param params
	 */
	changeStatus(params: { id: string, gardenId: string, usingStatus: boolean }) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/comment/template/usingStatus', params);
	}

	/**
	 * 启用状态
	 * @param params
	 */
	getStartup(params: { gardenId: string, ignoreId: string }) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template/usingStatus', params);
	}

	/**
	 * 根据id获取教学评价模版
	 * @param id 模版id
	 */
	getTemplateById(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template/' + id);
	}

	/**
	 * 获取教学评价模版列表
	 * @param params
	 */
	getTemplate(params: { gardenId: string | number, keyword?: string }) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template', params);
	}

	/**
	 * 获取教学评价模版列表
	 * @param params
	 */
	getTemplates(params: { gardenId: string | number, keyword?: string, type?: number, effectiveness?: boolean, offset?: number, size?: number, index?: number }) {

		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/template', params, {observe: 'response'}).map(response => {
			return {
				totalCount: response.headers.get('x-record-count'),
				data: response.body
			};
		});

	}

	/**
	 * 下载可用的教学评价模版
	 */
	downTemplate() {
		location.href = this.envConfig.getModuleUrl(this.moduleCode.TPK_WEB) + '/comment/template/templateFile?TOKEN=' +
			this.tokenService.getAccessToken();
	}

	/**
	 * 获取园区列表
	 * @param params
	 */
	getGardens(params) {
		return this.httpService.get(this.moduleCode.GARDEN, '/garden/simple/group-strategy', params);
	}

	/**
	 * 获取园区用户信息
	 * @param gardenId
	 * @returns {Observable<any>}
	 */
	getGardenInfo(gardenId) {
		return this.httpService.get(this.moduleCode.GARDEN, '/garden/simple', {gardenIds: gardenId});
	}

	/*****************************主观评价 客观评价  改进建议/诊断结果*******************************/

	/*
	 * 提交客观评价
	 * @param params
	 */
	submitEvaluationObjective(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/objective', params);
	}

	/**
	 * 提交主观评价
	 * @param params
	 */
	submitEvaluationSubjective(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/subjective', params);
	}

	/**
	 * 提交主观评价留言
	 * @param params
	 */
	submitEvaluationSubjectiveMsg(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/reply', params);
	}

	/**
	 * 提交改进建议和诊断结果
	 * @param params
	 */
	submitAdviceOrResult(params) {
		return this.httpService.put(this.moduleCode.TPK_WEB, '/comment/comment', params);
	}

	/**
	 * 获取主观评价列表
	 * @param {string} activityId
	 * @param appraiserId
	 */
	getEvaluationSubjective(activityId: string, appraiserId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/comment/subjective/${activityId}/${appraiserId}`);
	}

	/**
	 * 获取客观评价列表
	 * @param {string} activityId
	 * @param appraiserId
	 */
	getEvaluationObjective(activityId: string, appraiserId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/comment/objective/${activityId}/${appraiserId}`);
	}

	/**
	 * 获取改进建议/诊断结果列表
	 * @param activityId
	 * @param appraiserId
	 */
	getAdviceOrResult(activityId: string, appraiserId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/comment/comment/${activityId}/${appraiserId}`);
	}

	/**
	 * 获取主观评价模板
	 * @param id
	 */
	getEvaluationSubjectiveTemplate(id: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/comment/template/subjective/${id}`);
	}

	/**
	 * 获取客观评价模板
	 * @param id
	 */
	getEvaluationObjectiveTemplate(id: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/comment/template/objective/${id}`);
	}

	/**
	 * 获取评课人全部评价
	 * @param activityId
	 * @param appraiserId
	 * @returns {Observable<any>}
	 */
	getAppraiserStatus(activityId, appraiserId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/task/appraiser/status', {
			activityId: activityId,
			appraiserId: appraiserId
		});
	}


	/*****************************评价汇总*******************************/

	/**
	 * 评价汇总-客观评价
	 * @param activityId
	 * @returns {Observable<any>}
	 */
	getStatisticsObjective(activityId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/statistics/objective', {activityId: activityId});
	}

	/**
	 * 评价汇总-主观评价
	 * @param activityId
	 * @returns {Observable<any>}
	 */
	getStatisticsSubjective(activityId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/statistics/subjective', {activityId: activityId});
	}

	/**
	 * 评价汇总-诊断结果
	 * @param activityId
	 * @returns {Observable<any>}
	 */
	getStatisticsResult(activityId) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/statistics/comment', {activityId: activityId});
	}

	/**
	 * 提交评价留言
	 * @param params
	 * @returns {Observable<any>}
	 */
	postStatisticsReplyMsg(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/comment/reply', params);

	}
}
