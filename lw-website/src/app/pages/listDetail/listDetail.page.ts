import { filter } from 'rxjs/operators';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { fadeInAnimation } from '../../directives/animate';
import { ActivatedRoute } from '@angular/router';
import { WebSiteService } from '../../service/website.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-listDetail',
	templateUrl: 'listDetail.page.html',
	styleUrls: ['./listDetail.page.scss'],
	animations: [fadeInAnimation]
})

export class ListDetailPage implements OnInit {
	childColumnsList: any = [];
	articleList: any = [];
	defaultColumn: any;
	params: any = {};
	type: number = 0;
	sub: number = 0;
	subs: number = 0;
	nid: number = 0;
	tooltip = {
		txt: "报名已经过期"
	}
	showDetail = false;
	articleDetail: any = {};
	publishTime: string;
	page: any;
	from = 0;
	to = 10;
	fristNum = 1;
	scrollPos: number;

	title: string;
	author: string;
	time: string;
	articleType: string;
	contentText: string;
	cover: string;
	content: any = {};
	summary: string;
	contentHtml: string;
	registerUrl: any;
	registerTitle: any = {};
	rigesterStartTime: any;
	rigesterEndTime: any;
	rigesterStartTimeHour: any;
	rigesterEndTimeHour: any;
	articleItem: any;
	videoList = [];
	imgList = [];
	crumbs = '';
	id_nav = 0;  // 菜单ID
	id_list = 0; // 列表ID
	id_list_first = 0; // 列表第一个子菜单ID
	id_act = 0;  // 文章ID
	constructor(
		private route: ActivatedRoute,
		private service: WebSiteService,
		private router: Router
	) {
		this.page = {
			offset: 0,
			size: 10,
			total: 0
		};
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.type = params["type"];
			this.sub = params["sub"];
			this.subs = params["subs"];
			this.nid = params["nid"];
			this.getColumnList();
			this.getArticleDetail();
		});
		window.scrollTo(0, 0);
		//     setInterval(() => {
		//       this.getScrollLen();
		//     }, 1);
	}

	getArticleDetail(): void {
		this.service.getArticleDetail(this.nid).subscribe(response => {
			this.articleDetail = response;
			// console.warn('文章：', response)
			this.articleType = this.articleDetail.articleType;
			this.title = this.articleDetail.title;
			this.id_act = this.articleDetail.id;
			this.id_list = this.articleDetail.columnId;
			this.author = this.articleDetail.author;
			this.contentHtml = this.articleDetail.contentHtml;
			this.contentText = this.articleDetail.contentText;

			// 富文本
			if(this.articleDetail.articleType == "richText") {
				this.time = this.articleDetail.publishTime;
			}
			// 招生简章
			if(this.articleDetail.articleType == "register") {
				this.rigesterStartTime = this.articleDetail.registerGuide.registerBeginTime;
				this.rigesterEndTime = this.articleDetail.registerGuide.registerEndTime;
				this.rigesterStartTimeHour = this.articleDetail.registerGuide.startTime;
				this.rigesterEndTimeHour = this.articleDetail.registerGuide.endTime;
				this.registerUrl = this.articleDetail.registerGuide.registerPageUrl;
				this.showTitle(this.articleDetail.currentTime,this.articleDetail.registerGuide.registerPageUrl);
			}
			// 图片
			if(this.articleDetail.articleType == "picture") {
				this.time = this.articleDetail.publishTime;
				this.imgList = this.articleDetail.attachments;
				this.content.imgList = this.imgList;
				this.content.contentText = this.articleDetail.contentText;
			}
			// 视频
			if(this.articleDetail.articleType == "video") {
				this.time = this.articleDetail.publishTime;
				this.videoList = this.articleDetail.attachments;
				this.content.contentText = this.articleDetail.contentText;
			}
		})
	}

	//获取左侧栏目列表
	getColumnList(): void {
		let columnList: any = JSON.parse(localStorage.getItem("navBar")); //数组
		if(!columnList){
			this.service.getColumn({}).subscribe( res => {
				localStorage.setItem("navBar", JSON.stringify(res));
				this.navConfig(res)
			});
		}else{
			this.navConfig(columnList);
		}
		
	}

	// 导航栏数据配置
	navConfig(data){
		data.forEach(col => { //item,一级栏目
			if(col.id == this.type) {
				this.defaultColumn = col; //标题赋值
				console.warn('菜单：', col)
				this.id_nav = col.id;
				col.childColumns.forEach((subCol,inde) => {
					if(inde == 0) {
						this.id_list_first = subCol.id;
					}
					if(subCol.id == this.sub) {
						this.crumbs = subCol.name;
						this.id_list = subCol.id;
						// console.warn('列表：',subCol)
						subCol.isSubMenu = true;
					} else {
						subCol.isSubMenu = false;
					}
				});
				this.childColumnsList = col.childColumns;
				this.childColumnsList[0].isSubMenu = true;
			}
		});
	}

	// 点击左侧栏目事件
	columnClick(item ? : any, items ? : any) {
		if(item.childColumns.length > 0) {
			if(items == undefined) {
				item.isSubMenu = !item.isSubMenu;
			} else {
				this.router.navigate(["/layout/list/" + this.type + "/" + item.id + "/" + items.id]);
			}
		} else {
			this.router.navigate(["/layout/list/" + this.type + "/" + item.id]);
		}
	}

	// 获取文章列表
	getArticleList(columnId ? : number) {
		this.articleList = [];
		if(typeof(columnId) != 'undefined') {
			this.params.columnId = columnId;
		} else {
			if(this.defaultColumn.childColumns) {
				if(this.defaultColumn.childColumns[0].childColumns) {
					this.params.columnId = this.defaultColumn.childColumns[0].childColumns[0].id;
				} else {
					this.params.columnId = this.defaultColumn.childColumns[0].id;
				}
			}
		}
		this.service.getArticle(this.params).subscribe(response => {
			this.articleList = response.data;
		});
	}

	// 获取滚动条到顶部的距离
	//   getScrollLen(): void {
	//     this.scrollPos = window.pageYOffset;
	//     if (this.scrollPos > 400) {
	//       $(".side-bar").css({
	//         "position": "fixed",
	//         "top": "100px"
	//       })
	//       $(".right").css({
	//         "margin-left": "296px"
	//       })
	//     }
	//     else {
	//       $(".side-bar").css({
	//         "position": "static",
	//         "top": "0px",
	//         "margin-right": "36px"
	//       })
	//       $(".right").css({
	//         "margin-left": "0"
	//       })
	//     }
	//   }

	// 分页器
	onPageChange(pageNo): void {
		if(pageNo > 1) {
			this.from = (pageNo - 1) * 10;
			this.to = pageNo * 10;
			this.fristNum = (pageNo - 1) * 10 + 1;
		} else {
			this.from = 0;
			this.to = 10;
			this.fristNum = 1;
		}
		window.scrollTo(0, 0);
		$(".list-right").scrollTop(0, 0);
	}

	 // 格式化时间
	 getFormat(time){
		let d = new Date(time);
		let year: number = d.getFullYear();
		let month: string = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
		let day: string = (d.getDate() < 10 ? '0' : '') + d.getDate(); 
		let data = `${year}/${month}/${day}`;
		return data;
	  }

	// 比较时间
	getDate(data: any, url) : {}{
		let str = {};
	  	let registerStart =  new Date(this.rigesterStartTime).getTime();
		let registerEnd =  new Date(this.rigesterEndTime).getTime();
		let indeedRegisterEnd = new Date(this.getFormat(registerEnd) + ' ' +this.rigesterEndTimeHour).getTime();

			if(data < registerStart){
				let day = Math.ceil((registerStart - data) /1000 / 60 / 60 / 24);
				str['name'] = `距离正式报名还有${day}天`;
				str['key'] = 1;
			}else if(data > indeedRegisterEnd && data > (registerEnd += 24*3600*1000)){
				str['name'] = '该报名活动已经过期';
				str['key'] = 2;
			}else{
					let d = new Date(data);
					let year: number = d.getFullYear();
					let month: string = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
					let day: string = (d.getDate() < 10 ? '0' : '') + d.getDate(); 
					let time = `${year}-${month}-${day}`;
					let startValidTime = time + ' ' + this.rigesterStartTimeHour;
					let endValidTime = time + ' ' + this.rigesterEndTimeHour;
					let startSeconds = new Date(startValidTime).getTime();
					let endSeconds = new Date(endValidTime).getTime();
					if(data < startSeconds || data > endSeconds){
						// let start = this.rigesterStartTimeHour.split(':');
						// start[0] += '时:';
						// start[1] += '分';
						// let end = this.rigesterEndTimeHour.split(':');
						// end[0] += '时:';
						// end[1] += '分';
						str['name'] = `不在报名时间范围内（请于${this.rigesterStartTimeHour}~${this.rigesterEndTimeHour}进行操作）`;
						str['key'] = 3;
					}else{
						if(url){
							str['name'] = '现在开始报名';
							str['key'] = 4;
						}
					}
			}

			return str;
	}
	
	// 招生简章的时间标题显示
	showTitle(time,url){
		
			let obj = this.getDate(time,url);
			this.registerTitle['title'] = obj['name'];
			if(obj['key'] == 1){
				this.registerTitle['value'] = 'rest';
			}else if(obj['key'] == 2){
				this.registerTitle['value'] = 'over';
			}else if(obj['key'] == 3){
				this.registerTitle['value'] = 'dayOver';
			}else if(obj['key'] == 4){
				this.registerTitle['value'] = 'start';
			}
			console.log(this.registerTitle)
		
	}

	// 点击报名
	redirectTo(){
		window.open(this.registerUrl);
	}
}