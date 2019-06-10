import { NgModule } from '@angular/core';
import { resourceClassesRoutes } from './resource-classes.router';
import { RouterModule } from '@angular/router';
import { ResourceInfoPage } from './pages/resource-info/resource-info.page';
import { ResourceHomePage } from './pages/resource-home/resource-home.page';
import { ResourcePreparePage } from './pages/resource-prepare/resource-prepare.page';
import {
	resourceComponents,
	QualityCoursesComponent,
	QualityCourseEditComponent, QualityCourseUploadComponent, ExercisesComponent
} from './components';
import { DynamicModule } from 'ng-dynamic-component';
import { SharedModule } from '../../extend';
import { ResourceManagerPage } from './pages/resource-manager/resource-manager.page';
import { DndModule } from 'ng2-dnd';
import { ResourceInfoDeactivate } from './resource-info.deactivate';
import { routerAuthServices } from '../../app.export';
import { OtherInterface } from '../../services/other.interface';
import { CloudCoursePage } from './pages/cloud-course/cloud-course.page';
import { CloudMicroClassPage } from './pages/cloud-micro-class/cloud-micro-class.page';
import { ExercisesStatisticsPage } from './pages/exercises-statistics/exercises-statistics.page';
import { ResourceServiceModule } from '../../services/resource/resource.module';
import { OrganizationServiceModule } from '../../services/organization/organization.module';
@NgModule({
	imports: [
		DndModule.forRoot(),
		SharedModule,
		ResourceServiceModule,
		OrganizationServiceModule,
		RouterModule.forChild(resourceClassesRoutes),
		DynamicModule.withComponents([QualityCoursesComponent])
	],
	declarations: [
		...resourceComponents,
		ResourceHomePage,
		ResourceInfoPage,
		ResourcePreparePage,
		ResourceManagerPage,
		CloudCoursePage,
		CloudMicroClassPage,
		ExercisesStatisticsPage
	],
	providers: [
		ResourceInfoDeactivate,
		routerAuthServices,
		OtherInterface,
	],
	entryComponents: [
		QualityCourseEditComponent,
		QualityCourseUploadComponent,
		ExercisesComponent
	]
})
export class ResourceClassesModule {
}
