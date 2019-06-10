import { ScrollWidthDirective } from './../../directives/scroll-width.directive';
import {
	Component,
	Input,
	OnInit,
	ViewChild,
	ElementRef,
	Output,
	EventEmitter,
	OnChanges,
	HostListener
} from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'select-group',
	templateUrl: './select-group.html',
	styleUrls: ['./select-group.scss']
})

export class SelectGroupComponent implements OnInit, OnChanges {
	moreStatus: boolean;
	showMoreButton: boolean;
	_titles: string;
	private oldValue: any;
	@Input()
	set titles(value: string) {
		this._titles = value;
	}
	@Input() data: any;
	@Output() selectEvent: EventEmitter<any> = new EventEmitter();
	@Input() model?: any;
	@Input() styleType?: any;
	@Input() myClass = false;
	@ViewChild('selectValues')
	private selectValues: ElementRef;
	@ViewChild('defaultHeight')
	private defaultHeight: ElementRef;

	constructor() {
		this.moreStatus = true;
		this.showMoreButton = false;
		this.data = [];
	}

	ngOnInit() {
		this.model = this.model ? this.model : '';
		//this.width = document.getElementsByClassName('selectorkey')[0].clientWidth;
	}

	@HostListener('window:resize')
	onWindowResize() {
		this.checkDataHeight();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.data) {
			if (changes.data.previousValue !== changes.data.currentValue) {
				this.showMoreButton = false;
				setTimeout(() => {
					this.checkDataHeight();
					// this.selectValues.nativeElement.querySelectorAll('.selectorValue')[0].setAttribute('class', 'selectorValue active');
				}, 50);
			}
		}
	}

	// 离开下拉框
	mouseleave() {
		this.moreStatus = true;
	}

	// 悬浮更多
	mouseenter() {
		this.moreStatus = false;
	}

	// 选中值
	selectValue(d, index) {
		if (this.oldValue !== d) {
			if (this.selectValues.nativeElement.querySelector('.active')) {
				this.selectValues.nativeElement.querySelector('.active').setAttribute('class', 'selectorValue');
			}
			let selectIndex: number = (this.styleType != "line") ? (index + 1) : index;
			this.selectValues.nativeElement.querySelectorAll('.selectorValue')[selectIndex].setAttribute('class', 'selectorValue active');
			this.oldValue = d;
			this.selectEvent.emit(d);
		}
	}

	private checkDataHeight() {
		this.showMoreButton = false;
		this.showMoreButton = (this.defaultHeight.nativeElement.offsetHeight * 1.5) < this.selectValues.nativeElement.offsetHeight;
	}

	getTitle(titles) {
		let style: any = {};
		let len: number = titles.length;
		if (this.styleType == 'line') {
			switch (len) {
				case 1:
				case 2:
				case 3:
					style = {
						"width": "93%"
					};
					break;
				case 4:
					style = {
						"width": "90%"
					};
					break;
				case 5:
				case 6:
				case 7:
				case 8:
					style = {
						"width": "85%"
					};
					break;
			};
		} else {
			style = {
				"width": "100%"
			};
		}
		return style;
	}
}
