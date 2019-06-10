import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpSentEvent,
	HttpHeaderResponse,
	HttpProgressEvent,
	HttpResponse,
	HttpHeaders,
	HttpUserEvent,
	HttpEvent,
	HttpErrorResponse,
} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import { OAUTH_URL } from '../oauth2';
import { LwOauth2TokenService } from '../oauth2';
import { LwOauth2Service } from '../oauth2/oauth2.service';
import { LwResponseService } from './response.service';
import { LwRequestService } from './request.service';
import { LwLoggerService } from './logger.service';

export const HEADER_TOKEN = 'TOKEN';

@Injectable()
export class LwInterceptorService implements HttpInterceptor {

	private requestTime: number;

	private responseTime: number;

	constructor(
		private router: Router,
		private oauthToken: LwOauth2TokenService,
		private responseService: LwResponseService,
		private loggerService: LwLoggerService,
		private requestService: LwRequestService,
		private oauth2Service: LwOauth2Service
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent |
		HttpHeaderResponse |
		HttpProgressEvent |
		HttpResponse<any> |
		HttpUserEvent<any>> {
		this.loggerService.requestTime(request);
		request = this.setToken(request);
		this.requestService.logger(request);
		return next.handle(request).do(response => {
			this.loggerService.responseTime(response);
			this.tokenIsValid(response);
			this.responseService.responseSubject.next(response);
		})._catch(error => {
			this.loggerService.responseTime(error);
			this.tokenIsValid(error);
			this.responseService.responseSubject.error(error);
			return Observable.throw(error);
		});
	}

	private setToken(request: HttpRequest<any>) {
		if (!request.url.includes(OAUTH_URL)) {
			const token = this.oauthToken.getAccessToken();
			return token ? request.clone({
				headers: new HttpHeaders({ TOKEN: token })
			}) : request;
		} else {
			console.log(request);
		}
		return request;
	}
	/**
	 * token是否有效
	 * @param response 请求接口相应数据
	 */
	private tokenIsValid(response: any): void {
		if (response.status === 401) {
			//console.log('token is not valid:'+response.status);
			this.oauth2Service.logout();
			this.router.navigate(['login']);
		}
	}
}
