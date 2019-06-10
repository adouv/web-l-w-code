import {NgModule} from '@angular/core';
import {EditionInterface} from './edition.interface';
import {EditionService} from './edition.service';


@NgModule({
	imports: [],
	exports: [],
	providers: [
		EditionInterface,
		EditionService
	],
})
export class EditionServiceModule {
}
