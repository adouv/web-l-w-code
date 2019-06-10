import {NgModule} from '@angular/core';
import {ExercisesInterface} from './exercises.interface';
import {ExercisesService} from './exercises.service';


@NgModule({
	imports: [],
	exports: [],
	providers: [
		ExercisesInterface,
		ExercisesService
	],
})
export class ExercisesServiceModule {
}
