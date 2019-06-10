import {Inject, Injectable} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, LwHttpService, ModuleCode} from '../../app.export';
import {EditionInterface} from './edition.interface';
import {Observable} from 'rxjs/Observable';
import { AccountService } from '../../services/account';


@Injectable()
export class EditionService {

	constructor(private editionInterface: EditionInterface,
				private account: AccountService) {
	}

	getEditionList(gradeCode: string, subjectCode: string) {
		if (!gradeCode || !subjectCode) {
			return Observable.of([]);
		} else {
			return this.editionInterface.getEditionList(gradeCode, subjectCode, this.account.getCurrentGardenId);
		}
	}
}
