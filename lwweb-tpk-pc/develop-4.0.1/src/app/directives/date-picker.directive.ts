/**
 * 基于layui的laydate封装的ng2指令
 * 使用准备:
 * 1.npm install layui-laydate
 * 2.在angular-cli.json文件中,引入laydate的css文件和js文件
 */
import {Directive, Input, ElementRef, EventEmitter, Output, OnChanges} from '@angular/core';

@Directive({
	selector: '[datePicker]',
})
export class DatePickerDirective implements OnChanges {
	@Input() dateConfig;
	@Input() dateFormat;
	@Input() minDate;
	@Input() maxDate;
	@Input() range;
	// 使用@Input 变量,@Output 变量+Change = new EventEmitter()
	// 这样写,变量会变成双向绑定的数据
	@Input() dateValue;
	@Output() dateValueChange = new EventEmitter<any>();
	layDate: any;

	constructor(private elementRef: ElementRef) {
		setTimeout(() => {
			// 日期初始化参数
			const options = {
				elem: this.elementRef.nativeElement, // 指定元素
				format: 'yyyy-MM-dd',
				type: 'datetime',
				btns: ['clear', 'confirm'],
				theme: '#00a0e9',
				value: this.dateValue,
				done: (time) => {
					this.dateValueChange.emit(time);
				},
			};
			this.extends(options, this.dateConfig || {});
			options.format = this.handleOldFormat(this.dateFormat);
			options.type = this.getLayDateType(options.format);
			if (this.minDate) {
				options['min '] = this.minDate;
			}
			if (this.maxDate) {
				options['max'] = this.maxDate;
			}
			if (this.range) {
				options['range'] = this.range;
			}
			this.layDate = window['laydate'].render(options);
		}, 0);
	}

	ngOnChanges(change) {
		if (this.layDate && change) {
			this.layDate.config.value = this.dateValue;
		}
	}

	/**
	 * 处理旧格式
	 * @param formatStr
	 * @returns {*}
	 */
	handleOldFormat(formatStr) {
		formatStr = formatStr.replace('YYYY', 'yyyy');
		formatStr = formatStr.replace('DD', 'dd');
		formatStr = formatStr.replace('hh', 'HH');
		return formatStr || 'yyyy-MM-dd';
	}

	/**
	 * 设置时间类型
	 * @param format
	 * @returns {string}
	 */
	getLayDateType(format) {
		let type = 'date';
		const [hasYear, hasMonth, hasDay, hasHour, hasMin] = this.handleFormat(format, [
			'yyyy', 'MM', 'dd', 'HH', 'mm'
		]);
		if (hasYear && hasMonth && hasDay
			&& hasHour && hasMin) {
			type = 'datetime';
		} else if (hasHour && hasMin) {
			type = 'time';
		} else if (hasYear && !hasMonth) {
			type = 'year';
		} else if (hasYear && hasMonth && !hasDay) {
			type = 'month';
		}
		return type || 'datetime';
	}

	/**
	 * 处理日期格式
	 * @param formatStr
	 * @param formats
	 * @returns {Array}
	 */
	handleFormat(formatStr, formats) {
		let formatArr;
		formatArr = [];
		if (Array.isArray(formats)) {
			formats.forEach(format => {
				formatArr.push(formatStr.includes(format));
			});
		}
		return formatArr;
	}

	/**
	 * 集成合并(对象)
	 * @param target
	 * @param original
	 */
	extends(target, original) {
		for (const key in Object.keys(original)) {
			if (original[key] && key !== 'sure' && key !== 'done') {
				target[key] = original[key];
			} else if (original[key]) {
				let applySure;
				applySure = target['done'];
				target['done'] = (newDate, formatDate) => {
					applySure(newDate, formatDate);
					original[key](newDate, formatDate);
				};
			}
		}
	}
}
