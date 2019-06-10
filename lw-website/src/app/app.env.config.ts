import {EnvDefaultConfig, moduleCode, fileCode} from './app.export';

export class AppEnvConfig extends EnvDefaultConfig {
	constructor() {
		super();
	}
}

export const envModuleCode = {
	...moduleCode,
	WEB_SITE: '/lw-website-server'
};

export const envFileCode = {
	...fileCode,
};
