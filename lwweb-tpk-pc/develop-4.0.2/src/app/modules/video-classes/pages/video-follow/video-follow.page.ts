
import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';
import { LwHttpService } from '../../../../common/http/index';
import { LW_MODULE_CODE, ModuleCode } from '../../../../common/config/index';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { LwStorageService } from '../../../../common/cache/storage.service';

@Component({
    selector: 'video-follow-page',
    templateUrl: 'video-follow.page.html',
    styleUrls: ['video-follow.page.scss']
})

export class VideoFollowPage implements OnInit, OnDestroy {
    followList: any = [];
    newList: any = [];
    resultList: any = [];
    moreStatus: boolean;
    showMoreButton: boolean;
    hideButton: boolean;
    classId: string;

    userID: string;

    constructor(
        private router: Router,
        private videoClassesInterface: VideoClassesInterface,
        private http: LwHttpService,
        @Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
        private subject: NzModalSubject,
        private message: NzMessageService,
        private lwStorageService: LwStorageService,
    ) {
        this.followList = {};
        this.followList.isloadComplete = false;
        this.followList.data = [];
        this.moreStatus = true;
        this.showMoreButton = false;
        this.hideButton = false;
    }
    ngOnInit() {
        this.getClassesList();
        this.userID = this.lwStorageService.get('user').accountId;
    }
    ngOnDestroy() {

    }
    // 离开下拉框
    mouseleave() {
        this.moreStatus = true;
    }

    // 悬浮更多
    mouseenter() {
        this.moreStatus = false;
    }
    getClassesList() {
        this.followList.isloadComplete = false;
        let user: any = JSON.parse(localStorage.getItem("user"));
        let params: any = {};
        params.gardenId =this.lwStorageService.getCurrentGarden().gardenId;
        params.accountId = user.accountId;
        this.http.get(this.moduleCode.TPK_WEB, '/unicast/attention/sourceList', params).subscribe(response => {
            this.followList.isloadComplete = true;
            if (response) {
                console.log('手动设置关注')
                console.log(response)
                this.followList.data = response;
                this.followList.data.forEach(item => {
                    // 剔除当前用户自己的课程
                    // this.cleanSelfCourse(item);
                    item.defaultList = [];
                    item.defaultId = item.classList[0].id;
                    item.defaultList = item.classList[0].attentionSourceList;
                    this.classId = item.defaultId;

                    item.classList.forEach(child => {
                        child.attentionSourceList.forEach(d => {
                            if (d.teacherId.split(',').includes(user.accountId)) {
                                d.teacher = true;
                                d.hasAttention = true;
                            }
                            this.newList.push(d);
                        });
                    });
                });
            }
        });
    }
    changeClass(event?: any, item?: any): void {
        item.defaultList = [];
        item.defaultId = event.id;
        item.defaultList = event.attentionSourceList;
    }

    selectAttention(item: any, data: any): void {
        if (!data.teacher) {
            data.hasAttention = !data.hasAttention;
        }

        this.hideButton = this.newList.filter(item => item.hasAttention).length == 0 ? true : false;

    }
    btnSubmit(): void {
        this.resultList = this.newList.filter(item => item.hasAttention);
        this.resultList = this.resultList.map(item => {
           return  item = Object.assign({}, item, {gardenId: this.lwStorageService.getCurrentGarden().gardenId});
        })
        if (this.resultList.length > 0) {
            this.http.post(this.moduleCode.TPK_WEB, '/unicast/attention', this.resultList).subscribe(response => {
                this.message.success('设置关注标签成功！');
                this.subject.destroy('onOk');
            }, error => {
                this.message.error("设置关注标签失败！");
                this.subject.destroy('onOk');
            });
        } else {
            this.message.success('请选择关注标签！');
        }
    }
    allBtnSubmit(): void {
            this.http.put(this.moduleCode.TPK_WEB, '/unicast/attention/all?isAll=true').subscribe(response => {
                this.message.success('设置一键关注成功！');
                this.subject.destroy('onOk');
            }, error => {
                this.message.error("设置一键关注失败！");
                this.subject.destroy('onOk');
            });
       
    }

    cleanSelfCourse(data) {
        
       
        data.classList.forEach(clazz => {
            let temp = [];
            console.log('剔除前')
            console.log(clazz.attentionSourceList);
            clazz.attentionSourceList.forEach(element => {
                if(!element.teacherId.includes(this.userID)) {
                    temp.push(element);
                }else if(element.teacherId.length !== this.userID.length) {
                    temp.push(element);
                }
            });
            clazz.attentionSourceList = temp;
            console.log('剔除后')
            console.log(clazz.attentionSourceList);
        });
       
        
       
    }
}