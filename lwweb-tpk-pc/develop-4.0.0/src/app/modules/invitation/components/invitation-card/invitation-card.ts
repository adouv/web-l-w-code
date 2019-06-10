import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../../extend/notification/notification.service';
import {EnvDefaultConfig, LW_FILE_CODE} from '../../../../app.export';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {FilePreviewService} from '../../../../services/file/file-preview.service';
import {LwClientService} from '../../../../common/client';
import {DatePipe} from '@angular/common';
import {InvitationInterface} from '../../services/invitation.interface';

@Component({
	selector: 'invitation-card',
	templateUrl: 'invitation-card.html',
	styleUrls: ['invitation-card.scss']
})

export class InvitationCardComponent implements OnInit {
	@Input()
	list;

	@Input()
	onlyShowSelect;

	@Output()
	onSelectChange = new EventEmitter();

	constructor(private router: Router,
				private filePreviewService: FilePreviewService,
				private modalService: NzModalService,
				@Inject(LW_FILE_CODE) private fileCode,
				private envDefaultConfig: EnvDefaultConfig,
				private clientService: LwClientService,
				private notification: NotificationService,
				private datePipe: DatePipe,
				private invitationInterface: InvitationInterface) {

	}

	ngOnInit() {
			console.log(this.list)
			console.log('--------------')
			console.log(this.onlyShowSelect)
	}

	/**
	 * 视频预览
	 */
	openVideo(item) {
		item.giveLessonTime = this.datePipe.transform(item.courseStartTime, 'yyyy-MM-dd HH:mm:ss');
		this.invitationInterface.getUnicastPlayUrl(item.classId, item.giveLessonTime).subscribe((data) => {
			if (data.pcPlayUrl) {
				const path = data.pcPlayUrl;
				const fileServerUrl = this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG) + path,
					clientFilePath = this.envDefaultConfig.getHttpServerUrl(this.fileCode.SHOW_IMG) + encodeURIComponent(path);
				if (path.indexOf('mp4') > 0 || path.indexOf('flv') > 0) {
					if (item.source === 1 && path && path.indexOf('.')) {
						this.filePreviewService.videoPreview(fileServerUrl, '视频预览');
					} else if (path) {
						this.filePreviewService.videoPreview(path, '视频预览');
					}
				} else {
					this.clientService.previewFile(clientFilePath, item.lessonName.replace(/ /g, '')).subscribe(preview => {
						console.log(preview);
					}, (err) => {
						console.log(err);
						this.notification.error('预览失败', '暂不支持该格式文件');
					});
				}
			}
		});
	}

	/**
	 * 设置选中
	 * @param {QualityCoursesModel} data
	 */
	isShowSelect(data) {
		const arr = [];
		for (const item of this.list) {
			if (item.isSelect === true) {
				arr.push(item);
				item.giveLessonTime = this.datePipe.transform(item.courseStartTime, 'yyyy-MM-dd HH:mm:ss');
			}
		}
		this.onSelectChange.emit(arr);
	}

}
