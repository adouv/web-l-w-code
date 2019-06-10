import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FileDownloadService} from '../../../../../services/file/file-download.service';
import {VideoClassesInterface} from '../../../../../services/videos/video-classes.interface';
import {LwStorageService} from '../../../../../app.export';

@Component({
	selector: 'show-upload-file',
	templateUrl: './show-upload-file.html',
	styleUrls: ['./show-upload-file.scss']
})

export class ShowUploadFile implements OnInit {
	isEvaluation: boolean;
	oldSelectVal: any;
	@Input() data: any;
	private currentData: any;
	_type: number;
	@Input() set type(value: number) {
		this._type = value;
	}

	@Input() videoDetails: any;
	@ViewChild('htmlDom') htmlDom: ElementRef;
	selectedTeaching: any;
	teachings: { label: string; value: string; }[] = [];

	constructor(private fileDownloadService: FileDownloadService, private videoClassesInterface: VideoClassesInterface,
				private storageService: LwStorageService) {
		this.isEvaluation = false;
	}

	ngOnInit() {
		this.htmlDom.nativeElement.innerHTML = this.data[0].commentHtml;
		this.currentData = this.data[0];
		if (this._type === 0) {
			this.getCommentTeacher();
		}
	}

	exportFile() {
		this.fileDownloadService.downloadFile({
			name: this.currentData.downloadFilename,
			path: this.currentData.filePath
		});
	}

	// 获得评价过我的老师
	private getCommentTeacher() {
		this.videoClassesInterface.getCommentTeacher({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime
		}).subscribe(data => {
			this.teachings = data;
			if (data.length > 0) {
				this.data = data;
				this.selectedTeaching = data[0];
				for (const d of data) {
					if (d.accountId === this.storageService.get('user').accountId) {
						this.selectedTeaching = d;
					}
				}
				this.getComment(this._type);
			}
		});
	}

	printView() {
		this.fileDownloadService.printView(this.htmlDom.nativeElement.innerHTML);
	}

	// 根据班级查询视频集
	searchTeaching($event) {
		if (this.selectedTeaching && this.oldSelectVal !== this.selectedTeaching) {
			this.oldSelectVal = this.selectedTeaching;
			this.getComment(this._type);
		}
	}

	// 获得教学评价或者教学反思
	private getComment(type) {
		this.videoClassesInterface.getComment({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime,
			commentatorId: this.selectedTeaching.accountId,
			type: type
		}).subscribe(data => {
			if (data.length > 0) {
				this.data = data;
				this.currentData = this.data[0];
				this.htmlDom.nativeElement.innerHTML = this.data[0].commentHtml;
			}
		});
	}
}
