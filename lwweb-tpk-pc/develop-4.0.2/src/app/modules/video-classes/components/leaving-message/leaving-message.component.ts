import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { DialogService } from '../../../../services/dialog/dialog.service';

interface MessgeItem {
	gradeId: string;
	classId: string;
	subjectCode: string;
	teacherId: string;
	giveLessonTime: string;
	period: number;
	gardenId: string;
	content: string;
}

@Component({
	selector: 'leaving-message',
	templateUrl: './leaving-message.component.html',
	styleUrls: ['./leaving-message.component.scss']
})

export class LeavingMessageComponent implements OnInit, OnChanges {
	@Input() videoDetails: any;
	@Input() type: any;
	messageItem: MessgeItem;
	leavingWord = '';
	messagesCount: number;
	messages: any[] = [];
	isHaveContent = false;
	@ViewChild('leavingContent') leavingContent: ElementRef;

	constructor(private videoClassesInterface: VideoClassesInterface, private dialogService: DialogService) {
	}

	ngOnInit() {
		this.getMessage();
		this.messageItem = this.videoDetails;
	}

	ngOnChanges() {
		if (this.videoDetails) {
			this.getMessage();
			this.messageItem = this.videoDetails;
		}
	}

	// 获得留言
	private getMessage() {
		this.videoClassesInterface.getMessage({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime,
			gardenId: this.videoDetails.gardenId
		}).subscribe(res => {
			this.messagesCount = res.headers.get('x-record-count');
			this.messages = res.body;
			this.leavingContent.nativeElement.scrollTop = 0;
		});
	}

	enterMessage() {
		this.addMessage();
	}

	wordChange($event) {
		this.isHaveContent = $event.trim('') !== '';
	}

	// 添加留言
	addMessage() {
		if (this.leavingWord.trim() !== '') {
			console.log(this.videoDetails);
			this.messageItem.content = this.leavingWord;
			this.messageItem.giveLessonTime = this.videoDetails.giveLessonTime;
			this.videoClassesInterface.addMessage(this.messageItem).subscribe(data => {
				this.leavingWord = '';
				this.isHaveContent = false;
				this.dialogService.alertSuccess('留言成功！');
				this.getMessage();
			}, err => {
				this.dialogService.alertError('发送失败: ' + err);
			});
		}
	}
}
