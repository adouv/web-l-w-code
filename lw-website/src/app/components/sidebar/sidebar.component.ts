import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { WebSiteService } from '../../service/website.service';

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	@Input() public list: any = [];
	@Input() public type: number = 0;
	columnList: any = [];
	constructor(
		private route: Router,
		private service: WebSiteService
	) { }
	ngOnInit() {

	}

	showMenu(item) {
		// if (!item.isSubMenu) {
		// 	this.list.filter(item => {
		// 		item.isSubMenu = false;
		// 		return item;
		// 	});
		// }
		item.isSubMenu = !item.isSubMenu;
	}

	getTest(e) {
		// console.log(e)
	}
}