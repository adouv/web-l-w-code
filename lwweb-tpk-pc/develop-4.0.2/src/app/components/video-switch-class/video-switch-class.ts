import { ActivatedRoute, Router } from '@angular/router';
import { VideoLiveDetailService } from './../../services/videos/video-live-detail.service';
import { VideoClassesInterface } from './../../services/videos/video-classes.interface';
import { AccountService } from './../../services/account/account.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { LwStorageService } from '../../common/cache/storage.service';
import { SussService } from '../../common/suss';


@Component({
    selector: 'video-switch-class',
    templateUrl: './video-switch-class.html',
    styleUrls: ['./video-switch-class.scss']
})
export class VideoSwitchClassComponent implements OnInit, OnChanges {
    constructor(private videoClassesInterface: VideoClassesInterface, private accountService: AccountService, private videoLiveDetailService: VideoLiveDetailService,
        private router: Router,
        private lwStorageService: LwStorageService, private suss: SussService) { }
    gradeList = [];
    classList = [];
    currentGrade: any = {};
    currentClass: any = {};
    currentGardenId: any;
    loadComplete = false;
    active: any = 0;
    @Input() videoParam: any;
    @ViewChild('scrollTop') scrollTop: ElementRef;
    ngOnInit(): void {
        console.log("传递过来的参数：", this.videoParam);
        this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id
        this.currentGrade.gradeId = this.videoParam.gradeId;
        this.currentClass.classId = this.videoParam.classId;
        this.currentGrade.gradeName = this.videoParam.gradeName;
        this.currentClass.className = this.videoParam.className;
        this.getGradeList();
        this.getClassList();
    }


    /**
     *   获取直播年级列表
     */
    getGradeList() {
        let gradeParam = { gardenId: this.lwStorageService.getCurrentGarden().gardenId };
        this.videoClassesInterface.getLiveGrades(gradeParam).subscribe((res) => {
            // console.log("获取直播年级列表：", res);
            if (res) {
                this.gradeList = res || [];
            }
        }, (err) => {
            console.log("获取直播年级列表失败：", err);
        });
    }
    /**
     *  获取年级下班级列表
     */
    getClassList() {
        let classParam = { gardenId: this.lwStorageService.getCurrentGarden().gardenId, gradeId: this.currentGrade.gradeId };
        this.videoClassesInterface.getLiveClasses(classParam).subscribe((res) => {
            this.loadComplete = true;
            console.log("获取直播班级列表：", res);
            if (res) {
                this.classList = res;
                this.classList.forEach((item, index, arr) => {
                    let name = item.status == 0 ? '课间' : item.subjectName;
                    item.classStr = this.currentGrade.gradeName + item.className;
                    /*   if(index==this.classList.length-1){
                          name="中国社会主义政治课"
                      } */
                    item.subjectStr = name;
                    // if(item.classId == this.currentClass.classId) {
                    //     this.scrollTop.nativeElement.scrollTo(0,`${40*index}`);
                    // }
                });
            }
        }, (err) => {
            this.loadComplete = true;
            console.log("获取直播班级列表失败：", err);
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log("ngOnChanges:", changes);
        this.videoParam = changes.videoDetails.currentValue;
        this.currentGrade.gradeId = this.videoParam.gradeId;
        this.currentClass.classId = this.videoParam.classId;
        this.currentGrade.gradeName = this.videoParam.gradeName;
        this.currentClass.className = this.videoParam.className;
        this.getGradeList();
        this.getClassList();
    }
    /**
     *
     * @param grade 切换年级
     */
    changeGrade(grade) {
        if (grade.id == this.currentGrade.gradeId) {
            return;
        }
        this.currentGrade.gradeId = grade.id;
        this.currentGrade.gradeName = grade.name;
        this.getClassList();
    }

    /**
   *
   * @param grade 切换班级
   */
    changeClass(classObj) {
        if (classObj.classId == this.currentClass.classId) {
            return;
        }
        this.currentClass.classId = classObj.classId;
        this.currentClass.className = classObj.className;
        this.suss.releaseMessage('vd', classObj);

        // this.router.navigate(["video/live/" + this.currentClass.classId]);
        // this.videoLiveDetailService.changeClass.emit(this.currentClass.classId);
    }
}
