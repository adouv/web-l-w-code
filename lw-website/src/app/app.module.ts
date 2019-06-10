import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutesModule } from './app.route';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { EnvDefaultConfig, LW_FILE_CODE, LW_MODULE_CODE, LwHttpModule, LwRequestService, LwResponseService } from './common';
import { WebSiteService } from './service/website.service';
import { AppEnvConfig, envFileCode, envModuleCode } from './app.env.config';
import { HomePage } from './pages/home/home.page';
import { ListPage } from './pages/list/list.page';
import { HttpClientModule } from '@angular/common/http';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { ListDetailPage } from './pages/listDetail/listDetail.page';
import { HtmlPipe } from "./service/htmlPipe.service";
import { EnrollmentComponent } from './pages/enrollment/enrollment.component';
import { LayoutComponent } from './pages/layout/layout.component';


@NgModule({
	declarations: [
		AppComponent,
		HomePage,
		ListPage,
		TooltipComponent,
		ListDetailPage,
		HtmlPipe,
		EnrollmentComponent,
		LayoutComponent
	],
	imports: [
		BrowserModule,
		SharedModule,
		AppRoutesModule,
		LwHttpModule,
		HttpClientModule,
		BrowserAnimationsModule
	],
	providers: [
		LwRequestService,
		LwResponseService,
		WebSiteService,
		{ provide: EnvDefaultConfig, useClass: AppEnvConfig },
		{ provide: LW_MODULE_CODE, useValue: envModuleCode },
		{ provide: LW_FILE_CODE, useValue: envFileCode }
	],
	bootstrap: [AppComponent],
	schemas: [
		NO_ERRORS_SCHEMA
	]
})
export class AppModule {
}
