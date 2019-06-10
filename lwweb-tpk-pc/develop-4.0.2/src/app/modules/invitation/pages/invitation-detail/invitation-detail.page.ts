import { Component, ChangeDetectorRef } from '@angular/core';
import { InvitationInterface } from '../../services/invitation.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../services/account';
import { ObjectiveEvaluationComponent } from '../../components/objective-evaluation/objective-evaluation.component';
import { EvaluationResultsComponent } from '../../components/evaluation-results/evaluation-results.component';
import { CompletedEvaluationComponent } from '../../components/completed-evaluation/completed-evaluation.component';
import { Observable } from 'rxjs/Observable';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UnfinishedEvaluationComponent } from '../../components/unfinished-evaluation/unfinished-evaluation.component';
import { EvaluationChartsComponent } from '../../components/evaluation-charts/evaluation-charts.component';
import { SubjectiveEvaluationComponent } from '../../components/subjective-evaluation/subjective-evaluation.component';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { FileDownloadService } from '../../../../services/file/file-download.service';
import { VideoClassesInterface } from '../../../../services/videos/video-classes.interface';

@Component({
	templateUrl: 'invitation-detail.page.html',
	styleUrls: ['invitation-detail.page.scss']
})

export class InvitationDetailPage {

	data: any = {};

	player: any = {};
	playerFlag: boolean = false;

	list = [];

	tabInputs = [];

	leftTabs = [];

	commentator = [];

	currentClass: any;

	tabOutputs = [];

	videoInfo: any;

	currentClassStartTime: string;

	currentAccountId = this.accountService.getAccountId();

	currentGardenId = this.accountService.getCurrentGardenId();

	isShowEdit: boolean;

	isOutTime = false;

	invitationType: number; // 0是别人邀请我 1是我发起的

	isAppraise: number; // 0是被评课 1是评课

	appraiserStatus: number;	// 2是全部已评

	private activityId: string; // 当前活动id

	selectedIndex: number; // tab页索引

	allowBack = [false, false, false];
	private params: any;
	playType = 'video';
	loadComplete = false;
	index: any = 0;

	title: string = '';
	noSource = false;


	constructor(private invitationInterface: InvitationInterface,
		activatedRoute: ActivatedRoute,
		private messageService: NzMessageService,
		private dialogService: DialogService,
		private accountService: AccountService,
		private router: Router,
		private fileDownloadService: FileDownloadService,
		private videoClassesInterface: VideoClassesInterface,
		private modalService: NzModalService,
		private cd: ChangeDetectorRef) {
		activatedRoute.params.subscribe(value => {
			// debugger;
			this.activityId = value.id;
			this.getDetailById(value.id);
			this.invitationType = parseInt(value.type, 0);
			this.isAppraise = parseInt(value.appraise, 0);
		});
		this.params = {};
		activatedRoute.queryParams.subscribe(params => {
			// debugger;
			this.params.tabIndex = params.tabIndex;//非undefined为全校任务
		});
	}

	getDetailById(id) {

		const commentator$ = this.invitationInterface.getCommentatorById(id);
		const detail$ = this.invitationInterface.getInvitationDetail(id, this.currentGardenId);
		const invitation$ = this.invitationInterface.getInvitationListById(id, this.currentGardenId);
		Observable.combineLatest(detail$, commentator$, invitation$, (detail, commentator, invitations) => {
			this.handleEvaluation(detail, commentator, invitations);
			this.controlEditBtn(detail);
			return { detail, commentator, invitations };
		}).subscribe(data => {
			this.data = data.detail;
			this.list = data.invitations.map((item, index) => {
				return Object.assign({}, item, { index: index });
			});
			console.log(data.invitations);
			this.currentClass = data.invitations[0];
			this.title = `${this.currentClass.lessonTitle ? this.currentClass.lessonTitle : '未配置课节名称'}${this.currentClass.teacherName + '-'}${this.currentClass.subjectName + '-'}${this.currentClass.gradeName}${this.currentClass.className}${'第' + this.currentClass.giveLessonTime + '周'}${'第' + this.currentClass.period + '节'}`
		});
	}

	handleEvaluation(detail, commentator, invitations) {
		this.getAppraiserStatus(detail.id, this.currentAccountId);
		this.isOutTime = detail.stage === 2;
		this.handleCommentator(commentator);
		// 我发起的/别人邀请我的-被评课
		if (this.invitationType === 1 || (this.invitationType === 0 && this.isAppraise === 0)) {
			this.initiatorTabComponent(detail, commentator);
		} else {
			this.anotherTabComponent(detail);
		}
		const classInfo = invitations[0];
		if (classInfo !== undefined) {
			this.getPlayerUrl(classInfo.classId, classInfo.giveLessonTime, classInfo.period);
		}
	}

	initiatorTabComponent(detail, commentator) {
		const commented = commentator.filter(item => item.status !== 0);
		const comment = commentator.filter(item => item.status === 0);
		this.leftTabs = [
			{ label: '评价汇总', component: EvaluationChartsComponent },
			{ label: '已完成评价人', component: CompletedEvaluationComponent },
			{ label: '未完成评价人', component: UnfinishedEvaluationComponent }
		];
		this.tabInputs[0] = { data: detail, type: parseInt(detail.type, 10) };
		this.tabInputs[1] = { data: detail, persons: commented, type: parseInt(detail.type, 10) };
		this.tabInputs[2] = { data: detail, persons: comment };
	}

	anotherTabComponent(detail) {
		this.leftTabs = [
			{ label: '客观评价', component: ObjectiveEvaluationComponent },
			{ label: '主观评价', component: SubjectiveEvaluationComponent },
			{ label: parseInt(detail.type, 10) ? '诊断结果' : '改进建议', component: EvaluationResultsComponent }
		];
		this.invitationInterface.getEvaluationSubjectiveTemplate(detail.templateId).subscribe(data => {
			if (data[0].name === '') {
				this.leftTabs.splice(1, 1);
			}
		});
		this.tabInputs[0] = { data: detail, isOutTime: this.isOutTime };
		this.tabInputs[1] = { data: detail, isOutTime: this.isOutTime };
		this.tabInputs[2] = { data: detail, isOutTime: this.isOutTime, type: parseInt(detail.type, 10) };
		this.tabOutputs = [{
			changeSubmit: () => {
				this.getAppraiserStatus(this.data.id, this.currentAccountId);
				this.getCommentatorById();
			},
			changeModel: (data) => (this.allowBack[0] = data)
		}, {
			changeSubmit: () => {
				this.getAppraiserStatus(this.data.id, this.currentAccountId);
				this.getCommentatorById();
			},
			changeModel: (data) => (this.allowBack[1] = data)
		}, {
			changeSubmit: () => {
				this.getAppraiserStatus(this.data.id, this.currentAccountId);
				this.getCommentatorById();
			},
			changeModel: (data) => (this.allowBack[2] = data)
		}];
	}

	changeAccount(account) {
		this.currentAccountId = account;
		this.tabInputs[0].account = account;
		this.tabInputs[1].account = account;
		this.tabInputs[2].account = account;
		this.selectedIndex = 0;
	}

	onChangeCard(event) {
		this.playerFlag = false;
		// debugger
		console.log('event--------:', event);
		this.index = event.index;
		this.currentClass = event;
		this.getPlayerUrl(event.classId, event.giveLessonTime, event.period);
	}

	controlEditBtn(detail) {
		const isInitiator = detail.initiatorId === this.accountService.getAccountId();
		const currentTime = new Date().getTime();
		const isActiveTime = detail.startTime > currentTime;
		this.isShowEdit = isActiveTime && isInitiator && !!this.invitationType;
	}

	getPlayerUrl(classId, startTime, period) {
		this.videoInfo = { classId: classId, giveLessonTime: startTime, period: period, status: 1 };
		console.log('---start---',this.videoInfo);
		this.player = [];
		this.loadComplete = false;
		this.playerFlag = false;
		this.noSource = false;
		this.currentClassStartTime = startTime;
			this.invitationInterface.getUnicastPlayUrl(classId, startTime).subscribe(data => {
				console.log('---end---');
				if (data && data.length > 0) {
					this.loadComplete = true;
					this.player = data;
					console.log('player:',this.player);
					if (this.player && this.player.length > 0) {
						let count = 0;
						this.player.forEach(element => {
							if (element.mbPlayUrl == null || element.mbPlayUrl == "" || !element.mbPlayUrl) {
								count++;
							}
						});
						if (this.player.length == count) {
							this.noSource = true;
						}
					}
					this.playerFlag = true;
				}
			});
	}

	private getAppraiserStatus(id, accountId) {
		this.invitationInterface.getAppraiserStatus(id, accountId).subscribe((data) => {
			this.appraiserStatus = data;
		});
	}

	changeVideo(video) {
		// debugger;
		const url = '/invitation/detail/';
		switch (this.invitationType) {
			case 0:
				this.router.navigate([url + video.id + '/0/1'], {
					queryParams: {
						tabIndex: this.params.tabIndex
					}
				});
				break;
			case 1:
				this.router.navigate([url + video.id + '/0/0'], {
					queryParams: {
						tabIndex: this.params.tabIndex
					}
				});
				break;
			case 2:
				this.router.navigate([url + video.id + '/1/1'], {
					queryParams: {
						tabIndex: this.params.tabIndex
					}
				});
				break;
		}
	}

	routeGo(page) {
		// 默认跳转列表页
		let url = '/video/list';
		if (page === 'index') {
			url = '/video/index';
		}
		if (this.allowBack.indexOf(true) > -1) {
			this.dialogService.openConfirm({
				title: '提示',
				content: '是否离开当前页面？已填写信息将会丢失。',
				mask: false,
				zIndex: 1003,
				class: 'evaluation-confirm',
				wrapClassName: 'vertical-center-modal',
				cancelText: '否',
				okText: '是',
				closable: true,
				width: 400,
				showConfirmLoading: false,
				maskClosable: false,
				onOk: () => {
					this.router.navigate([url]);
				},
				onCancel: () => {
					console.log('cancel');
				}
			});
		} else {
			this.router.navigate([url], { queryParams: this.params });
		}
	}

	private getCommentatorById() {
		this.invitationInterface.getCommentatorById(this.activityId).subscribe((data) => {
			this.handleCommentator(data);
		});
	}

	private handleCommentator(data) {
		if (!this.isOutTime) {
			const arr = [];
			for (const item of data) {
				if (item.status !== 0) {
					arr.push(item);
				}
			}
			this.commentator = arr;
		} else {
			this.commentator = data;
		}
	}

	downEvaluationTemplate(activityId) {
		let path = '/comment/activity/word?activityId=' + activityId;
		this.videoClassesInterface.getActivityFilename({
			activityId: activityId,
		}).subscribe(data => {
			let fileName = this.fileDownloadService.existsLocalFile(data.fileName);
			this.fileDownloadService.downloadFile({
				name: fileName,
				path: '',
				title: '下载成功'
			}, path);
		});
		// this.fileDownloadService.downloadFile({
		// 	name: '文件下载.docx',
		// 	path: '',
		// 	title: '下载成功'
		// }, path);
	}
}
