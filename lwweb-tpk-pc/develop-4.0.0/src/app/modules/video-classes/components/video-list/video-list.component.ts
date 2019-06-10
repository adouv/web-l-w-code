import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {VideoClassesService} from '../../../../services/videos/video-classes.service';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import { AccountService } from '../../../../services/account/account.service';


@Component({
	selector: 'video-set',
	templateUrl: './video-list.component.html',
	styleUrls: ['./video-list.component.scss']
})

export class VideoListComponent implements OnInit {
	@Input() videoDetails: any;
	@ViewChild('scrollTop') scrollTop: ElementRef;
	selectedClass: any;
	videoSets: Array<any> = [];
	oldSelectVal: any;
	countClasses: { name: string; id: string; }[] = [];
	loadComplete=false;
	type: any = localStorage.getItem('from');   // 判断我关注的课/我的课

	constructor(private videoClassesService: VideoClassesService,
				private videoClassesInterface: VideoClassesInterface,
				private router: Router,
				private account: AccountService,
				) {
	}

	ngOnInit() {
		console.log("视频集接组件收到videoDetails",this.videoDetails);
		// this.getClassesByTeacher();
		// 获取视频集
		this.getUnicastList( this.videoDetails.classId);
	}



	// 获得视频集
	private getUnicastList(id) {
		let requestParam={
			subjectCode: this.videoDetails.subjectCode,
			gradeId: this.videoDetails.gradeId,
			classId: this.videoDetails.classId,
			gardenId: localStorage.getItem('s_gardenId'),
		}
		if(this.type === 'focusLessons') {
			requestParam = Object.assign({}, requestParam, {accountId: this.account.getAccountId()});
		}else if(this.type === 'myLessons') {
			requestParam = Object.assign({}, requestParam, {teacherId: this.videoDetails.teacherId});
		}
		this.videoClassesService.getUnicastList(requestParam, (data) => {
			this.loadComplete=true;
			this.videoSets = data;
			if(this.type === 'myLessons') {
				this.videoSets.forEach((item,index) => {
					if(item.id === this.videoDetails.id) {
						console.log(this.scrollTop.nativeElement.scrollTop)
						this.scrollTop.nativeElement.scrollTop =  `${40 * index}px`;
						console.log(this.scrollTop.nativeElement.scrollTop)
					}
				})
			}
		});
	}

	// 获得下拉数据
	private getClassesByTeacher() {
		this.videoClassesInterface.getClassesByTeacher(this.videoDetails.teacherId).subscribe(data => {
			this.countClasses = data;
			if (data.length > 0) {
				for (const clazz of data) {
					if (clazz.id === this.videoDetails.classId) {
						this.selectedClass = clazz;
					}
				}
				this.getUnicastList(this.videoDetails.classId);
			}
		});
	}

	// 更新页面
	playVideo(video) {
		if (video.hasPermission) {
			this.router.navigate(['/video/unicast/' + video.id],{
				queryParams: {
					subjectCode: video.subjectCode,
					gardenId: video.gardenId,
					gradeId: video.gradeId,
					classId: video.classId,
					teacherId: video.teacherId
				}
			});
		}
	}

	// 根据班级查询视频集
	searchVideoSet($event) {
		if (this.selectedClass && this.oldSelectVal !== this.selectedClass) {
			this.oldSelectVal = this.selectedClass;
			this.getUnicastList(this.selectedClass.id);
		}
	}
}
