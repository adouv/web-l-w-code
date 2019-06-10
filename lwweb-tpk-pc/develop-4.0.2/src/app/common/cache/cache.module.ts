import {NgModule} from '@angular/core';
import {LwStorageService} from './storage.service';
import {Base64Service} from './base64.service';

@NgModule({
	providers: [
		LwStorageService,
		Base64Service
	]
})
export class LwCacheModule {
}
