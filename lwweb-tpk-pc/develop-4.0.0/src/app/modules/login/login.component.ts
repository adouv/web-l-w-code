import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LwOauth2Service, AccountService } from '../../app.export';
import { NzMessageService } from 'ng-zorro-antd';
import { LwClientService } from '../../common/client';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	userName: string;

	passWord: string;

	isLonging: boolean;

	constructor(private router: Router,
		private clientService: LwClientService,
		private oauth2Service: LwOauth2Service,
		private messageService: NzMessageService,
		private accountService: AccountService) {
		// this.judgeLogin();
		this.clientService.controlButtons({ toggle: false });
		this.clientService.setCurrentWindowSize(380, 510);
	}

	ngOnInit(): void {
		this.clientService.showCurrentWindow();
	}

	/**
	 * 登录
	 */
	login(): void {
		let noError = true;
		if (!this.userName || this.userName === '' || !this.passWord || this.passWord === '') {
			this.messageService.error('用户名或密码不能为空！');
			noError = false;
		}
		if (noError) {
			this.isLonging = true;
			this.oauth2Service.login({ username: this.userName, password: this.passWord }).subscribe(() => {
				this.clientService.setCurrentWindowOpacity(0);
				this.clientService.toggleMaximize();
				this.clientService.setCurrentWindowSize();
				this.clientService.controlButtons({ toggle: true });
				//this.clientService.hideCurrentWindow();
				this.accountService.setAllGardens();
				this.accountService.getCurrentAccount(() => {
					//this.router.navigate(['/resource/home/-1']);
					//this.router.navigate(['/course/timetable']);
					localStorage.setItem('s_gardenId', JSON.parse(localStorage.getItem('user')).gardens[0].gardenId);
					this.router.navigate(['/course/timetable']);
				});
			}, () => {
				this.messageService.error('用户名或密码错误！');
				this.isLonging = false;
			});
		}
	}

	/**
	 *  回车登录
	 */
	goLogin(event) {
		if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13
			|| event.key === 'Enter' || event.code === 'NumpadEnter') {
			this.login();
		}
	}
}
