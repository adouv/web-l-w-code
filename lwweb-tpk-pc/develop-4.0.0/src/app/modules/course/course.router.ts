import { CoursePreparePage } from './pages/course-prepare/course-prepare.page';
import { Routes } from '@angular/router';
import { CourseWarePage } from './pages/courseware/courseware';
import { CourseTimetablePage } from './pages/timetable/timetable';
import { PreparePage } from './pages/prepare/prepare.page';
import { PrepareInfoPage } from './pages/prepare-info/prepare-info.page';
import { PatrolInfoPage } from './pages/patrol-info/patrol-info.page';
import { PrepareInfoOnePage } from './pages/prepare-info-one/prepare-info-one.page';

export const courseRouters: Routes = [
	{
		path: '',
		component: CourseTimetablePage
	},
	{
		path: 'timetable',
		component: CourseTimetablePage
	},
	{
		path: 'courseware/:lessonId/:lessonDate',
		component: CourseWarePage
	},
	{
		path: 'timetable/:selectedClassId',
		component: CourseTimetablePage
	},
	{
		path: 'prepare/:lessonId/:lessonDate',
		component: CoursePreparePage
	},
	{
		path: 'prepare/info/:lessonId/:lessonDate',
		component: PrepareInfoPage
	},
	{
		path: 'patrol/info/:lessonId/:lessonDate',
		component: PatrolInfoPage
	},
	{
		path: 'prepare/info-one/:lessonId/:lessonDate',
		component: PrepareInfoOnePage
	}
];
