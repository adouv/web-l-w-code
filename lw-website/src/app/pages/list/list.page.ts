import { Component, OnInit, AfterViewInit, Inject, HostListener, AfterViewChecked, NgZone } from '@angular/core';
import { fadeInAnimation } from '../../directives/animate';
import { ActivatedRoute } from '@angular/router';
import { WebSiteService } from '../../service/website.service';
import { Router } from '@angular/router';
import { LW_MODULE_CODE, ModuleCode } from '../../common/config';
import { LwHttpService } from '../../common';
declare var $: any;

@Component({
	selector: 'list-page',
	templateUrl: 'list.page.html',
	styleUrls: ['./list.page.scss'],
	animations: [fadeInAnimation]
})

export class ListPage implements OnInit, AfterViewInit, AfterViewChecked {
	childColumnsList: any = [];
	articleList: any = [];
	defaultColumn: any;
	params: any = {};
	type: number = 0;
	sub: number = 0;
	subs: number = 0;
	tooltip = {
		txt: "报名已经过期"
	}
	showDetail = false;
	articleDetail: any = {};
	publishTime: string;
	page: any;
	pageSize = 10;
	offset = 0;
	scrollPos: number;
	pageNum: number;
	pageIndex = 1;
	apiUrl: string;
	isSpinning: boolean = true;
	isList: boolean = true;
	bannerList: any = [];
	total: number = 0;
	registerTitle: any;
	imgUrl: string;
	constructor(
		private route: ActivatedRoute,
		private service: WebSiteService,
		private router: Router,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
		private ngZone: NgZone,
		private http: LwHttpService
	) {
		this.apiUrl = this.moduleCode.WEBSITE_CMS;
		this.page = {
			index: 1,
			offset: 0,
			size: 10,
			total: 0
		};
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.type = params["type"];
			this.sub = (params["sub"] == undefined) ? 0 : params["sub"];
			this.subs = (params["subs"] == undefined) ? 0 : params["subs"];
			this.getColumnList();
			this.getArticleList((this.subs > 0) ? this.subs : this.sub);
			this.http.get('', 'assets/data/banner.json').subscribe(response => {
				response.forEach(element => {
					if (this.type == element.id) {
						this.bannerList = element.urlList;
					}
				});
			});
			// 确认显示左侧图片
			// this.service.get
		});

		// setInterval(() => {
		// this.getScrollLen();
		// }, 1);
	}


	ngAfterViewInit() {
		try {
			this.water();
		} catch (error) {

		}
	}
	ngAfterViewChecked() {
		this.ngZone.runOutsideAngular(() => {
			setTimeout(() => {
				try {
					this.water();
				} catch (error) {

				}
			}, 1000);
		});
	}

	//获取左侧栏目列表
	getColumnList(): void {
		this.service.getColumn({}).subscribe(res => {
			let columnList = res;//数组
			columnList.forEach((col, index) => {//item,一级栏目

				if (col.id == this.type) {
					this.defaultColumn = col;//标题赋值
					col.childColumns.forEach(subCol => {// 二级栏目
						if (subCol.id == this.sub) {
							subCol.isSubMenu = true;
							// if (subCol.childColumns[0]) {
							// 	this.subs = subCol.childColumns[0].id  // 默认选中
							// }
						} else {
							subCol.isSubMenu = false;
						}
					});

					this.childColumnsList = col.childColumns;
					if (this.childColumnsList.length) {
						this.childColumnsList[0].isSubMenu = true;
					}


					switch (col.name) {
						case "学校概况":
							this.imgUrl = `assets/images/xuexiaogaikuang.png`;
							break;
						case "教育教学":
							this.imgUrl = `assets/images/jiaoyujiaoxue.png`;
							break;
						case "新闻中心":
							this.imgUrl = `assets/images/xinwenzhongxin.png`;
							break;
						case "德育之窗":
							this.imgUrl = `assets/images/deyuzhichuang.png`;
							break;
						case "学生频道":
							this.imgUrl = `assets/images/xueshengpindao.png`;
							break;
						case "国际交流":
							this.imgUrl = `assets/images/guojijiaoliu.png`;
							break;
						case "招贤纳士":
							this.imgUrl = `assets/images/zhaoxiannashi.png`;
							break;
					}

				}
			});
		})

	}

	// 点击左侧栏目事件
	columnClick(item?: any, items?: any) {
		if (item.childColumns.length > 0) {
			if (items == undefined) {
				item.isSubMenu = !item.isSubMenu;
			} else {
				this.router.navigate(["/layout/list/" + this.type + "/" + item.id + "/" + items.id]);
			}
		} else {
			this.router.navigate(["/layout/list/" + this.type + "/" + item.id]);
			this.onPageChange(1);
		}
	}
	// 分页器
	onPageChange(pageNo): void {
		this.pageIndex = pageNo;
		if (pageNo > 1) {
			this.offset = (pageNo - 1) * 10;
		} else {
			this.offset = 0;
		}
		this.service.getArticle({ columnId: (this.subs > 0) ? this.subs : this.sub, pageSize: this.pageSize, offset: this.offset }).subscribe(response => {
			this.articleList = response.data;
			this.articleList.forEach(element => {
				if (element.articleType === 'register') {
					this.showTitle(element, element.currentTime, element.registerGuide.registerBeginTime, element.registerGuide.registerEndTime, element.registerGuide.startTime, element.registerGuide.endTime);
				}
			});
			this.total = response.totalCount;
			try {
				setTimeout(() => {
					this.isSpinning = false;
					if (this.articleList.length == 0) {
						this.isList = false;
					}
				}, 0);
			} catch (error) {

			}
		});
		$(window).scrollTop(0, 0);
		try {
			this.water();
		} catch (error) {

		}
	}
	// 获取文章列表
	getArticleList(columnId?: number, ) {
		this.isSpinning = true;
		this.isList = true;
		this.articleList = [];
		if (typeof (columnId) != 'undefined') {
			this.params.columnId = columnId;
		} else {
			if (this.defaultColumn.childColumns) {
				if (this.defaultColumn.childColumns[0].childColumns) {
					this.params.columnId = this.defaultColumn.childColumns[0].childColumns[0].id;
				} else {
					this.params.columnId = this.defaultColumn.childColumns[0].id;
				}
			}
		}
		this.params.pageSize = 10;
		this.params.offset = 0;
		this.service.getArticle(this.params).subscribe(response => {
			this.articleList = response.data;
			this.total = response.totalCount;
			this.onPageChange(1);
			try {
				this.water();
				setTimeout(() => {
					this.isSpinning = false;
					if (this.articleList.length == 0) {
						this.isList = false;
					}
				}, 1500);
			} catch (error) {

			}
		});
	}

	// 查看文章详情
	onDetailClicked(item): void {
		this.router.navigate(['/layout/listDetail/' + this.type + "/" + this.sub + "/" + this.subs + "/" + item.id]);
	}

	// 获取滚动条到顶部的距离
	// 	getScrollLen(): void {
	// 		this.scrollPos = window.pageYOffset;
	// 		if (this.scrollPos > 400) {
	// 			$(".side-bar").css({
	// 				"position": "fixed",
	// 				"top": "100px"
	// 			})
	// 			$(".right").css({
	// 				"margin-left": "296px"
	// 			})
	// 		}
	// 		else {
	// 			$(".side-bar").css({
	// 				"position": "static",
	// 				"top": "0px",
	// 				"margin-right": "36px"
	// 			})
	// 			$(".right").css({
	// 				"margin-left": "0",
	// 			})
	// 		}
	// 	}

	@HostListener('window:load', ['$event'])
	loadw(event?: any) {
		this.water();
	}
	water(event?: any) {
		//获取一下大盒子
		let main: HTMLElement = document.getElementById("main");
		if (main) {
			//获取每个小盒子，因为有兼容，所以写个函数，函数在下面
			// let boxs: any[] = this.getByClass(main, "box");
			let boxs: any[] = $("#main>li");
			//获取屏幕宽，也有兼容
			let clientW: number = document.body.clientWidth || document.documentElement.clientWidth;
			clientW = 919;
			//获取每个小盒子的宽，因为宽度都一样，获取第一个的就行
			let boxW: number = boxs[0].offsetWidth;
			//算一下得几列就好，因为可能算出小数，所以向下取整
			//let cols: number = Math.floor(clientW / boxW);
			let cols: number = 2;
			//给大盒子设置宽度
			main.style.width = cols * boxW + 'px';

			//来一个数组，这个数组里面存放前6个盒子的高度
			let hArr: any[] = [];
			for (let i = 0; i < boxs.length; i++) {
				if (i < cols) {
					//存放前六个高度
					hArr.push(boxs[i].offsetHeight);
				} else {
					//因为第七个要给前六个最短小的哪个下面放，所以要获取一下前六的最小高度
					let minH: any = Math.min.apply(null, hArr);
					//获取这个最小的高度属于前六个的第几个
					let minIndex: any = this.getIndex(minH, hArr);
					//给第七个设置位置
					boxs[i].style.position = "absolute";
					boxs[i].style.marginTop = minH + 'px';
					boxs[i].style.marginLeft = boxW * minIndex + 'px';
					//因为第八个和第七个一样，所以把哪个高度更新一下
					hArr[minIndex] += boxs[i].offsetHeight;
				}
			}
			if (hArr.length > 0) {
				if (parseInt(hArr[0]) > parseInt(hArr[1])) {
					main.style.height = (parseInt(hArr[0]) + 50) + "px";
				} else {
					if (hArr.length == 1) {
						main.style.height = (parseInt(hArr[0]) + 50) + "px";
					} else {
						main.style.height = (parseInt(hArr[1]) + 50) + "px";
					}
				}
			}
		}
	}

	getIndex(val: number, arr: any[]) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] == val) {
				return i;
			}
		}
	}



	getByClass(parent: HTMLElement, className) {
		let arr: any[] = [];
		// let eles: NodeListOf<Element> = parent.getElementsByClassName("box");
		let eles = parent.getElementsByClassName("box");
		for (let i = 0; i < eles.length; i++) {
			if (eles[i].className.split(' ').includes(className)) {
				arr.push(eles[i])
			}
		}
		return arr;
	}

	checkScroll() {
		let main: HTMLElement = document.getElementById("main");
		let boxs: any[] = this.getByClass(main, "box");
		let h: any = boxs[boxs.length - 1].offsetTop + boxs[boxs.length - 1].offsetHeight / 2;
		let bh: any = document.body.scrollTop || document.documentElement.scrollTop;
		let ch: any = document.body.clientHeight || document.documentElement.clientHeight;
		if (h < bh + ch) {
			return true;
		} else {
			return false;
		}
	}

	contentHtmlFilter(content: string) {
		let result: string = "";
		let len: number = 108;
		if (content != null) {
			result = content.replace(/(\n)/g, "");
			result = content.replace(/(\t)/g, "");
			result = content.replace(/(\r)/g, "");
			result = content.replace(/<\/?[^>]*>/g, "");
			result = content.replace(/\s*/g, "");
		}
		if (result != "") {
			return (result.length > len) ? result.substring(0, len) + "..." : result;
		} else {
			return "";
		}
	};

	// 格式化时间
	getFormat(time) {
		let d = new Date(time);
		let year: number = d.getFullYear();
		let month: string = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
		let day: string = (d.getDate() < 10 ? '0' : '') + d.getDate();
		let data = `${year}/${month}/${day}`;
		return data;
	}

	// // 比较时间
	getDate(data, rigesterStartTime, rigesterEndTime, rigesterStartTimeHour, rigesterEndTimeHour): {} {
		// if(rigesterStartTime == rigesterEndTime) rigesterEndTime += 24*3600*1000;
		let str = {};
		let d;
		let registerStart = new Date(rigesterStartTime).getTime();
		let registerEnd = new Date(rigesterEndTime).getTime();
		let indeedRegisterEnd = new Date(this.getFormat(registerEnd) + ' ' + rigesterEndTimeHour).getTime();
		if (data < registerStart) {
			let day = Math.ceil((registerStart - data) / 1000 / 60 / 60 / 24);
			str['name'] = `*距离正式报名还有${day}天`;
			str['key'] = 1;
		} else if (data > indeedRegisterEnd && data > (rigesterEndTime += 24 * 3600 * 1000)) {
			str['name'] = '*该报名活动已经过期';
			str['key'] = 2;
		} else {
			let d = new Date(data);
			let year: number = d.getFullYear();
			let month: string = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
			let day: string = (d.getDate() < 10 ? '0' : '') + d.getDate();
			let time = `${year}-${month}-${day}`;
			let startValidTime = time + ' ' + rigesterStartTimeHour;
			let endValidTime = time + ' ' + rigesterEndTimeHour;
			let startSeconds = new Date(startValidTime).getTime();
			let endSeconds = new Date(endValidTime).getTime();
			if (data < startSeconds || data > endSeconds) {
				// let start = rigesterStartTimeHour.split(':');
				// start[0] += '时:';
				// start[1] += '分';
				// let end = rigesterEndTimeHour.split(':');
				// end[0] += '时:';
				// end[1] += '分';
				str['name'] = `*不在报名时间范围内（请于${rigesterStartTimeHour}~${rigesterEndTimeHour}进行操作）`;
				str['key'] = 3;
			} else {
				str['name'] = '*现在开始报名';
				str['key'] = 4;
			}
		}

		return str;
	}

	// // 招生简章的时间标题显示
	showTitle(element, time, rigesterStartTime, rigesterEndTime, rigesterStartTimeHour, rigesterEndTimeHour) {
		let obj = this.getDate(time, rigesterStartTime, rigesterEndTime, rigesterStartTimeHour, rigesterEndTimeHour);
		element['tipTitle'] = obj['name'];
		if (obj['key'] == 1) {
			element['tipValue'] = 'rest';
		} else if (obj['key'] == 2) {
			element['tipValue'] = 'over';
		} else if (obj['key'] == 3) {
			element['tipValue'] = 'dayOver';
		} else if (obj['key'] == 4) {
			element['tipValue'] = 'start';
		}

	}
}
