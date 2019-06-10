import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CloudHomeService } from '../../services/cloud-home.service';
import { ClassTabEntity } from '../../services/entity/ClassTabEntity';
import { ClassSheetEntity } from '../../services/entity/ClassSheetEntity';
import { NzModalSubject } from 'ng-zorro-antd';
import { DateToWeekPipe } from '../../../../pipes/date/dateToWeek';
import {LwStorageService } from '../../../../app.export';

@Component({
    selector: 'dialog-timetable',
    templateUrl: './dialog-timetable.component.html',
    styleUrls: ['./dialog-timetable.component.scss']
})
export class DialogTimetableComponent implements OnInit {
    isBannerShow = true;
    hasGarden = true;
    hasLesson = true;
    gardens: any[] = [];
    @Input()
    selectedGarden: string;
    years: any[] = [];
    @Input()
    selectedYear: string;
    semesters: any[] = [];
    @Input()
    selectedSemester: string;
    weeks: any[] = [];
    @Input()
    selectedWeek: any;
    classes: ClassTabEntity[] = [];
    @Input()
    selectedClass: string;
    selectedGradeId: any;
    lessons: ClassSheetEntity[] = [];
    currFilteData = { gardenId: '', year: '', semester: '', week: '', classId: '', lessonId: '', date: '' };
    selectClassName: string;
    @Input() lessonId: any;
    @Input() date: any;
    @Input() selectList = [];
    checkLessonList = [];
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private subject: NzModalSubject,
        private dateToWeekPipe: DateToWeekPipe,
        private cloudhomeProvider: CloudHomeService,
        private storageService: LwStorageService) {
        this.dateToWeekPipe = new DateToWeekPipe();
        this.checkLessonList = [];
    }

    ngOnInit(): void {
        console.log('dialog' + this.storageService.get('s_gardenId'))
        this.currFilteData.gardenId = this.storageService.get('s_gardenId');
        // this.checkLessonList = this.selectList;
        console.log(this.selectList);
        this.checkLessonList = [];
        this.selectList.map((item) => {
            this.checkLessonList.push(item);
        });
        this.getGardens(this.currFilteData.gardenId); // this.selectedgarden
    }

    getSelectedGarden(e) {
        this.selectedGarden = e;
        this.getGardens(this.currFilteData.gardenId);
    }

    getGardens(gardenId) {
        this.cloudhomeProvider.getGardens(gardenId).subscribe((data) => {
            if (data) {
                this.gardens = data.items;
                this.selectedGarden = data.curr ? data.curr.value : '';
                this.gardenSelected();
                this.hasGarden = this.gardens.length > 0;
            }
        });
    }

    gardenSelected() {
        this.cloudhomeProvider.getYears(this.currFilteData, this.selectedYear).subscribe((data) => {
            if (data) {
                this.years = data.items;
                this.selectedYear = data.curr ? data.curr.value : '';
                this.yearSelected();
            }
        });
    }


    yearSelected() {
        this.currFilteData.year = this.selectedYear;
        this.cloudhomeProvider.getSemesters(this.currFilteData, this.selectedSemester).subscribe((data) => {
            if (data) {
                this.semesters = data.items;
                this.selectedSemester = data.curr ? data.curr.value : '';
                this.semesterSelected();
            }
        });
    }

    semesterSelected() {
        this.currFilteData.semester = this.selectedSemester;
        this.cloudhomeProvider.getWeeks(this.currFilteData, this.selectedWeek).subscribe((data) => {
            if (data) {
                this.weeks = data.items;
                this.selectedWeek = data.curr ? data.curr : data.items[0];
                this.weekSelected();
            }
        });
    }

    weekSelected() {
        this.currFilteData.week = this.selectedWeek.value;
        this.cloudhomeProvider.getClasses(this.currFilteData, this.selectedClass).subscribe((data) => {
            if (data) {
                this.classes = data.items;
                this.classSelected(data.curr ? data.curr : {});
            }
        });
    }

    classSelected(selectedClass: any) {
        this.currFilteData.classId = selectedClass.code;
        this.selectedGradeId = selectedClass.data.gradeId;
        this.selectedClass = selectedClass.code;
        this.currFilteData.date = this.date;
        this.currFilteData.lessonId = this.lessonId;
        this.selectClassName = selectedClass.name;
        this.cloudhomeProvider.getSyncLessons(this.currFilteData).subscribe((data) => {
            if (data) {
                this.lessons = data;
                this.hasLesson = this.lessons.length > 0 ? true : false;
            }
        });
    }

    closeBanner() {
        this.isBannerShow = false;
    }
    goBack() {
        this.subject.destroy('onCancel');
    }
    sure() {
        this.subject.next(Object.assign({ data: {} }, { data: this.checkLessonList }))
        this.subject.destroy('onOk');
    }
    startPrepareLesson(lesson) {
        // 设置选中
        if (lesson.data.status) {
            this.addToLessonList(lesson);
        } else {
            this.removeToLessonList(lesson);
        }
    }
    addToLessonList(lesson) {
        let ishave = false;
        this.checkLessonList.map((item) => {
            if (item.id == lesson.data.id && lesson.date != item.data.date) {
                ishave = true;
            }
        })
        if (!ishave) {
            this.checkLessonList.push({
                lessonId: lesson.data.id,
                name: '第' + this.selectedWeek.weekNo + '周 ' + this.selectClassName + ' 周' + this.dateToWeekPipe.transform(lesson.data.week, true) + '第' + lesson.data.period + '节',
                date: lesson.data.date
            });
        }
    }

    removeToLessonList(lesson) {
        let result = [];
        this.checkLessonList.map((item) => {
            if (!(item.lessonId == lesson.data.id && lesson.data.date == item.date)) {
                result.push(item);
            }
        })
        this.checkLessonList = result;
    }

    changeClass(event) {

    }
}
