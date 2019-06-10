import { RouterModule } from '@angular/router';


export const appRoutes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: "home",
		loadChildren: './home/home.module#HomeModule'
	},
	{
		path: 'manage',
		loadChildren: './manage/manage.module#ManageModule'
	},
	{
		path: '**',
		loadChildren: './home/home.module#HomeModule'
	}
];
