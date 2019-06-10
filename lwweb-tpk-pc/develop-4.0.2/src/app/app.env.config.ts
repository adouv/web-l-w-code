import {EnvDefaultConfig, moduleCode, fileCode} from './app.export';

export class AppEnvConfig extends EnvDefaultConfig {
	constructor() {
		super();
	}
}

export const envModuleCode = {
	...moduleCode,
	TPK_WEB: '/lwtpk-web',
	RESOURCE_WEB: '/lwtpk-web',
	CMS: '/lw-stream-cms'
};

export const envFileCode = {
	...fileCode,
};
