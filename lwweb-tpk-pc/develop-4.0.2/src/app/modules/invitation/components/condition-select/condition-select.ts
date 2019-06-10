import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {InvitationInterface} from '../../services/invitation.interface';
import {DatePipe} from '@angular/common';
import {LwStorageService} from '../../../../common/cache/storage.service';


@Component({
	selector: 'condition-select',
	templateUrl: 'condition-select.html',
	styleUrls: ['condition-select.scss']
})

export class ConditionSelectComponent implements OnChanges {
	gradeList = [{name: '', id: ''}];

	classList = [{name: '', id: ''}];

	subjectList = [{name: '', id: ''}];

	teacherList = [{name: '', id: ''}];

	@Input() condition;

	@Input() appraiserIds;

	@Output() onChangeSelect = new EventEmitter();

	currentGardenId: any;

	constructor(private invitationInterface: InvitationInterface,
				private datePipe: DatePipe,
				private lwStorageService: LwStorageService,
	) {
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id

	}

	ngOnChanges(change) {
		if (change.condition && change.condition.previousValue !== change.condition.currentValue) {
			this.getGradeList();
			if (this.condition.gradeId) {
				this.getClassList();
				this.getSubjectList();
				this.getTeacherList();
			}
		}
		if (change.appraiserIds && change.appraiserIds.previousValue !== change.appraiserIds.currentValue) {
			this.getGradeList();
			if (this.condition.gradeId) {
				this.getTeacherList();
			}
		}
	}

	private getGradeList() {
		this.invitationInterface.getGradeList({gardenId: this.currentGardenId}).subscribe((data) => {
			this.gradeList = data.data;
			if (data.data && data.data.length === 1) {
				this.condition.gradeId = data.data[0].id;
				this.getClassList();
			}
		});
	}

	private getClassList() {
		this.invitationInterface.getClassList(this.condition.gradeId).subscribe((data) => {
			this.classList = data.data;
			if (data.data && data.data.length === 1) {
				this.condition.classId = data.data[0].id;
				this.getSubjectList();
			}
		});
	}

	private getSubjectList() {
		this.invitationInterface.getSubjectList(this.condition.classId).subscribe((data) => {
			this.subjectList = data;
			if (data.data && data.data.length === 1) {
				this.condition.subjectCode = data.data[0].id;
				this.getTeacherList();
			}
		});
	}

	private getTeacherList() {
		this.invitationInterface.getTeacherList(this.condition.classId, this.condition.subjectCode).subscribe((data) => {
			const arr = [];
			for (const item of data) {
				if (this.appraiserIds.indexOf(item.id) < 0) {
					arr.push(item);
				}
			}
			this.teacherList = arr;
			if (this.teacherList && this.teacherList.length === 1) {
				this.condition.teacherId = this.teacherList[0].id;
				this.onChangeSelect.emit(this.condition);
			}
		});
	}

	changeDate(event) {
		if (event[0] != null && event[1] != null) {
			this.condition.startTime = this.datePipe.transform(new Date(event[0]), 'yyyy-MM-dd HH:mm:ss');
			this.condition.endTime = this.datePipe.transform(new Date(event[1]), 'yyyy-MM-dd HH:mm:ss');
		} else {
			this.condition.startTime = '';
			this.condition.endTime = '';
		}
		this.onChangeSelect.emit(this.condition);
	}

	changeGrade(event) {
		this.condition.gradeId = event;
		if (this.condition.gradeId) {
			this.condition.classId = null;
			this.condition.subjectCode = null;
			this.condition.teacherId = null;
			this.getClassList();
			// this.getSubjectList();
			// this.getTeacherList();
			this.onChangeSelect.emit(this.condition);
		}
	}

	changeClass(event) {
		this.condition.classId = event;
		this.condition.subjectCode = null;
		this.condition.teacherId = null;
		this.getSubjectList();
		this.onChangeSelect.emit(this.condition);
	}

	changeSubject(event) {
		this.condition.subjectCode = event;
		this.condition.teacherId = null;
		this.getTeacherList();
		this.onChangeSelect.emit(this.condition);
	}

	changeTeacher(event) {
		this.condition.teacherId = event;
		// this.getTeacherList();
		this.onChangeSelect.emit(this.condition);
	}
}
