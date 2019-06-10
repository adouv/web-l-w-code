import {NgModule} from '@angular/core';
import {LwOauth2TokenService} from './oauth2-token.service';
import {LwOauth2Service} from './oauth2.service';
import {LwCacheModule} from '../cache';

@NgModule({
    imports: [
        LwCacheModule,
    ],
    providers: [
        LwOauth2TokenService,
        LwOauth2Service
    ]
})
export class LwOauth2Module {
}
