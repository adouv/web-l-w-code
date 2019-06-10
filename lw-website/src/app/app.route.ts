import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomePage } from './pages/home/home.page';
import { ListPage } from './pages/list/list.page';
import { ListDetailPage } from './pages/listDetail/listDetail.page';
import { ImageTextListComponent } from './components/image-text-list/image-text-list.component';
import { TextListComponent } from './components/text-list/text-list.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { EnrollmentComponent } from './pages/enrollment/enrollment.component';
import { LayoutComponent } from './pages/layout/layout.component';
@NgModule({
	imports: [
		RouterModule.forRoot([
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'enrollment'
			},
			{
				path: 'layout',
				component: LayoutComponent,
				children: [
					{
						path: '',
						redirectTo: 'home',
						pathMatch: 'full'
					},
					{
						path: 'home',
						component: HomePage
					},
					{
						path: 'list/:type',
						component: ListPage,

					},
					{
						path: 'list/:type/:sub',
						component: ListPage,

					},
					{
						path: 'list/:type/:sub/:subs',
						component: ListPage,

					},
					{
						path: 'listDetail',
						component: ListDetailPage,
					},
					{
						path: 'listDetail/:type',
						component: ListDetailPage,
					},
					{
						path: 'listDetail/:type/:sub',
						component: ListDetailPage,
					},
					{
						path: 'listDetail/:type/:sub/:subs',
						component: ListDetailPage,
					},
					{
						path: 'listDetail/:type/:sub/:subs/:nid',
						component: ListDetailPage,
					}
				]
			},
			{
				path: 'enrollment',
				component: EnrollmentComponent
			},{
				path: '**',
				pathMatch: 'full',
				redirectTo: 'enrollment'
			},
		])
	],
	exports: [
		RouterModule
	]
})

export class AppRoutesModule {
}
