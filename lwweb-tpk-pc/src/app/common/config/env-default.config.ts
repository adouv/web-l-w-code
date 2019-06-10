import {moduleCode} from './module.config';

export abstract class EnvDefaultConfig {

	getServerUrl(fileCode: string) {
		return moduleCode.FILE_SERVER + fileCode;
	}

	getModuleUrl(code: string) {
		return code;
	}

	getHttpModuleUrl(code: string) {
		return location.origin + code;
	}

	getHttpServerUrl(fileCode: string) {
		return location.origin + moduleCode.FILE_SERVER + fileCode;
	}
}
