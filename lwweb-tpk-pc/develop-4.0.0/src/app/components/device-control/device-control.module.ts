import {NgModule} from '@angular/core';
import {DeviceControlComponent} from './device-control.component';
import {LwResponseService} from '../../common/interceptor/response.service';
import {LwRequestService} from '../../common/interceptor/request.service';
import {DeviceControlService} from './device-control-service';
import {LwHttpService} from '../../common/http/http.service';

@NgModule({
	declarations: [
		DeviceControlComponent
	],
	providers: [
		LwHttpService,
		LwResponseService,
		LwRequestService,
		DeviceControlService
	],
	exports: [
		DeviceControlComponent
	]
})
export class DeviceControlModule {

}
