import { Component, OnInit, Inject } from '@angular/core';
import { fadeInAnimation } from '../../directives/animate';
import { ActivatedRoute } from '@angular/router';
import { WebSiteService } from '../../service/website.service';
import { Router } from '@angular/router';
import { LW_MODULE_CODE, ModuleCode } from '../../common/config';

@Component({
	selector: 'app-school-module',
	templateUrl: './school-module.component.html',
	styleUrls: ['./school-module.component.scss'],
	animations: [fadeInAnimation]
})

export class SchoolModuleComponent implements OnInit {
	childColumnsList: any = [];
	articleList: any = [];
	defaultColumn: any;
	params: any = {};
	type: number = 4;
	tooltip = {
		txt: "报名已经过期"
	}
	showDetail = false;
	firstTitle: string;
	firstTime: any;
	coverUrl: string = '';
	showCoverUrl = true;
	columnList = [];
	apiUrl: string;
	articleType: string = "";
	// callNum: null;
	// tallNum: number = 486;
	education: any;
	educationObj: any = '教育教学';
	active: any;
	activedObj: any = '新闻中心';

	show: boolean = true;
	constructor(
		private route: ActivatedRoute,
		private service: WebSiteService,
		private router: Router,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode
	) {
		this.apiUrl = this.moduleCode.WEBSITE_CMS;
	}

	ngOnInit() {
		this.getArticleList(this.educationObj);
		// 获取教育教学，新闻中心的路由
		let data = JSON.parse(localStorage.getItem('navBar'));
		data.forEach(element => {
			if (element.name === '教育教学') this.education = element;
			if (element.name === '新闻中心') this.active = element;
		});
	}
	// getModuleObj(){
	// 	let data =JSON.parse(localStorage.getItem('navBar'));
	// 	data.forEach(element => {
	// 		if(element.name === '教育教学')	this.educationObj = element;
	// 		if(element.name === '新闻中心')	this.activedObj = element;
	// 	});
	// }
	clickNav(obj) {
		if (obj === 0) {
			this.router.navigate(['/layout/list/4/21']);
		} else {
			this.router.navigate(['/layout/list/65/66']);
		}
	}
	columnClick(item?: any, items?: any) {
		this.showDetail = false;
		if (item.childColumns != null) {
			if (items == undefined) {
				item.isSubMenu = !item.isSubMenu;
			} else {
				this.getArticleList(items.id);
			}
		} else {
			this.getArticleList(item.id);
		}
	}

	getArticleList(column?) {
		let type;
		this.articleList = [];
		if ("ActiveXObject" in window) {
			column = encodeURI(column);
		}
		if (column) this.params.columnName = column;
		this.service.getAllArticle(this.params).subscribe(response => {
			let dd: any = response;
			if (dd.length > 0) {
				let i: number = 0;
				dd.forEach(element => {
					if (i <= 6) {
						this.articleList.push(element);
					}
					i++;
				});
				this.firstTime = this.articleList[0].publishTime;
				this.firstTitle = this.articleList[0].title;
				this.articleType = this.articleList[0].article_type;
				if (this.articleList[0].cover) {
					if (this.articleList[0].cover.indexOf('http') > -1) {
						this.coverUrl = this.articleList[0].cover;
					} else {
						this.coverUrl = this.apiUrl + this.articleList[0].cover;

					}
					this.showCoverUrl = true;
				}
				else {
					this.showCoverUrl = false;
				}
			}
			else {
				this.showCoverUrl = false;
			}
		});
	}

	onTabClicked(column): void {
		if (column == this.educationObj) {
			this.show = true;
		} else if (column == this.activedObj) {
			this.show = false;
		}
		// this.tallNum = columnId;
		this.articleList = [];
		if ("ActiveXObject" in window) {
			column = encodeURI(column);
		}
		this.params = {
			columnName: column
		}

		this.service.getAllArticle(this.params).subscribe(response => {
			let dd: any = response;
			if (dd.length > 0) {
				let i: number = 0;
				dd.forEach(element => {
					// this.callNum = element.columnId;
					if (i <= 6) {
						this.articleList.push(element);
					}
					i++;
				});
				this.firstTime = this.articleList[0].publishTime;
				this.firstTitle = this.articleList[0].title;
				if (this.articleList[0].cover) {
					this.coverUrl = this.articleList[0].cover;
					if (this.coverUrl.indexOf('http') == -1) this.coverUrl = this.apiUrl + this.coverUrl;
					this.showCoverUrl = true;
				}
				else {
					this.showCoverUrl = false;
					this.coverUrl = '';
				}
			}
			else {
				this.showCoverUrl = false;
			}
		});
	}

	onListClicked(item: any): void {
		let obj = {
			path: '',
		};
		this.service.getWelcomeParentPath(item.id).subscribe(res => {
			res.forEach((element, index) => {
				obj[`key${index + 1}`] = element.id;
				obj[`value${index + 1}`] = element.name;
				if ((res.length - 1) == index && index == 1) {
					obj['path'] += '/' + element.id + '/0/' + item.id;
				} else if ((res.length - 1) == index && index == 2) {
					obj['path'] += '/' + element.id + '/' + item.id;
				} else {
					obj['path'] += '/' + element.id;
				};

			});
			this.router.navigate([`/layout/listDetail/${obj.path}`]);
		})
	}
}
