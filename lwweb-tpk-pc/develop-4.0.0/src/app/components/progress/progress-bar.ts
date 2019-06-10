import {Component, Input} from '@angular/core';
import {ToPercentagePipe} from '../../pipes/percent/to-percentage.pipe';

@Component({
	selector: 'processBar',
	templateUrl: './progress-bar.html',
	styleUrls: ['./progress-bar.scss']
})
export class ProgressBarComponent {

	@Input()
	private progress: number;
	@Input()
	private allColor: string;
	@Input()
	private currColor: string;
	@Input()
	private progressWidth: number;
	@Input()
	private progressHeight: number;

	private radius: number;

	constructor() {
		this.progress = 0;
		this.allColor = '#eee';
		this.currColor = 'linear-gradient(90deg, #febb5c 0%, #ff7d55 100%), linear-gradient(#34383f, #34383f)';
		this.progressWidth = 260;
		this.progressHeight = 10;
	}

	getAll() {
		this.radius = this.progressHeight / 2;
		return {
			'background': this.allColor,
			'width': this.progressWidth + 'px',
			'height': this.progressHeight + 'px',
			'border-radius': this.radius + 'px',
		};
	}

	getCurr() {
		this.radius = this.progressHeight / 2;
		return {
			'background': this.currColor,
			'width': this.progress === 0 ? '0px' : this.progressWidth * new ToPercentagePipe().transform(this.progress, 2) / 10000 + 'px',
			'height': this.progressHeight + 'px',
			'border-radius': this.radius + 'px',
		};
	}
}
