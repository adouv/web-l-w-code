import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgxEchartsService} from 'ngx-echarts';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';
@Component({
	selector: 'app-exercises-statistics',
	templateUrl: './exercises-statistics.page.html',
	styleUrls: ['./exercises-statistics.page.scss']
})

export class ExercisesStatisticsPage {
	courseTitle: any;
	statistics: any;
	statisticsChecked: any;
	exercisesClassChecked: any; // 选中的班级
	oldExercisesClassChecked: any;// 上一次选中的班级
	outlineId: any;
	subjectCode: any;
	chartOption: any;
	indes: any;
	exercisesId: any;
	exercisesClasses: any;
	data: any;// 统计数据
	gradeCode: any;
	times: any;
	timesChecked: any;
	oldTimesChecked: any;

	constructor(private echartsService: NgxEchartsService, private router: Router, private activatedRoute: ActivatedRoute, private resourceClassesInterface: ResourceClassesInterface) {
		this.statistics = [];
		this.times = [];
		this.data = {};
		this.getRouteParam();
		this.getExerciseRecordTimes();
	}

	statisticsChange() {

	}

	goBack() {
		this.router.navigate(['resource/home/-1/info', this.outlineId], {
			queryParams: {
				subjectCode: this.subjectCode,
				title: this.courseTitle,
				gradeCode: this.gradeCode
			}
		});
	}

	private getRouteParam() {
		this.outlineId = this.activatedRoute.snapshot.params['id'];
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.subjectCode = queryParams.subjectCode;
			this.courseTitle = queryParams.title;
			this.exercisesId = queryParams.exercisesId
			// this.exercisesId = '115';
			this.gradeCode = queryParams.gradeCode;
		});
	}

	getExercisesDetals() {

		this.resourceClassesInterface.getExercisesDetails({
			exerciseOutlineId: this.exercisesId,
			classId: this.exercisesClassChecked.classId,
			num: this.timesChecked
		}).subscribe((data)=> {
			this.data = data;
			this.chartOption = {
				tooltip: {
					trigger: 'item',
					formatter: "{b}:{c}"
				},
				series: [
					{
						name: '',
						type: 'pie',
						radius: ['40%', '55%'],
						label: {
							normal: {
								formatter: '{b}：{c}',
							}
						},
						data: []
					}
				]
			};
			for (let i = 0; i < this.data.answers.length; i++) {
				this.chartOption.series[0].data.push({
					name: this.data.answers[i].option,
					value: this.data.answers[i].users.length
				});
			}
			setTimeout(()=> {
				console.log(this.chartOption);
				this.indes = this.echartsService.getInstanceByDom(document.getElementById('echarts'));
				this.indes.resize();
			});
		})
	}

	getExerciseRecordTimes() {
		this.resourceClassesInterface.getExerciseRecordTimes({
			exerciseOutlineId: this.exercisesId
		}).subscribe((data)=> {
			console.log(data);
			this.exercisesClasses = data;
			if (this.exercisesClasses.length > 0) {
				this.exercisesClassChecked = this.exercisesClasses[0];
				console.log(this.exercisesClassChecked);
				this.times = this.exercisesClassChecked.times;
				this.timesChecked = this.times[0];
				this.getExercisesDetals();
			}
		})
	}

	// 班级改变事件
	exercisesClassesChange() {
		if (this.exercisesClassChecked && this.oldExercisesClassChecked !== this.exercisesClassChecked) {
			this.oldExercisesClassChecked = this.exercisesClassChecked;
			this.times = this.exercisesClassChecked.times;
			this.timesChecked = this.times[0];
			this.getExercisesDetals();
		}

	}

	timesChange() {
		if (this.timesChecked && this.oldTimesChecked !== this.timesChecked) {
			this.oldTimesChecked = this.timesChecked;
			this.getExercisesDetals();
		}
	}
}