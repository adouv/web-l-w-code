import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {analysisRouters} from './analysis.router';
import {SharedModule} from '../../extend';
import {components, entryComponents} from './components';
import {AnalysisHomePage} from './pages/analysis-home/analysis-home.page';
import {AnalysisInterface} from './services/analysis.interface';
import {AnalysisListPageComponent} from './pages/analysis-list/analysis-list.page';
import {AnalysisDetailsPageComponent} from './pages/analysis-details/analysis-details.page';
@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild(analysisRouters)
	],
	declarations: [
		...components,
		AnalysisHomePage,
		AnalysisListPageComponent,
		AnalysisDetailsPageComponent
	],
	providers: [
		AnalysisInterface
	],
	entryComponents: [
		...entryComponents,
		AnalysisListPageComponent,
		AnalysisDetailsPageComponent
	]
})
export class AnalysisPageModule {
}
