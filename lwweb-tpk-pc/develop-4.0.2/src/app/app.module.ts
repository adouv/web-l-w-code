import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { appRoutes } from './app.router';
import {
	EnvDefaultConfig, LW_FILE_CODE, LW_MODULE_CODE, LwClientModule, LwHttpModule, LwOauth2Module, LwRequestService,
	LwResponseService, SussService
} from './app.export';
import { AppComponent } from './app.component';
import { AppRouterStrategy } from './app-router.strategy';
import { DatePipe } from '@angular/common';
import { AppEnvConfig, envFileCode, envModuleCode } from './app.env.config';
import { PageService } from './services/page/page.service';
import { AccountService } from './services/account';
import { OtherInterface } from './services/other.interface';
import { FileDownloadService } from './services/file/file-download.service';
import { FilePreviewService } from './services/file/file-preview.service';
import { FileInterface } from './services/file/file.interface';
import { NotificationModule, SharedModule } from './extend';
import { AngularDraggableModule } from 'angular2-draggable';
import { LwStorageService } from './common/cache';
import { SelectPersonModule } from './components/select-person/select-person.module';
import { RouterCanActivate } from './app-router.canactivate';
import * as $ from 'jquery';
@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		NoopAnimationsModule,
		LwOauth2Module,
		LwHttpModule,
		LwClientModule,
		SharedModule,
		NotificationModule,
		AngularDraggableModule,
		SelectPersonModule,
		RouterModule.forRoot(appRoutes),
	],
	providers: [
		DatePipe,
		LwResponseService,
		SussService,
		LwRequestService,
		{ provide: RouteReuseStrategy, useClass: AppRouterStrategy },
		{ provide: EnvDefaultConfig, useClass: AppEnvConfig },
		{ provide: LW_MODULE_CODE, useValue: envModuleCode },
		{ provide: LW_FILE_CODE, useValue: envFileCode },
		AccountService,
		RouterCanActivate,
		PageService,
		OtherInterface,
		FileInterface,
		FileDownloadService,
		FilePreviewService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
	constructor(private storageService: LwStorageService) {
		storageService.getUrlToken();
	}
}
