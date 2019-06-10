import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
	selector: 'tpk-course-tree',
	templateUrl: 'dialog-tree.html',
	styleUrls: ['dialog-tree.scss']
})

export class TreeCourseComponent implements OnChanges {
	@Input() data: any;
	@Output() checkClick: EventEmitter<any> = new EventEmitter();
	childisOpen: boolean;
	@Input() checkAry: Array<any>;
	@Input() openList: Array<any>;
	@Input() openStatus: boolean;
	@Input() maxLength: number;

	constructor() {
		this.childisOpen = true;
		this.openStatus = false;
		this.maxLength = -1;
		this.checkAry = [];
		this.openList = [];
		this.data = [];
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.data.length > 0) {
			this.treeDataisOpen();
		}
	}

	childClick(t) {
		t.isOpen = !t.isOpen;
		this.checkClick.emit({
			isHave: this.haveChild(t, this.openList),
			type: 1, // 展开
			data: t
		});
	}

	childisOpenChange($event, child, isOpen) {
		if (isOpen && !child.canPrepare) {
			this.childClick(child);
		} else {
			if (isOpen && !child.isOpen && child.canPrepare) {
				this.childClick(child);
			} else {

				if (this.maxLength !== -1) {
					if ((this.checkAry.length >= this.maxLength && child.isSelect) || this.checkAry.length < this.maxLength) {
						child.isSelect = !child.isSelect;
						this.checkClick.emit({
							isHave: this.haveChild(child, this.checkAry),
							data: child,
							type: 0 // 选中
						});
					}
				} else {
					child.isSelect = !child.isSelect;
					this.checkClick.emit({
						isHave: this.haveChild(child, this.checkAry),
						data: child,
						type: 0 // 选中
					});
				}
			}
		}

	}

	checkedAllChange($event, child) {
		this.checkClick.emit({
			isHave: this.haveChild(child, this.checkAry),
			data: child,
			type: 0 // 选中
		});
	}

	haveChild(d, ary) {
		let isHave = false;
		for (let i = 0; i < ary.length; i++) {
			if (ary[i].id === d.id) {
				isHave = true;
			}
		}
		return isHave;
	}


	treeDataisOpen() {
		for (let i = 0; i < this.data.length; i++) {
			if (this.checkAry.findIndex((value, index, arr) => {
				return value.id === this.data[i].id;
			}) > -1) {
				this.data[i].isSelect = true;
			} else {
				this.data[i].isSelect = false;
			}
			if (!this.openStatus) {
				if (this.openList.findIndex((value, index, arr) => {
					return value.id === this.data[i].id;
				}) > -1) {
					this.data[i].isOpen = true;
				} else {
					this.data[i].isOpen = false;
				}
			} else {
				this.data[i].isOpen = true;
			}
		}
	}
}
