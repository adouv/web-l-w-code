import {Component, Inject, Optional} from '@angular/core';
import {ConfirmationService} from 'primeng/primeng';
import {CourseDialogService} from '../exercise/dialog.service';


@Component({
	selector: 'uploader-dialog',
	templateUrl: './uploader.html',
	styleUrls: ['./uploader.scss']
})
export class UploaderDialogComponent {

	title: string;
	data: { items: any[]; uploadFileView?: any } = {items: []};

	constructor(private dialogService: CourseDialogService, private confirmationService: ConfirmationService) {
		this.title = '文件上传';
	}

	cancelOne(index) {
		// this.data.uploadFileView.cancelOne(index);
	}

	deleteOne(index) {
		this.dialogService.openConfirmDialog(this.confirmationService, '提示', '您确定要删除此文件吗？', () => {
			// this.data.uploadFileView.deleteOne(index);
		});
	}

	close() {
		// this.dialogRef.close();
		// this.data.uploadFileView.cancelAll();
	}

	unfinished() {
		// if (!this.data.uploadFileView.isCanClickConfirmButton) {
		// 	return false;
		// } else {
		// 	this.dialogRef.close();
		// 	this.data.uploadFileView.cancelAll();
		// }
	}

	minimize() {
		// this.data.uploadFileView.showUploadBtn();
		// this.dialogRef.close();
	}
}
