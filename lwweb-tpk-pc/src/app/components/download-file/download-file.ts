import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NzMessageService, NzModalSubject } from 'ng-zorro-antd';
import { EnvDefaultConfig, LwClientService, fileCode } from '../../app.export';

@Component({
	selector: 'download-file',
	templateUrl: './download-file.html',
	styleUrls: ['./download-file.scss']
})

export class DownloadFileComponent implements OnInit {


	_title: string;
	@Input()
	set title(value: string) {
		this._title = value;
	}

	@Input() downloadFileView;
	@Input() downloadList: any;

	unfinishedBtn: boolean;

	constructor(private subject: NzModalSubject,
		private message: NzMessageService,
		private envDefaultConfig: EnvDefaultConfig,
		private clientService: LwClientService) {
	}

	ngOnInit() {
	}

	/**
	 * 打开文件
	 * @param filePath
	 */
	openFile(filePath) {
		const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
		this.clientService.openFile(filePath).subscribe(data => {
		}, error => {
			this.message.warning(fileName + error.err, { nzDuration: 2000 });
		});
	}

	/**
	 * 打开文件夹
	 * @param filePath
	 */
	openFolder(filePath) {
		this.clientService.openFolder(filePath).subscribe(data => {
		}, error => {
			console.log('失败了。。。');
		});
	}

	/**
	 * 完成按钮
	 */
	finished() {
		this.subject.destroy('onOk');
		this.downloadFileView.isDownload = false;
		this.downloadFileView.idList = [];
		this.downloadFileView.downloadList = [];
	}
	isfinished() {
		let result = false;
		this.downloadFileView.downloadList.map((data) => {
			if (data.downloading) {
				this.downloadFileView.unfinishedBtn = false;
				result = true;
			}
		})
		return result;
	}
}