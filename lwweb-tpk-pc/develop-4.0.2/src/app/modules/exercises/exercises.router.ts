import {Routes} from '@angular/router';
import {ExerciseChartPage} from './pages/exercise-chart/exercise-chart.page';
import {ExerciseClassComponent} from './pages/exercise-class/exercise-class.component';
import {ExerciseLibraryPage} from './pages/exercise-library/exercise-library.page';
import {ExerciseAddPage} from './pages/exercise-add/exercise-add.page';
import {ExerciseImportPage} from './pages/exercise-import/exercise-import.page';
export const routs: Routes = [
	{
		path: '',
		redirectTo: 'home'
	},
	{
		path: 'home',
		component: ExerciseChartPage
	},
	{
		path: 'class',
		component: ExerciseClassComponent
	},
	{
		path: 'library',
		component: ExerciseLibraryPage
	},
	{
		path: 'add',
		component: ExerciseAddPage
	},
	{
		path: 'import',
		component: ExerciseImportPage
	}
];
