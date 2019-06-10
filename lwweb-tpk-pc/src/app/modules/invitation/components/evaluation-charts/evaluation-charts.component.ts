import {Component, Input, OnChanges} from '@angular/core';
import {NgxEchartsService} from 'ngx-echarts';
import {InvitationInterface} from '../../services/invitation.interface';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'evaluation-charts',
	templateUrl: 'evaluation-charts.component.html',
	styleUrls: ['evaluation-charts.component.scss']
})
/*export class EvaluationChartsComponent implements OnChanges {

	chartsOptions: any;

	type = 0;

	@Input() totalScore = 0;

	@Input() avgScore = 0;

	@Input() chartData: any[];

	commentList = [];
	@Input()
	set comments(comments) {
		const arr = [];
		comments.forEach(item => {
			if (item.comment) {
				arr.push(item);
			}
		});
		this.commentList = arr;
	}

	constructor(private chartsService: NgxEchartsService) {
		this.initCharts();
	}

	ngOnChanges() {
		if (this.chartData && this.chartData.length > 0) {
			this.chartsOptions.radar.indicator = [];
			const itemAvgScore = [];
			this.chartData.forEach(item => {
				this.chartsOptions.radar.indicator.push({
					name: item.itemName,
					max: item.itemScore,
				});
				itemAvgScore.push(item.itemObtainedAvg);
				// this.totalScore += parseInt(item.itemObtainedAvg, 0);
			});
			// this.avgScore = (this.totalScore / this.chartData.length).toFixed(2);
			this.chartsOptions.series[0].data[0].value = itemAvgScore;
			setTimeout(() => {
				const charts = document.getElementById('echarts');
				this.chartsService.getInstanceByDom(charts).resize();
			});
		}
	}

	initCharts() {
		this.chartsOptions = {
			tooltip: {
				formatter: (params, ticket, callback) => {
					let result = params.name;
					for (let i = 0; i < this.chartsOptions.radar.indicator.length; i++) {
						result += '<br>' + this.chartsOptions.radar.indicator[i].name + ' : ' + params.value[i];
					}
					return result;
				}
			},
			color: ['#ff553f', '#ffcf25'],
			legend: {
				data: [{
					name: '我的平均分',
					textStyle: {
						color: '#333333'
					}
				}/!*, {
					name: '年级平均分',
					textStyle: {
						color: '#333333'
					}
				}*!/],
				bottom: '0',

			},
			radar: {
				name: {
					textStyle: {
						color: '#999',
						borderRadius: 3,
						padding: [3, 5]
					}
				},
				radius: '50%',
				indicator: [
					// {name: '教学目标', max: 6500},
					// {name: '教学技能', max: 16000},
					// {name: '教学能力', max: 30000},
					// {name: '教学活动', max: 38000},
					// {name: '教学方式', max: 52000},
				]
			},
			series: [{
				type: 'radar',
				data: [
					{
						value: [],
						name: '我的平均分',

					},
					{
						value: [],
						name: '年级平均分',
					}
				]
			}]
		};
	}
}*/

export class EvaluationChartsComponent {

	@Input() data: any;

	@Input() type: number;

	commentList = [];

	tabType = 0;

	subjectList = [];

	chartData: any;

	hiddenReply: boolean;

	constructor(private invitationInterface: InvitationInterface,
				private messageService: NzMessageService,
				private router: ActivatedRoute) {
		setTimeout(() => {
			this.getStatisticsSubjective();
			this.getStatisticsObjective();
			this.getStatisticsResult();
			this.router.params.subscribe((param) => {
				if (param.type === '1') {
					this.hiddenReply = true;
				}
			});
		}, 0);
	}

	getStatisticsObjective() {
		this.invitationInterface.getStatisticsObjective(this.data.id).subscribe((data) => {
			this.chartData = data;
		});
	}

	getStatisticsSubjective() {
		this.invitationInterface.getStatisticsSubjective(this.data.id).subscribe((data) => {
			this.subjectList = data;
			this.subjectList.forEach(arr => {
				arr.commentSubjectiveVoList.forEach(item => {
					item.btnDebunce = true;
				})
			})
		});
	}

	getStatisticsResult() {
		this.invitationInterface.getStatisticsResult(this.data.id).subscribe((data) => {
			const arr = [];
			data.forEach(item => {
				if (item.comment) {
					arr.push(item);
				}
			});
			this.commentList = arr;
		});
	}

	submitReply(item) {
		item.btnDebunce = false;
		const params = {
			subjectiveId: item.id,
			content: item.replyContent
		};
		this.invitationInterface.postStatisticsReplyMsg(params).subscribe((data) => {
			this.messageService.success('提交成功！');
			this.getStatisticsSubjective();
		},error => item.btnDebunce = true);
	}
}
