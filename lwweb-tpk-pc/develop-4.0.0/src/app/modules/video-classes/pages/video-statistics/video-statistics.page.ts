import {Component, OnInit} from '@angular/core';
import {VideoEvaluationComponent} from '../../components';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoClassesService} from '../../../../services/videos/video-classes.service';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {LwStorageService} from '../../../../app.export';
import {VideoRankingComponent} from '../../components';
import {DatePipe} from '@angular/common';
@Component({
	selector: 'page-video-statistics',
	templateUrl: './video-statistics.page.html',
	styleUrls: ['./video-statistics.page.scss']
})

export class VideoStatisticsPage implements OnInit {
	videoTabs: any[] = [
		{label: '评价分析', component: VideoRankingComponent},
		{label: '教学反思', component: VideoEvaluationComponent},
		{label: '教学评价', component: VideoEvaluationComponent}
	];
	videoDetails: any;
	tabInputs: Array<any>;
	videoid: any;
	routerParams: any = {};

	constructor(private activatedRoute: ActivatedRoute,
				private videoClassesService: VideoClassesService,
				private videoClassesInterface: VideoClassesInterface,
				private storageService: LwStorageService,
				private datePipe: DatePipe,
				private router: Router) {
		this.videoid = this.activatedRoute.snapshot.params['id'];
	}

	ngOnInit() {
		this.getRouteParam();
		if (this.videoid == 'home') {
			// this.videoid = this.activatedRoute.snapshot.params['id'];
			this.getUnicastDeatails();
		} else {
			this.getUnicastDetailsById(this.videoid);
		}
	}

	// 获得点播详情
	private getUnicastDetailsById(id) {
		this.videoClassesService.getUnicastDetails(id, (data) => {
			this.videoDetails = data[0];
			this.tabInputs = [
				{
					videoDetails: this.videoDetails,
					type: 1
				},
				{
					videoDetails: this.videoDetails,
					type: 1
				},
				{
					videoDetails: this.videoDetails,
					type: 0
				}
			];
		});
	}

	private getUnicastDeatails() {
		this.videoClassesService.getUnicastDetailsByClassAndTime({
			classId: this.routerParams.classId,
			giveLessonTime: this.datePipe.transform(this.routerParams.giveLessonTime, 'yyyy-MM-dd HH:mm:ss')
		}, (data)=> {
			this.videoDetails = data[0];
			console.log(data);
			this.tabInputs = [
				{
					videoDetails: this.videoDetails,
					type: 3
				},
				{
					videoDetails: this.videoDetails,
					type: 1
				},
				{
					videoDetails: this.videoDetails,
					type: 0
				}
			];
			this.videoid = this.videoDetails.id;
		});
	}

	goJump() {
		this.getRouteParam();
		this.router.navigate(['video/unicast/'], {
			queryParams: {
				classId: this.routerParams.classId,
				subjectCode: this.routerParams.subjectCode,
				teacherId: this.routerParams.teacherId,
				gradeId: this.routerParams.gradeId
			}
		});
	}

	/**
	 * 获取路由参数
	 */
	private getRouteParam() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.routerParams.teacherId = res.teacherId;
			this.routerParams.subjectCode = res.subjectCode;
			this.routerParams.classId = res.classId;
			this.routerParams.gradeId = res.gradeId;
			this.routerParams.giveLessonTime = res.giveLessonTime;
		}, (error) => {
			console.log(error);
		});
	}
}
