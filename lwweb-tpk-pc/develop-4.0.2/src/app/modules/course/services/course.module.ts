import {NgModule} from '@angular/core';
import {CourseInterface} from './course.interface';
import {CloudHomeService} from './cloud-home.service';
import {CourseMaterialService} from './material/CourseMaterialService';
import {PipesModule} from '../../../pipes/pipes.module';
import {FileDownloadService} from './file/file-download.service';


@NgModule({
	imports: [],
	exports: [],
	declarations: [],
	providers: [
		PipesModule,
		CourseInterface,
		CloudHomeService,
		CourseMaterialService,
		FileDownloadService
	],
})
export class CourseModule {
}
