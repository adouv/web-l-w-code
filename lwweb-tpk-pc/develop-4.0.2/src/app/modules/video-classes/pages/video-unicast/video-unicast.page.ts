import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { VideoClassesService } from '../../../../services/videos/video-classes.service';
import { PageService } from '../../../../services/page/page.service';
import { ScrollEvent } from 'ngx-scroll-event';
import { LwStorageService } from '../../../../common/cache/storage.service';




interface SelectData {
	classId: string;
	teacherId: string;
	subjectCode: string;
}

@Component({
	templateUrl: './video-unicast.page.html',
	styleUrls: ['./video-unicast.page.scss'],
	selector: 'video-unicast'
})

export class VideoUnicastPage implements OnInit {
	gradeList: any[]; // 年级列表
	classesList: any; // 班级列表
	subjectList: any; // 学科列表
	teacherList: any; // 老师列表
	unicastList: any[] = []; // 点播视频列表
	totalCount: number; // 总数
	pageIndex = 1;
	pageSize = 35;
	selectData: SelectData; // 保存条件选择数据
	isloadComplete = false; // 是否加载完成
	gradeId: string;
	selectIndex: number; // 选中页
	defaultMessage: any; // 缺省信息
	ishaveCondition = false; // 判断是否有条件，显示不同的缺省页

	isNoData: boolean = false;
	@ViewChild('unicastListEle') unicastListEle: ElementRef;
	rank: any;
	isScroll = false;
	currentGardenId: any;

	constructor(private router: Router, private videoClassesInterface: VideoClassesInterface,
		private activatedRoute: ActivatedRoute,
		private videoClassesService: VideoClassesService,
		private lwStorageService: LwStorageService,
	) {
		this.gradeId = '';
		this.selectData = {
			classId: '',
			teacherId: '',
			subjectCode: ''
		};
		this.selectIndex = 0;
		this.rank = { page: PageService.setPageParams(1, 35), list: [], loaded: false, total: 0 };
		this.subjectList = {};
		this.subjectList.isloadComplete = false;
		this.subjectList.data = [];
		this.teacherList = {};
		this.teacherList.isloadComplete = false;
		this.teacherList.data = [];
		this.classesList = {};
		this.classesList.isloadComplete = false;
		this.classesList.data = [];
		this.isScroll = false;
	}

	ngOnInit() {
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id

		this.getRouteParam();
		this.getGradeUseGarden();


	}

	selectedClass(event) {
		this.pageIndex = 1;
		this.selectData.classId = event === '' ? '' : event.id;
		this.selectData.teacherId = '';
		this.selectData.subjectCode = '';
		this.isloadComplete = false;
		this.ishaveCondition = !(this.selectData.classId === '' && this.selectData.subjectCode === '' && this.selectData.teacherId === '');
		this.rank.page = PageService.setPageParams(1, this.pageSize);
		this.rank.list = [];
		this.getTeacherList(this.gradeId);
		this.getSubjectList(this.gradeId);
		this.getUnicastList();
	}

	selectedSubject(event) {
		this.pageIndex = 1;
		this.selectData.subjectCode = event === '' ? '' : event.id;
		this.isloadComplete = false;
		this.ishaveCondition = !(this.selectData.classId === '' && this.selectData.subjectCode === '' && this.selectData.teacherId === '');
		this.rank.page = PageService.setPageParams(1, this.pageSize);
		this.rank.list = [];
		this.getTeacherList(this.gradeId);
		this.getUnicastList();
	}

	selectedTeacher(event) {
		this.pageIndex = 1;
		this.selectData.teacherId = event === '' ? '' : event.id;
		this.isloadComplete = false;
		this.ishaveCondition = !(this.selectData.classId === '' && this.selectData.subjectCode === '' && this.selectData.teacherId === '');
		this.rank.page = PageService.setPageParams(1, this.pageSize);
		this.rank.list = [];
		this.getSubjectList(this.gradeId);
		this.getUnicastList();
	}

	/**
	 * 根据园区找班级
	 */
	private getGradeUseGarden() {
		this.videoClassesInterface.getAttentionGrade({ gardenId: this.currentGardenId }).subscribe(res => {
			if (res.length > 0) {
				this.gradeList = res;
				for (let i = 0; i < res.length; i++) {
					if (res[i].id === this.gradeId) {
						this.selectIndex = i;
					}
				}
				if (!this.gradeId) {
					this.gradeId = this.gradeList[0].id;
				}
				this.getClassesList(this.gradeId);
				this.getSubjectList(this.gradeId);
				this.getTeacherList(this.gradeId);
				this.getUnicastList();
			}
		});
	}

	/**
	 * 切换班级
	 * @param index
	 */
	changeClass(index) {
		// debugger
		if (this.selectIndex !== index) {
			this.isloadComplete = false;
			this.unicastList = [];
			this.selectIndex = index;
			this.gradeId = this.gradeList[index].id;
			this.pageIndex = 1;
			this.selectData = {
				classId: '',
				teacherId: '',
				subjectCode: ''
			};
			this.rank.page = PageService.setPageParams(1, this.pageSize);
			this.rank.list = [];
			this.getClassesList(this.gradeId);
			this.getSubjectList(this.gradeId);
			this.getTeacherList(this.gradeId);
			this.getUnicastList();
		}

	}

	/**
	 * 获取班级列表
	 */
	private getClassesList(gradeId) {
		this.classesList.isloadComplete = false;
		this.videoClassesInterface.getAttentionClassesList({ gradeId: gradeId }).subscribe(res => {
			this.classesList.isloadComplete = true;
			this.classesList.data = res;
		});
	}

	/*
	*
	* 获取学科列表
	*
	* */
	private getSubjectList(gradeId) {
		this.subjectList.isloadComplete = false;
		this.videoClassesInterface.getSubjectList({
			gradeId: gradeId,
			classId: this.selectData.classId,
			teacherId: this.selectData.teacherId,
			gardenId: this.currentGardenId,
		}).subscribe(res => {
			this.subjectList.isloadComplete = true;
			this.subjectList.data = res;
		});
	}

	/*
	*
	* 获取老师列表
	*
	* */
	private getTeacherList(gradeId) {
		this.teacherList.isloadComplete = false;
		this.videoClassesInterface.getTeacherList({
			gradeId: gradeId,
			classId: this.selectData.classId,
			subjectCode: this.selectData.subjectCode,
			gardenId: this.currentGardenId,
		}).subscribe(res => {
			this.teacherList.isloadComplete = true;
			this.teacherList.data = [];
			for (const t of res) {
				this.teacherList.data.push({
					id: t.id,
					name: t.name
				});
			}
		});
	}
	changeList($event?, record?) {
		if (record && record.page.size < record.total) {    // 滚动加载
			record.page.size = record.page.size + 35;
			this.getUnicastList();
		}

		// 滚动加载
		//  this.rank.page = PageService.setPageParams(++this.pageIndex, this.pageSize);
		//  this.getUnicastList();
	}
	/*
	*
	* 获取点播视频列表
	* */
	private getUnicastList() {
		this.isScroll = true;
		this.videoClassesService.getUnicastListForPermission({
			...this.rank.page,
			gradeId: this.gradeId,
			classId: this.selectData.classId,
			teacherId: this.selectData.teacherId,
			subjectCode: this.selectData.subjectCode,
			gardenId: this.currentGardenId,
		}, (data, totalCount) => {
			console.log(data.length);
			this.isloadComplete = true;
			//this.isScroll = true;
			// this.unicastList = data;
			// this.rank.list = data;
			if (data.length <= 0) {
				this.isNoData = true;
			} else {
				this.isNoData = false;
			}
			this.unicastList = this.unicastList.concat(data);
			this.rank.list = this.rank.list.concat(data);
			this.rank.list = this.rank.list.map(item => {
				return Object.assign({}, item, { gradeClass: `${item.gradeName}${item.className}` })
			})
			this.isScroll = true;
			this.rank.total = totalCount;
			this.totalCount = totalCount;

			// this.unicastListEle.nativeElement.scrollTop = 0;
			if (!this.ishaveCondition) {
				this.defaultMessage = {
					title: '暂无课程录制',
					imgName: 'no-course.png'
				};
			} else {
				this.defaultMessage = {
					title: '您的筛选条件无结果，请重新选择',
					imgName: 'no-course.png'
				};

			}

			this.isScroll = false;
		});
	}

	changePage(index) {
		if (this.pageIndex !== index) {
			this.pageIndex = index;
			this.getUnicastList();
		}
	}

	goDetail(video) {
		if (video.hasPermission) {
			this.router.navigate(['video/unicast/' + video.id], {
				queryParams: {
					teacherId: this.selectData.teacherId,
					classId: this.selectData.classId,
					subjectCode: this.selectData.subjectCode,
					gradeId: this.gradeId,
					from: "playBack"
				}
			});
			window.localStorage.setItem("from", "playBack");
		}
	}

	/**
	 * 获取路由参数
	 */
	private getRouteParam() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.selectData.classId = res.classId;
			this.selectData.teacherId = res.teacherId;
			this.selectData.subjectCode = res.subjectCode;
			this.gradeId = res.gradeId;
		}, (error) => {
			console.log(error);
		});
	}
	/**
	 * 返回列表
	 * */
	goVideoBack() {
		this.router.navigate(['/video/index'], {});
	}

	getScroll(evt) {
		this.handleScroll(evt);
	}

	handleScroll(event) {
		// let sTop = event['currentTarget'].scrollTop;
		// let cHeight = event['currentTarget'].clientHeight;
		// let offsetHeight = this.unicastListEle.nativeElement.offsetHeight;
		// if (offsetHeight - (event) <= 30 && this.isScroll) {
		//     if ((Math.ceil( this.rank.total / 40)) == 1) {
		//         return
		//     }
		//     if (this.rank.page.index < (Math.ceil( this.rank.total / 40))) {
		// 			this.changeList();
		// 			this.isScroll = false;
		//     }
		// }

		this.isScroll = true;
		this.changeList();

	}
}
