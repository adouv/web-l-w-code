import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {InvitationInterface} from './services/invitation.interface';
import {SharedModule} from '../../extend';
import {InvitationDetailPage} from './pages/invitation-detail/invitation-detail.page';
import {components, entryComponents} from './components';
import {BallChartComponent} from './components/ball-chart/ball.chart.component';
import {VideoClassesServiceModule} from '../../services/videos/videos-classes.module';
import {InvitationChangePage} from './pages/invitation-change/invitation-change.page';
import {ScaleMangeAddPage} from './pages/scale-manage-add/scale-manage-add.page';
import {ScaleManagePage} from './pages/scale-manage/scale-manage.page';
const invitationRoutes: Routes = [
	{
		path: '',
		redirectTo: 'add'
	},
	{
		path: 'add',
		component: InvitationChangePage
	},
	{
		path: 'edit/:id',
		component: InvitationChangePage
	},
	{
		path: 'detail/:id/:type/:appraise',
		component: InvitationDetailPage
	},
	{
		path: 'scale/add',
		component: ScaleMangeAddPage
	},
	{
		path: 'scale',
		component: ScaleManagePage
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(invitationRoutes),
		NgZorroAntdModule,
		FormsModule,
		CommonModule,
		ReactiveFormsModule,
		SharedModule,
		VideoClassesServiceModule
	],
	exports: [
	],
	declarations: [
		InvitationChangePage,
		InvitationDetailPage,
		ScaleMangeAddPage,
		ScaleManagePage,
		...components
	],
	providers: [
		InvitationInterface
	],
	entryComponents: [
		...entryComponents
	]
})
export class InvitationModule {

}
