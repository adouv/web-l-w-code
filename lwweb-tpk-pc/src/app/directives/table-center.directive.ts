import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({selector: '[table-center]'})
export class TableCenterDirective {
	private table: any;
	private tableItem: Element;

	constructor(private tableRef: ElementRef) {
		setTimeout(() => {
			this.table = this.tableRef.nativeElement;
			this.tableItem = this.table.children[0];
			this.changeTable();
		}, 0);
	}

	@Input() isCommit = false;

	@HostListener('window:resize')
	onWindowResize() {
		this.changeTable();
	}

	/**
	 * 改变table位置,使table居中
	 */
	private changeTable() {
		let rowCount: number;
		rowCount = Math.floor(this.table.parentElement.clientWidth / this.tableItem.clientWidth);
		if(this.isCommit) {
			this.table.style.paddingLeft = (this.table.parentElement.clientWidth - this.tableItem.clientWidth * rowCount) / 2 + 'px';
		}else {
			if (this.table.children.length >= rowCount) {
				this.table.style.paddingLeft = (this.table.parentElement.clientWidth - this.tableItem.clientWidth * rowCount) / 2 + 'px';
			}
		}
		
	}
}
