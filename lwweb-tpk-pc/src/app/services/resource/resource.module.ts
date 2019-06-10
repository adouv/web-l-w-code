import {NgModule} from '@angular/core';
import {QualityCourseInterface} from './quality-course.interface';
import {CmsInterface} from './cms.interface';
import {ResourceClassesInterface} from './resource-classes.interface';
import {ResourceClassesService} from './resource-classes.service';
import {ResourceHomeInterface} from './resource-home.interface';
@NgModule({
    imports: [],
	exports: [],
	providers: [
        QualityCourseInterface,
        CmsInterface,
        ResourceClassesInterface,
        ResourceClassesService,
        ResourceHomeInterface
	]
})

export class ResourceServiceModule {}