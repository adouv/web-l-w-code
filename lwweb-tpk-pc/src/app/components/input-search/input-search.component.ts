import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'input-search',
	templateUrl: 'input-search.component.html',
	styleUrls: ['./input-search.component.scss']
})

export class InputSearchComponent {
	@Input()
	tpkModel: any;
	@Output() tpkModelChange: EventEmitter<any> = new EventEmitter();
	@Input()
	tpkPlaceholder: any;
	timer: any;
	@Input() maxlength: number;
	@Output() onSearch: EventEmitter<any> = new EventEmitter();
	@Output() onKeyupSearch: EventEmitter<any> = new EventEmitter();

	constructor() {
		this.tpkModel = '';
		this.tpkPlaceholder = '';
		this.timer = null;
		this.maxlength = 1000000000000;
	}

	searchContent() {
		this.onSearch.emit(this.tpkModel);
	}

	deleteContent() {
		this.tpkModel = '';
		if (this.onSearch.observers.length > 0) {
			this.onSearch.emit(this.tpkModel);
		} else {
			this.onKeyupSearch.emit(this.tpkModel);
		}
	}

	changeKeyWord(event) {
		this.tpkModelChange.emit(event);
	}

	keyupSearch() {
		if (this.timer == null) {
			this.timer = setTimeout(() => {
				this.onKeyupSearch.emit(this.tpkModel);
				this.onSearch.emit(this.tpkModel);
			}, 500);
		} else {
			window.clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.onKeyupSearch.emit(this.tpkModel);
				this.onSearch.emit(this.tpkModel);
			}, 500);
		}
	}
}
