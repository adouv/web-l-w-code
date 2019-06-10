import {Injectable} from '@angular/core';
import {MaterialItemDto} from './dto/MaterialItemDto';
import {CourseSpaceDto} from './dto/CourseSpaceDto';
import {FiletypePipe} from '../../../../pipes/filetype/filetype';
import {CourseInterface} from '../course.interface';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CourseMaterialService {

	constructor(private courseInterface: CourseInterface) {
	}

	public getCourseMaterials(lessonId: string, lessonDate: string, lessonStage: string|number, courseMaterialDesign: string): Observable<MaterialItemDto[]> {
		return this.courseInterface.getAllMaterials(lessonId, lessonDate, lessonStage, courseMaterialDesign).map(data => {
			const results: MaterialItemDto[] = [];
			if (data && data.length > 0) {
				data.forEach(item => {
					const isMainAble: boolean = this.isMainAble(item.name);
					results.push(new MaterialItemDto(item.id, item.name, isMainAble, item.isMain, item.path, item.size, item.fileServer));
				});
			}
			return results;
		});
	}

	public getCourseSpace(lessonId: string, lessonDate: string): Observable<CourseSpaceDto> {
		return this.courseInterface.getLessonSpace(lessonId, lessonDate).map(data => {
			if (data) {
				return new CourseSpaceDto(data.used, data.total);
			} else {
				return new CourseSpaceDto(0, 0);
			}
		});
	}

	private isMainAble(name: string) {
		const fileTypePipe = new FiletypePipe();
		const type = fileTypePipe.transform(name);
		return type === FiletypePipe.PDF
		|| type === FiletypePipe.PPT
		|| type === FiletypePipe.WORD
		|| type === FiletypePipe.EXCEL ? true : false;
	}


}
