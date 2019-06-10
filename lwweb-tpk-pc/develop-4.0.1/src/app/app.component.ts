import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LwStorageService, LwResponseService, LwClientService, LwOauth2Service } from './app.export';

@Component({
	selector: 'app-root',
	template: `
		<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

	constructor(private router: Router,
		private activatedRoute: ActivatedRoute,
		private clientService: LwClientService,
		private responseService: LwResponseService,
		private storageService: LwStorageService,
		private oauth2Service: LwOauth2Service) {
	}


	ngOnInit(): void {
		this.checkLogin();
		this.clearStorage();
	}

	/**
	 * 判断登录
	 */
	private checkLogin() {
		this.responseService.invalidToken().subscribe((data) => {
			console.log('app.module');
			// token失效时退出
			if (data.status === 401) {
				this.oauth2Service.logout();
				this.router.navigate(['login']);
			}
		});
		if (location.pathname === '/') {
			//this.router.navigate(['resource/home/-1']);
			this.router.navigate(['course/timetable']);
		}
	}

	/**
	 * 清除储存的信息
	 */
	private clearStorage() {
		this.clientService.on('close', () => {
			localStorage.clear();
		});
	}
}
