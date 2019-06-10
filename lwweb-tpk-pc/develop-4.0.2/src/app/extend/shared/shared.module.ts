/**
 * SharedModule
 * 声明可复用组件、指令和管道 / 导入内置模块
 * 避免提供服务
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {DirectivesModule} from '../../directives/directives.module';
import {PipesModule} from '../../pipes/pipes.module';
import {FileUploadModule} from 'ng2-file-upload';
import {ComponentsModule} from '../../components/components.module';
import {GalleryModule} from '@ngx-gallery/core';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {DialogService} from '../../services/dialog/dialog.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { ScrollEventModule } from 'ngx-scroll-event';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgxEchartsModule,
		NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: '../assets/anticon/iconfont' }),
		GalleryModule.forRoot(),
		LightboxModule.forRoot(),
		FileUploadModule,
		DirectivesModule,
		PipesModule,
		ComponentsModule,
		ScrollEventModule
	],
	exports: [
		CommonModule,
		FormsModule,
		NgZorroAntdModule,
		GalleryModule,
		FileUploadModule,
		DirectivesModule,
		PipesModule,
		ComponentsModule,
		NgxEchartsModule
	],
	declarations: [],
	providers: [
		DialogService
	]
})
export class SharedModule {
}
