import {Component, Output, EventEmitter, Input, OnInit, OnChanges, ViewChild, ElementRef} from '@angular/core';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';

@Component({
	templateUrl: './exercises-details.component.html',
	styleUrls: ['./exercises-details.component.scss'],
	selector: 'exercises-details'
})

export class ExercisesDetailsComponent implements OnInit, OnChanges {
	@Output() btnClick: EventEmitter<any> = new EventEmitter();
	@Input() data: any;
	@Input() type: any;
	currentData: any;
	allData: any;
	@ViewChild('answerHtml') answerHtml: ElementRef;
	@ViewChild('scrollBar') scrollBar: ElementRef;
	answerStatus: boolean;

	constructor(private resourceClassesInterface: ResourceClassesInterface) {
		this.data = [];
		this.currentData = {};
		this.answerStatus = false;
		this.allData = [];
	}

	ngOnInit() {
		// this.getExerciseOutlineList();
	}

	ngOnChanges() {
		console.log(this.data);
		if (this.data.length > 0) {
			this.getExerciseOutlineList();
		}
	}

	goBack() {
		this.btnClick.emit({
			btnType: 'back',
		});
	}

	getExerciseOutlineList() {
		this.resourceClassesInterface.getExerciseOutlineList({
			ids: this.data.join(',')
		}).subscribe((data) => {
			this.allData = data;
			for (let i = 0; i < this.allData.length; i++) {
				this.allData[i].index = i;
			}
			this.currentData = data[0];
		});
	}

	// 下一题
	nextExercises(index, disbale) {
		if (disbale) return;
		this.currentData = this.allData[index + 1];
		this.answerStatus = false;
		this.scrollBar.nativeElement.scrollTop = 0;
	}

	// 上一题
	prevExercises(index, disbale) {
		if (disbale) return;
		this.currentData = this.allData[index - 1];
		this.answerStatus = false;
		this.scrollBar.nativeElement.scrollTop = 0;
	}

	showAnswer() {
		this.answerStatus = !this.answerStatus;
		if(!this.answerStatus){
			this.scrollBar.nativeElement.scrollTop = 0;
		}else{
			setTimeout(()=>{
				const offsetHeight = this.getXy(this.answerHtml.nativeElement).y;
				this.scrollBar.nativeElement.scrollTop = offsetHeight;
			})
		}
	}

	getXy(element) {
		let x = 0, y = 0;
		while (element.offsetParent) {
			y += element.offsetTop;
			x += element.offsetLeft;
			element = element.offsetParent;
		}
		return {'x': x, 'y': y};
	}
}
