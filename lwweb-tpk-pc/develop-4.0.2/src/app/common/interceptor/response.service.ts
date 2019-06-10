import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { LwOauth2Service } from '../oauth2';

@Injectable()
export class LwResponseService {

	responseSubject: Subject<any> = new Subject<any>();

	constructor(private router: Router,
		private oauth2Service: LwOauth2Service) {
	}
	invalidToken(): Observable<any> {
		return this.responseSubject.filter(data => {
			return data.status === 401;
		}).map(data => {
			return data;
		}).debounceTime(1000)._catch(error => {
			return Observable.of(error);
		});
	}
}
