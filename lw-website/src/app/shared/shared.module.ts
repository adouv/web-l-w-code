import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {components} from '../components';
import {DirectivesModule} from '../directives/directives.module';
import {RouterModule} from '@angular/router';



/* video */
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DirectivesModule,
		NgZorroAntdModule,
		RouterModule,
		VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
	],
	declarations: [
		...components
	],
	providers: [],
	exports: [
		NgZorroAntdModule,
		FormsModule,
		DirectivesModule,
		ReactiveFormsModule,
		...components,
		HttpClientModule,
		CommonModule,
		RouterModule,
	],
})
export class SharedModule {
}
