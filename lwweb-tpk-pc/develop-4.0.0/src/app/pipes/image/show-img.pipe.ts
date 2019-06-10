import {Inject, Pipe, PipeTransform} from '@angular/core';
import {EnvDefaultConfig, LW_FILE_CODE} from '../../app.export';

@Pipe({
	name: 'showImg',
})
export class ShowImgPipe implements PipeTransform {
	constructor(private envDefaultConfig: EnvDefaultConfig,
				@Inject(LW_FILE_CODE) private fileCode) {
	}

	transform(path: string, defaultImg: string): any {
		if (path) {
			return this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG) + path;
		} else {
			return defaultImg;
		}
	}
}
