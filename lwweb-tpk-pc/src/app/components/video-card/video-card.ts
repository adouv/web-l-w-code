import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'video-card',
	templateUrl: './video-card.html',
	styleUrls: ['./video-card.scss']
})

export class VideoCardComponent implements OnInit {
	@Input()
	video: any;

	@Output() vclick = new EventEmitter();

	@Input() isDisabled = true;

	@Input() actived = false;

	@Input() selectedIndex = 0;

	@Input() lastIndex = 0;

	constructor() {
	}

	ngOnInit() {
		this.video.totalClicks = this.video.totalClicks === 0 ? '0' : this.video.totalClicks;
	}

	onClick(item) {
		this.vclick.emit(this.video);
	}
}
