import {
	Component, ViewChild, OnInit, OnDestroy, HostListener
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudHomeService} from '../../services/cloud-home.service';
import {CourseMaterialService} from '../../services/material/CourseMaterialService';
import {CourseSpaceDto} from '../../services/material/dto/CourseSpaceDto';
import {MaterialItemDto} from '../../services/material/dto/MaterialItemDto';
import {ConfirmationService} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';
import {FileUploaderCourseComponent} from '../../components/uploader/uploader';
import {
	COURSE_NAME, COURSE_STATUE, LESSON_METHOD, LESSON_NAME, MAX_FILE_SIZE, COURSE_NAME_UPLOAD,
	RouterCourseWareParams
} from './courseware.const';
import {FlowUploader} from '../../components/ng2-flow/flow-uploader.model';
import {LwOauth2TokenService} from '../../../../app.export';
import {CourseInterface} from '../../services/course.interface';
import {ScrollWidthDirective} from '../../../../directives/scroll-width.directive';
import {FileUploaderOptionsExtend} from '../../components/uploader/uploader.options.extend';
import {NumberToUpperCasePipe} from '../../../../pipes/number/numberToUpperCase.pipe';
import {CourseDialogService} from '../../components/exercise/dialog.service';
import {NzMessageService} from 'ng-zorro-antd';
import {FileDownloadService} from '../../../../services/file/file-download.service';
import {SelectDataItem} from '../../services/entity/select-data-item';

@Component({
	selector: 'course-ware',
	templateUrl: './courseware.html',
	styleUrls: ['./courseware.scss']
})
export class CourseWarePage implements OnInit, OnDestroy {

	private lessonId: string;

	private lessonDate: string;

	private selectedParams: RouterCourseWareParams;

	lessonStages: SelectDataItem[] = [];

	currStageCode: string;

	isShowBanner = true;

	isUploader = false;

	isDownloadDialog = false;

	courseMaterial: any = {};

	classAllName: string;

	uploaderDisplayStageName: string;

	courseSpace: CourseSpaceDto;

	courseMaterials: MaterialItemDto[] = [];

	private uploadFileMap: Map<string, string> = new Map();

	materialFileNames: string[] = [];

	uploaderOptions: FileUploaderOptionsExtend;

	@ViewChild('button') button;

	@ViewChild('clondSpace') clondSpace;

	@ViewChild('exWrapper') exWrapper;

	@ViewChild('mainBox') mainBox;

	@ViewChild(FileUploaderCourseComponent)
	private uploaderComponent: FileUploaderCourseComponent;

	lessonMethod: string;

	LESSON_METHOD: any;

	selectLessonItems: { label: string, value: string }[] = [];

	private routerSubscribe: any;

	exerciseModules: Array<any> = [];

	currentModuleIndex = 0;

	addDisplay = false;

	progress: string | number = 0;

	flowChecked = false;

	growlMsg = false;

	exerciseFileName: string;

	hideExerciseLoading = true;

	showLoading = false;

	flowUploader: FlowUploader;

	flowUpload: any;

	exerciseValidFile: any;

	exerciseList: any[] = [];

	isExerciseAddBack = false;

	isPublish = false;
	title = '';
	comfirmContent = '';
	timer: any;

	constructor(private router: Router,
				private activedRoute: ActivatedRoute,
				private dialogService: CourseDialogService,
				private cloudhomeProvider: CloudHomeService,
				private courseInterface: CourseInterface,
				private courseMaterialService: CourseMaterialService,
				private confirmationService: ConfirmationService,
				private messageService: MessageService,
				private message: NzMessageService,
				private fileDownloadService: FileDownloadService,
				private tokenService: LwOauth2TokenService) {
		this.defaultParams();
		this.initialParams();
	}

	defaultParams(): void {
		this.selectLessonItems = [
			{label: LESSON_NAME.COURSEWARE, value: LESSON_METHOD.COURSEWARE},
			{label: LESSON_NAME.EXERCISE, value: LESSON_METHOD.EXERCISE}
		];
		this.lessonStages = [
			new SelectDataItem(
				COURSE_STATUE.COURSE_BEFORE,
				COURSE_NAME.UPLOADER_DISPLAY_PRE_STAGE
			),
			new SelectDataItem(
				COURSE_STATUE.COURSE_DURING,
				COURSE_NAME.UPLOADER_DISPLAY_IN_STAGE
			),
			new SelectDataItem(
				COURSE_STATUE.COURSE_AFTER,
				COURSE_NAME.UPLOADER_DISPLAY_LAST_STAGE
			)
		];
		this.exerciseValidFile = {
			size: 5 * 1024 * 1025,
			ext: ['doc', 'wpt'],
			sizeError: '不支持上传大小超过5M的习题文件',
			extError: '文件格式错误，请重新选择'
		};
		this.flowUploader = {
			target: this.courseInterface.EXERCISE_ADD_MODULE,
			headers: {TOKEN: this.tokenService.getAccessToken()},
			fileParameterName: 'file',
			singleFile: true,
			allowDuplicateUploads: true,
			attributes: {accept: 'application/msword'}
		};
	}

	initialParams(): void {
		this.courseSpace = new CourseSpaceDto(0, 0);
		this.currStageCode = this.lessonStages[1].code;
		this.lessonMethod = LESSON_METHOD.COURSEWARE;
		this.LESSON_METHOD = LESSON_METHOD;
		this.uploaderDisplayStageName = COURSE_NAME_UPLOAD.UPLOADER_DISPLAY_IN_STAGE;
		this.lessonId = this.activedRoute.snapshot.params['lessonId'];
		this.lessonDate = this.activedRoute.snapshot.params['lessonDate'];
	}

	@HostListener('window:resize')
	onWindowResize(): void {
		if (this.lessonMethod === LESSON_METHOD.COURSEWARE) {
			const clondSpaceWidth = this.clondSpace.nativeElement.clientWidth;
			this.button.nativeElement.style.width = clondSpaceWidth + 'px';
			setTimeout(() => {
				this.isUploader = this.uploaderComponent ? this.uploaderComponent.isUploader : false;
			}, 0);
		} else {
			const hasScroll = new ScrollWidthDirective(this.exWrapper).isScroll(this.mainBox.nativeElement);
			const clondSpaceWidth = this.exWrapper.nativeElement.clientWidth;
			this.button.nativeElement.style.width = clondSpaceWidth + 'px';
			this.button.nativeElement.style.marginRight = (hasScroll.scrollY ? 30 : 20) + 'px';
		}
	}

	ngOnInit(): void {
		this.classSelected(this.currStageCode);
		this.getCourseMaterial();
		this.routerSubscribe = this.activedRoute.queryParams.subscribe(queryParams => {
			this.selectedParams = queryParams as RouterCourseWareParams;
		});
		this.historyBack();
	}

	getExercisesModule() {
		this.getExerciseModules({
			lessonId: this.lessonId,
			date: this.lessonDate,
			lessonStage: this.currStageCode
		}).subscribe(() => {
			if (this.exerciseModules && this.exerciseModules[this.currentModuleIndex]) {
				this.getExerciseList(this.exerciseModules[this.currentModuleIndex].exampleId);
			}
		});
	}

	getExerciseList(id) {
		this.courseInterface.getExerciseListById(id).subscribe(data => {
			this.exerciseList = data.exampleMainVoList;
		});
	}

	tabExercise(e) {
		this.currentModuleIndex = e.index;
		this.getExerciseList(this.exerciseModules[this.currentModuleIndex].exampleId);
	}

	getExerciseModules(params) {
		return this.courseInterface.getExerciseModules(
			params
		).do(data => {
			this.exerciseModules = data || [];
		});
	}

	showAddExercise() {
		this.addDisplay = true;
		this.exerciseFileName = '';
		this.flowChecked = false;
		this.flowUploader.query = {
			id: '',
			exampleId: '',
			lessonId: this.lessonId,
			date: this.lessonDate,
			lessonStage: this.currStageCode
		};
	}

	onExerciseModuleClose(event) {
		const title = '提示';
		const content = '此操作将删除该习题模块下的所有的习题，删除后将不可恢复，是否继续？';
		// TODO
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			this.courseInterface.deleteExerciseModuleById(
				this.exerciseModules[event.index].id
			).subscribe(res => {
				this.exerciseModules.splice(event.index, 1);
			});
		}, null, 'confirmDialogDel');
	}

	exerciseFilesAdded(event) {
		this.flowUpload = event.upload;
		this.exerciseFileName = event.$files[0].name;
	}

	exerciseFileSuccess(event) {
		this.hideExerciseLoading = true;
		this.removeLoadHistory(true);
		if (event.$data.code === 1) {
			this.messageService.add({
				id: 'addError',
				summary: '', severity: 'warn',
				detail: event.$data.msg
			});
		} else {
			this.showLoading = false;
			if (this.flowChecked) {
				this.exerciseModules.push(event.$data);
			} else {
				if (this.exerciseModules.length === 0) {
					this.exerciseModules.push(event.$data);
				}
				this.getExerciseList(event.$data.exampleId);
			}
			this.messageService.add({
				id: 'normal',
				severity: 'success',
				detail: '添加成功！'
			});
		}
	}

	cancelAddExercise() {
		this.addDisplay = false;
		this.exerciseFileName = '';
	}

	historyBack(): void {
		if (window.history && window.history.pushState) {
			window.addEventListener('popstate', ($event) => {
				if (this.showLoading) {
					this.fileParsing();
				}
			});
		}
	}

	fileParsing() {
		const title = '提示';
		const content = '文件解析尚未结束，若离开本页面则所有数据将丢失，是否继续？';
		// TODO
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			this.showLoading = false;
			this.removeLoadHistory(true);
			this.router.navigate(['/course/timetable'], {
				queryParams: this.selectedParams
			});
		}, () => {
			this.addLoadHistory();
		}, 'confirmDialogDel');
	}

	sureAddExercise() {
		this.addLoadHistory();
		if (this.exerciseFileName) {
			this.addDisplay = false;
			this.showLoading = true;
			this.exerciseFileName = '';
			this.hideExerciseLoading = false;
			if (!this.flowChecked && this.exerciseModules.length > 0) {
				this.flowUploader.query.id = this.exerciseModules[this.currentModuleIndex].id;
				this.flowUploader.query.exampleId = this.exerciseModules[this.currentModuleIndex].exampleId;
			} else {
				this.flowUploader.query.id = '';
				this.flowUploader.query.exampleId = '';
			}
			this.flowUpload.upload();
		} else {
			this.messageService.add({
				id: 'normal', severity: 'warn',
				detail: '请上传习题文件！'
			});
		}
	}

	addLoadHistory() {
		this.isExerciseAddBack = true;
		history.pushState(null, null, document.URL);
	}

	removeLoadHistory(isHistory: boolean = false) {
		if (this.isExerciseAddBack) {
			this.isExerciseAddBack = false;
			if (!isHistory) {
				history.back();
			}
		}
	}


	downloadTemplate() {
		const downloadTemplatePath = this.courseInterface.getDownloadTemplatePath();
		this.fileDownloadService.downloadFileByFullPath(downloadTemplatePath, '习题上传模板.doc');

	}

	classSelected(status: string) {
		this.currStageCode = status;
		switch (status) {
			case COURSE_STATUE.COURSE_BEFORE:
				this.uploaderDisplayStageName = COURSE_NAME_UPLOAD.UPLOADER_DISPLAY_PRE_STAGE;
				break;
			case COURSE_STATUE.COURSE_DURING:
				this.uploaderDisplayStageName = COURSE_NAME_UPLOAD.UPLOADER_DISPLAY_IN_STAGE;
				break;
			case COURSE_STATUE.COURSE_AFTER:
				this.uploaderDisplayStageName = COURSE_NAME_UPLOAD.UPLOADER_DISPLAY_LAST_STAGE;
		}
		this.refreshMaterialsInfo();
		this.currentModuleIndex = 0;
		this.getExercisesModule();
	}

	onUploadSuccess(data: any) {
		if (data) {
			this.cloudhomeProvider.uploadMaterial(
				this.lessonId,
				this.lessonDate,
				this.currStageCode,
				data.name,
				data.path,
				data.size,
				data.videoGuid,
				data.fileServer
			).subscribe((res) => {
				this.uploadFileMap.set(data.path, res.id);
				this.refreshMaterialsInfo();
				if (data.isLast) {
					setTimeout(() => {
						this.message.create('success', '上传成功！');
					}, 1000);

				}
			});
		}
	}

	private deleteUploadFile(data: any) {
		if (data && data.filePath &&
			this.uploadFileMap.has(data.filePath)) {
			this.cloudhomeProvider.deleteMaterial(
				this.uploadFileMap.get(data.filePath),
				data.filePath
			).subscribe(() => {
				this.messageService.add({
					severity: 'success',
					id: 'normal',
					detail: '删除文件成功！'
				});
				this.refreshMaterialsInfo();
			});
		}
	}

	private publish() {
		this.courseInterface.validationMainMaterial(this.lessonId, this.lessonDate).subscribe(data => {
			if (data && data.canPublish) {
				this.openPublishConfirmDialog();
			} else {
				this.message.create('warning', '您必须上传课件或习题后才能发布此备课！');
			}
		});
	}

	private openPublishConfirmDialog() {
		// this.title = '提示';
		// this.comfirmContent = '发布备课后，此课程的主课件和其他上课材料将可以被其他有权限的用户浏览观看。继续发布吗？';
		// this.isPublish = true;

		const title = '提示';
		const content = '发布备课后，此课程的主课件和其他上课材料将可以被其他有权限的用户浏览观看。继续发布吗？';
		this.dialogService.openConfirmDialog(this.confirmationService, title, content, () => {
			this.confirmPublish();
		}, null);
	}

	handleOk(e) {
		setTimeout(() => {
			this.isPublish = false;
		}, 500);
	}

	handleCancel(e) {
		this.isPublish = false;
	}

	private confirmPublish() {
		this.courseInterface.publishCourseMaterial(
			this.lessonId,
			this.lessonDate,
			!this.courseMaterial.publishStatus
		).subscribe(data => {
			this.message.create('success', '课程发布成功！');
			// this.messageService.add({severity: 'success', id: 'normal', detail: '课程发布成功！'});
			setTimeout(() => {
				this.back();
			}, 2000);
			this.getCourseMaterial();
		});
	}

	private cancel() {
		// 取消发布
		this.courseInterface.publishCourseMaterial(
			this.lessonId,
			this.lessonDate,
			!this.courseMaterial.publishStatus
		).subscribe(data => {
			this.messageService.add({severity: 'success', id: 'normal', detail: '取消发布成功！'});
			this.getCourseMaterial();
		});
	}

	setMainCourseWare(index: number) {
		const currentMainMaterial = this.courseMaterials[index];
		if (!currentMainMaterial || !currentMainMaterial.isSetMainAble) {
			return;
		}
		this.courseMaterials.forEach(it => {
			if (it === currentMainMaterial) {
				currentMainMaterial.isMain = !currentMainMaterial.isMain;
				this.courseInterface.setMainMaterial(
					currentMainMaterial.id,
					currentMainMaterial.isMain
				).subscribe(() => {
					if (currentMainMaterial.isMain) {
						this.messageService.add({
							id: 'normal',
							severity: 'success',
							summary: '提示',
							detail: '主课件设置成功！'
						});
					}
					this.refreshMaterialsInfo();
				});
			} else if (it.isMain) {
				it.isMain = false;
				this.courseInterface.setMainMaterial(
					it.id, it.isMain
				).subscribe(() => {
					this.refreshMaterialsInfo();
				});
			}
		});
	}

	private dealMaterialData() {
		// if (this.isAndroid) {
		// 	this.courseMaterial.publishStatus = true;
		// }
	}

	private getCourseMaterial() {
		// TODO:wuh 在接口返回值中需要扩展两个字段：学期和周次，还需要补上园区字段
		this.courseInterface.getMaterialDetail(this.lessonId, this.lessonDate).subscribe((data) => {
			if (data) {
				console.log(data);
				this.courseMaterial = data;
				this.dealMaterialData();
				const gradeName: string = data.gradeName;
				const className: string = data.className;
				// TODO
				const year: string = this.lessonDate.substr(0, 4) + '年';
				const weekName: string = '周' + new NumberToUpperCasePipe().transform(data.week);
				const periodName: string = '第' + new NumberToUpperCasePipe().transform(data.period) + '节';
				const lessonName: string = data.subjectName + '课';
				this.classAllName = gradeName + className + ' ' + weekName + ' ' + periodName + ' ' + lessonName;
				const directory = 'course/materials/' + year + '/' + gradeName + '/' + className + '/' + weekName + '-' + periodName + '-' + lessonName;
				this.uploaderOptions = new FileUploaderOptionsExtend(directory, MAX_FILE_SIZE);
			}
		});
	}

	refreshMaterialsInfo() {
		this.courseMaterialService.getCourseMaterials(
			this.lessonId,
			this.lessonDate,
			this.currStageCode,
			'courseware'
		).subscribe((data) => {
			if (data) {
				this.courseMaterials = data;
				this.materialFileNames = [];
				for (const material of data) {
					this.materialFileNames.push(material.name);
				}
			}
		});
		this.courseMaterialService.getCourseSpace(
			this.lessonId, this.lessonDate
		).subscribe((data) => {
			if (data) {
				this.courseSpace = data;
			}
		});
	}

	back() {
		this.router.navigate(['/course/timetable'], {
			queryParams: this.selectedParams
		});
	}

	openUploadDialog() {
		this.uploaderComponent.openDialog();
	}

	openDownLoadDialog() {
	}

	ngOnDestroy(): void {
		this.routerSubscribe.unsubscribe();
	}

	loadingHtml() {
		return `
        <svg width="100px"  height="80px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-flickr" style="animation-play-state: running; animation-delay: 0s; background: none;">
            <circle ng-attr-cx="{{config.cx1}}" cy="50" ng-attr-fill="{{config.c1}}" ng-attr-r="{{config.radius}}" cx="58" fill="#226cfb" r="20" style="animation-play-state: running; animation-delay: 0s;" class="">
              <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="1" begin="-0.5s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;" class=""></animate>
            </circle>
            <circle ng-attr-cx="{{config.cx2}}" cy="50" ng-attr-fill="{{config.c2}}" ng-attr-r="{{config.radius}}" cx="42" fill="#ffffff" r="20" style="animation-play-state: running; animation-delay: 0s;" class="">
              <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="1" begin="0s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;" class=""></animate>
            </circle>
            <circle ng-attr-cx="{{config.cx1}}" cy="50" ng-attr-fill="{{config.c1}}" ng-attr-r="{{config.radius}}" cx="58" fill="#226cfb" r="20" style="animation-play-state: running; animation-delay: 0s;" class="">
              <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="1" begin="-0.5s" repeatCount="indefinite" style="animation-play-state: running; animation-delay: 0s;" class=""></animate>
              <animate attributeName="fill-opacity" values="0;0;1;1" calcMode="discrete" keyTimes="0;0.499;0.5;1" ng-attr-dur="{{config.speed}}s" repeatCount="indefinite" dur="1s" style="animation-play-state: running; animation-delay: 0s;" class=""></animate>
            </circle>
        </svg>
        `;
	}
}
