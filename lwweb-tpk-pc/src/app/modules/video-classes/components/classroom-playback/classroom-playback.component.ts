import { Component, OnInit, Inject } from '@angular/core';
import { VideoClassesService } from '../../../../services/videos/video-classes.service';
import { LwStorageService } from '../../../../common/cache/storage.service';
import { NzModalService, NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { VideoFollowPage } from '../../pages/video-follow/video-follow.page';
import { ResponseActivity } from '../../../../dto/response/ResponseActivity.Dto';
import { LwHttpService } from '../../../../common/http/index';
import { LW_MODULE_CODE, ModuleCode } from '../../../../common/config/index';
import { AccountService } from '../../../../services/account/account.service';
import {ActivatedRoute, Router} from '@angular/router';





@Component({
    selector: 'classroom-playback',
    templateUrl: './classroom-playback.component.html',
    styleUrls: ['./classroom-playback.component.scss']
})
export class ClassroomPlaybackComponent implements OnInit {
    isShowButton = true;
    currentGardenId: any;
    myClassesList: any;
    myFocusedClassesList: any = [];

    activityList: any[] = [];
    followBox: any;
    activityRequestParams: any = {};
    activityResponseItem: ResponseActivity;
    load = false;
	focusedLoad = false;
    unicastList: any[] = [];

    constructor(
        private videoClassService: VideoClassesService,
        private lwStorageService: LwStorageService,
        private modalService: NzModalService,
        private httpService: LwHttpService,
        @Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
        private accountService: AccountService,
		private router: Router,
		private videoClassesService: VideoClassesService,
		private message: NzMessageService,

    ) { }

    ngOnInit(): void {
        this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id
        this.getMyClassesList();
		this.getMyFocusedClassesList();
		this.checkHasAttention();   // 判断是否有权限
     }


     // 获取我的课
     getMyClassesList() {
        this.videoClassService.getMyClasses({gardenId: this.currentGardenId}).subscribe(out => {
			this.myClassesList = out.map(item => {
				return Object.assign({}, item, {gradeClass: `${item.gradeName}${item.className}`});
			})
	
        })
     }

     // 获取我关注的课
     getMyFocusedClassesList() {
        this.videoClassService.getMyFocusedClasses({gardenId: this.currentGardenId}).subscribe(out => {
            this.myFocusedClassesList = out.map( item => Object.assign({}, item, {activeTab: 0,firstActiveId: item.classList[0].id, selectedAllClass: item.classList[0].attentionSourceList}));
        })
     }

     // 展示选择班级下面的课
     selectValue(jIndex, iIndex, allClass) {
       this.myFocusedClassesList[jIndex].selectedAllClass = allClass.classList[iIndex].attentionSourceList;
	   this.myFocusedClassesList[jIndex].firstActiveId = allClass.classList[iIndex].id;
	   this.focusedLoad = false;
     }


     // 跳转点播课程详情页
     routeToclazz(clazzItem) {
		// this.router.navigate(['video/unicast/' + clazzItem.classId]);
		this.videoClassService.getUnicastList({
			classId: clazzItem.classId,
			subjectCode: clazzItem.subjectCode,
			gradeId: clazzItem.gradeId,
			gardenId: this.currentGardenId,
			accountId: this.accountService.getAccountId(),
		},(data) => {
			if(data.length > 0) {
				window.localStorage.setItem("from","focusLessons");
				this.router.navigate(['video/unicast/0'],
				{queryParams:{'subjectCode': clazzItem.subjectCode,'gradeId': clazzItem.gradeId, 'classId': clazzItem.classId,from:"focusLessons"}});
			}else {
				this.message.warning('课堂回放正在生成，请耐心等待');
			}
		})
		
	 }
	 
	// 跳转我的课
	routeToMyclass(myClass) {
		this.router.navigate(['video/myclass/'],
		{queryParams:{'subjectCode': myClass.subjectCode,'gradeId': myClass.gradeId, 'classId': myClass.classId}});
	}

    // 弹出关注弹框
	btnFollow(closable) {
		this.followBox = this.modalService.open({
			title: '设置关注标签',
			content: VideoFollowPage,
			footer: null,
			width: 800,
			class:"ad-model",
			wrapClassName: 'follow-modal',
			maskClosable: false,
			closable: closable,
			onOk: () => {
				this.getActivityList();
				this.getUnicastList();
				this.checkHasAttention();
                this.accountService.CreateComponent("1");
                this.getMyFocusedClassesList();
			}
		});
	}
    /**
	 * 获取活动列表
	 */
	getActivityList() {
		this.activityResponseItem = { id: 0, initiatorName: '', appraiseeName: '', startTime: '', endTime: '', name: '' };
		this.activityRequestParams.offset = 0;
		this.activityRequestParams.size = 5;
		this.httpService.get(this.moduleCode.TPK_WEB, '/comment/activity/appraise', this.activityRequestParams).subscribe(response => {
			if (response) {
				this.activityList = response;
				this.activityResponseItem = this.activityList[0];
            }
            setTimeout(() => {
				this.load = false;
			}, 1000);
		});
    }

    /**
	 * 获取点播视频列表
	 */
	getUnicastList() {
		this.videoClassService.getUnicastListForPermission({
			offset: 0,
			size: 15,
			gardenId: this.accountService.getCurrentGardenId,
		}, (data, totalCount) => {
			this.unicastList = data;
			setTimeout(() => {
				this.load = false;
			}, 1000);
		});
    };
    // 是否显示关注按钮，1：有可以关注的数据，2：没有进行过关注
	checkHasAttention(): void {
		const params: any = {};
		params.gardenId = this.currentGardenId;
		params.accountId = this.accountService.getAccountId();
		this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/attention/sourceList', params).subscribe(res => {
			if (res.length <= 0) {
				this.isShowButton = false;
			} else {
				// 没有关注过强制弹框关注
				this.httpService.get(this.moduleCode.TPK_WEB, '/unicast/attention/checkHasAttention', params).subscribe(response => {
					if (!response) {
						this.btnFollow(false);
					}
				});
			}
		});

	}

}



