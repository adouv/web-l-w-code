import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'image-text-list',
	templateUrl: 'image-text-list.component.html',
	styleUrls: ['./image-text-list.component.scss']
})

export class ImageTextListComponent implements OnInit {

	page: any;

	constructor() {
		this.page = {
			offset: 0,
			size: 10,
			total: 0
		};
	}

	ngOnInit() {
	}

	// 点击分页按钮
	initPage(pageNo) {
		this.page.offset = (pageNo - 1) * this.page.size;
	}
}