/**
 * 新建/编辑 评课邀请
 */

import {Component, OnInit} from '@angular/core';
import {InvitationInterface} from '../../services/invitation.interface';
import {DatePipe} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../../../services/dialog/dialog.service';
import {ScaleSelectComponent} from '../../components/scale-select/scale-select.component';
import {SelectPersonService} from '../../../../components/select-person/services/select-person.service';
import {AccountService} from '../../../../services/account';
import {LwStorageService} from '../../../../app.export';
import {SelectPersonComponent} from '../../../../components/select-person/containers/select-person.component';

@Component({
	selector: 'invitation-change-page',
	templateUrl: 'invitation-change.page.html',
	styleUrls: ['invitation-change.page.scss']
})

export class InvitationChangePage implements OnInit {
	condition = {
		gradeId: null,
		classId: null,
		subjectCode: null,
		teacherId: null,
		_date: null, // 时间
		startTime: null,
		endTime: null,
		offset: 0,
		size: 100
	};

	invitationInfo = {
		name: '', // 名字
		type: '', // 类型
		appraiserIds: [], // 被邀请人
		_date: '', // 时间
		startTime: '',
		endTime: '',
		require: '', // 评课要求
		teacherInfo: '', // 教师信息
		courseRecords: [],
		initiatorName: '',
		templateId: '',
		templateName: ''
	};

	invitationTypes = [
		{name: '诊断型', code: '1'},
		{name: '研讨型', code: '0'},
	];

	invitationInvitees = [];

	showSelected = false;

	videoList = [];

	currentGardenId: any;

	activityId: string | null;
	selectScaleModel: any;
	vaildModel = {
		courseRecordsStatus: false,
		nameStatus: false,
		typeStatus: false,
		appraiserIdsStatus: false,
		_dateStatus: false
	};
	tabIndex: number;

	btnDebunce = true;

	constructor(private invitationInterface: InvitationInterface,
				private storageService: LwStorageService,
				private datePipe: DatePipe,
				private messageService: NzMessageService,
				private router: Router,
				private selectPersonService: SelectPersonService,
				private dialogService: DialogService,
				private accountService: AccountService,
				private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		this.currentGardenId = this.storageService.getCurrentGarden().gardenId;
		this.activityId = this.activatedRoute.snapshot.paramMap.get('id');
		this.activatedRoute.queryParams.subscribe(params => {
			this.tabIndex = params['tabIndex'];
		});
		if (this.activityId) {
			this.invitationInterface.getInvitationDetail(this.activityId, this.currentGardenId).subscribe((data) => {
				if (data) {
					this.getEditInfo(data);
				}
			});

		} else {
			this.getAddInfo();
		}
	}

	private getAddInfo() {
		this.invitationInfo.initiatorName = this.storageService.get('user').displayName;
	}

	private getEditInfo(data) {
		data._date = [new Date(data.startTime), new Date(data.endTime)];
		this.videoList = data.courseRecords;
		this.condition = {
			gradeId: data.gradeId,
			classId: data.classId,
			subjectCode: data.subjectCode,
			teacherId: data.appraiseeId,
			_date: data._date, // 时间
			startTime: null,
			endTime: null,
			offset: 0,
			size: 100
		};
		this.invitationInfo = data;
		this.invitationInfo.require = data.requirement;
		this.getDepartmentAccountByIds();
	}

	getVideoList(ev) {
		this.invitationInfo.courseRecords = [];
		this.videoList = [];
		if (ev.gradeId && ev.classId && ev.subjectCode && ev.teacherId) {
			ev = Object.assign({}, ev, {gardenId: this.currentGardenId});
			this.invitationInterface.getVideoList(ev).subscribe((data) => {
				this.videoList = data.data;
			});
		}
	}

	getSelectVideo(ev) {
		this.invitationInfo.courseRecords = ev;
		this.vaildModel.courseRecordsStatus = false;
	}

	private getDepartmentAccountByIds() {
		this.invitationInterface.getDepartmentAccountByIds(this.invitationInfo.appraiserIds.join(',')).subscribe((data) => {
			this.invitationInvitees = data;
		});
	}

	changeDate(event) {
		this.invitationInfo.startTime = this.datePipe.transform(new Date(event[0]), 'yyyy-MM-dd HH:mm:ss');
		this.invitationInfo.endTime = this.datePipe.transform(new Date(event[1]), 'yyyy-MM-dd HH:mm:ss');
		this.vaildModel._dateStatus = false;
	}

	goBack() {
		if (this.validValueInput()) {
			this.dialogService.openConfirm({
				title: '提示',
				content: '离开后信息将无法保存，是否确认返回？',
				mask: false,
				maskClosable: false,
				zIndex: 1003,
				okText: '否',
				class: 'evaluation-confirm',
				cancelText: '是',
				wrapClassName: 'vertical-center-modal',
				onCancel: () => {
					history.go(-1);
				},
				onOk: () => {

				}
			});
		} else {
			let url: string = '/video/index';
			if (this.tabIndex != -1) {
				url = '/video/list';
			}
			this.router.navigate([url], {
				queryParams: {
					tabIndex: this.tabIndex
				}
			});
			//history.go(-1);
		}

	}

	validValueInput() {
		let result = false;
		if (!(this.invitationInfo.courseRecords == null || this.invitationInfo.courseRecords.length == 0)) {
			result = true;
		}
		if (!(this.invitationInfo.name == null || this.invitationInfo.name == '')) {
			result = true;
		}
		if (!(this.invitationInfo.type == null || this.invitationInfo.type == '')) {
			result = true;
		}
		if (!(this.invitationInfo.appraiserIds == null || this.invitationInfo.appraiserIds == [] ||
			this.invitationInfo.appraiserIds.length == 0)) {
			result = true;
		}

		if (!(this.invitationInfo.startTime == null || this.invitationInfo.startTime == '')) {
			result = true;
		}

		if (!(this.invitationInfo.require == null || this.invitationInfo.require == '')) {
			result = true;
		}

		if (!(this.invitationInfo.templateName == null || this.invitationInfo.templateName == '')) {
			result = true;
		}

		if (!(this.invitationInfo.teacherInfo == null || this.invitationInfo.teacherInfo == '')) {
			result = true;
		}
		return result;
	}

	validValue() {
		let result = false;
		if (this.invitationInfo.courseRecords == null || this.invitationInfo.courseRecords.length == 0) {
			this.vaildModel.courseRecordsStatus = true;
			result = true;
		} else {
			this.vaildModel.courseRecordsStatus = false;
		}
		if (this.invitationInfo.name == null || this.invitationInfo.name == '') {
			this.vaildModel.nameStatus = true;
			result = true;
		} else {
			this.vaildModel.nameStatus = false;
		}
		if (this.invitationInfo.type == null || this.invitationInfo.type == '') {
			this.vaildModel.typeStatus = true;
			result = true;
		} else {
			this.vaildModel.typeStatus = false;
		}
		this.invitationInfo.appraiserIds = [];
		this.invitationInvitees.map((item) => {
			this.invitationInfo.appraiserIds.push(item.id);
		});
		if (this.invitationInfo.appraiserIds == null || this.invitationInfo.appraiserIds == [] || this.invitationInfo.appraiserIds.length == 0) {
			this.vaildModel.appraiserIdsStatus = true;
			result = true;
		} else {
			this.vaildModel.appraiserIdsStatus = false;
		}

		if (this.invitationInfo.startTime == null || this.invitationInfo.startTime == '') {
			this.vaildModel._dateStatus = true;
			result = true;
		} else {
			this.vaildModel._dateStatus = false;
		}
		return result;
	}

	changeActivity() {
		if (this.validValue()) {
			this.dialogService.alertWarning('存在必填项未填写，请填写后提交！');
			return;
		}
		if (this.activityId) {
			this.btnDebunce = false;
			this.invitationInterface.editActivity(this.invitationInfo).subscribe((data) => {
				this.messageService.success('修改成功！');
				if (data.invitationId) {
					// type: 0 别人邀请我  1 我邀请别人
					this.router.navigate(['invitation/detail/' + data.invitationId + '/1/1']);
				} else {
					this.router.navigate(['video/index']);
				}
				;
				this.btnDebunce = true;
			}, error => this.btnDebunce = true);
		} else {
			this.btnDebunce = false;
			let param = Object.assign({}, this.invitationInfo, {gardenId: this.currentGardenId});
			this.invitationInterface.addActivity(param).subscribe(() => {
				this.messageService.success('发布成功！');
				this.router.navigate(['video/index']);
				this.btnDebunce = true;
			}, error => this.btnDebunce = true);
		}
	}

	deleteSelectScale() {
		this.invitationInfo.templateId = '';
		this.invitationInfo.templateName = '';
	}

	changeInput(name, length) {
		if (this.invitationInfo[name].length > length) {
			this.invitationInfo[name] = this.invitationInfo[name].substring(0, length);
			console.log(this.invitationInfo[name]);
		}
	}

	selectScale() {
		this.dialogService.openDialog({
			title: '选择评课量表',
			content: ScaleSelectComponent,
			class: 'select-scale',
			footer: false,
			width: 600,
			maskClosable: false,
			onCancel: () => {
				console.log('onCancel');
			},
			onOk: () => {

			},
			componentParams: {
				selectScaleModel: {id: this.invitationInfo.templateId}
			}
		});
		this.dialogService.getModal().subscribe((result) => {
			if (result.type && result.type == 'ok') {
				this.selectScaleModel = result.selectScaleModel;
				this.invitationInfo.templateId = this.selectScaleModel.id;
				this.invitationInfo.templateName = this.selectScaleModel.name;
			}
		});
	}

	/**
	 * 删除被邀请人
	 * @param {{}} removedInvitee
	 */
	deleteAppraiser(removedInvitee: {}): void {
		this.invitationInvitees = this.invitationInvitees.filter(invitee => invitee !== removedInvitee);
		this.invitationInfo.appraiserIds = this.invitationInvitees.map((item) => {
			return item.id;
		});
	}

	checkPerson() {
		const persons = [];
		this.invitationInvitees.map((item) => {
			persons.push(item.id);
		});
		this.selectPersonService.open({
			persons: persons,
			disablePersons: [this.condition.teacherId],
			gardenId: this.currentGardenId,
			component: SelectPersonComponent,
			onOk: (data) => {
				this.invitationInvitees = data;
				// this.invitationInfo.appraiserIds = data.map((item) => {
				// 	return item.id;
				// });
			}
		});
	}
}
