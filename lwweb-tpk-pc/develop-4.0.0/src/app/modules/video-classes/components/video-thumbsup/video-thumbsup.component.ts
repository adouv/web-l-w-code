import {Component, Inject, Input, OnChanges} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE, ModuleCode} from '../../../../app.export';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {Router} from '@angular/router';
import {VideoClassesService} from '../../../../services/videos/video-classes.service';

interface FavourListModel {
	userId: string;
	imgUrl: string;
	displayName: string;
}

@Component({
	selector: 'video-thumbsup',
	styleUrls: ['./viedo-thumbsup.component.scss'],
	template: `
		<footer flex-box="1">
			<button class="round-btn" nz-button [nzType]="'danger'" [disabled]="videoDetails.status==0||(videoDetails.status!=0&&videoDetails.subjectName=='自习')" (click)="changeFavour()">
				<i class="iconfont" [ngClass]="{'icon-dianzan':isFavour,'icon-dianzanmoren':!isFavour}"></i>
				<span>赞</span>
				<p>{{favourList.length}}</p>
			</button>
			<div class="praise-wrapper">
				<nz-tabset class="praise-person" [nzShowPagination]="true" nzSize="small" nzTabPosition="bottom">
					<nz-tab *ngFor="let favour of favourList">
						<ng-template #nzTabHeading>
							<img *ngIf="favour.imgUrl" src="{{favour.imgUrl|showImg}}" alt=""
								 title="{{favour.displayName}}">
							<img *ngIf="!favour.imgUrl" src="../../../../../assets/images/user-icon.png" alt=""
								 title="{{favour.displayName}}">
						</ng-template>
					</nz-tab>
				</nz-tabset>
			</div>
		</footer>
	`
})

export class VideoThumbsupComponent implements OnChanges {
	@Input('videoDetails') videoDetails; // 视频详情页
	favourList: FavourListModel[] = []; // 点赞列表
	isFavour: boolean; // 是否已经点赞
	private baseParam: { classId: string; giveLessonTime: string; gardenId: string };

	constructor(private envConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode,
				private videoClassesInterface: VideoClassesInterface) {
	}

	ngOnChanges(change): void {
		if (this.videoDetails === change.videoDetails.currentValue
			&& JSON.stringify(this.videoDetails) !== '{}') {
			this.getBaseParam();
			this.getFavourList();
			this.getIsFavour();
		}
	}

	/**
	 * 获取点赞列表,是否点赞接口所需要的参数
	 */
	private getBaseParam() {
		this.baseParam = {
			classId: this.videoDetails.classId,
			giveLessonTime: this.videoDetails.giveLessonTime,
			gardenId: this.videoDetails.gardenId,
		};
	}

	/**
	 * 获取点赞列表
	 */
	private getFavourList() {
		this.videoClassesInterface.getFavourList(this.baseParam).subscribe(res => {
			this.favourList = res;
		});
	}


	/**
	 * 获取是否点赞
	 */
	private getIsFavour() {
		this.videoClassesInterface.getIsFavour(this.baseParam).subscribe(res => {
			this.isFavour = res;
		});
	}

	/**
	 * 改变点赞状态
	 */
	changeFavour() {
		let addParam;
		if (this.isFavour) {
			this.videoClassesInterface.deleteFavour(this.baseParam).subscribe(() => {
				this.getFavourList();
				this.getIsFavour();
			});
		} else {
			addParam = {
				...this.baseParam,
				gradeId: this.videoDetails.gradeId,
				subjectCode: this.videoDetails.subjectCode,
				teacherId: this.videoDetails.teacherId,
				period: this.videoDetails.period,
			};
			this.videoClassesInterface.postFavour(addParam).subscribe(() => {
				this.getFavourList();
				this.getIsFavour();
			});
		}
	}
}
