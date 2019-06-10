import {Inject, Injectable} from '@angular/core';
import {LwHttpService, EnvDefaultConfig, LW_MODULE_CODE, LwOauth2TokenService} from '../../../../app.export';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ExerciseInterface {

	EXERCISE_ADD_MODULE: string = this.defaultConfig.getServerUrl(this.moduleCode.TPK_WEB) + '/course/material/example';
	EXERCISE_TEMPLATE: string = this.defaultConfig.getServerUrl(this.moduleCode.TPK_WEB) + '/example/template';

	constructor(private http: LwHttpService,
				@Inject(LW_MODULE_CODE) private moduleCode,
				private defaultConfig: EnvDefaultConfig,
				private accessToken: LwOauth2TokenService) {
	}

	/**
	 * 通过ID查询习题
	 * @param {string} id
	 * @returns {Promise<any>}
	 */
	getExerciseListById(id: string): Observable<any> {
		return this.http.get(this.moduleCode.TPK_WEB, '/example/' + id);
	}

	downloadTemplate() {
		location.href = this.defaultConfig.getServerUrl(this.moduleCode.TPK_WEB) + '/example/template?TOKEN=' + this.accessToken.getAccessToken();
	}

	/**
	 * 获取当前课程所有的习题模块
	 * @param {{lessonId: string; date: string; lessonStage: string}} params
	 * @returns {Promise<any>}
	 */
	getExerciseModules(params: { lessonId: string, date: string, lessonStage: string }): Observable<any> {
		return this.http.get(this.moduleCode.TPK_WEB, '/course/material/example', params);
	}

	deleteExerciseModuleById(id: string): Observable<any> {
		return this.http.delete(this.moduleCode.TPK_WEB, '/course/material/example', {id: id});
	}

	deleteMainExerciseById(id: string): Observable<any> {
		return this.http.delete(this.moduleCode.TPK_WEB, '/example/main/' + id, null);
	}

	deleteSubExerciseById(id: string) {
		return this.http.delete(this.moduleCode.TPK_WEB, '/example/sub/' + id, null);
	}

	updateMainExercise(params: { totalScore?: string, subjectHtml: string, description?: string, id: string }): Observable<any | null> {
		return this.http.put(this.moduleCode.TPK_WEB, '/example/main', params);
	}

	updateSubExercise(params: { score?: string,
								troubleLevel?: string,
								subjectHtml: string,
								answerHtml?: string,
								id: string }): Observable<any | null> {
		return this.http.put(this.moduleCode.TPK_WEB, '/example/sub', params);
	}
}
