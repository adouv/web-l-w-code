import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import { LwStorageService } from '../../../../common/cache/storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';


@Component({
    selector: 'classroom-live',
    templateUrl: './classroom-live.component.html',
    styleUrls: ['./classroom-live.component.scss']
})
export class ClassroomLiveComponent implements OnInit, OnDestroy, AfterViewInit {
    currentGardenId: any;
    selectedClazz: number = 0;
    selectedClazzObj: any =  {};
    selectedClazzObjIndex:number = 0;
    liveClassesList: any [];
    liveCoursesList: any[];
    timer: any;
    time: number = 100;
    load: boolean = false;

    @ViewChild('wrap') wrap: ElementRef;
    tableItem: Element;
    constructor(
        private videoClassesInterface: VideoClassesInterface,
        private lwStorageService: LwStorageService,
        private router: Router,
    ) { 
    }

    ngOnInit(): void { 
        this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id
        this.getLiveClassesList();
    }

    ngAfterViewInit() {
        this.resize();
    }

    resize() {
        Observable.fromEvent(window, 'resize').debounceTime(100).subscribe((event) => {
            if( this.wrap){
                this.tableItem = this.wrap.nativeElement.children[0];
                let rowCount = Math.floor(this.wrap.nativeElement.parentElement.clientWidth / this.tableItem.clientWidth);
                this.wrap.nativeElement.style.paddingLeft = (this.wrap.nativeElement.parentElement.clientWidth - this.tableItem.clientWidth * rowCount) / 2 + 'px';
            console.log(this.wrap.nativeElement.style.paddingLeft)
            }
        });
    }

    // 获取直播班级列表
    getLiveClassesList () {
        this.videoClassesInterface.getClassesLiveList({gardenId: this.currentGardenId}).subscribe(out => {
            this.liveClassesList = out;
            this.selectedClazzObj = this.liveClassesList[0];
            this.getLiveCoursesList();
            this.getLiveStatus();
        },error => {
            if(error.status == 422) {
                this.liveClassesList = [];
            }
        })
    }

    // 根据班级id获取直播课程
    getLiveCoursesList() {
        this.videoClassesInterface.getClassesLiveCoursesList({gradeId:this.selectedClazzObj.id}).subscribe(out => {
            this.selectedClazz = this.selectedClazzObjIndex;
            this.liveCoursesList = out || [];
            this.load = false;
        })
    }

    // 查询直播状态
    getLiveStatus() {
        if(this.timer) {
            window.clearInterval(this.timer);
        }
        this.timer = window.setInterval(_ => {
            this.getLiveCoursesList();
        }, 60000);
    }

    // 跳转到直播课程页面
    routeToLive(clazz) {
		this.router.navigate(['video/live/' + clazz.classId]);
    }
    ngOnDestroy() {
        window.clearInterval(this.timer);
    }
}
