import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'video-list',
	templateUrl: 'video-list.component.html',
	styleUrls: ['./video-list.component.scss']
})

export class VideoListComponent implements OnInit {

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