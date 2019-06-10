import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject, NzModalService } from 'ng-zorro-antd';

@Component({
	selector: 'file-uploader',
	templateUrl: './upload-file.html',
	styleUrls: ['./upload-file.scss']
})

export class FileUploaderComponent implements OnInit {
	@Input()
	uploadList: any;
	@Input()
	uploadFileView: any;
	_title: string;
	@Input()
	set title(value: string) {
		this._title = value;
	}

	constructor(private subject: NzModalSubject, private modalService: NzModalService) {
	}

	ngOnInit() {
		console.log(this.uploadFileView);
		console.log(this.uploadList);
		console.log(this._title);
	}

	/**
	 * 完成按钮
	 */
	finished() {
		if (this.uploadFileView.unfinishedBtn) {
			this.uploadFileView.cancelAll();
			this.uploadFileView.isUploader = false;
			this.subject.destroy('onOk');
		}
	}

	/**
	 * 取消
	 * @param index
	 */
	cancel(index) {
		this.uploadFileView.cancelOne(index);
	}
	close() {
		this.uploadFileView.cancelAll();
		this.uploadFileView.isUploader = false;
		this.subject.destroy('onOk');
	}
	delete(index, status) {
		if (!status) {
			this.modalService.confirm({
				title: '提示',
				zIndex: 1003,
				content: '您确定要删除此文件吗？',
				class: 'evaluation-confirm',
				wrapClassName: 'vertical-center-modal',
				cancelText: '是',
				okText: '否',
				closable: true,
				width: 400,
				showConfirmLoading: false,
				maskClosable: false,
				onOk: () => {

				},
				onCancel: () => {
					this.uploadFileView.delete(index);
				}
			})
		} else {
			this.uploadFileView.delete(index);
		}

	}
}