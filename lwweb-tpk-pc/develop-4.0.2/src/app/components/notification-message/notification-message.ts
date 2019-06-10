import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NotificationService} from '../../extend/notification/notification.service';
import {LwClientService} from '../../app.export';
import {NzMessageService} from 'ng-zorro-antd';
@Component({
	templateUrl: './notification-message.html',
	styleUrls: ['./notification-message.scss']
})
export class NotificationMessage {
	@Input() type: string;
	@Input() filePath: string;
	@Input() filename: string;
	@Input() message: string;
	@ViewChild('notificationMessage') notificationMessage: ElementRef;
	constructor(private notificationService: NotificationService, private clientService: LwClientService, private messageService: NzMessageService) {}
	openFile() {
		const fileName = this.filePath.substring(this.filePath.lastIndexOf('/') + 1, this.filePath.length);
		// 打开文件
		this.clientService.openFile(this.filePath).subscribe(data => {

		}, error => {
			// this.notificationService.error('打开失败', '');
			this.messageService.warning(fileName + error.err, {nzDuration: 2000});
		});
		this.notificationService.close(this.notificationMessage.nativeElement);
	}
	openFloder() {
		// 打开文件夹 .substring(0, this.filePath.lastIndexOf('/'))
		this.clientService.openFolder(this.filePath).subscribe(data => {
		}, error => {
			// this.notificationService.error('打开失败', '');
		});
		this.notificationService.close(this.notificationMessage.nativeElement);
	}
}
