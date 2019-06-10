import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class LwRequestService {

	requestSubject: Subject<any> = new Subject<any>();

	logger(request) {
		// console.log(request.url)
	}
}
