import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FileDownloadService } from '../../services/file/file-download.service';
import { Router } from '@angular/router';
import { VideoClassesInterface } from '../../services/videos/video-classes.interface';

// var fs = require('fs');
@Component({
	selector: 'video-card-one',
	templateUrl: './video-card-one.html',
	styleUrls: ['./video-card-one.scss']
})

export class VideoCardOneComponent implements OnInit {
	@Input()
	video: any;
	@Input() selectIndex: any;
	@Output() vclick = new EventEmitter();
	@Input() videoQueryParams: any;
	@Input() isDisabled = true;
	@Input() typeIndex:any;
	@Input() actived = false;

	constructor(private fileDownloadService: FileDownloadService,
		private router: Router,
		private videoClassesInterface: VideoClassesInterface,
	) { }

	ngOnInit() {
		this.video.totalClicks = this.video.totalClicks === 0 ? '0' : this.video.totalClicks;
	}

	onClick() {
		this.vclick.emit(this.video);
	}

	downEvaluationTemplate(evt,id) {
		window[evt] ? window[evt].cancelBubble = true : evt.stopPropagation();
		let path = '/comment/activity/word?activityId=' + id;
		this.videoClassesInterface.getActivityFilename({
			activityId: id,
		}).subscribe(data => {
			let fileName = this.fileDownloadService.existsLocalFile(data.fileName);
			this.fileDownloadService.downloadFile({
				name: fileName,
				path: '',
				title: '下载成功'
			}, path);
		});
		
	}


	goDetail(video) {
		// debugger;
		const url = '/invitation/detail/';
		switch (this.typeIndex) {
			case 0:
				this.router.navigate([url + video.id + '/0/1'],{
					queryParams: {
						tabIndex: this.selectIndex
					}
				});
				break;
			case 1:
				this.router.navigate([url + video.id + '/0/0'],{
					queryParams: {
						tabIndex: this.selectIndex
					}
				});
				break;
			case 2:
				this.router.navigate([url + video.id + '/1/1'],{
					queryParams: {
						tabIndex: this.selectIndex
					}
				});
				break;
		}
	}
}
