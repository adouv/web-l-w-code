import { Routes } from '@angular/router';
import { VideoHomePage } from './pages/video-home/video-home.page';
import { VideoLiveDetailPage } from './pages/viedo-live-detail/video-live-detail.page';
import { VideoStatisticsPage } from './pages/video-statistics/video-statistics.page';
import { VideoLivePage } from './pages/video-live/video-live.page';
import { VideoUnicastPage } from './pages/video-unicast/video-unicast.page';
import { VideoUnicastDetailPage } from './pages/viedo-unicast-detail/video-unicast-detail.page';
import { InvitationHomePage } from './pages/invitation-home/invitation-home.page';
import { VideoIndexPage } from './pages/video-index/video-index.page';
import { VideoListPage } from './pages/video-list/video-list.page';
import { VideoMyclass } from './pages/video-myclass/video-myclass.component';

export const videoClassesRoutes: Routes = [
	{
		path: '',
		redirectTo: 'index'
	},
	{
		path: 'home',
		component: VideoHomePage
	},
	{
		path: 'index',
		component: VideoIndexPage
	},
	{
		path: 'list',
		component: VideoListPage
	},
	{
		path: 'live',
		component: VideoLivePage
	},
	{
		path: 'live/:id', // 视频直播
		component: VideoLiveDetailPage
	},
	{
		path: 'unicast', // 课堂回放列表
		component: VideoUnicastPage
	},
	{
		path: 'unicast/:id', // 视频点播详情
		component: VideoUnicastDetailPage
	},
	{
		path: 'unicast/statistics/:id', // 听评课统计
		component: VideoStatisticsPage
	},
	{
		path: 'invitation', // 听评课统计
		component: InvitationHomePage
	},
	{
		path: 'myclass',   // 课堂回放我的课
		component: VideoMyclass
	}
];
