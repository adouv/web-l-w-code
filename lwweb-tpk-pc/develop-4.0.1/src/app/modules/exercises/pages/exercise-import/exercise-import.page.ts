import {Component, ViewChild, Inject, ElementRef} from '@angular/core';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';
import {EnvDefaultConfig, LW_FILE_CODE} from '../../../../app.export';
import {NzMessageService} from 'ng-zorro-antd';
import {DialogService} from '../../../../services/dialog/dialog.service';
import {SelectChapterComponent} from '../../components/select-chapter/select-chapter';
@Component({
	templateUrl: './exercise-import.page.html',
	styleUrls: ['./exercise-import.page.scss']
})

export class ExerciseImportPage {
	exerciseTypes: Array<any>;
	exerciseTypeCheck: any;
	editContent: any;
	uploader: FileUploader;
	isDrop: boolean;
	@ViewChild('resource') resource: ElementRef
	constructor(
		@Inject(LW_FILE_CODE) private fileCode,
				private envDefaultConfig: EnvDefaultConfig,
		private dialogService: DialogService,
		private message: NzMessageService) {
		this.exerciseTypes = [];
		this.setFileOption();
		this.isDrop = false;
	}
	/**
	 * 设置文件上传参数
	 */
	private setFileOption() {
		// 获取上传到文件服务器的地址
		const fileServerUrl = this.envDefaultConfig.getServerUrl(this.fileCode.UPLOAD);
		const options: FileUploaderOptions = {
			autoUpload: true,
			url: fileServerUrl,
			method: 'POST',
			itemAlias: 'filedata', // 文件别名
			removeAfterUpload: true, // 是否在上传完成后从队列中移除
			maxFileSize: 100 * 1024 * 1024
		};
		this.uploader = new FileUploader(options);
		this.uploader.onWhenAddingFileFailed = (item, filter) => {
			if (filter.name === 'fileSize') {
				this.message.warning('不支持超过100M的单个文件上传！');
			}
		};
		this.uploader.onAfterAddingAll = (fileItems) => {
			// for (const item of fileItems) {
			// 	const type = this.getSuffixName(item.file.name);
			// 	if (this.videoType.indexOf(type) < 0) {
			// 		this.message.warning('文件格式错误，请重新选择！');
			// 		this.uploader.clearQueue();
			// 		return;
			// 	}
			// }
			// this.openUploadDialog();
		};
	}
	// 类型改变
	exerciseTypeChange() {

	}
	fileOverBase(event) {
		// 拖拽状态改变的回调函数
		console.log('拖拽状态改变的回调函数');
		console.log(event);
		this.isDrop = event;
	}
	fileDropOver(event) {
		// 文件拖拽完成的回调函数
		console.log('文件拖拽完成的回调函数');
		console.log(event);
	}

	uploaderDropClick() {
		this.resource.nativeElement.click();
	}

	selectChapter() {
		this.dialogService.openDialog({
			title: '章节绑定',
			content: SelectChapterComponent,
			width: 800,
			class: 'select-chaper',
			footer: false,
			maskClosable: false,
			onCancel: () => {

			},
			componentParams: {}
		})
	}

	doExercises(type) {

	}
}
