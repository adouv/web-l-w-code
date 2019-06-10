import {Component, ViewChild, ElementRef, Input, OnInit, OnChanges} from '@angular/core';
import {VideoClassesInterface} from '../../../../../services/videos/video-classes.interface';
import {DialogService} from '../../../../../services/dialog/dialog.service';
import {SimpleChanges} from '@angular/core/src/metadata/lifecycle_hooks';
import {NzModalSubject, NzModalService} from 'ng-zorro-antd';
import {AccountService} from '../../../../../services/account/account.service';
import {LwStorageService} from '../../../../../app.export';

@Component({
	selector: 'dialog-evaluate',
	templateUrl: './dialog-evaluate.html',
	styleUrls: ['./dialog-evaluate.scss']
})

export class DialogEvaluate implements OnInit, OnChanges {
	data: any;
	@Input() videoDetails: any;
	@Input() type: any;
	@Input() isUsed: boolean;
	@Input() commentdata: any;
	@Input() isStatistics: boolean;
	@Input() isShow: boolean;
	@ViewChild('textareaEle') textareaEle: ElementRef;
	@ViewChild('tplContent') tplContent: any;
	@ViewChild('myHandle') myHandle: any;
	issubmit = false;
	draggableStatus = false;
	people: any;
	// lecturer: any;

	gardenId: any;
	constructor(private videoClassesInterface: VideoClassesInterface,
				private dialogService: DialogService,
				private subject: NzModalSubject,
				private modalService:NzModalService,
				private accountService: AccountService,
				private storageService: LwStorageService,
				) {
		this.data = {};
		this.isUsed = true;
		this.videoDetails = {};
		this.isStatistics = false;
		this.isShow = false;
		// this.lecturer = '张三李四王五张三李四王五';
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.commentdata != null) {
			this.data = changes.commentdata.currentValue;
		}
	}

	ngOnInit() {
		console.log(this.accountService.getUser());
		// 获取当前园区Id
		this.gardenId = this.storageService.getCurrentGarden().gardenId; 
		this.people = this.accountService.getUser().displayName;
		if (this.isUsed) {
			this.data = this.commentdata;
		} else {
			if(this.type === 0){
				this.getCommentTemplate();
			}else{
				this.getCommentSelf(this.gardenId);
			}
			
		};
	}

	formatterDollar(value) {
		if (!(value + '' == '' || value == 'undefined' || value == undefined)) {
			return parseInt(value);
		}
	}

	parserDollar(value) {
		return value;
	}

	// 提交评价
	submitEvaluate() {
		this.issubmit = true;
		if (this.verification()) {
			this.dialogService.openConfirm({
				title: '是否确认提交 ' + (this.type == 0 ? '教学评价' : '教学反思') + '表 ？',
				content: this.tplContent,
				mask: false,
				maskClosable: false,
				zIndex: 1003,
				okText: '继续',
				class: 'evaluation-confirm',
				cancelText: '取消',
				wrapClassName: 'vertical-center-modal',
				onOk: () => {
					this.data.comment = document.getElementById('textareaEle').textContent;
					this.videoClassesInterface.submitComment(this.data).subscribe(data => {
						this.subject.destroy('onCancel');
						this.dialogService.alertSuccess('提交成功！');
					}, err => {
						this.dialogService.alertWarning('网络原因，请稍后重试！');
					});
				}
			})
		} else {
			this.dialogService.alertWarning('有必填项未填，不能提交！');
		}
	}

	// 其他评语
	otherInput() {
		if (document.getElementById('textareaEle').textContent.length > 300) {
			document.getElementById('textareaEle').textContent = document.getElementById('textareaEle').textContent.substring(0, 300);
			document.getElementById('textareaEle').blur();
		}
		;
	}

	// 验证数据
	verification() {
		console.log(this.data);
		for (let i = 0; i < this.data.items.length; i++) {
			for (let j = 0; j < this.data.items[i].childItems.length; j++) {
				if (this.data.items[i].childItems[j].obtainedScore + '' === '' || this.data.items[i].childItems[j].obtainedScore === 'undefined' || this.data.items[i].childItems[j].obtainedScore === undefined) {
					return false;
				}
			}
		}
		return true;
	}

	// 分数改变
	numchange($event, d) {
		// $event = parseInt($event) != 0 && ($event + '' == '' || $event == 'undefined' || $event == undefined) ? 0 : $event;
		// this.computeScore($event, id);
		console.log($event.srcElement.value);
		this.computeScore(this.getChangeNum($event.srcElement.value, d.score), d.id);
	}

	getChangeNum(num, max) {
		console.log(num);
		console.log(max);
		if (isNaN(parseInt(num))) {
			return 0;
		} else if (parseInt(num) >= parseInt(max)) {
			return parseInt(max);
		} else if (parseInt(num) <= 0) {
			return 0;
		} else {
			return parseInt(num);
		}
	}

	// 分数输入离焦
	inputBlur($event, id) {
		$event.target.value = parseInt($event.target.value) != 0 && ($event.target.value == '' || $event.target.value == 'undefined' || $event.target.value == undefined) ? 0 : $event.target.value;
		this.computeScore($event.target.value, id);
	}

	// 计算分数
	computeScore(value, id) {
		let totalScore = 0;
		for (let i = 0; i < this.data.items.length; i++) {
			let obtainedScore = 0;
			for (let j = 0; j < this.data.items[i].childItems.length; j++) {
				// console.log(this.data.items[i].childItems[j].obtainedScore);
				if (this.data.items[i].childItems[j].id == id) {
					this.data.items[i].childItems[j].obtainedScore = value;
					console.log(value);
					document.getElementById(id).setAttribute('value', value);
					console.log(this.data.items[i].childItems[j].obtainedScore);
				}
				if (!(this.data.items[i].childItems[j].obtainedScore === '' || this.data.items[i].childItems[j].obtainedScore === 'undefined' || this.data.items[i].childItems[j].obtainedScore === undefined)) {
					// console.log(this.data.items[i].childItems[j].obtainedScore);
					// this.data.items[i].childItems[j].obtainedScore = parseInt(this.data.items[i].childItems[j].obtainedScore);
					obtainedScore += parseInt(this.data.items[i].childItems[j].obtainedScore);
				}
			}
			this.data.items[i].obtainedScore = obtainedScore;
			totalScore += obtainedScore;
		}
		this.data.totalObtainedScore = totalScore;
	}

	isInput() {
		if (!(this.data.theme == '' || this.data.theme == 'undefined' || this.data.theme == undefined)) {
			return true;
		}
		for (let i = 0; i < this.data.items.length; i++) {
			for (let j = 0; j < this.data.items[i].childItems.length; j++) {
				if (!(this.data.items[i].childItems[j].obtainedScore === '' || this.data.items[i].childItems[j].obtainedScore === 'undefined' || this.data.items[i].childItems[j].obtainedScore === undefined)) {
					return true;
				}
			}
		}
		if (document.getElementById('textareaEle').textContent !== '') {
			return true;
		}
		return false;
	}

	// 获得模版
	getCommentTemplate() {
		this.videoClassesInterface.getCommentTemplate({
			gardenId: this.videoDetails.gardenId,
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime
		}).subscribe((data)=> {
			this.data = data;
			this.data.title = '教师听课评课表';
			this.data.courseRecord = {};
			this.data.courseRecord.teacherId = this.videoDetails.teacherId;
			this.data.courseRecord.gradeId = this.videoDetails.gradeId;
			this.data.courseRecord.subjectCode = this.videoDetails.subjectCode;
			this.data.courseRecord.classId = this.videoDetails.classId;
			this.data.courseRecord.giveLessonTime = this.videoDetails.giveLessonTime;
			this.data.courseRecord.period = this.videoDetails.period;
			this.data.courseRecord.gardenId = this.videoDetails.gardenId;
			this.data.beCommentatorId = this.videoDetails.teacherId;
			this.data.beCommentatorName = this.videoDetails.teacherName;
			// this.data.beCommentatorName = this.videoDetails;
		})
	}

	getCommentSelf(gardenId){
		this.videoClassesInterface.getCommentSelf({gardenId:gardenId}).subscribe((data)=>{
			this.data = data;
			this.data.title = '教师听课评课表';
			this.data.courseRecord = {};
			this.data.courseRecord.teacherId = this.videoDetails.teacherId;
			this.data.courseRecord.gradeId = this.videoDetails.gradeId;
			this.data.courseRecord.subjectCode = this.videoDetails.subjectCode;
			this.data.courseRecord.classId = this.videoDetails.classId;
			this.data.courseRecord.giveLessonTime = this.videoDetails.giveLessonTime;
			this.data.courseRecord.period = this.videoDetails.period;
			this.data.courseRecord.gardenId = this.videoDetails.gardenId;
			this.data.beCommentatorId = this.videoDetails.teacherId;
			this.data.beCommentatorName = this.videoDetails.teacherName;
		})
	}

	closeEvaluate() {
		this.subject.destroy('onCancel');
	}

	evaluationCancel() {
		if (this.isUsed) {
			this.subject.destroy('onCancel');
		} else {
			if (this.isInput()) {
				this.dialogService.openConfirm({
					title: '是否确定关闭' + (this.type == 0 ? '教学评价' : '教学反思') + '窗口？',
					content: '已填写信息将会丢失',
					mask: false,
					maskClosable: false,
					zIndex: 1003,
					okText: '否',
					class: 'evaluation-confirm',
					cancelText: '是',
					wrapClassName: 'vertical-center-modal',
					onCancel: () => {
						this.subject.destroy('onCancel');
					}
				})
			} else {
				this.subject.destroy('onCancel');
			}

		}

	}
}