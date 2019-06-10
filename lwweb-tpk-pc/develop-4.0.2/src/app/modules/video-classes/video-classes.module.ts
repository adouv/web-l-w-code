import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { videoClassesRoutes } from './video-classes.router';
import {
	LeavingMessageComponent, VideoClassesComponents, VideoListComponent,
	UploadFile, ShowUploadFile, VideoEvaluationComponent, DialogEvaluate, VideoRankingComponent
} from './components';
import { VideoHomePage } from './pages/video-home/video-home.page';
import { VideoIndexPage } from './pages/video-index/video-index.page';
import { VideoFollowPage } from './pages/video-follow/video-follow.page';
import { VideoListPage } from './pages/video-list/video-list.page';
import { VideoTaskPage } from './pages/video-task/video-task.page';
import { VideoLiveDetailPage } from './pages/viedo-live-detail/video-live-detail.page';
import { VideoStatisticsPage } from './pages/video-statistics/video-statistics.page';
import { VideoUnicastPage } from './pages/video-unicast/video-unicast.page';
import { VideoLivePage } from './pages/video-live/video-live.page';
import { VideoMyclass } from './pages/video-myclass/video-myclass.component';
import { VideoUnicastDetailPage } from './pages/viedo-unicast-detail/video-unicast-detail.page';
import { SharedModule } from '../../extend';
import { AngularDraggableModule } from 'angular2-draggable';
import { DeviceControlModule } from '../../components/device-control/device-control.module';
import { VideoClassesServiceModule } from '../../services/videos/videos-classes.module';

import { InvitationHomePage } from './pages/invitation-home/invitation-home.page';

@NgModule({
	imports: [
		SharedModule,
		AngularDraggableModule,
		DeviceControlModule,
		VideoClassesServiceModule,
		RouterModule.forChild(videoClassesRoutes),
	],
	exports: [
		VideoUnicastPage
	],
	declarations: [
		...VideoClassesComponents,
		VideoHomePage,
		VideoIndexPage,
		VideoFollowPage,
		VideoListPage,
		VideoLivePage,
		VideoTaskPage,
		VideoLiveDetailPage,
		VideoUnicastPage,
		VideoStatisticsPage,
		VideoUnicastDetailPage,
		InvitationHomePage,
		VideoMyclass
	],
	providers: [
		DialogEvaluate,
	],
	entryComponents: [
		UploadFile,
		DialogEvaluate,
		ShowUploadFile,
		LeavingMessageComponent,
		VideoListComponent,
		VideoEvaluationComponent,
		VideoRankingComponent,
		VideoFollowPage,
		VideoTaskPage
	]
})

export class VideoClassesModule {
}
