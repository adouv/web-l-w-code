import { Component, ElementRef, OnInit, ViewChild ,Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { VideoClassesService } from '../../../../services/videos/video-classes.service';
import { PageService } from '../../../../services/page/page.service';
import { ScrollEvent } from 'ngx-scroll-event';
import { LwStorageService } from '../../../../common';


interface SelectData {
    classId: string;
    teacherId: string;
    subjectCode: string;
}


@Component({
    selector: 'video-task',
    templateUrl: 'video-task.page.html',
    styleUrls: ['video-task.page.scss']
})

export class VideoTaskPage implements OnInit {
    @Input() selectIndex: any;
    gradeList: any[]; // 年级列表
    classesList: any; // 班级列表
    subjectList: any; // 学科列表
    teacherList: any; // 老师列表
    unicastList: any[] = []; // 点播视频列表
    totalCount: number; // 总数
    pageIndex = 1;
    pageSize = 40;
    selectData: SelectData; // 保存条件选择数据
    isloadComplete = false; // 是否加载完成
    gradeId: string;
    //selectIndex: number; // 选中页
    defaultMessage: any; // 缺省信息
    ishaveCondition = false; // 判断是否有条件，显示不同的缺省页
    @ViewChild('unicastListEle') unicastListEle: ElementRef;
    rank: any;
    gardenId: any;
    accountId: any;
    videoQueryParams:any;

    page = {
        offset: 0,
        size: 40,
        page: 1,
	}
	isScroll = true;
	currentTotal = 0;

    constructor(private router: Router, private videoClassesInterface: VideoClassesInterface,
        private activatedRoute: ActivatedRoute,
        private videoClassesService: VideoClassesService,
        private lwStorageService: LwStorageService) {
        this.gradeId = '';
        this.selectData = {
            classId: '',
            teacherId: '',
            subjectCode: ''
        };
        //this.selectIndex = 0;
        this.rank = { page: PageService.setPageParams(1, this.pageSize), list: [], loaded: false, total: 0 };
        this.subjectList = {};
        this.subjectList.isloadComplete = false;
        this.subjectList.data = [];
        this.teacherList = {};
        this.teacherList.isloadComplete = false;
        this.teacherList.data = [];
        this.classesList = {};
        this.classesList.isloadComplete = false;
        this.classesList.data = [];
        this.videoQueryParams = {
            teacherId: this.selectData.teacherId,
            classId: this.selectData.classId,
            subjectCode: this.selectData.subjectCode,
            gradeId: this.gradeId,
            tabIndex: 1
        }
    }

    ngOnInit() {
        this.getRouteParam();
        this.getGradeUseGarden();
    }

    selectedClass(event) {
        this.pageIndex = 1;
		this.rank.page.size = this.pageSize;
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
		this.rank.page.size = this.pageSize;
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
		this.rank.page.size = this.pageSize;
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
        let params: any = {};
        params.gardenId = this.gardenId;
        this.videoClassesInterface.getTaskAttentionGrade(params).subscribe(res => {
            if (res.length > 0) {
                this.gradeList = res;
                // if (!this.gradeId) {
                //     this.gradeId = this.gradeList[0].id;
                // }
                // this.getClassesList(this.gradeId);
                // this.getSubjectList(this.gradeId);
                // this.getTeacherList(this.gradeId);
                this.getUnicastList();
            }else {
				this.isloadComplete = true;
			}
        });

    }

	/**
	 * 切换年级
	 * @param index
	 */
    changeClass(event) {
        this.isloadComplete = false;
        this.unicastList = [];
        //this.selectIndex = index;
        this.gradeId = event == "" ? "" : event.id;
        this.pageIndex = 1;
		this.rank.page.size = this.pageSize;
        this.selectData = {
            classId: '',
            teacherId: '',
            subjectCode: ''
        };

        if (event != "") {
            this.getClassesList(this.gradeId);
            this.getSubjectList(this.gradeId);
            this.getTeacherList(this.gradeId);
        }
        this.rank.page = PageService.setPageParams(1, this.pageSize);
        this.rank.list = [];
        this.getUnicastList();
    }

	/**
	 * 获取班级列表
	 */
    private getClassesList(gradeId) {
        this.classesList.isloadComplete = false;
        this.videoClassesInterface.getTaskAttentionClassesList({ gradeId: gradeId }).subscribe(res => {
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
        this.videoClassesInterface.getTaskSubjectList({
            gardenId: this.gardenId,
            gradeId: gradeId,
            classId: this.selectData.classId,
            teacherId: this.selectData.teacherId
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
        this.videoClassesInterface.getTaskTeacherList({
            gardenId: this.gardenId,
            gradeId: gradeId,
            classId: this.selectData.classId,
            subjectCode: this.selectData.subjectCode
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
        // if (record && record.page.size < record.total) { // 点击加载
        //     record.page.size = record.page.size + this.pageSize;
        //     this.getUnicastList();
        // }

        // 滚动加载
        this.rank.page = PageService.setPageParams(++this.pageIndex, this.pageSize);
        this.getUnicastList();
    }
	/*
	*
	* 获取点播视频列表
	* */
    private getUnicastList() {
        this.videoClassesService.getTaskUnicastListForPermission({
            ...this.rank.page,
            accountId: this.accountId,
            gardenId: this.gardenId,
            gradeId: this.gradeId,
            classId: this.selectData.classId,
            appraiseeId: this.selectData.teacherId,
            subjectCode: this.selectData.subjectCode
        }, (data, totalCount) => {
            this.isloadComplete = true;
            // this.unicastList = data;
            // this.rank.list = data;
            this.unicastList = this.unicastList.concat(data);
            this.rank.list = this.rank.list.concat(data);
            this.rank.total = totalCount;
            this.totalCount = totalCount;
            this.isScroll = true;
            // this.unicastListEle.nativeElement.scrollTop = 0;
            if (!this.ishaveCondition) {
                this.defaultMessage = {
                    title: '暂无评课活动',
                    imgName: 'no-course.png'
                };
            } else {
                this.defaultMessage = {
                    title: '您的筛选条件无结果，请重新选择',
                    imgName: 'no-course.png'
                };

            }
        });
    }

    changePage(index) {
        if (this.pageIndex !== index) {
            this.pageIndex = index;
            this.getUnicastList();
        }
    }

    goDetail(video) {
        this.router.navigate(['invitation/detail/' + video.id + '/0/0'], {
            queryParams: {
                teacherId: this.selectData.teacherId,
                classId: this.selectData.classId,
                subjectCode: this.selectData.subjectCode,
                gradeId: this.gradeId,
                tabIndex: 1
            }
        });
    }

	/**
	 * 获取路由参数
	 */
    private getRouteParam() {
        let user: any = JSON.parse(localStorage.getItem("user"));
        let currentGarden = this.lwStorageService.getCurrentGarden();
        this.gardenId = currentGarden.gardenId;
        this.accountId = user.accountId;
        this.activatedRoute.queryParams.subscribe(res => {
            this.selectData.classId = res.classId;
            this.selectData.teacherId = res.teacherId;
            this.selectData.subjectCode = res.subjectCode;
            this.gradeId = res.gradeId;
        }, (error) => {
            console.log(error);
        });
    }


    handleScroll(event: ScrollEvent) {
        let sTop = event['currentTarget'].scrollTop;
        let cHeight = event['currentTarget'].clientHeight;
		let offsetHeight = this.unicastListEle.nativeElement.offsetHeight;
        if (offsetHeight - (sTop + cHeight) <= 100 && this.isScroll) {
            console.log('滚动加载')
            if ((Math.ceil( this.rank.total / 40)) == 1) {
                return
            }
            if (this.rank.page.index < (Math.ceil( this.rank.total / 40))) {
                this.changeList();
                this.isScroll = false;
            }
        }
	}
}