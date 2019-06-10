import {NgModule} from '@angular/core';
import {LwInterceptorModule} from '../interceptor';
import {LwHttpService} from './http.service';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    imports: [
        HttpClientModule,
        LwInterceptorModule
    ],
    providers: [
        LwHttpService
    ]
})
export class LwHttpModule {
}
