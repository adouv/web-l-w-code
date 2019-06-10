import { VideoSwitchClassComponent } from './video-switch-class/video-switch-class';
import { DirectivesModule } from './../directives/directives.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from '../pipes/pipes.module';
import { VideoPlayerComponent } from './video-player/video-player';
import { VideoPlayerOneComponent } from "./video-player-one/video-player-one";
import { NotificationMessage } from './notification-message/notification-message';
import { NavSliderComponent } from './nav-slider/nav-slider';
import { EllipticalPage } from './elliptical-page/elliptical-page';
import { CollapseMultilevelComponent } from './collapse-multilevel/collapse-multilevel';
import { ResourceHomeInterface } from '../services/resource/resource-home.interface';
import { CollapseTreeComponent } from './collapse-tree/collapse-tree.component';
import { CollapseTreeService } from './collapse-tree/collapse-tree.service';
import { VideoCardComponent } from './video-card/video-card';
import { VideoCardOneComponent } from './video-card-one/video-card-one';
import { DynamicTabsComponent } from './dynamic-tabs/dynamic-tabs.component';
import { DynamicModule } from 'ng-dynamic-component';
import { VideoResourceComponent } from './video-resource/video-resource.component';
import { VideoClassesServiceModule } from '../services/videos/videos-classes.module';
import { InputSearchComponent } from './input-search/input-search.component';
import { SelectGroupComponent } from './selector-group/select-group';
import { ExercisesGroupComponent } from './exercises-group/exercises-group.component';
import { ProgressBarComponent } from './progress/progress-bar';
import { FileUploaderComponent } from './upload-file/upload-file';
import { DownloadFileComponent } from './download-file/download-file';
import { ResourceListComponent } from './resource-list/resource-list.component';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgZorroAntdModule,
		PipesModule,
		RouterModule,
		DirectivesModule,
		VideoClassesServiceModule,
		DynamicModule.withComponents([])
	],
	exports: [
		VideoPlayerComponent,
		VideoPlayerOneComponent,
		NotificationMessage,
		NavSliderComponent,
		EllipticalPage,
		CollapseMultilevelComponent,
		CollapseTreeComponent,
		VideoCardComponent,
		VideoCardOneComponent,
		DynamicTabsComponent,
		VideoResourceComponent,
		VideoSwitchClassComponent,
		InputSearchComponent,
		SelectGroupComponent,
		ExercisesGroupComponent,
		ProgressBarComponent,
		FileUploaderComponent,
		DownloadFileComponent,
		ResourceListComponent
	],
	declarations: [
		VideoPlayerComponent,
		VideoPlayerOneComponent,
		NotificationMessage,
		EllipticalPage,
		NavSliderComponent,
		CollapseMultilevelComponent,
		CollapseTreeComponent,
		VideoCardComponent,
		VideoCardOneComponent,
		DynamicTabsComponent,
		VideoResourceComponent,
		VideoSwitchClassComponent,
		InputSearchComponent,
		SelectGroupComponent,
		ExercisesGroupComponent,
		ProgressBarComponent,
		FileUploaderComponent,
		DownloadFileComponent,
		ResourceListComponent
	],
	entryComponents: [
		VideoPlayerComponent,
		VideoPlayerOneComponent,
		NotificationMessage,
		EllipticalPage,
		VideoResourceComponent,
		VideoSwitchClassComponent,
		InputSearchComponent,
		SelectGroupComponent,
		ExercisesGroupComponent,
		ProgressBarComponent,
		FileUploaderComponent,
		DownloadFileComponent,
		ResourceListComponent
	],
	providers: [
		CollapseTreeService,
		ResourceHomeInterface
	]
})
export class ComponentsModule {
}
