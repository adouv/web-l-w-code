import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceControlService} from './device-control-service';

@Component({
	selector: 'device-control',
	templateUrl: 'device-control.html',
	styleUrls: ['device-control.scss']
})
export class DeviceControlComponent implements OnInit, OnDestroy {


	@Input('camera') camera;

	private ws: WebSocket;

	constructor(private deviceControlService: DeviceControlService) {

	}


	ngOnInit() {
		this.initWebSocket();
	}

	stopMove() {
		this.ws.send(`{'operationType': 'move','operationValue':'stop','cameraInfo': '${this.camera.desCamera}}'`);
		/*this.deviceControlService.stopMove(this.camera.gatherUrl, this.camera.desCamera).subscribe((data) => {
			console.log('操作成功！');
		});*/
	}

	startMove(direction: string) {
		this.ws.send(`{'operationType': 'move','operationValue': '${direction}','cameraInfo': '${this.camera.desCamera}'}`);
		/*this.deviceControlService.startMove(this.camera.gatherUrl, this.camera.desCamera, direction).subscribe((data) => {
			console.log('操作成功！');
		});*/
	}

	zoom(operation: string) {
		this.ws.send(`{'operationType': 'zoom','operationValue': '${operation}','cameraInfo': '${this.camera.desCamera}'}`);
		/*this.deviceControlService.zoom(this.camera.gatherUrl, this.camera.desCamera, operation).subscribe((data) => {
			console.log('操作成功！');
		});*/
	}

	initWebSocket() {
		if(this.camera.gatherUrl!=null){
			console.log(this.camera.gatherUrl);
			this.ws = new WebSocket(this.camera.gatherUrl + 'ptz');
			this.ws.onerror = (ev) => {
				console.log('ws异常!');
			};
		}
	}

	ngOnDestroy(): void {
		if(this.ws){
			this.ws.close();
		}
	}


}
