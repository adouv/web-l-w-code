import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
	name: 'courseImg',
})
export class CourseImgPathPipe implements PipeTransform {


	transform(courseName: string, ...args) {
		const subjectArr = ['music', 'physics', 'plant', 'political', 'sport', 'weiqi',
			'art', 'biology', 'calligraphy', 'chemistry', 'chinese', 'english',
			'geography', 'history', 'math', 'message'];
		if (subjectArr.indexOf(courseName) !== -1) {
			return 'assets/images/subject/' + courseName + '.png';
		} else if (courseName && subjectArr.indexOf(courseName) === -1) {
			return 'assets/images/subject/other.png';
		}
	}
}
