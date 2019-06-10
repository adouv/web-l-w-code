import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {UploaderItemEntity} from './file-item.entity';

@Component({
	selector: 'file-item',
	templateUrl: './file-item.html',
	styleUrls: ['./file-item.scss']
})

export class ProgressItemComponent {

	@Input()
	uploaderItem: UploaderItemEntity;
	@Input()
	functionName: string;

	@Output()
	cancelEvent = new EventEmitter();
	@Output()
	deleteEvent = new EventEmitter();
	@Output()
	openEvent = new EventEmitter();

	@ViewChild('imgView')
	imgView;

	constructor() {
	}

	delete() {
		this.deleteEvent.emit();
	}

	cancel() {
		this.cancelEvent.emit();
	}

	open() {
		this.openEvent.emit();
	}

}
