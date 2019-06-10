import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DeviceControlService {

	constructor(private httpService: HttpClient) {
	}

	/**
	 *
	 * @param {string} cameraId 摄像机Id
	 * @param {string} direction 方向（up/down/left/right/home）
	 * @returns {Observable<any>}
	 */
	startMove(serverUrl: string, cameraInfo: string, direction: string) {
		return this.httpService.get(serverUrl + `/ptz/move/${direction}`, {
			withCredentials: true,
			params: {
				'cameraInfo': cameraInfo
			}
		});
	}

	/**
	 *
	 * @param {string} cameraId 摄像头id
	 * @param {string} operation 放大/缩小（plus/minus）
	 */
	zoom(serverUrl: string, cameraInfo: string, operation: string) {
		return this.httpService.get(serverUrl + `/ptz/zoom/${operation}`, {
			withCredentials: true,
			params: {
				'cameraInfo': cameraInfo
			}
		});
	}

	stopMove(serverUrl: string, cameraInfo: string) {
		return this.httpService.get(serverUrl + `/ptz/move/stop`, {
			withCredentials: true,
			params: {
				'cameraInfo': cameraInfo
			}
		});
	}

}
