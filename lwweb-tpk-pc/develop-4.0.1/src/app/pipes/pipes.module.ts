import {NgModule} from '@angular/core';
import {NumberToUpperCasePipe} from './number/numberToUpperCase.pipe';
import {FiletypePipe} from './filetype/filetype';
import {CourseImgPathPipe} from './image/courseImgPath';
import {BackgroundImgCss} from './image/BackgroundImgCss';
import {DateToWeekPipe} from './date/dateToWeek';
import {ResourceTypePipe} from './resource-type/resource-type.pipe';
import {ShowImgPipe} from './image/show-img.pipe';
import {ToPercentagePipe} from './percent/to-percentage.pipe';
import {NumberToWeekPipe} from './number/numberToWeek.pipe';

@NgModule({
	imports: [],
	exports: [
		NumberToUpperCasePipe,
		NumberToWeekPipe,
		FiletypePipe,
		CourseImgPathPipe,
		BackgroundImgCss,
		DateToWeekPipe,
		ResourceTypePipe,
		ShowImgPipe,
		ToPercentagePipe
	],
	declarations: [
		NumberToUpperCasePipe,
		NumberToWeekPipe,
		FiletypePipe,
		CourseImgPathPipe,
		BackgroundImgCss,
		DateToWeekPipe,
		ResourceTypePipe,
		ShowImgPipe,
		ToPercentagePipe
	],
	providers: [FiletypePipe, DateToWeekPipe],
})
export class PipesModule {
}
