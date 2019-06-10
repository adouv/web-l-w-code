import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AccountService} from '../services/account';
import {Observable} from 'rxjs/Observable';
import {LwStorageService} from '../common/cache';
import {PERMISSION_CODE} from '../services/account/account.model';

@Directive({
	selector: '[permission]'
})
export class PermissionDirective {

	@Input('permission')
	set permission(permission: string) {
		if (!permission || permission === '') {
			this.viewContainer.createEmbeddedView(this.templateRef);
			return;
		}
		let logical = 'or';
		let permissionCodes = permission.split('|');
		if (permissionCodes.length === 1) {
			permissionCodes = permission.split('&');
			logical = 'and';
		}
		this.getPermission().subscribe(data => {
			for (let i = 0; i < permissionCodes.length; i++) {
				if (data.includes(permissionCodes[i])) {
					if (logical === 'or' || i === permissionCodes.length - 1) {
						this.viewContainer.createEmbeddedView(this.templateRef);
						break;
					}
				} else {
					if (logical === 'and') {
						this.viewContainer.clear();
						break;
					}
				}
			}
		});
	}

	constructor(private templateRef: TemplateRef<any>,
				private storageService: LwStorageService,
				private accountService: AccountService,
				private viewContainer: ViewContainerRef) {
	}

	getPermission() {
		return this.accountService.getPermissionCode();
	}
}
