import {Injectable} from '@angular/core';

@Injectable()
export class PageService {

	constructor() {
	}

	static setPageParams(index, size): PageParamsModel {
		return {
			index: index,
			size: size,
			offset: (Number(index) - 1) * Number(size)
		};
	}
}

