import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {LwOauth2Service, AccountService} from '../../app.export';
import {loginRouters} from './login.router';
import {LoginComponent} from './login.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(loginRouters)
	],
	exports: [],
	declarations: [
		LoginComponent
	],
	providers: [
		LwOauth2Service,
		AccountService
	],
})
export class LoginPageModule {

}
