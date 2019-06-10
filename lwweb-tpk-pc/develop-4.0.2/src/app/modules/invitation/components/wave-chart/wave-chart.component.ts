import {Component, ViewChild, ElementRef, OnInit, Input} from '@angular/core';

@Component({
	selector: 'wave-chart',
	templateUrl: './wave-chart.component.html',
	styleUrls: ['./wave-chart.component.scss']
})

export class WaveChartComponent implements OnInit{
	@ViewChild('fillColorEle') fillColorEle: ElementRef;
	@Input() percent: any;
	@Input() chartTitle: string;
	constructor() {
		this.percent = '60%';
	}
	ngOnInit() {

	}
}