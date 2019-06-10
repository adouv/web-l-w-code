import {Component, Input, OnInit} from '@angular/core';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';
import {AccountService} from '../../../../services/account/account.service';
import {PageService} from '../../../../services/page/page.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
	templateUrl: './exercises.component.html',
	styleUrls: ['./exercises.component.scss'],
	selector: 'exercises-component'
})

export class ExercisesComponent implements OnInit {
	qualitys = [];
	qualityChecked: any;
	oldQualityChecked: any;
	checkedAll: boolean;
	isClickCard: boolean;
	exercisesData: any;
	showDetails: boolean;
	typelist: any;
	record: any;
	@Input() classId: string;
	@Input() outlineId: any;
	@Input() subjectCode: any;
	@Input() courseTitle: any;
	@Input() gradeCode: any;
	exercisesCardConfig: any;
	detailsData: any;
	detailsType: any;
	typeCode: any; // 习题类型
	ellipticalTitle: string; // 缺省信息
	urlOutlineId: any;
	isSingle: boolean; // 是否是单点
	constructor(private resourceClassesInterface: ResourceClassesInterface,
				private accountService: AccountService,
				private messageService: NzMessageService) {
		this.checkedAll = false;
		this.isClickCard = false;
		this.showDetails = false;
		this.detailsData = [];
		this.exercisesCardConfig = {};
		this.exercisesData = [];
		this.ellipticalTitle = '暂无习题';
		this.typeCode = '';
		this.isSingle = true;
		this.record = {page: PageService.setPageParams(1, 30), list: [], loaded: false, total: 0};
	}

	ngOnInit() {
		this.exercisesCardConfig.data = {
			outlineId: this.outlineId,
			subjectCode: this.subjectCode,
			courseTitle: this.courseTitle,
			gradeCode: this.gradeCode
		};
		this.exercisesCardConfig.showExercises = true;
		this.urlOutlineId = this.outlineId;
		this.getExerciseOutline();
		this.getOneselfAndChild();
		this.getExerciseTypeList();
	}

	qualityChange() {
		if (this.qualityChecked && this.oldQualityChecked !== this.qualityChecked) {
			this.oldQualityChecked = this.qualityChecked;
			// this.getComment(this._type);
			// this.times = this.exercisesClassChecked.times;
			this.outlineId = this.qualityChecked.id;
			this.getExerciseOutline();
		}
	}

	// 习题选中事件
	statusChange($event) {
		this.isCheckAll();
		this.dealDetailsData();
	}

	// 全选事件
	checkedAllChange($event) {
		for (let i = 0; i < this.exercisesData.length; i++) {
			this.exercisesData[i].status = $event;
		}
		this.dealDetailsData();
	}

	isCheckAll() {
		let status = true;
		for (let i = 0; i < this.exercisesData.length; i++) {
			if (!this.exercisesData[i].status) {
				status = false;
			}
		}
		if (status) {
			this.checkedAll = true;
		} else {
			this.checkedAll = false;
		}
	}

	btnClick() {
		this.showDetails = false;
		if (this.isSingle) {
			this.detailsData = [];
		}
	}

	showExerciseDetails($event) {
		this.isSingle = true;
		// if(!this.isSingle)
		this.checkedAll = false;
		for (let i = 0; i < this.exercisesData.length; i++) {
			this.exercisesData[i].status = false;
		}
		if ($event.type === 'showAnswer') {
			this.detailsData = [];
			this.detailsType = 0;
			this.detailsData.push($event.data.id);
			this.showDetails = true;
		} else {
			this.detailsData = [];
			this.detailsData.push($event.data.id);
			this.detailsType = 1;
			this.showDetails = true;
		}
	}

	getExerciseOutline() {
		console.log(this.classId, '------------')
		this.resourceClassesInterface.getPrepareExerciseList({
			outlineId: this.outlineId,
			classId: this.classId,
			typeCode: this.typeCode,
			gardenId: this.accountService.getCurrentGardenId,
		}).subscribe((data) => {
			this.record.loaded = true;
			// this.record.total = res.totalCount;
			this.exercisesData = data || [];
			if (this.exercisesData.length === 0) {
				this.ellipticalTitle = (this.typeCode === '' && this.urlOutlineId === this.outlineId) ? '暂无习题' : '没有相应的试题,换其他条件试试吧';
			}
			this.record.list = this.exercisesData;
			for (let i = 0; i < this.exercisesData.length; i++) {
				this.exercisesData[i].status = false;
			}
		});
	}

	getOneselfAndChild() {
		this.resourceClassesInterface.getOneselfAndChild({
			id: this.outlineId
		}).subscribe((data) => {
			this.qualitys = data.childOutlineList;
			if (this.qualitys.length !== 0) {
				this.qualitys.unshift(data);
			}
		});
	}

	// 获得题目类型
	getExerciseTypeList() {
		this.resourceClassesInterface.getExerciseTypeList({
			gradeCode: this.gradeCode,
			subjectCode: this.subjectCode
		}).subscribe((data) => {
			this.typelist = data;
			this.typelist.unshift({
				name: '全部',
				code: '',
			});
			for (let i = 0; i < this.typelist.length; i++) {
				if (this.typelist[i].code === '') {
					this.typelist[i].status = true;
				} else {
					this.typelist[i].status = false;
				}
			}
		});
	}

	// 刷新选中数据
	dealDetailsData() {
		this.detailsData = [];
		for (let i = 0; i < this.exercisesData.length; i++) {
			if (this.exercisesData[i].status) {
				this.detailsData.push(this.exercisesData[i].id);
			}
		}
	}

	// 做题 讲题
	doExercises(type) {
		this.dealDetailsData();
		if (this.detailsData.length === 0) {
			// this.messageService.warning('请选择习题！');
		} else {
			this.isSingle = false;
			this.detailsType = type;
			this.showDetails = true;
		}
	}

	// 选择题目类型
	checkType(type) {
		this.checkedAll = false;
		this.detailsData = [];
		for (let i = 0; i < this.typelist.length; i++) {
			if (this.typelist[i].code === type) {
				this.typelist[i].status = true;
				this.typeCode = type;
				this.getExerciseOutline();
			} else {
				this.typelist[i].status = false;
			}
		}

	}

	changeRecordList($event, record?) {
		if (record && record.page.size < record.total) {
			record.page.size = record.page.size + 30;
		}
		this.getExerciseOutline();
	}
}
