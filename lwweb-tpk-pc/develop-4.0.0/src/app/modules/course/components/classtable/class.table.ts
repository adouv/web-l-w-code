import { AfterViewChecked, Component, EventEmitter, Input, Output, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { SelectDataItem } from '../../services/entity/select-data-item';
import { AccountService } from '../../../../services/account/account.service';


@Component({
	selector: 'course-class-table',
	templateUrl: './class.table.html',
	styleUrls: ['./class.table.scss']
})
export class CourseClassTableComponent implements AfterViewChecked, OnInit {
	curLeft: number;
	@Input()
	items: Array<SelectDataItem> = [];
	@Input()
	currItem = '';
	@Output()
	selected = new EventEmitter();

	@ViewChild('itemsView')
	itemsView;
	@ViewChild('classtabsView')
	classtabsView;
	@ViewChild('leftmaskView')
	leftmaskView;
	@ViewChild('rightmaskView')
	rightmaskView;
	@ViewChild('lefthoverView')
	lefthoverView;
	@ViewChild('righthoverView')
	righthoverView;

	private preClientWidth = 0;


	constructor(private accountService: AccountService) {
	}
	ngOnInit() {
		this.accountService.CreateSubject((data) => {
			this.itemsView.nativeElement.style.left = 0 + 'px';
		});
	}
	selectClass(index) {
		this.currItem = this.items[index].code;
		this.selected.emit(this.items[index]);
	}

	getStyle(index) {
		let style = {};
		if (this.items[index].code === this.currItem) {
			style = {
				'background': '#00A1EA',
				'color': '#ffffff',
			};
		}
		return style;
	}

	ngAfterViewChecked(): void {
		this.refreshCurLeft();
		this.checkMask();
	}

	last() {
		this.refreshCurLeft();
		if (Math.abs(this.curLeft) < this.getStep()) {
			this.itemsView.nativeElement.style.left = 0 + 'px';
		} else {
			this.curLeft += this.getStep();
			this.itemsView.nativeElement.style.left = this.curLeft + 'px';
		}
		this.checkMask();
	}

	next() {
		this.refreshCurLeft();
		const aa = this.itemsView.nativeElement.clientWidth - Math.abs(this.curLeft) - this.classtabsView.nativeElement.clientWidth;
		if (aa < this.getStep()) {
			this.itemsView.nativeElement.style.left = -(this.itemsView.nativeElement.clientWidth -
				this.classtabsView.nativeElement.clientWidth) + 'px';
		} else {
			this.curLeft -= this.getStep();
			this.itemsView.nativeElement.style.left = this.curLeft + 'px';
		}
		this.checkMask();
	}

	refreshCurLeft() {
		this.curLeft = 0;
		const leftText = this.itemsView.nativeElement.style.left;
		if (leftText !== '') {
			this.curLeft = parseInt(leftText.substring(0, leftText.length - 2));
		}
	}

	checkMask() {

		if (this.curLeft !== 0) {
			this.leftmaskView.nativeElement.style.display = 'block';
			this.lefthoverView.nativeElement.style.display = 'block';
		} else {
			this.leftmaskView.nativeElement.style.display = 'none';
			this.lefthoverView.nativeElement.style.display = 'none';
		}

		// TODO:wuh this.itemsView.nativeElement.clientWidth != 2*this.count 是特殊逻辑，因为返回后总有一次clientWidth变成二倍，需要过滤，否则会出现箭头闪动
		if ((this.curLeft > this.classtabsView.nativeElement.clientWidth - this.itemsView.nativeElement.clientWidth) &&
			this.itemsView.nativeElement.clientWidth !== 2 * this.preClientWidth) {
			this.rightmaskView.nativeElement.style.display = 'block';
			this.righthoverView.nativeElement.style.display = 'block';
		} else {
			this.rightmaskView.nativeElement.style.display = 'none';
			this.righthoverView.nativeElement.style.display = 'none';
		}
		this.preClientWidth = this.itemsView.nativeElement.clientWidth;
	}

	getStep(): number {
		return this.classtabsView.nativeElement.clientWidth - 170;
	}
}
