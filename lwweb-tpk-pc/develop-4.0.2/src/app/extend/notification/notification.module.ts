import {NgModule} from '@angular/core';
import {NotificationComponent} from './notification';
import {NotificationService} from './notification.service';
import {CommonModule} from '@angular/common';

@NgModule({
	imports: [
		CommonModule,
	],
	exports: [],
	declarations: [
		NotificationComponent
	],
	entryComponents: [
		NotificationComponent,
	],
	providers: [
		NotificationService
	],
})
export class NotificationModule {
}
