import {Component, Input, OnInit} from '@angular/core';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {FileDownloadService} from '../../../../services/file/file-download.service';
import {NgxEchartsService} from 'ngx-echarts';
@Component({
	selector: 'video-ranking',
	templateUrl: 'video-ranking.component.html',
	styleUrls: ['video-ranking.component.scss']
})


export class VideoRankingComponent implements OnInit {
	chartOption: any;
	@Input() videoDetails: any;
	@Input() type: number;
	courseCommentAnalysis: any;
	indes: any;
	isHaveContent = false;

	constructor(private echartsService: NgxEchartsService, private videoClassesInterface: VideoClassesInterface, private fileDownloadService: FileDownloadService) {
		this.initConfig();
	}

	ngOnInit() {
		this.getCourseCommentAnalysis();
	}

	getCourseCommentAnalysis() {
		this.videoClassesInterface.getCourseCommentAnalysis({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime
		}).subscribe((data)=> {
			console.log(data);
			this.isHaveContent = data.gradeAvg != null && data.oneselfAvg != null;
			this.courseCommentAnalysis = data;
			this.chartOption.radar.indicator = [];
			for (let i = 0; i < data.itemList.length; i++) {
				this.chartOption.radar.indicator.push({
					name:  data.itemList[i].name,
					max: data.itemList[i].score,

				});
			}

			this.chartOption.series[0].data[0].value = data.oneselfAvg;
			this.chartOption.series[0].data[1].value = data.gradeAvg;
			setTimeout(()=> {
				if (document.getElementById('echarts')) {
					this.indes = this.echartsService.getInstanceByDom(document.getElementById('echarts'));
					this.indes.resize();
				}
			})
		})
	}

	exportFile() {
		// console.log(this.indes.getDataURL());
		this.videoClassesInterface.analysisDoc({
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime,
			imageFile:(<HTMLCanvasElement>document.querySelector('.demo-chart canvas')).toDataURL().split(',')[1]
		}).subscribe((data)=> {
			this.fileDownloadService.downloadFile({
				name: data.fileName,
				path: '',
				title: '导出成功'
			}, data.serverUrl + '?fileName=' + data.fileId)
		})
	}

	// 初始化雷达图
	initConfig() {
		this.chartOption = {
			tooltip: {
				formatter: (params, ticket, callback)=> {
					let result = params.name;
					for (let i = 0; i < this.chartOption.radar.indicator.length; i++) {
						result += "<br>" + this.chartOption.radar.indicator[i].name + " : " + params.value[i];
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
				},{
					name: '年级平均分',
					textStyle: {
						color: '#333333'
					}
				}],
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
				radius:'50%',
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
		}
	}
}