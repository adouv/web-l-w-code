import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'exercises-card',
	templateUrl: './exercises-card.html',
	styleUrls: ['./exercises-card.scss']
})

export class ExercisesCard implements OnInit, OnChanges {
	cardStatus: boolean;
	@Input() data: any; // 渲染的数据
	@Input() index: number; // 索引
	@Output() statusChange: EventEmitter<any> = new EventEmitter(); // 选中当前习题的状态事件
	@Output() showDetails: EventEmitter<any> = new EventEmitter(); // 展示做题
	@Input() config: any; // config { showExercises: '是否是仅展示习题 默认为false',
	// hiddenCheckBox: '是否隐藏前面checkbox 默认为false 显示' , data: {'需要传入的扩展参数'}}
	isShowAnswer: boolean; // 初始化默认是否展示答案
	constructor(private router: Router) {
		this.config = {};
		this.cardStatus = false;
		this.isShowAnswer = false;
	}

	ngOnInit() {
		console.log(this.config);
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log(this.data);
	}

	cardStatusChange($event) {
		this.statusChange.emit({
			status: $event
		});
	}

	// 跳转习题详情
	goToStatistics(disable) {
		if (disable) return;
		this.router.navigate(['resource/home/-1/statistics', this.config.data.outlineId], {
			queryParams: {
				subjectCode: this.config.data.subjectCode,
				title: this.config.data.courseTitle,
				exercisesId: this.data.id,
				gradeCode: this.config.data.gradeCode
			}
		});
	}

	showExerciseDetails(type) {
		// data.status = true;
		this.showDetails.emit({
			type: type,
			data: this.data
		});
	}

	showAnswer() {
		this.isShowAnswer = !this.isShowAnswer;
	}

}
