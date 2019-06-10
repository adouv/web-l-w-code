import {Injectable} from '@angular/core';

@Injectable()
export class SelectParamsService {

	constructor() {

	}

	getSelectParam(): string {
		return window.sessionStorage.getItem('select');
	}

	setSelectParam(value: string) {
		window.sessionStorage.setItem('select', value);
	}
}
