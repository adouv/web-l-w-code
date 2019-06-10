import {Injectable, Inject} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LwHttpService} from '../http/http.service';
import {LW_MODULE_CODE, ModuleCode} from '../config';
import {DEFAULT_OAUTH2_MODE, Oauth2Model, Oauth2Result, OAUTH_URL} from './oauth2.model';
import {LwOauth2TokenService} from './oauth2-token.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class LwOauth2Service {

	oauthModel: Oauth2Model;

	constructor(private tokenService: LwOauth2TokenService,
				private httpService: LwHttpService,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
		this.oauthModel = DEFAULT_OAUTH2_MODE;
	}

	login(user: { username: string, password: string }): Observable<Oauth2Result> {
		this.tokenService.removeToken();
		const oauthModel = new HttpParams({fromObject: {...DEFAULT_OAUTH2_MODE, ...user}});
		const header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
		return this.httpService.post(this.moduleCode.OAUTH, OAUTH_URL, oauthModel, {headers: header}).pipe(tap(data => {
			this.tokenService.cacheToken(data);
		}));
	}

	logout(): Observable<boolean> {
		return Observable.create(observer => {
			this.tokenService.removeToken();
			observer.next(true);
		});
	}
}
