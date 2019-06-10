import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {ClassSheetEntity} from './entity/ClassSheetEntity';
import {SelectDataItem, SELECTED, UNSELECTED} from './entity/select-data-item';
import {Observable} from 'rxjs/Observable';
import {CourseInterface} from './course.interface';
import {LwStorageService} from '../../../common/cache';

@Injectable()
export class CloudHomeService {

	constructor(private courseInterface: CourseInterface,
				private lwStorageService: LwStorageService) {
	}

	// 获取园区列表及选中的园区
	public getGardens(curr?: string): Observable<any> {
		return this.courseInterface.getGardens().map((data) => {
			const bars = [];
			for (const item of data) {
				bars.push({label: item.name, value: item.id});
			}
			return this.setCurrSelected(bars, curr);
		});
	}


	public getPatrolGardens(curr?: string): Observable<any> {
		return this.courseInterface.getPatrolGardens().map((data) => {
			const bars = [];
			for (const item of data) {
				bars.push({label: item.name, value: item.id});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	// 获取年份列表及选中的年份
	public getYears(params: any, curr?: string): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getYears(params).map((data) => {
			const bars = [];
			for (const item of data) {
				bars.push({label: item, value: item});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	public getPatrolYears(params: any, curr?: string): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getPatrolYears(params).map((data) => {
			const bars = [];
			for (const item of data) {
				bars.push({label: item, value: item});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	// 获取年份列表及选中的年份
	public getSemesters(params: any, curr?: string): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getSemesters(params).map((data) => {
			const bars = [];
			for (const item of data) {
				bars.push({label: item.semester === 1 ? '春季学期' : '秋季学期', value: item.semester, isDefault: item.isDefault});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	// 获取周列表及选中的周
	public getWeeks(params: any, curr?: string): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getWeeks(params).map((data) => {
			const bars = [];
			for (const item of data) {
				bars.push({
					label: '第' + item.weekNo + '周',
					value: this.getWeekCode(item.startDate, item.endDate),
					isDefault: item.isDefault,
					weekNo: item.weekNo
				});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	//获取年纪
	getPatrolGrade(params: any, curr?: string) {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getPatrolGrdea(params).map(data => {
			const bars = [];
			for (const item of data) {
				bars.push({
					label: item.gradeName,
					value: item.gradeId
				});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	//获取学科
	getPatrolSubject(params: any, curr?: string) {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getPatrolSubject(params).map(data => {
			const bars = [];
			bars.push({
				label: '全部',
				value: ''
			});
			for (const item of data) {
				bars.push({
					label: item.subjectName,
					value: item.subjectCode
				});
			}
			return this.setCurrSelected(bars, curr);
		});
	}

	// 获取班级列表及选中的班级
	public getClasses(params: any, curr?: string): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getClasses(this.buildParams(params)).map((data) => {
			//console.log(data);
			const bars: SelectDataItem[] = [];
			for (const item of data) {
				const bar: SelectDataItem = new SelectDataItem();
				bar.code = item.classId;
				bar.name = item.gradeName + item.className;
				bar.state = UNSELECTED;
				bar.data = item;
				bars.push(bar);
			}
			if (bars.length > 0) {
				bars[0].state = SELECTED;
			}
			return this.setCurrSelected1(bars, curr);
		});
	}

	public getPatrolClasses(params: any, curr?: string) {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getPatrolClasses(this.buildParams(params)).map((data) => {
			const bars: SelectDataItem[] = [];
			for (const item of data) {
				const bar: SelectDataItem = new SelectDataItem();
				bar.code = item.classId;
				bar.name = item.gradeName + item.className;
				bar.state = UNSELECTED;
				bar.data = item;
				bars.push(bar);
			}
			if (bars.length > 0) {
				bars[0].state = SELECTED;
			}
			return this.setCurrSelected1(bars, curr);
		});
	}

	// 获取课程列表
	public getLessons(params?: any): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getLessons(this.buildParams(params)).map((data) => {
			const lessons: ClassSheetEntity[] = [];
			for (const rows of data) {
				lessons.push(this.getRowTitle(rows));
				for (const lesson of rows.lessonList) {
					const newLesson = new ClassSheetEntity();
					if (lesson != null) {
						newLesson.name = lesson.subjectName;
						newLesson.state = lesson.prepareStatus;
						newLesson.data = lesson;
					}
					lessons.push(newLesson);
				}
			}
			return lessons;
		});
	}

	public getPatrolLessons(params?: any): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getPatrolLessons(this.buildParams(params)).map((data) => {
			const lessons: ClassSheetEntity[] = [];
			//console.log(data);
			for (const rows of data) {
				lessons.push(this.getRowTitle(rows));
				for (const lesson of rows.lessonList) {
					const newLesson = new ClassSheetEntity();
					if (lesson != null) {
						newLesson.name = lesson.subjectName;
						newLesson.state = lesson.prepareStatus;
						newLesson.data = lesson;
					}
					lessons.push(newLesson);
				}
			}
			return lessons;
		});
	}

	// 获取课程列表
	public getSyncLessons(params?: any): Observable<any> {
		params = Object.assign({}, params, {gardenId: this.lwStorageService.get('s_gardenId')});
		return this.courseInterface.getSyncLessons(this.buildParams(params)).map((data) => {
			const lessons: ClassSheetEntity[] = [];
			for (const rows of data) {
				lessons.push(this.getRowTitle(rows));
				for (const lesson of rows.lessonList) {
					const newLesson = new ClassSheetEntity();
					if (lesson != null) {
						newLesson.name = lesson.subjectName;
						newLesson.state = lesson.prepareStatus;
						newLesson.data = lesson;
						newLesson.enableSync = lesson.enableSync;
					}
					lessons.push(newLesson);
				}
			}
			return lessons;
		});
	}

	public uploadMaterial(lessonId: string,
						  date: string,
						  lessonStage: string,
						  name: string,
						  path: string,
						  size: number,
						  videoGuid: string,
						  courseMaterialDesign: string,
						  fileServer = 0): Observable<any> {
		return this.courseInterface.uploadMaterial(lessonId, date, lessonStage, name, path, size, videoGuid, courseMaterialDesign, fileServer).map((data) => {
			return data;
		});
	}

	public deleteMaterial(id: string, path: string): Observable<any> {
		this.courseInterface.deleteFileServerFile(path);
		return this.courseInterface.deleteMaterial(id);
	}

	public getMaterialDetail(lessonId: string, date: string): Observable<any> {
		return this.courseInterface.getMaterialDetail(lessonId, date);
	}


	public getPromise(params?: any) {
		return this.courseInterface.getPromise(params);
	}

	private getRowTitle(item) {
		const timeSlot: ClassSheetEntity = new ClassSheetEntity();
		const dates = item.datetime.split('~');
		const startDate = dates[0].slice(0, -3);
		const endDate = dates[1].slice(0, -3);
		timeSlot.name = startDate + '~' + endDate;
		timeSlot.state = ClassSheetEntity.NOT_LESSON;
		timeSlot.data = item;
		return timeSlot;
	}

	private setCurrSelected(bars: Array<any>, curr?: string): any {
		//console.log(curr, 'adou1');
		let selected: any;
		let defaultSelected: any;
		for (const bar of bars) {
			if (curr == bar.value) {
				selected = bar;
			}
			if (bar.isDefault && bar.isDefault === true) {
				defaultSelected = bar;
			}
		}
		return {curr: selected ? selected : defaultSelected ? defaultSelected : bars[0], items: bars};
	}

	private setCurrSelected1(bars: Array<any>, curr?: string): any {
		let selected: SelectDataItem;
		let defaultSelected: SelectDataItem;
		for (const bar of bars) {
			if (curr === bar.code) {
				selected = bar;
			}
			if (bar.state === SELECTED) {
				defaultSelected = bar;
			}
		}
		if (selected && defaultSelected) {
			selected.state = SELECTED;
			if (selected !== defaultSelected) {
				defaultSelected.state = UNSELECTED;
			}
		} else if (!selected && defaultSelected) {
			selected = defaultSelected;
		}
		return {curr: selected, items: bars};
	}

	private getWeekCode(startDate: string, endDate: string): string {
		if (startDate && endDate) {
			return startDate + '|' + endDate;
		}
		return '';
	}

	private buildParams(params: any) {
		if (params && params.week) {
			const dates: string[] = params.week.split('|');
			params.startDate = dates[0];
			params.endDate = dates[1];
		}
		return params;
	}


}
