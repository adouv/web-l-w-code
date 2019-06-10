import {Injectable} from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LwRequestService {

	requestSubject: Subject<any> = new Subject<any>();

	logger(request) {
		// console.log(request.url)
	}
}
