import { LwStorageService } from './../../common/cache/storage.service';
import { ResourceClassesInterface } from './../../services/resource/resource-classes.interface';
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoClassesInterface} from '../../services/videos/video-classes.interface';
import {FilePreviewService} from '../../services/file/file-preview.service';

@Component({
	selector: 'video-resource',
	styleUrls: ['./video-resource.component.scss'],
	template: `
		<nav class="resource-container" flex="dir:top">
			<div class="courseware auto-scroll">
				<ul *ngIf="videoResources&&videoResources.length>0&&videoDetails&&videoDetails.status!=undefined&&videoDetails.status!=0">
					<li *ngFor="let vr of videoResources" (dblclick)="previewFile(vr)">
						<a class="video-resources-a" title="{{vr.name}}" href="javascript:void(0);">
							<img src="{{vr.name | resourceType}}" alt="">
							<span class="resource-name">{{vr.name}}</span>
							<span class="tag" [ngStyle]="{'background':vr.backgroundTone}">{{vr.courseMaterialDesignName}}</span>
						</a>
					</li>
				</ul>
				<div *ngIf='(videoDetails&&videoDetails.status!=0&&videoDetails.subjectName!="自习")&&videoResources.length==0'
					 class="elliptical-page-message">本课暂无备课资源
				</div>
				<div *ngIf="videoDetails&&videoDetails.status==0" class="elliptical-page-message">课间了，休息一下</div>
				<div *ngIf='videoDetails&&videoDetails.status!=0&&videoDetails.subjectName=="自习"' class="elliptical-page-message">
					自习时间，没有备课资源
				</div>

			</div>
			<!--<tabs-footer [videoDetails]="videoDetails"></tabs-footer>-->
		</nav>
	`
})

export class VideoResourceComponent implements OnChanges {
	@Input() videoDetails: any;
	videoResources: Array<any> = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,private storageService:LwStorageService,
				private videoClassesInterface: VideoClassesInterface,
				private filePreviewService: FilePreviewService,private resourceClassInterface: ResourceClassesInterface) {

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.videoDetails.currentValue !== changes.videoDetails.previousValue) {
			this.getPublishedList();
		} else {
			this.videoResources = [];
		}
	}


	// 获得课堂资源
	private getPublishedList() {
		// 课间和自习不查询后台接口
		if (this.videoDetails.status != 0 || this.videoDetails.subjectName != '自习') {
			// classResource
			console.log('当前videoDetails：', this.videoDetails);
			if (this.videoDetails && this.videoDetails.classId && this.videoDetails.giveLessonTime) {
				this.videoClassesInterface.bindCourseWare({
					classId: this.videoDetails.classId,
					giveLessonTime: this.videoDetails.giveLessonTime
					//, period: this.videoDetails.period
				}).subscribe(data => {
					console.log('获取课堂资源接口返回：', data);
					if (data && data.length > 0) {
						this.videoResources = data;
						console.log(this.videoResources);
					}
					/* 	this.videoResources = data.map(item => {
							item.name = item.resourceName;
							return item;
						}); */
				});
			}
		}
	}

	previewFile(vr) {
			// 预览文件
			this.filePreviewService.filePreview(vr, this.videoResources);
	/* 	// 根据文件名查询资源路径
		this.resourceClassInterface.getPlayUrl(this.storageService.getCurrentGarden().gardenId,vr.path).subscribe((res)=>{
			console.log("获取资源路径：",res);
			if(res){
			// 预览文件
			this.filePreviewService.filePreview(vr, this.videoResources,res.pcPlayUrl);
			}
		}); */
	
	}
}
