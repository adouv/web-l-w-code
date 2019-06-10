import {Routes} from '@angular/router';
import {AnalysisHomePage} from './pages/analysis-home/analysis-home.page';
import {AnalysisListPageComponent} from './pages/analysis-list/analysis-list.page';
import {AnalysisDetailsPageComponent} from './pages/analysis-details/analysis-details.page';
export const analysisRouters: Routes = [
	{
		path: '',
		redirectTo: 'home'
	},
	{
		path: 'home',
		component: AnalysisHomePage
	},
	{
		path: 'list',
		component: AnalysisListPageComponent
	},
	{
		path: 'details',
		component: AnalysisDetailsPageComponent
	}
];
