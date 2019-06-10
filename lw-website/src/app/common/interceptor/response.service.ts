import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, filter, map } from 'rxjs/operators';

@Injectable()
export class LwResponseService {

  responseSubject: Subject<any> = new Subject<any>();


  invalidToken(): Observable<any> {
    return this.responseSubject.pipe(filter(data => {
        // token 失效过期条件 （当前条件是相应状态等于401视为TOKEN过期）
        return data.status === 401;
      }), map(data => {
        return data;
      }), debounceTime(1000),
      catchError(error => {
        return of(error);
      }));
  }
}
