import { NzModalService, NzMessageService, NzModalSubject} from 'ng-zorro-antd';
import { ExercisesInterface } from './../../services/exercises/exercises.interface';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account/account.service';


@Component({
    selector: 'exercises-group',
    templateUrl: './exercises-group.component.html',
    styleUrls: ['./exercises-group.component.scss']
})
export class ExercisesGroupComponent implements OnInit {
    @Input() designStatus: any;
    @Input() item: any;
    @Input() list: any;
    @Input() index: number;
    @Input() lessonId: any;
    @Input() lessonStage: any;
    @Input() date: any;
    @Input() isShowRemove = true;
	@Output() refreshList  = new EventEmitter();
	@Output() checkboxExecises = new EventEmitter();
    questionDesignCode: string;
    questionDesignList = [];
	@ViewChild('designCodeTep') designCodeTep;
	designCodeTepModal: any;
    constructor(
		private subject: NzModalSubject, 
		private messageService: NzMessageService, 
		private exercisesInterface: ExercisesInterface,
		private modalService: NzModalService,
		private account: AccountService) {
        this.designStatus = 1;
        this.index = 0;
		this.item = {checked: false};
        this.list = [];
    }
    ngOnInit() {
		console.log(this.item);
		this.getExerciseDesign();
    }
	/**
	 * 移出习题
	 */
	delExercise(id) {
		this.exercisesInterface.delExerciseByMaterial({
			lessonId: this.lessonId,
			lessonStage: this.lessonStage,
			date: this.date,
			exerciseIds: id,
			gardenId: this.account.getCurrentGardenId,
		}).subscribe((data) => {
			this.messageService.success('移出成功！');
			this.refreshList.emit();
			// this.getExerciseList();
			// this.clearCheckedStatus();
		});
	}
    /**
	 * 查看答案
	 */
	showAnswer(exerciseCurr) {
		if (exerciseCurr.showAnswer) {
			exerciseCurr.showAnswer = false;
		} else {
			for (const exerciseItem of this.list) {
				if(exerciseItem.exercise.content){
					exerciseItem.exercise.content.showAnswer = false;
				}
			}
			exerciseCurr.showAnswer = true;
		}
    }
    /**
	 * 获取设计标签
	 */
	getExerciseDesign() {
		this.exercisesInterface.getExerciseDesign().subscribe((data) => {
			this.questionDesignList = data;
		});
	}
    /**
	 * 设置题目设计类型
	 */
	setDesignCode(status, item?) {
		this.questionDesignCode = this.questionDesignList[0].code;
		this.designCodeTepModal = this.modalService.open({
			width: 400,
			content: this.designCodeTep,
			class: 'designCodeTep',
			maskClosable: false,
			okText:'取消',
			cancelText: '确定',
			footer: false,
			onOk: () => {
				this.saveDesignCode(status,item);
			}
		});
	}
	sureClick() {
		this.designCodeTepModal.destroy('onOk');
	}
	goBack() {
		this.designCodeTepModal.destroy('onCancel');
	}
	/**
	 * 选题
	 */
	checkedExercise() {
		console.log('选题');
		this.checkboxExecises.emit();
	}
	/**
	 * 保存题目设计类型
	 */
	saveDesignCode(status,item?) {
		let exerciseIds = status?[item.exerciseId]:item;
		this.exercisesInterface.setExerciseDesignByMaterial({
            lessonId: this.lessonId,
            lessonStage: this.lessonStage,
            date: this.date,
            exerciseIds: exerciseIds,
            designCode: this.questionDesignCode
        }).subscribe(() => {
			// this.getExerciseList({designStatus: this.tabList[1].designStatus});
            // this.clearCheckedStatus();
            this.refreshList.emit();
        });
	}

}
