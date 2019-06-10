import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {QualityCoursesModel} from './quality-courses.model';
import {Router} from '@angular/router';
import {FilePreviewService} from '../../../../services/file/file-preview.service';
import {QualityCourseInterface} from '../../../../services/resource/quality-course.interface';
import {QualityCourseEditComponent} from '../quality-course-edit/quality-course-edit.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {EnvDefaultConfig, LW_FILE_CODE} from '../../../../app.export';
import {LwClientService} from '../../../../common/client';
import {NotificationService} from '../../../../extend/notification/notification.service';
import {DialogService} from '../../../../services/dialog/dialog.service';
import {AccountService} from '../../../../services/account';

@Component({
	selector: 'quality-courses',
	templateUrl: 'quality-courses.component.html',
	styleUrls: ['quality-courses.component.scss']
})

export class QualityCoursesComponent implements OnInit {
	@Input()
	qualityCoursesList: Array<QualityCoursesModel> = [];

	@Output()
	onRefreshQualityCourse = new EventEmitter();

	constructor(private router: Router, private filePreviewService: FilePreviewService,
				private messageService: NzMessageService,
				private modalService: NzModalService,
				private qualityCourseInterface: QualityCourseInterface,
				@Inject(LW_FILE_CODE) private fileCode,
				private envDefaultConfig: EnvDefaultConfig,
				private clientService: LwClientService,
				private dialogService: DialogService,
				private notification: NotificationService,
				private account: AccountService) {

	}

	ngOnInit() {

	}

	/**
	 * 视频预览
	 */
	openVideo(item) {
		const fileServerUrl = this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG) + item.path,
			clientFilePath = this.envDefaultConfig.getHttpServerUrl(this.fileCode.SHOW_IMG) + encodeURIComponent(item.path);
		if (item.path.indexOf('mp4') > 0 || item.path.indexOf('flv') > 0) {
			if (item.source === 1 && item.path && item.path.indexOf('.')) {
				this.filePreviewService.videoPreview(fileServerUrl);
			} else if (item.path) {
				this.filePreviewService.videoPreview(item.path);
			}
		} else {
			this.clientService.previewFile(clientFilePath, item.name.replace(/ /g, '')).subscribe(preview => {
				console.log(preview);
			}, (err) => {
				console.log(err);
				this.notification.error('预览失败', '暂不支持该格式文件');
			});
		}
	}

	/**
	 *  删除精品课
	 */
	deleteCourse(data: QualityCoursesModel, index) {
		this.dialogService.openConfirm({
			title: '提示',
			content: '您确定要删除此文件吗？',
			mask: false,
			zIndex: 1003,
			class: 'evaluation-confirm',
			wrapClassName: 'vertical-center-modal',
			cancelText: '否',
			okText: '是',
			closable: true,
			width: 400,
			showConfirmLoading: false,
			maskClosable: false,
			onOk: () => {
				this.qualityCourseInterface.delQualityCourseList(data.id, data.outlineId, this.account.getCurrentGardenId).subscribe(() => {
					this.messageService.success('删除文件成功！');
					this.qualityCoursesList.splice(index, 1);
					setTimeout(() => {
						this.onRefreshQualityCourse.emit();
					}, 200);
				});
			},
			onCancel: () => {
				console.log('cancel');
			}
		})
		// this.modalService.open({
		// 	class: 'modal-confirm',
		// 	title: '提示',
		// 	content: '您确定要删除此文件吗？',
		// 	closable: true,
		// 	width: 400,
		// 	showConfirmLoading: false,
		// 	maskClosable: false,
		// 	cancelText: '否',
		// 	okText: '是',
		// 	onCancel: () => {
        //
		// 	},
		// 	onOk: () => {
		// 		this.qualityCourseInterface.delQualityCourseList(data.id, data.outlineId).subscribe(() => {
		// 			this.messageService.success('删除文件成功！');
		// 			this.qualityCoursesList.splice(index, 1);
		// 			setTimeout(() => {
		// 				this.onRefreshQualityCourse.emit();
		// 			}, 200);
		// 		});
		// 	},
		// });
	}

	/**
	 * 编辑精品课
	 * @param data
	 */
	editCourse(data: QualityCoursesModel) {
		this.modalService.open({
			title: '精品课编辑',
			content: QualityCourseEditComponent,
			width: 600,
			class: 'popover-file',
			footer: false,
			maskClosable: false,
			componentParams: {
				qualityCourseItem: data,
				outlineId: data.outlineId
			},
			onOk: () => {
				this.onRefreshQualityCourse.emit();
				this.qualityCoursesList = [];
			},
			onCancel() {
				console.log('Click cancel');
			},
		});
	}

	/**
	 * 设置显示
	 * @param {QualityCoursesModel} data
	 */
	isShowCourse(data: QualityCoursesModel) {
		this.qualityCourseInterface.isShowQualityCourse(data.id, this.qualityCoursesList[0].outlineId).subscribe(() => {
			this.onRefreshQualityCourse.emit();
		});
	}

	/**
	 *
	 * @param ev
	 */
	sortQualityCourse(ev) {
		this.qualityCourseInterface.sortQualityCourse(this.qualityCoursesList).subscribe((e) => {
			console.log(e);
		});
	}
}
