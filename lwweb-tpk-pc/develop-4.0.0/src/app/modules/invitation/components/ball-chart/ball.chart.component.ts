import {Component, OnInit, Input} from '@angular/core';
import set = Reflect.set;

@Component({
	selector: 'app-ball',
	template: `
		<div style="position: relative;">
		<div style="width: 250px;height: 250px;" echarts [options]='echartOption'
			 (chartInit)='onChartInit($event)'></div><img [ngStyle]="fillimgs.style" src="{{fillimgs.src}}" /></div>`
})

export class BallChartComponent implements OnInit {
	echartOption: any;
	@Input() healthDegree: number;
	@Input() totalScore: number;
	fillColor: any; // 水波的渐变颜色
	fillColorConfig: any; // 水球的填充颜色
	fillimgs: any;
	constructor() {
		this.healthDegree = 0.65;
	}

	onChartInit(ec) {
		// 先出波纹再出数字
		setTimeout(() => {
			ec.setOption({
				series: [{
					// 文字样式设置
					label: {
						normal: {
							color: '#333',
							insideColor: '#333',
						},
					}
				}]
			});
		}, 2500);

		// 处理当分数是0不能点击 跟踪整个画布事件
		ec.getZr().on('click', (e) => {
			if (e.target) {
				// window.open('scene/list/health');
			}
		});
	}

	ngOnInit() {
		this.computerColor();
		this.getBallChart();
	}



	/**
	 * 得到球图
	 */
	private getBallChart() {
		this.echartOption = {
			series: [{
				data: [this.healthDegree, {
					value: this.healthDegree,
					phase: Math.PI
				}],
				type: 'liquidFill',
				phase: 0, // 弧度系统中的波浪阶段
				period: 5000, // 向前移动一个波长需要的毫秒数
				amplitude: '5%', // 幅度
				waveLength: '100%', // 波长
				animationDurationUpdate: 2000, // 更新动画
				center: ['50%', '30%'], // 位置
				radius: '60%', // 半径
				color: this.fillColorConfig, // 填充颜色
				// 容器样式设置
				backgroundStyle: {
					color: '#fff',
					// 边框颜色用渐变颜色里浅的
					borderColor: this.fillColor.startColor,
					borderWidth: 1,
				},
				// 外边框样式设置
				outline: {
					show: false,
				},
				itemStyle: {
					opacity: 0.95,
					shadowBlur: 0,
					shadowColor: 'rgba(0, 0, 0, 0.4)'
				},
				// 文字样式设置
				label: {
					normal: {
						formatter: (param) => {
							return this.totalScore + '{smallFont|分}';
						},
						show: true,
						color: '#333',
						insideColor: '#333',
						fontSize: 44,
						fontWeight: 'bold',
						// align: 'bottom',
						baseline: 'middle',
						rich: {
							smallFont: {
								fontSize: 14,
								verticalAlign: 'bottom',
								// padding: [10, -30, 10, 10]
							}
						}
					},
				}
			}]
		};
	}

	/**
	 * 根据分数计算水球的颜色
	 */
	private computerColor() {
		// （1）80≤系统总健康度得分≤100  对应外部颜色：绿色；
		// （2）70≤系统总健康度得分＜80  对应外部颜色：黄色；
		// （3）60≤系统总健康度得分＜70 对应外部颜色：棕色；
		// （4）0≤系统总健康度得分＜60 对应外部颜色：红色；
		if (this.healthDegree >= 0.8 && this.healthDegree <= 1) {
			this.fillColor = {
				startColor: '#deff6a',
				endColor: '#7ce052',
			};
			this.fillimgs = {
				src:'../../../../../assets/images/qiu4.png',
				style: {
					'position':' absolute',
					'top':'-6px',
					'left':'15px'
				}
			};
		} else if (this.healthDegree >= 0.7 && this.healthDegree < 0.8) {
			this.fillColor = {
				startColor: '#91dbfd',
				endColor: '#00a0e9',
			};
			this.fillimgs = {
				src:'../../../../../assets/images/qiu3.png',
				style: {
					'position':' absolute',
					'top':'-4px',
					'left':'15px'
				}
			};
		} else if (this.healthDegree >= 0.6 && this.healthDegree < 0.7) {
			this.fillColor = {
				startColor: '#ffec86',
				endColor: '#eea930',
			};
			this.fillimgs = {
				src:'../../../../../assets/images/qiu2.png',
				style: {
					'position':' absolute',
					'top':'1px',
					'left':'15px'
				}
			};
		} else if (this.healthDegree >= 0 && this.healthDegree < 0.6) {
			this.fillColor = {
				startColor: '#ffa2df',
				endColor: '#fa2121',
			};
			this.fillimgs = {
				src:'../../../../../assets/images/qiu1.png',
				style: {
					'position':' absolute',
					'top':'4px',
					'left':'15px'
				}
			};
		}
		this.fillColorConfig = [{
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0.69,
			y2: 0,
			colorStops: [{
				offset: 0, color: this.fillColor.startColor // 0% 处的颜色
			}, {
				offset: 1, color: this.fillColor.endColor // 100% 处的颜色
			}],
			globalCoord: false // 缺省为 false
		}];
	}
}
