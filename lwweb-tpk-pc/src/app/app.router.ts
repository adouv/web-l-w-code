import { Routes } from '@angular/router';
import { NavSliderComponent } from './components/nav-slider/nav-slider';
export const appRoutes: Routes = [
	{
		path: '',
		component: NavSliderComponent,
		children: [
			{
				path: '',
				loadChildren: './modules/course/course.module#CoursePageModule'
			},
			{
				path: 'video',
				loadChildren: './modules/video-classes/video-classes.module#VideoClassesModule'
			},
			{
				path: 'course',
				loadChildren: './modules/course/course.module#CoursePageModule'
			},
			{
				path: 'resource',
				loadChildren: './modules/resource-classes/resource-classes.module#ResourceClassesModule'
			},
			{
				path: 'exercises',
				loadChildren: './modules/exercises/exercises.module#ExercisesModule'
			},
			{
				path: 'invitation',
				loadChildren: './modules/invitation/invitation.module#InvitationModule'
			},
			{
				path: 'analysis',
				loadChildren: './modules/analysis/analysis.module#AnalysisPageModule'
			},
			{
				path: 'analysis-own',
				loadChildren: './modules/analysis/analysis.module#AnalysisPageModule'
			}
		]
	},
	{
		path: 'login',
		loadChildren: './modules/login/login.module#LoginPageModule'
	}
];
