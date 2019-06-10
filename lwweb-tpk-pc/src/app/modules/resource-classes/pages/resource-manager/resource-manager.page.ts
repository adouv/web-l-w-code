import {Component, Inject, OnInit} from '@angular/core';
import {QualityCourseInterface} from '../../../../services/resource/quality-course.interface';
import {ResourceClassesInterface} from '../../../../services/resource/resource-classes.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {QualityCoursesModel} from '../../components/quality-courses/quality-courses.model';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';
import {EnvDefaultConfig, LW_FILE_CODE} from '../../../../app.export';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {QualityCourseUploadComponent} from '../../components';
import {AccountService} from '../../../../services/account';

@Component({
	templateUrl: 'resource-manager.page.html',
	styleUrls: ['resource-manager.page.scss']
})

export class ResourceManagerPage implements OnInit {
	private outlineId: string;
	private subjectCode: string;
	courseTitle: string;
	qualityCoursesList: QualityCoursesModel[] = [];
	uploader: FileUploader;
	videoType: any = [];

	constructor(private qualityCourseInterface: QualityCourseInterface,
				private resourceClassesInterface: ResourceClassesInterface,
				private activatedRoute: ActivatedRoute,
				@Inject(LW_FILE_CODE) private fileCode,
				private envDefaultConfig: EnvDefaultConfig,
				private modalService: NzModalService,
				private message: NzMessageService,
				private router: Router,
				private account: AccountService) {
		this.videoType = ['mp4', 'rmvb', 'avi', 'flv', 'wmv'];
	}

	ngOnInit() {
		this.getRouteParam();
		this.setFileOption();
		if (this.outlineId) {
			this.getQualityCourseList();
		}
	}

	/**
	 * 获取大纲id
	 */
	private getRouteParam() {
		this.outlineId = this.activatedRoute.snapshot.params['id'];
		this.activatedRoute.queryParams.subscribe(queryParams => {
			this.subjectCode = queryParams.subjectCode || 'biology';
			this.courseTitle = queryParams.title;
		});
	}

	/**
	 * 获取精品课列表
	 */
	getQualityCourseList() {
		this.qualityCourseInterface.getQualityCourseList(this.outlineId, this.account.getCurrentGardenId).subscribe((data) => {
			if (data.length > 0) {
				this.courseTitle = data[0] ? data[0].outlineTitle : '';
				this.qualityCoursesList = data;
			}
		});
	}

	/**
	 * 设置文件上传参数
	 */
	private setFileOption() {
		// 获取上传到文件服务器的地址
		const fileServerUrl = this.envDefaultConfig.getServerUrl(this.fileCode.UPLOAD);
		const options: FileUploaderOptions = {
			autoUpload: false,
			url: fileServerUrl,
			method: 'POST',
			itemAlias: 'filedata', // 文件别名
			removeAfterUpload: true, // 是否在上传完成后从队列中移除
			additionalParameter: {
				folder: 'video'
			},
			maxFileSize: 100 * 1024 * 1024
		};
		this.uploader = new FileUploader(options);
		this.uploader.onWhenAddingFileFailed = (item, filter) => {
			if (filter.name === 'fileSize') {
				this.message.warning('不支持超过100M的单个文件上传！');
			}
		};
		this.uploader.onAfterAddingAll = (fileItems) => {
			for (const item of fileItems) {
				const type = this.getSuffixName(item.file.name);
				if (this.videoType.indexOf(type) < 0) {
					this.message.warning('文件格式错误，请重新选择！');
					this.uploader.clearQueue();
					return;
				}
			}
			this.openUploadDialog();
		};
	}

	private openUploadDialog() {
		this.modalService.open({
			title: '精品课上传',
			content: QualityCourseUploadComponent,
			footer: false,
			maskClosable: false,
			class: 'popover-file',
			componentParams: {
				uploader: this.uploader,
				outlineId: this.outlineId,
				subjectCode: this.subjectCode
			},
			onOk: () => {
				this.message.success('上传成功!');
				this.getQualityCourseList();
			},
			onCancel: () => {
				this.uploader.cancelAll();
				this.uploader.clearQueue();
			},
		});
	}

	goBack() {
		this.router.navigate(['resource/home/1']);
	}

	private getSuffixName(name: string) {
		return name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
	}
}
