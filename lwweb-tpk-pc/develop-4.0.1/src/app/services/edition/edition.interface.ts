import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, ModuleCode} from '../../app.export';

@Injectable()
export class EditionInterface {

	constructor(private httpService: LwHttpService,
				private envConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	getEditionList(gradeCode: string, subjectCode: string, gardenId: any) {
		return this.httpService.get(this.moduleCode.TPK_WEB, `/outlineDictionary/semesters/${gradeCode}/${subjectCode}`,{gardenId});
	}
}
