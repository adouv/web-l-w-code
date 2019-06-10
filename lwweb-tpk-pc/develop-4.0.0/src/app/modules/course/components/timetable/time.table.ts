import {
	OnChanges, ChangeDetectionStrategy, Component, EventEmitter, Input, Output,
	ViewChild, SimpleChanges, HostListener
} from '@angular/core';
import { ClassSheetEntity } from '../../services/entity/ClassSheetEntity';

@Component({
	selector: 'course-time-table',
	templateUrl: './time.table.html',
	styleUrls: ['./time.table.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseTimeTableComponent implements OnChanges {

	@Input()
	items: Array<ClassSheetEntity> = [];
	@Output()
	prepareLesson = new EventEmitter();
	@Input() dialog: boolean;
	@Input() selectList = [];
	bigItems: Array<Array<ClassSheetEntity>> = [];
	@ViewChild('classbody')
	classBodyView: any;
	@ViewChild('head')
	headView: any;
	@Input() tabType: number;

	ngOnChanges(changes: SimpleChanges): void {
		this.bigItems = [];
		if (this.dialog) {
			this.items.map((item) => {
				if (item.data && item.data.id && item.data.id != '') {
					if (this.selectList.findIndex((sl) => {
						return sl.lessonId === item.data.id && sl.date == item.data.date;
					}) > -1) {
						item.data.status = true;
					}
				}
			});
		}
		const rows = this.items.length / 8;
		for (let i = 0; i < rows; i++) {
			const columnItems = this.items.slice(0 + 8 * i, 8 + 8 * i);
			this.bigItems.push(columnItems);
		}
	}

	constructor() {
		this.dialog = false;
	}

	getStyle(index) {
		if (this.items.length === 0) {
			return;
		}
		const state = this.items[index].state;
		let style = {};
		switch (state) {
			case ClassSheetEntity.NOT_LESSON:
				style = { 'background-color': '#ffffff' };
				break;
			case ClassSheetEntity.NOT_PREPARE_LESSON:
				style = { 'background-color': '#77879C' };
				break;
			case ClassSheetEntity.PREPAREING_LESSON:
				style = { 'background-color': this.tabType == 1 ? '#77879C' : '#00A1EA' };
				break;
			case ClassSheetEntity.PREPARED_LESSON:
				style = { 'background-color': '#1BC371' };
				break;
		}
		return style;
	}

	getClass(i, j) {
		const index = i + 1 + 8 * j;
		if (this.items.length === 0) {
			return;
		}
		const state = this.items[index].state;
		let clazz = {};
		return clazz = {
			'class_item': state !== ClassSheetEntity.NOT_LESSON,
			'class_item1': state === ClassSheetEntity.NOT_LESSON
		};
	}

	goPrepareLesson(index) {
		if (this.dialog && !this.items[index].enableSync) {
			return;
		}
		if (this.dialog) {
			this.checkLesson(this.items[index]);
		}
		if (this.items[index].state !== ClassSheetEntity.NOT_LESSON) {
			this.prepareLesson.emit(this.items[index]);
		}
	}

	checkLesson(item) {
		if (item.data) {
			item.data.status = !item.data.status;
			//console.log(item);
		}
	}

	handleScroll($event) {
		console.log('scroll');
	}

	getTipStyle(){
		//let width:any=document.getElementsByClassName("")
	}
}
