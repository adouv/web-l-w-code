import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import  { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { WebSiteService } from '../../service/website.service';

declare var $: any;

@Component({
	selector: 'nav-header',
	templateUrl: 'nav-header.component.html',
	styleUrls: ['nav-header.component.scss']
})

export class NavHeaderComponent implements OnInit, AfterViewChecked{
	navBars: any = [];
	currentUrl: string = '/home';
	type: number = 1;
	sType: number = 1;
	firstType: number = 1;
	cut: number = 93;
	first: any = false;
	other: any = false;
	otherItem: any = false;
	otherNavData: any = [];
	navShowSize: number = 1; //nav show num
	navShowData: any = [];
	// server: string = 'http://nysx.nlsyz.com.cn:82';
	server: string = 'http://10.0.0.10:120';
	constructor(
		private router: Router,
		private service: WebSiteService,		
		private activatedRoute: ActivatedRoute
	) {
		console.warn(this.navShowSize);
	}

	ngOnInit() {
		this.GetNavBarList();		
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				if (event.url === "/layout/home") {
					event.url = "/layout/home";
				}
				this.currentUrl = event.url;
				!event.url.split('/')[3] ? this.type = 1 : this.type = parseInt(event.url.split('/')[3]);
				this.navBars.forEach(element => {
					element['isSelected'] = false;
				});
			}
		});
			// 页面监听
			fromEvent(window,'resize').subscribe((event) => {
				this.firstStateNav();
			});
	
	}

	ngAfterViewChecked(){
		// this.firstStateNav();
	}

	// 导航菜单栏显示
	firstStateNav(): void {
		this.navShowData = [];
		this.otherNavData = [];
		var isWidth = $(window).width();
		var oWidth = isWidth - 740;
		var oliAllWidth = 93;
		this.navBars.forEach(element => {
			if(element.name.length<=4){
				element['width'] = 93;
			}else{
				element['width'] = element.name.length * 18 + 20; // 18对应一个字符长度
			}
		});
		for(var j = 1; j <= this.navBars.length; j++) {
				if((this.navBars.length) !== j)oliAllWidth += this.navBars[j].width;	
				if(oliAllWidth > oWidth) {
					this.navShowSize = j-1;
					$('#main_header_nav').width(oliAllWidth - (this.navBars[j-1].width) +'px');  
					break;
				}else if(oliAllWidth <= oWidth && (this.navBars.length) == j){
					$('#main_header_nav').width(oWidth +'px'); 
					this.navShowSize = j;
				}
		
		}
		this.navShowSize == this.navBars.length ? this.other = true : this.other = false;

		
			for (var j = 1; j <= this.navShowSize; j++) {
				this.navShowData.push(this.navBars[j-1]);
			}
			if(!this.other){
				this.otherNavData = [];
				for (var i = this.navShowSize; i < this.navBars.length; i++) {
					this.otherNavData.push(this.navBars[i]);
					if(this.navBars[i].isSelected) {
						this.onColumnClicked(this.navBars[i]);
					}
				}
			}
	}
	// 获取导航列表
	GetNavBarList(): void {
		this.navBars = [];
		let params: any = {};
		this.service.getColumn(params).subscribe(response => {
			if (response) {
				let data: any = response;
				for (let index = 0; index < data.length; index++) {
					const item = data[index];
					if(item.name == '首页') {
						this.firstType = item.id;
					}
					if (item.parentId == null) {
						this.navBars.push(item);
					}
					if (item.childColumns.length > 0) {
						item.routerPath = (item.name == "首页") ? "/layout/home" : "/layout/list/" + item.id + "/" + item.childColumns[0].id;
					} else {
						item.routerPath = (item.name == "首页") ? "/layout/home" : "/layout/list/" + item.id;
					}
				}
			};
			this.onColumnClicked();
			this.navShowSize = this.navBars.length;
			this.firstStateNav();
			localStorage.removeItem("navBar");
			localStorage.setItem("navBar", JSON.stringify(this.navBars));
		});
	}
	//点击导航回到顶部
	onColumnClicked(data?,type?): void {
		this.navBars.forEach(element => {
			element['isSelected'] = false;
		});
		if (window.location.pathname == "/layout/home") {
			if(data){
				data['isSelected'] = true;
			}else{
				this.type = this.navBars[0].id
			}
			this.otherItem = false;
		} else {
				this.type = parseInt(window.location.pathname.split('/')[3]);
				if(data){
				data['isSelected'] = true;	
				}
				if(type === 2){
					this.otherItem = true;
				}else if(type === 1){
					this.otherItem = false;
				}
		}
		window.scrollTo(0, 0);
	}
	// 超出内容后省略号显示
	contentHtmlFilter(content: string) {
		let result: string = "";
		let len: number = 5;
		if (content != null) {
			result = content.replace(/(\n)/g, "");
			result = content.replace(/(\t)/g, "");
			result = content.replace(/(\r)/g, "");
			result = content.replace(/<\/?[^>]*>/g, "");
			result = content.replace(/\s*/g, "");
		}
		if (result != "") {
			return (result.length > len) ? result.substring(0, len) + "..." : result;
			// return result;
		} else {
			return "";
		}
	};
	redirectTo(){
		window.open(this.server)
	}
}