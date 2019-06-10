import {Component, Inject, Input, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {LW_MODULE_CODE, EnvDefaultConfig, LwOauth2TokenService, LW_FILE_CODE} from '../../../../../app.export';
@Component({
	selector: 'leaving-message-card',
	templateUrl: './leaving-message-card.html',
	styleUrls: ['./leaving-message-card.scss']
})

export class LeavingMessageCard implements OnInit {
	@Input()
	message: any;
	datePipe: DatePipe;
	constructor(private envDefaultConfig: EnvDefaultConfig, @Inject(LW_FILE_CODE) private fileCode) {
		this.datePipe = new DatePipe('en-US');
	}
	ngOnInit() {
		this.message.headImg  = this.envDefaultConfig.getServerUrl(this.fileCode.SHOW_IMG) + this.message.headImg;
	}
}
