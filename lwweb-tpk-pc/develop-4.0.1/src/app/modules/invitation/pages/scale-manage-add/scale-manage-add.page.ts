import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { EnvDefaultConfig, ModuleCode, LW_MODULE_CODE } from '../../../../app.export';
import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { InvitationInterface } from '../../services/invitation.interface';
import { AccountService } from '../../../../services/account/account.service';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { FileDownloadService } from '../../../../services/file/file-download.service';
@Component({
	// selector: 'scale-manage-add',
	templateUrl: 'scale-manage-add.page.html',
	styleUrls: ['scale-manage-add.page.scss']
})

export class ScaleMangeAddPage implements OnInit {
	uploadErr = false;
	isSubmit = false;
	vaildModel: any = {};
	gardenName: string;
	routeParams: any = {};
	uploader: FileUploader;
	data: any = { usingStatus: true };
	modelTemplate: any = {};
	allowTypes = ['xlsx', 'xls'];
	uploaderProgress = 0;
	inputDatas: Array<any>;
	@ViewChild('selectFile')
	selectFile;
	singleValue: boolean;
	isDisabled: boolean;
	isSeeStatus: boolean;
	selectType: number = 0;
	effectiveness: boolean = true;
	optionDisable:boolean = false;
	btnDebunce: boolean = true;
	resolvingConflicts:boolean;
	constructor(private router: Router,
		private messageService: NzMessageService,
		private dialogService: DialogService,
		private templateInterface: InvitationInterface,
		private envDefaultConfig: EnvDefaultConfig,
		private activatedRoute: ActivatedRoute,
		private modalService: NzModalService,
		private accountService: AccountService,
		private notification: NzNotificationService,
		private fileDownloadService: FileDownloadService,
		@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
		this.routeParams = {};
		this.singleValue = true;
		this.isDisabled = true;
		this.isSeeStatus = true;
		this.inputDatas = [{
			data: {
				name: ''
			}
		}];
	}

	ngOnInit() {
		this.initParams();
		// this.routeParams.gardenId = this.accountService.getGardenId();
		this.initUploader();
		this.getGardenInfo();
		this.getTemplateById();
	}

	initParams() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.routeParams = {
				id: res.id,
				gardenId: this.accountService.getCurrentGardenId()
			};
			this.isSeeStatus = res.type != 0;
			// this.routeParams = res;
			// this.routeParams.gardenId = this.accountService.getGardenId();
			console.log(this.isSeeStatus);
		});
	}

	/**
	 * 下载客观评价模版
	 */
	downTemplate() {
		this.fileDownloadService.downloadFile({
			name: '教学评价模板.xlsx',
			path: '',
			title: '下载成功'
		}, '/comment/template/templateFile');
	}
	/**
	 * 初始化上传参数
	 */
	initUploader() {
		this.uploader = new FileUploader({
			url: this.templateInterface.uploadTemplateFile(),
			method: 'POST',
			itemAlias: 'templateFile',
			autoUpload: false,
			removeAfterUpload: true,
			maxFileSize: 2 * 1024 * 1024
		});
	}

	getGardenInfo() {
		if (this.routeParams.gardenId) {
			this.templateInterface.getGardenInfo(this.routeParams.gardenId).subscribe(res => {
				this.gardenName = res[0].gardenName;
			});
		}
	}

	inputChange($event, inputData) {
		if ($event !== inputData.data.name) {
			inputData.data.itemModify = true;
		}
	}

	/**
	 * 获取模板数据
	 */
	getTemplateById() {
		if (this.routeParams.id) {
			this.templateInterface.getTemplateById(this.routeParams.id).subscribe(data => {
				// data.usingStatus = !!data.usingStatus;
				this.data = data;
				this.modelTemplate = data;
				console.log(this.modelTemplate);
				this.effectiveness = data.effectiveness;
				this.selectType = data.type;
				this.optionDisable = true;
				this.uploaderProgress = 100;
				if (data.subjectiveItems.length > 0) {
					this.inputDatas = [];
					data.subjectiveItems.map((value) => {
						this.inputDatas.push({
							data: value
						})
					});
					// this.inputDatas = data.subjectiveItems;
				}
				console.log(this.data);
			});
		}
	}

	getSelectedTemplate(event) {
		this.selectType = event;
		this.inputDatas = [{
			data: {
				name: ''
			}
		}];
	}
	changeEffectiveness(event) {
		this.effectiveness = event;
	}
	// 上传文件改变
	selectedFileOnChanged(e) {
		const queueLists = this.uploader.queue;
		const files = e.target.files;
		if (files[0].size > this.uploader.options.maxFileSize) {
			this.vaildModel.isMaxSize = true;
			this.messageService.warning('不支持超过2M的文件上传！');
			return;
		} else {
			this.vaildModel.isMaxSize = false;
		}
		const fileExt = files[0].name && files[0].name.substring(files[0].name.lastIndexOf('.') + 1);
		if (this.allowTypes.indexOf(fileExt) > -1 && queueLists.length > 0) {
			queueLists[0].upload();
			queueLists[queueLists.length - 1].onSuccess = (response, status, headers) => {
				if (status === 200) {
					this.modelTemplate = JSON.parse(response);
					this.uploadErr = false;
					this.vaildModel.isFile = false;
					this.vaildModel.isMaxSize = false;
					this.vaildModel.type = false;
					this.uploaderProgress = 100;
				}
				e.target.value = null;
			};
			this.onProgress(queueLists[queueLists.length - 1]);
			queueLists[queueLists.length - 1].onError = (err) => {
				this.notification.blank('提示', JSON.parse(err).error_description, { nzDuration: 0 });
				this.uploadErr = true;
				e.target.value = null;
			};
		} else {
			this.vaildModel.type = true;
			this.messageService.warning('文件格式错误！');
			this.uploader.queue = [];
			// this.uploadErr = true;
			e.target.value = null;
		}
	}

	onProgress(fileItem) {
		fileItem.onProgress = (progress) => {
			this.uploaderProgress = progress;
		};
	}

	uploadTemp() {
		this.selectFile.nativeElement.click();
	}

	/**
	 * 取消
	 */
	cancelTemplate() {
		if (!((!this.data.name && JSON.stringify(this.modelTemplate) === '{}') && !this.inputhaveContent() || (this.data.name === undefined && JSON.stringify(this.modelTemplate) === '{}') && !this.inputhaveContent()) && this.isSeeStatus) {
			this.dialogService.openConfirm({
				title: '提示',
				content: '取消后，量表将不会被保存，是否确认取消？',
				mask: false,
				maskClosable: false,
				zIndex: 1003,
				okText: '否',
				class: 'evaluation-confirm',
				cancelText: '是',
				wrapClassName: 'vertical-center-modal',
				onCancel: () => {
					this.router.navigate(['/invitation/scale'], {
						queryParams: {
							gardenId: this.routeParams.gardenId
						}
					});
				},
				onOk: () => {

				}
			})
		} else {
			this.router.navigate(['/invitation/scale'], {
				queryParams: {
					gardenId: this.routeParams.gardenId
				}
			});
		}
	}

	inputhaveContent() {
		let result = false;
		this.inputDatas.map((value, index) => {
			console.log(value.data);
			if (!(value.data.name == null || value.data.name == '')) {
				result = true;
			}
		})
		return result;
	}

	goTemplate() {
		this.router.navigate(['/invitation/scale'], {
			queryParams: {
				gardenId: this.routeParams.gardenId
			}
		});
	}

	/**
	 * 保存模板数据
	 */
	saveTemplateList() {
		this.isSubmit = true;
		this.vaildModel.hasName = true;
		if (this.validValue()) {
			this.saveTemplate();
		}
	}

	/**
	 * 保存模板
	 */
	saveTemplate() {
		if(!this.btnDebunce){
			return;
		}
		this.btnDebunce = false;
		let subjectiveItemNames = [];
		this.inputDatas.map((value) => {
			subjectiveItemNames.push(value.data);
		})
		const params = {
			id: this.routeParams.id || null,
			name: this.data.name,
			gardenId: this.routeParams.gardenId,
			objectiveItems: this.modelTemplate.items,
			totalScore: this.modelTemplate.totalScore,
			subjectiveItems: subjectiveItemNames,
			type: this.selectType,
			effectiveness: this.effectiveness,
			resolvingConflicts:this.resolvingConflicts
		};
		if (this.routeParams.id) {
			this.exitTemplate(params);
		} else {
			this.updateTemplate(params);
		}
	}

	// 编辑模板
	exitTemplate(params) {
		this.templateInterface.exitTemplate(params).subscribe(data => {
			if(data.code === 1){
				this.getTempateStartup("续操作将把原教学反思置为无效，使用当前教学反思模板，是否继续？");
			}else{
				this.messageService.success('保存成功！', { nzDuration: 2000 });
				this.router.navigate(['/invitation/scale'], {
					queryParams: {
						gardenId: this.routeParams.gardenId
					}
				});
			};
			this.btnDebunce = true;
		}, error => {
			this.btnDebunce = true;
			this.messageService.warning(error.error.error_description);
		});
	}

	// 新建模板
	updateTemplate(params) {
		this.templateInterface.saveTemplate(params).subscribe(data => {
			this.btnDebunce = true;
			if(data.code === 1){
				this.getTempateStartup('该模板将被置为有效，原有模板将被置为无效，请确认是否继续该操作？');
			}else{
				this.messageService.success('保存成功！', { nzDuration: 2000 });
				this.router.navigate(['/invitation/scale'], {
					queryParams: {
						gardenId: this.routeParams.gardenId
					}
				});
			}


		}, error => {
			this.btnDebunce = true;
			this.messageService.warning(error.error.error_description);

		});
	}


	getTempateStartup(tips){
		if(this.effectiveness === true && this.selectType === 1){
			this.templateInterface.checkConflict(this.routeParams.gardenId,this.routeParams.id||null).subscribe(data=>{
				this.resolvingConflicts = data;
				if (data === false) {
					this.modalService.open({
						title: '提示',
						content: tips,
						cancelText: '否',
						okText: '是',
						closable: true,
						width: 400,
						showConfirmLoading: false,
						maskClosable: false,
						onOk: () => {
							this.resolvingConflicts = true;
							this.saveTemplate();


						},
						onCancel: () => {
							return;
						}
					});
				} else {
					this.saveTemplate();
				}
			})
		}

	}
	// 查询列表状态值
	getStartup() {
		this.templateInterface.getStartup({
			gardenId: this.routeParams.gardenId,
			ignoreId: this.routeParams.id || null
		}).subscribe(data => {
			if (data && this.data.usingStatus) {
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
						this.saveTemplate();
					},
					onCancel: () => {
						return;
					}
				});
			} else {
				this.saveTemplate();
			}
		});
	}

	validValue() {
		let flag = true;
		if (!this.data.name || this.data.name === '') {
			flag = false;
		}
		if (JSON.stringify(this.modelTemplate) === '{}') {
			this.vaildModel.isFile = true;
			flag = false;
		}
		// } else {
		// 	for (const data of this.modelTemplate.items) {
		// 		for (const child of data.childItems) {
		// 			if (!data.name || data.name === '' || !child.name || child.name === '' || !child.score || child.score === '') {
		// 				flag = false;
		// 			}
		// 		}
		// 	}

		// 	console.log(2);
		// }
		// this.inputDatas.map((value, index) => {
		// 	if (value.data.name == '') {
		// 		value.status = true;
		// 		flag = false;
		// 	}
		// })
		return flag;
	}

	emptyValue() {
		this.vaildModel.hasName = false;
	}

	inputValue(input) {
		input.status = false;
	}

	addInputGroup(index) {
		this.inputDatas.splice(index + 1, 0, {
			data: {
				name: ''
			}
		});
	}

	removeInputGroup(index) {
		// this.inputDatas = this.inputDatas.slice(0, i);
		let inputAry = [];
		this.inputDatas.map((value, i) => {
			if (i != index) {
				inputAry.push(value);
			}
		});
		this.inputDatas = inputAry;
	}
}