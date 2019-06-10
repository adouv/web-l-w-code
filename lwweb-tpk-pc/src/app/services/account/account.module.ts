import {NgModule} from '@angular/core';
import {AccountService} from './account.service';
import {LwCacheModule} from '../../common/cache/index';
import {LwOauth2Service} from '../../common/oauth2/oauth2.service';
import {LwOauth2TokenService} from '../../common/oauth2/oauth2-token.service';

@NgModule({
	imports: [
		LwCacheModule,
	],
	providers: [
		AccountService
	]
})
export class AccountModule {
}
