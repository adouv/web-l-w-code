import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LwOauth2Module} from '../oauth2';
import {LwInterceptorService} from './interceptor.service';
import {LwLoggerService} from './logger.service';

@NgModule({
	imports: [LwOauth2Module],
	providers: [
		LwLoggerService,
		{provide: HTTP_INTERCEPTORS, useClass: LwInterceptorService, multi: true}
	]
})
export class LwInterceptorModule {
}
