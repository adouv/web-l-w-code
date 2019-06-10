import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, ModuleCode} from '../../app.export';

@Injectable()
export class KnowledgeInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	getKnowledgeList(gradeCode: string, subjectCode: string, name?: string) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/knowledge/list`, {
			gradeCode: gradeCode,
			subjectCode: subjectCode,
			name: name
		});
	}
}
