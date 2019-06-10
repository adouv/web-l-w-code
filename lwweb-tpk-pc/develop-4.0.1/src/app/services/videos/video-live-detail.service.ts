import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class VideoLiveDetailService {
	public changeClass:EventEmitter<string>=new EventEmitter<string>();
	constructor( ) {
	}
 
}
