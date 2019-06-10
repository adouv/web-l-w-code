import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AccountModel, GardenModel, PERMISSION_CODE, USER_KEY, GARDEN_ID, ALLGARDENS} from './account.model';
import {LwStorageService} from '../../common/cache/index';
import {LwHttpService} from '../../common/http/index';
import {LW_MODULE_CODE, ModuleCode} from '../../common/config/index';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class AccountService {
	public observer: any;
	public subject: any;

	private currentGarden: GardenModel;

	constructor(private storageService: LwStorageService,
				private httpService: LwHttpService,
				private router: Router,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
	}

	/**
	 * 订阅组件
	 * @param callback 回调函数
	 */
	public CreateSubject(callback: Function): void {
		var that = this;
		this.observer = new Observable(observer => {
		});
		this.subject = this.observer.subscribe((data) => {
			callback(data);
		});
	}

	/**
	 * 发布组件
	 * @param ComponentName 组件名称
	 * @param Inputs 接收参数
	 * @param CloseActive
	 * @param Repeat
	 */
	public CreateComponent(ComponentName: any): void {
		if (this.subject && this.subject.next) {
			this.subject.next({ComponentName: ComponentName});
		}
	}

	saveAccount(account: AccountModel): void {
		this.storageService.set(USER_KEY, account);
	}

	getAccountId(): string {
		return this.getUser().accountId;
	}

	getGardenId(): string {
		const user = this.getUser();
		if (user && user.gardens && user.gardens.length > 0) {
			this.currentGarden = user.gardens[0];
		}
		if (this.currentGarden) {
			return this.currentGarden.gardenId;
		} else {
			throw new Error('没有找到指定用户的园区');
		}
	}

	shiftGarden(gardenId: string): void {
		const gardens = this.getUser().gardens;
		if (gardens && gardens.length > 0) {
			for (const garden of gardens) {
				if (garden.gardenId === gardenId) {
					this.currentGarden = garden;
					return;
				}
			}
		}
		throw new Error('切换园区失败');
	}

	getUser(): AccountModel {
		const userStr = this.storageService.get(USER_KEY);
		if (userStr) {
			return userStr;
		} else {
			this.router.navigate(['login']);
		}
		throw new Error('没有找到指定用户');
	}

	getCurrentAccount(callback) {
		this.httpService.get(this.moduleCode.ACCOUNT, '/account/auth-info').subscribe(res => {
			if (res && res.accountId && res.gardens && res.gardens.length !== 0) {
				this.saveAccount(res);
				// 存储当前园区id
				this.setGardenId(res);
			}
		}, error => {
			console.log(error);
		}, () => {
			callback();
		});
	}


	getAllGardens() {
		return localStorage.getItem(ALLGARDENS);
	}

	setAllGardens() {
		this.httpService.get(this.moduleCode.ACCOUNT, '/garden/simple/group-strategy', {isUserControlStrategy: false}).subscribe(out => {
			if (out && out.length > 0) {
				this.storageService.set(ALLGARDENS, out);
			}
		});
	}


	getCurrentGardenId() {
		console.log('园区ID为' + this.storageService.getCurrentGarden().gardenId);
		return this.storageService.getCurrentGarden().gardenId;
	}

	setGardenId(res) {
		this.storageService.set(GARDEN_ID, res.gardens[0].gardenId);
	}

	getRealGardenId() {
		return this.storageService.get(GARDEN_ID);
	}

	getPermissionCode() {
		const permissions = sessionStorage.getItem(PERMISSION_CODE);
		if (permissions) {
			return Observable.of(permissions.split(','));
		} else {
			return this.httpService.get(this.moduleCode.ACCOUNT, '/permission/getPermissionCodeList').do(data => {
				sessionStorage.setItem(PERMISSION_CODE, data);
			});
		}
	}
}

