export * from './dialog/dialog-show-upload-file/show-upload-file';
export * from './dialog/dialog-upload-file/upload-file';
export * from './dialog/dialog-evaluate/dialog-evaluate';
export * from './leaving-message/leaving-message.component';
export * from './tabs-footer/tabs-footer';
export * from './video-evaluation/video-evaluation.component';
export * from './video-header/video-header.component';
export * from './video-list/video-list.component';
export * from './video-thumbsup/video-thumbsup.component';
export * from './video-ranking/video-ranking.component';

import {LeavingMessageComponent} from './leaving-message/leaving-message.component';
import {VideoHeadComponent} from './video-header/video-header.component';
import {LeavingMessageCard} from './leaving-message/leaving-message-card/leaving-message-card';
import {VideoThumbsupComponent} from './video-thumbsup/video-thumbsup.component';
import {UploadFile} from './dialog/dialog-upload-file/upload-file';
import {DialogEvaluate} from './dialog/dialog-evaluate/dialog-evaluate';
import {ShowUploadFile} from './dialog/dialog-show-upload-file/show-upload-file';
import {VideoEvaluationComponent} from './video-evaluation/video-evaluation.component';
import {VideoListComponent} from './video-list/video-list.component';
import {TabsFooter} from './tabs-footer/tabs-footer';
import {VideoRankingComponent} from './video-ranking/video-ranking.component';
import { ClassroomPlaybackComponent } from './classroom-playback/classroom-playback.component';
import { ClassroomLiveComponent } from './classroom-live/classroom-live.component';


export const VideoClassesComponents = [
	ClassroomLiveComponent,
	ClassroomPlaybackComponent,
	VideoThumbsupComponent,
	VideoHeadComponent,
	VideoEvaluationComponent,
	LeavingMessageComponent,
	LeavingMessageCard,
	VideoListComponent,
	UploadFile,
	TabsFooter,
	ShowUploadFile,
	DialogEvaluate,
	VideoRankingComponent,
];
