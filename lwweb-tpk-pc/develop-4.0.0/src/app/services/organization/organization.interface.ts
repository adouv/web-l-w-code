import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, ModuleCode} from '../../app.export';
import {map} from 'rxjs/operators';

@Injectable()
export class OrganizationInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 获取指定老师所教的年级
	 * @param {string} teacherId
	 * @param {string} gardenId
	 * @returns {Observable<any>}
	 */
	getGradeListByTeacherId(teacherId?: string, gardenId?: string) {
		const params = {teacherId: teacherId, gardenId: gardenId};
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/teacher/grades', params);
	}

	/**
	 * 获取所有年级
	 * @param teacherId
	 * @param {string} gardenId
	 * @returns {Observable<any>}
	 */
	getGradeList(teacherId: string, gardenId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/teacher/professor/grades', {
			teacherId: teacherId,
			gardenId: gardenId
		});
	}

	/**
	 * 根据年级获取班级
	 * @param {string} gradeId
	 * @returns {Observable<any>}
	 */
	getClassesByGradeId(gradeId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization/classes', {gradeId: gradeId}).pipe(
			map(data => data.data)
		);
	}

	/**
	 * 获取该年级下所有学科
	 * @param {string} gradeId
	 * @returns {Observable<any>}
	 */
	getSubjectListByGradeId(gardenId: string, gradeId: string, classId: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/outlineDictionary/subjectList', {
			gradeId: gradeId,
			classId: classId,
			gardenId: gardenId
		});
	}

	/**
	 *
	 * 获得缓存
	 * @returns {Observable<any>}
	 * @param resource
	 */
	getOutlineDictionaryCache(resource) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/outlineDictionary/cache', {resource: resource});
	}


	/**
	 * 获取大纲id
	 * @param params
	 * @returns {Observable<any>}
	 */
	getClickOutlineId(params) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/outline/clickOutlineId', params);
	}


	/**
	 * 设置大纲id
	 * @param params
	 * @returns {Observable<any>}
	 */
	setClickOutlineId(params) {
		return this.httpService.post(this.moduleCode.TPK_WEB, '/outline/outlineIdsCache', params);
	}

	getOrganizationById(id) {
		return this.httpService.get(this.moduleCode.TPK_WEB, '/organization', {id: id});
	}

}
