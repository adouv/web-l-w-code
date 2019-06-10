import {Component, Inject, Input, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {EnvDefaultConfig, LW_FILE_CODE} from '../../../../app.export';
import {ResourceHomeInterface} from '../../../../services/resource/resource-home.interface';
import {QualityCourseInterface} from '../../../../services/resource/quality-course.interface';
import {NzMessageService, NzModalSubject} from 'ng-zorro-antd';
import {AccountService} from '../../../../services/account';

@Component({
	templateUrl: 'quality-course-upload.html',
	styleUrls: ['quality-course-upload.scss']
})

export class QualityCourseUploadComponent implements OnInit {
	@Input() uploader: FileUploader;
	@Input() outlineId: string;
	@Input() subjectCode: string;
	files: any[] = [];
	showFileUrl: string;
	knowledgeOptions: any[];
	outlineIds: string[];
	errOutlineIds: boolean;
	unfinishbtn: boolean;

	constructor(@Inject(LW_FILE_CODE) private fileCode,
				private envDefaultConfig: EnvDefaultConfig,
				private resourceHomeInterface: ResourceHomeInterface,
				private qualityCourseInterface: QualityCourseInterface,
				private subject: NzModalSubject,
				private message: NzMessageService,
				private account: AccountService) {

	}

	ngOnInit() {
		this.showFileUrl = this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG);
		setTimeout(() => {
			this.getLastOutlineList();
			if (this.uploader.queue) {
				const fileTotal = this.uploader.queue.length;
				for (const item of this.uploader.queue) {
					item.upload();
					item.onSuccess = (response, status) => {
						// 得到上传后的图片信息
						if (status === 200) {
							console.log('成功', JSON.parse(response));
							let successFile;
							successFile = JSON.parse(response);
							successFile.size = item.file.size;
							successFile.source = 1;
							successFile.subjectCode = this.subjectCode;
							this.files.push(successFile);
							if (this.files.length === fileTotal) {
								this.unfinishbtn = true;
							}
						} else {
							console.log('上传失败', response);
						}
					};
				}
			}
		}, 0);
	}

	cancelUpload(queue) {
		this.uploader.cancelItem(queue);
	}

	// 已上传的删除
	delFile(index) {
		this.files.splice(index, 1);
	}

	/**
	 * 获取知识点下拉列表
	 */
	getLastOutlineList() {
		this.resourceHomeInterface.getLastOutlineList(this.outlineId).subscribe((data) => {
			this.knowledgeOptions = data;
			this.outlineIds = [this.outlineId];
		});
	}

	addCourse() {
		if (this.outlineIds.length === 0) {
			this.errOutlineIds = true;
			this.message.warning('请选择知识点！');
			return;
		}
		for (const file of this.files) {
			file.outlineIds = this.outlineIds;
		}
		let params = Object.assign({}, this.files, {gardenId: this.account.getCurrentAccount})
		this.qualityCourseInterface.addQualityCourse(this.files).subscribe(() => {
			this.subject.next('传出');
			this.subject.destroy('onOk');
		}, () => {
			this.subject.destroy('onCancel');
		});
	}

}
