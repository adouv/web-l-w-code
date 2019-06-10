import {NgModule} from '@angular/core';
import {ExerciseClassComponent} from './pages/exercise-class/exercise-class.component';
import {ExerciseChartPage} from './pages/exercise-chart/exercise-chart.page';
import {RouterModule} from '@angular/router';
import {routs} from './exercises.router';
import {SharedModule} from '../../extend';
import {ExerciseLibraryPage} from './pages/exercise-library/exercise-library.page';
import {ExercisesServiceModule} from '../../services/exercises/exercises.module';
import {OrganizationServiceModule} from '../../services/organization/organization.module';
import {EditionServiceModule} from '../../services/edition/edition.module';
import {components} from './components';
import {KnowledgeServiceModule} from '../../services/knowledge/knowledge.module';
import {SelectChapterComponent} from './components/select-chapter/select-chapter';
import {ExerciseAddPage} from './pages/exercise-add/exercise-add.page';
import {ExerciseImportPage} from './pages/exercise-import/exercise-import.page';
import {SelectParamsService} from './services/select-params/select-params.service';
import {UEditorModule} from 'lw-ngx-ueditor';
console.log(UEditorModule);
@NgModule({
	imports: [
		SharedModule,
		ExercisesServiceModule,
		OrganizationServiceModule,
		EditionServiceModule,
		KnowledgeServiceModule,
		UEditorModule.forRoot({
			// 指定ueditor.js路径目录
			path: 'assets/ueditor/',
			// 默认全局配置项
			options: {
				themePath: '/assets/ueditor/themes/'
			}
		}),
		RouterModule.forChild(routs)
	],
	exports: [],
	declarations: [
		ExerciseClassComponent,
		ExerciseChartPage,
		ExerciseLibraryPage,
		ExerciseAddPage,
		ExerciseImportPage,
		...components
	],
	entryComponents: [
		SelectChapterComponent
	],
	providers: [
		SelectParamsService
	],
})
export class ExercisesModule {
}
