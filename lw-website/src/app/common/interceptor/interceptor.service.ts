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
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { OAUTH_URL } from '../oauth2';
import { LwOauth2TokenService } from '../oauth2';
import { LwResponseService } from './response.service';
import { LwRequestService } from './request.service';
import { LwLoggerService } from './logger.service';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
export const HEADER_TOKEN = 'TOKEN';

@Injectable()
export class LwInterceptorService implements HttpInterceptor {

  private requestTime: number;

  private responseTime: number;

  constructor(private oauthToken: LwOauth2TokenService,
              private responseService: LwResponseService,
              private loggerService: LwLoggerService,
              private requestService: LwRequestService,
              private route: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent |
    HttpHeaderResponse |
    HttpProgressEvent |
    HttpResponse<any> |
    HttpUserEvent<any>> {
    this.loggerService.requestTime(request);
    request = this.setToken(request);
    this.requestService.logger(request);
    return next.handle(request).pipe(
      tap(response => {
        this.loggerService.responseTime(response);
        this.responseService.responseSubject.next(response);
        // if(response.type == 0){
        //   this.route.navigate(['/enrollment'])
        // }
      }),
      catchError(error => {
        this.loggerService.responseTime(error);
        this.responseService.responseSubject.error(error);
        return throwError(error);
      })
    );
  }

  private setToken(request: HttpRequest<any>) {
    if (!request.url.includes(OAUTH_URL)) {
      const token = this.oauthToken.getAccessToken();
      return token ? request.clone({
        headers: new HttpHeaders({TOKEN: token})
      }) : request;
    } else {
      // console.error(request);
    }
    return request;
  }
}
