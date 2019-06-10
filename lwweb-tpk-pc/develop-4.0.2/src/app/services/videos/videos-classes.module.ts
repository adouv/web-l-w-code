import { ResourceClassesInterface } from './../resource/resource-classes.interface';
import { VideoLiveDetailService } from './video-live-detail.service';
import {NgModule} from '@angular/core';
import {VideoClassesService} from './video-classes.service';
import {VideoClassesInterface} from './video-classes.interface';


@NgModule({
	imports: [],
	exports: [],
	providers: [VideoClassesInterface,ResourceClassesInterface, VideoClassesService,VideoLiveDetailService],
})
export class VideoClassesServiceModule {
}
