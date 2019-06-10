import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { courseRouters } from './course.router';
import { CourseTimetablePage } from './pages/timetable/timetable';
import { CourseWarePage } from './pages/courseware/courseware';
import { CourseModule } from './services/course.module';
import { courseComponents, primeNgModules, primeNgServices } from './components';
import { ImageDialogComponent } from './components/image/image';
import { CourseDialogService } from './components/exercise/dialog.service';
import { FlowModule } from './components/ng2-flow/flow.module';
import { SharedModule } from '../../extend';
import { PreparePage } from './pages/prepare/prepare.page';
import { ExercisesServiceModule } from '../../services/exercises/exercises.module';
import { ResourceServiceModule } from '../../services/resource/resource.module';
import { KnowledgeServiceModule } from '../../services/knowledge/knowledge.module';
import { OrganizationServiceModule } from '../../services/organization/organization.module';
import { EditionServiceModule } from '../../services/edition/edition.module';
import { CoursePreparePage } from './pages/course-prepare/course-prepare.page';
import { PrepareInfoPage } from './pages/prepare-info/prepare-info.page';
import { PrepareInfoOnePage } from './pages/prepare-info-one/prepare-info-one.page';
import { PatrolInfoPage } from './pages/patrol-info/patrol-info.page';
import { ExercisesDetailsComponent } from '../resource-classes/components/exercises-details/exercises-details.component';
import { PatrolPage } from './pages/patrol/patrol';

@NgModule({
	imports: [
		CourseModule,
		...primeNgModules,
		SharedModule,
		ExercisesServiceModule,
		FlowModule,
		KnowledgeServiceModule,
		ResourceServiceModule,
		OrganizationServiceModule,
		EditionServiceModule,
		RouterModule.forChild(courseRouters)
	],
	declarations: [
		CourseTimetablePage,
		CourseWarePage,
		PreparePage,
		CoursePreparePage,
		PrepareInfoPage,
		PatrolInfoPage,
		PrepareInfoOnePage,
		PatrolPage,
		ExercisesDetailsComponent,
		...courseComponents
	],
	providers: [
		CourseDialogService,
		...primeNgServices
	],
	entryComponents: [
		ImageDialogComponent,
		PatrolPage,
		...courseComponents
	]
})
export class CoursePageModule {
}
