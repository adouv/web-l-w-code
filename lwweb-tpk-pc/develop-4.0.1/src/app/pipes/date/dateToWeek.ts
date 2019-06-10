import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
	name: 'dateToWeek',
})
export class DateToWeekPipe implements PipeTransform {

	transform(date: number, ...args) {
		if (args.length > 0 && args[0]) {
			if (date) {
				const week_zh = ['日', '一', '二', '三', '四', '五', '六', '日'];
				return week_zh[date];
			}
		} else {
			if (date) {
				const week_zh = ['日', '一', '二', '三', '四', '五', '六', '日'];
				const dateNumber = new Date(date).getDay();
				return week_zh[dateNumber];
			}
		}

	}
}

