import {Pipe, PipeTransform} from '@angular/core';

const week = ['日', '一', '二', '三', '四', '五', '六', '日'];

@Pipe({
	name: 'numberToWeek'
})
export class NumberToWeekPipe implements PipeTransform {

	transform(num: number): any {
		if (num < 0 || num > 7) {
			const date = new Date();
			num = date.getDay();
		}
		return week[num];
	}

}
