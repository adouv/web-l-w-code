import {InjectionToken} from '@angular/core';

export class ModuleCode {
	[code: string]: string
}

export const LW_MODULE_CODE = new InjectionToken<ModuleCode>('LW_MODULE_CODE');
export const LW_FILE_CODE = new InjectionToken<ModuleCode>('LW_FILE_CODE');
// export const LW_MODULE_CODE = 'LW_MODULE_CODE';

export const moduleCode: ModuleCode = {
	OAUTH: '/lw-authz-server',
	ACCOUNT: '/lw-garden-server',
	GARDEN: '/lw-garden-server',
	FILE_SERVER: '/lw-fileserver'
};
export const fileCode: ModuleCode = {
	SHOW_IMG: '/fs/file/showPic?fileName=',
	DOWNLOAD: '/fs/file/download?fileName=',
	UPLOAD: '/fs/file/upload'
};
