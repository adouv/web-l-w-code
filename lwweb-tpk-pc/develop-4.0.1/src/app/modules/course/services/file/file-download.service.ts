import {Inject, Injectable} from '@angular/core';
import {MaterialItemDto} from '../material/dto/MaterialItemDto';
import {EnvDefaultConfig, LW_MODULE_CODE} from '../../../../app.export';

@Injectable()
export class FileDownloadService {

	public isDownloadDialogMini = false;
	private downloadDir: string;

	constructor(private envDefaultConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode) {
		this.downloadDir = '';
	}

	downloadFile(data: MaterialItemDto) {
		const fileName = data.name;
		const fileUrl = data.path;
		const url = this.envDefaultConfig.getServerUrl(this.moduleCode.FILE_SERVER) + `/fs/file/download?fileName=${fileUrl}&name=${fileName}`;
	}

}
