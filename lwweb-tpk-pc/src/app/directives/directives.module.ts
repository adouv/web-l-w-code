import {NgModule} from '@angular/core';

import {ScaleDirective} from './scale.directive';
import {TableCenterDirective} from './table-center.directive';
import {ScrollWidthDirective} from './scroll-width.directive';
import {DynamicHtmlDirective} from './dynamic.directive';
import {PermissionDirective} from './permission.directive';
import {BlurDirective} from './blur.directive';
import {DatePickerDirective} from './date-picker.directive';
import {btnDebunceDirective } from './btn-debunce.directive';
import {ScrollAddDirective} from './scroll-add.directive';

@NgModule({
	imports: [],
	exports: [
		ScaleDirective,
		TableCenterDirective,
		ScrollWidthDirective,
		DynamicHtmlDirective,
		PermissionDirective,
		BlurDirective,
		DatePickerDirective,
		btnDebunceDirective,
		ScrollAddDirective,
	],
	declarations: [
		ScaleDirective,
		TableCenterDirective,
		ScrollWidthDirective,
		DynamicHtmlDirective,
		PermissionDirective,
		BlurDirective,
		DatePickerDirective,
		btnDebunceDirective,
		ScrollAddDirective
	],
	providers: [],
})
export class DirectivesModule {
}
