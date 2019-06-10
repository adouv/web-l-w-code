import { Component, OnInit } from '@angular/core';
import { AnalysisInterface } from '../../services/analysis.interface';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LwStorageService } from '../../../../common/cache';

@Component({
	templateUrl: './analysis-home.page.html',
	styleUrls: ['./analysis-home.page.scss']
})
export class AnalysisHomePage implements OnInit {
	dateRange = '';
	condition = {
		gardenId: '',
		startDate: null,
		endDate: null
	};
	nowDate: string;
	beforeDate: string;
	statisticsPrepare: any;
	statisticsPrepareSomeList = [];
	tabCode = 'subject';
	currentGardenId: any;

	constructor(private analysisInterface: AnalysisInterface,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private lwStorageService: LwStorageService,
		private datePipe: DatePipe) {
	}

	ngOnInit() {
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;
		this.nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
		this.beforeDate = this.datePipe.transform(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
		this.condition.gardenId = this.currentGardenId;
		this.getRouterParams();
		this.getStatisticsPrepareAll();
		this.getStatisticsPrepareSomeList();
	}

	private getStatisticsPrepareAll() {
		this.analysisInterface.getStatisticsPrepareAll(this.condition).subscribe((data) => {
			this.statisticsPrepare = data;
		});
	}

	changeDate(event) {
		// console.log(event);
		// console.log(event[0]);
		// console.log(event[1]);
		// let dayStart = event[0].getFullYear();
		// if ((event[0].getMonth() + 1) < 10) {
		// 	dayStart += "-0" + (event[0].getMonth() + 1);
		// } else {
		// 	dayStart += "-" + (event[0].getMonth() + 1);
		// }
		// if (event[0].getDate() < 10) {
		// 	dayStart += "-0" + event[0].getDate();
		// } else {
		// 	dayStart += "-" + event[0].getDate();
		// }
		// let dayEnd = event[1].getFullYear();
		// if ((event[1].getMonth() + 1) < 10) {
		// 	dayStart += "-0" + (event[1].getMonth() + 1);
		// } else {
		// 	dayStart += "-" + (event[1].getMonth() + 1);
		// }
		// if (event[1].getDate() < 10) {
		// 	dayStart += "-0" + event[1].getDate();
		// } else {
		// 	dayStart += "-" + event[1].getDate();
		// }

		// this.dateRange = event ? event : '';
		// this.condition.startDate = event ? dayStart : this.beforeDate;
		// this.condition.endDate = event ? dayEnd : this.beforeDate;
		// this.getStatisticsPrepareAll();
		// this.getStatisticsPrepareSomeList();


		this.dateRange = event ? event : '';
		const dateArr = event.split(' ~ ');
		this.condition.startDate = event ? dateArr[0] : this.beforeDate;
		this.condition.endDate = event ? dateArr[1] : this.beforeDate;
		this.getStatisticsPrepareAll();
		this.getStatisticsPrepareSomeList();
	}

	private getStatisticsPrepareSubject() {
		this.analysisInterface.getStatisticsPrepareSubject(this.condition).subscribe((data) => {
			this.statisticsPrepareSomeList = data;
		});
	}

	private getStatisticsPrepareGrade() {
		this.analysisInterface.getStatisticsPrepareGrade(this.condition).subscribe((data) => {
			this.statisticsPrepareSomeList = data;
		});
	}

	private getStatisticsPrepareSomeList() {
		if (this.tabCode === 'subject') {
			this.getStatisticsPrepareSubject();
		} else {
			this.getStatisticsPrepareGrade();
		}
	}

	changeTab(code) {
		this.tabCode = code;
		this.getStatisticsPrepareSomeList();
	}

	goToList(item) {
		this.router.navigate(['../list'], {
			queryParams: {
				startDate: this.condition.startDate,
				endDate: this.condition.endDate,
				firstStartDate: this.condition.startDate,
				firstEndDate: this.condition.endDate,
				subjectCode: this.tabCode === 'subject' ? item.id : '',
				gradeId: this.tabCode === 'grade' ? item.id : '',
			},
			relativeTo: this.activatedRoute
		});
	}

	getRouterParams() {
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.condition.startDate = queryParams.startDate || this.beforeDate;
			this.condition.endDate = queryParams.endDate || this.beforeDate;
			this.dateRange = !queryParams.startDate ||
				queryParams.startDate === this.beforeDate && queryParams.endDate === this.beforeDate
				? '' : this.condition.startDate + ' ~ ' + this.condition.endDate;
		});
	}
}
