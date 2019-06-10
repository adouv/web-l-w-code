import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LwOauth2Service, LwStorageService, AccountService } from '../../app.export';
import { AccountModel, GardenModel } from '../../services/account';
import { OtherInterface } from '../../services/other.interface';
import { LwHttpService } from '../../common/http/index';
import { LW_MODULE_CODE, ModuleCode } from '../../common/config/index';


interface MenuItemModel {
	title: string;
	isChecked: boolean | number;
	isParent?: boolean;
	isOpen?: boolean;
	router?: string;
	icon?: string;
	childList?: Array<MenuItemModel>;
	isParentChecked?: boolean;
	include?: any;
	permission?: any;
}

@Component({
	selector: 'nav-slider',
	templateUrl: 'nav-slider.html',
	styleUrls: ['nav-slider.scss']
})
export class NavSliderComponent implements OnInit, OnDestroy {
	menus: Array<MenuItemModel>;
	currentDate: any;
	account = {} as AccountModel;
	garden = {} as GardenModel;
	currentGarden = {};
	gardenList: Array<any> = [];
	timer: any;
	hiddenSide: boolean;
	hiddenSideUrls: Array<string>;
	gardenId: any;
	isShow: boolean = false;

	constructor(private router: Router, private oauth2Service: LwOauth2Service,
		private otherInterface: OtherInterface,
		private storageService: LwStorageService,
		private accountService: AccountService,
		private httpService: LwHttpService,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode
	) {
		this.hiddenSideUrls = ['invitation/scale', 'invitation/detail', 'invitation/add', 'analysis-own', 'analysis/details', 'course/prepare', 'course/patrol/info'];
	}


	ngOnInit(): void {
		this.menuInit();
		this.judgeMenuChecked(this.router.url);
		this.getCurrentTime();
		this.getUserInfo();
		this.haveAllGardens();
		// this.getAllGardes();

	}

	ngOnDestroy() {
		clearInterval(this.timer);
	}


	/**
	 * 获取用户信息
	 */
	private getUserInfo() {
		if (this.storageService.get('user') || this.storageService.getUrlToken().user) {
			this.account = this.storageService.get('user') || this.storageService.getUrlToken().user;
			this.garden = this.account.gardens[0];
		}
	}

	/**
	 * 是否有存在所有园区
	 */
	haveAllGardens() {

		this.httpService.get(this.moduleCode.ACCOUNT, '/garden/simple/group-strategy', { isUserControlStrategy: false }).subscribe(out => {
			if (out && out.length > 0) {
				this.storageService.set('AllGardens', out);
				let bool = out.some(item => item.gardenId == this.storageService.get('s_gardenId'));
				if (!bool) {
					this.storageService.setStr('s_gardenId', this.storageService.get('user').gardens[0].gardenId);
				}
				this.getAllGardes();
			}
		});

	}

	/**
	 * 获取所有园区信息
	 */
	private getAllGardes() {
		let gardenList = this.storageService.get('AllGardens');
		if (gardenList && gardenList.length > 0) {
			this.gardenList = gardenList;
			let temp = localStorage.getItem('s_gardenId');

			this.gardenList.forEach(item => {
				if (item.gardenId == temp) {
					this.gardenId = item.gardenId;
					this.currentGarden = item;
					this.storageService.set(`c_garden_${this.storageService.get('user').accountId}`, item);
				}
			});

			// if(this.storageService.getCurrentGarden()) {      
			// 	let temp = this.storageService.getCurrentGarden();
			// 	this.gardenId = temp.gardenId;
			// 	this.currentGarden = temp;
			// }else {
			// 	this.gardenId = this.gardenList[0].gardenId;
			// 	this.currentGarden = this.gardenList[0];
			// 	this.storageService.set(`c_garden_${this.storageService.get('user').accountId}`,this.currentGarden);
			// }
		}
	}

	/**
	 * 切换园区
	 */
	private switchGarden(garden) {
		this.gardenId = garden.gardenId;
		this.currentGarden = garden;
		this.storageService.setStr('s_gardenId', garden.gardenId);
		this.storageService.set(`c_garden_${this.storageService.get('user').accountId}`, garden);
		let url = window.location.pathname;
		let urlArry = ['/course/timetable', '/video/index', '/analysis/home'];
		if (!urlArry.includes(url)) {
			let rootPath = url.split('/')[1];
			urlArry.forEach(item => {
				if (item.includes(rootPath)) {
					this.router.navigate([item]);
					return;
				}
			});

			switch (rootPath) {
				case 'invitation':
					this.router.navigate([urlArry[1]])
					break;
				case 'exercises':
					this.router.navigate([urlArry[0]])
					break;
			}
		} else {
			urlArry.forEach(item => {
				if (item === url) {
					this.router.navigate([`/${item.split('/')[1]}`]);
					return;
				}
			})
		}
	}


	/**
	 * 菜单初始化
	 */
	private menuInit() {
		this.menus = [
			{
				title: '教',
				isChecked: false,
				router: 'course/timetable',
				icon: 'icon-speak',
				isParent: true,
				include: ['resource', 'exercises', 'course', 'course/timetable'],
			},
			{
				title: '评',
				isChecked: false,
				router: 'video/index',
				icon: 'icon-review',
				isParent: false,
				include: ['video/index', 'index/', 'video']
			},
			{
				title: '析',
				isChecked: false,
				router: 'analysis',
				icon: 'icon-analysis',
				isParent: true,
				include: ['analysis'],
				permission: 'materialStatistics:list'
			},
		];
	}

	/**
	 * 判断菜单选中
	 */
	private judgeMenuChecked(url) {
		for (const first of this.menus) {
			for (const urlstr of first.include) {
				if (url.indexOf(urlstr) > 0) {
					first.isChecked = url.indexOf(first.router) > 0;
					first.isParentChecked = url.indexOf(urlstr) > 0;
					first.isChecked = first.isParentChecked || first.isChecked;
					first.isOpen = first.isChecked;
				}
			}

			if (first.childList) {
				for (const second of first.childList) {
					second.isChecked = url.indexOf(second.router) > 0;
					if (second.isChecked || first.isChecked) {
						first.isParentChecked = true;
					}
					if (second.isChecked && !first.isChecked) {
						first.isOpen = true;
					}
				}
			}
		}

		this.hiddenSide = this.hiddenSideUrls.findIndex((value, index) => {
			return url.indexOf(value) > -1;
		}) > -1;
	}

	/**
	 * 获取当前时间
	 */
	private getCurrentTime() {
		this.otherInterface.getCurrentTime().subscribe(res => {
			this.currentDate = res;
			this.timer = setInterval(() => {
				this.currentDate.datetime = this.currentDate.datetime + 1000;
			}, 1000);
		});
	}

	/**
	 * 跳转
	 * @param menu
	 */
	goJump(menu) {
		if (menu.isParent) {
			if (!menu.isOpen) {
				menu.isOpen = !menu.isOpen;
			}
			for (let i = 0; i < this.menus.length; i++) {
				if (this.menus[i].title !== menu.title)
					this.menus[i].isOpen = false;
			}
		}
		if (menu.router) {
			this.router.navigateByUrl('/' + menu.router);
		}
	}

	openMenu(menu) {
		for (let i = 0; i < this.menus.length; i++) {
			if (this.menus[i].router === menu.router) {
				menu.isOpen = !menu.isOpen;
			} else {
				this.menus[i].isOpen = false;
			}
		}
	}
	show(evt) {
		window[evt] ? window[evt].cancelBubble = true : evt.stopPropagation();
		this.isShow = !this.isShow;
	}
}
