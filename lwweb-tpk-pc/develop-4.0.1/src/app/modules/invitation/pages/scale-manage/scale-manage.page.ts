import {Component, OnInit} from '@angular/core';
import {InvitationInterface} from '../../services/invitation.interface';
import {AccountService} from '../../../../services/account';
import {ActivatedRoute, Router} from '@angular/router';
import {FileDownloadService} from '../../../../services/file/file-download.service';
import {DialogService} from '../../../../services/dialog/dialog.service';
import {PageService} from '../../../../services/page/page.service';
import {NzModalService} from 'ng-zorro-antd';

@Component({
	templateUrl: 'scale-manage.page.html',
	styleUrls: ['scale-manage.page.scss']
})

export class ScaleManagePage implements OnInit {
	keyword = '';
	timerObj: any;
	scaleDatas: any;
	selectedTpkType: number;
	typeList: any[];
	ellipticalTitle: string;
	resolvingConflicts: string;
	private routeParams;

	constructor(private dialogService: DialogService, private fileDownloadService: FileDownloadService,
				private modalService: NzModalService,
				private router: Router, private invitationInterface: InvitationInterface,
				private activatedRoute: ActivatedRoute, private accountService: AccountService) {
		this.scaleDatas = [];
		this.routeParams = {};
		this.scaleDatas = {page: PageService.setPageParams(1, 20), list: [], loaded: false, total: 0};
	}

	ngOnInit() {
		this.getScales();
		this.activatedRoute.queryParams.subscribe(res => {
			this.routeParams = {
				tabIndex: res.tabIndex
			};
		});

	}

	onSearch($event) {
		this.keyword = $event;
		this.getScales();
	}

	addScale() {

	}

	canceHome() {

	}

	downTemplate() {
		this.fileDownloadService.downloadFile({
			name: '教学评价模板.xlsx',
			path: '',
			title: '下载成功'
		}, '/comment/template/templateFile');
	}

	editScale(scale) {
		this.stopPropagation();
		this.router.navigate(['/invitation/scale/add'], {
			queryParams: {
				id: scale.id
			}
		});
	}

	scaleDetails(scale) {
		this.accountService.getPermissionCode().subscribe(permissionList => {
			if (permissionList.includes('commentTemplate:list')) {
				this.router.navigate(['/invitation/scale/add'], {
					queryParams: {
						id: scale.id,
						type: 0
					}
				});
			}
		});
	}

	/**
	 * 阻止默认行为
	 */
	private stopPropagation() {
		window.event ? window.event.cancelBubble = true : event.stopPropagation();
	}

	deleteScale(scale) {
		this.stopPropagation();
		this.dialogService.openConfirm({
			title: '提示',
			content: '确认删除当前量表？',
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
				this.invitationInterface.delTemplate(scale.id).subscribe((result) => {
					this.scaleDatas = {page: PageService.setPageParams(1, 20), list: [], loaded: false, total: 0};
					this.getScales();
					this.dialogService.alertSuccess('删除文件成功！');
				});
			},
			onCancel: () => {
				console.log('cancel');
			}
		});

	}

	getScales() {
		this.invitationInterface.getTemplates({
			gardenId: this.accountService.getCurrentGardenId(),
			keyword: this.keyword,
			type: this.selectedTpkType,
			...this.scaleDatas.page
		}).subscribe((result) => {
			this.scaleDatas.loaded = true;
			this.scaleDatas.list = result.data;
			this.scaleDatas.total = result.totalCount;
		});
	}

	changeList($event, record) {
		if (record && record.page.size < record.total) {
			record.page.size = record.page.size + 20;
		}
		this.getScales();
	}

	goVideoList() {
		this.router.navigate(['/video/list'], {
			queryParams: {
				tabIndex: this.routeParams.tabIndex
			}
		});
	}

	getSelectedTemplate(event) {
		this.selectedTpkType = event;
		this.getScales();
		if (event === 1) {
			this.ellipticalTitle = '暂无教学反思模板，请联系学校管理员';
		} else {
			this.ellipticalTitle = '暂无匹配的量表数据';
		}
	}

	/**
	 * 修改量表管理有效性
	 * @param event
	 * @param data
	 */
	changeEffectiveness(event, data) {
		console.log(event);
		console.log(data);
		let params = {
			gardenId: data.gardenId,
			ignoreId: data.id
		};
		let params2 = {
			id: data.id,
			effectiveness: event
		};
		if (event === true && data.type === 1) {
			this.checkConflict(params, event);
		} else {
			this.saveTemplate(params2);
		}

	}


	/**
	 * 校验模版冲突
	 * @param params
	 * @param event
	 */
	checkConflict(params, event) {
		this.invitationInterface.checkConflict(params.gardenId, params.ignoreId).subscribe(data => {
			this.resolvingConflicts = data;
			let params2 = {
				id: params.ignoreId,
				effectiveness: event,
				resolvingConflicts: data
			};
			if (data === false) {
				this.modalService.open({
					title: '提示',
					content: '该模板将被置为有效，原有模板将被置为无效，请确认是否继续该操作？',
					cancelText: '否',
					okText: '是',
					closable: true,
					width: 400,
					showConfirmLoading: false,
					maskClosable: false,
					onOk: () => {
						params2['resolvingConflicts'] = true;
						this.saveTemplate(params2, true);
					},
					onCancel: () => {
						this.getScales();
						return;
					}
				});
			} else {
				this.saveTemplate(params2);
			}
		});
	}

	saveTemplate(param, status?) {
		this.invitationInterface.updateEffectiveness(param).subscribe(data => {
			this.getScales();
		});
	}

}
