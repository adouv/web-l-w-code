import { Routes } from '@angular/router';
import { ResourcePreparePage } from './pages/resource-prepare/resource-prepare.page';
import { ResourceHomePage } from './pages/resource-home/resource-home.page';
import { ResourceInfoPage } from './pages/resource-info/resource-info.page';
import { ResourceManagerPage } from './pages/resource-manager/resource-manager.page';
import { ResourceInfoDeactivate } from './resource-info.deactivate';
import { CloudCoursePage } from './pages/cloud-course/cloud-course.page';
import { CloudMicroClassPage } from './pages/cloud-micro-class/cloud-micro-class.page';
import { ExercisesStatisticsPage } from './pages/exercises-statistics/exercises-statistics.page';

export const resourceClassesRoutes: Routes = [
	{
		path: '',
		redirectTo: 'home/-1'
	},
	{
		path: 'home/:type',
		component: ResourceHomePage
	},
	{
		path: 'home/:type/prepare/:id',
		component: ResourcePreparePage
	},
	{
		path: 'home/:type/info/:id',
		component: ResourceInfoPage,
		canDeactivate: [ResourceInfoDeactivate]
	},
	{
		path: 'home/:type/manager/:id',
		component: ResourceManagerPage
	},
	{
		path: 'home/:type/statistics/:id',
		component: ExercisesStatisticsPage
	},
	{
		path: 'cloudCourse',
		component: CloudCoursePage
	},
	{
		path: 'cloudMicro',
		component: CloudMicroClassPage
	}
];
