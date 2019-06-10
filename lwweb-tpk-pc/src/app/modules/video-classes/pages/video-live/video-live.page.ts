import {Component, Input, OnInit} from '@angular/core';
import {VideoClassesInterface} from '../../../../services/videos/video-classes.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../../services/account/account.service';
import { LwStorageService } from '../../../../common/cache/storage.service';


@Component({
	selector: 'video-live',
	templateUrl: 'video-live.page.html',
	styleUrls: ['video-live.page.scss']
})

export class VideoLivePage implements OnInit {
	@Input() public line: number = 1;
	gradeList: any[] = []; // 年级列表
	classesList: any[] = []; // 班级列表
	classesId: string; // 班级id
	gradeId: string; // 年级id
	activeTab: number; // 选中的tab页
	currentGardenId: any;

	constructor(private videoClassesInterface: VideoClassesInterface,
				private router: Router,
				private activatedRoute: ActivatedRoute,
				private accountService: AccountService,
				private lwStorageService: LwStorageService,
				) {

	}

	ngOnInit() {
		this.accountService.CreateSubject((data) => {
			this.reloadData();
		});
		this.getRouteParam();
		this.getGradeUseGarden();
		this.currentGardenId = this.lwStorageService.getCurrentGarden().gardenId;    // 多园区切换在重新选取当前园区id

	}

	/**
	 * 获取路由参数
	 */
	private getRouteParam() {
		this.activatedRoute.queryParams.subscribe(res => {
			this.classesId = res.classesId;
			this.gradeId = res.gradeId;
		}, (error) => {
			console.log(error);
		});
	}

	reloadData() {
		this.videoClassesInterface.getAttentionGrade({gardenId: this.currentGardenId}).subscribe(res => {
			this.gradeList = res;
			if (this.gradeId) {
				for (const gradeIndex in this.gradeList) {
					if (this.gradeId === this.gradeList[gradeIndex].id) {
						const index = Number(gradeIndex);
						if (index === this.activeTab || !this.activeTab) {
							this.getClassesList();
						}
						this.activeTab = Number(gradeIndex);
					}
				}
			}
		});
	}

	/**
	 * 根据园区找班级
	 */
	getGradeUseGarden() {
		this.videoClassesInterface.getAttentionGrade({gradeId: this.currentGardenId}).subscribe(res => {
			this.gradeList = res;
			if (this.gradeId) {
				this.getActiveTab();
			}
		});
	}

	/**
	 * 获取选中的tab页
	 */
	private getActiveTab() {
		console.log('获取选中的tab页');
		for (const gradeIndex in this.gradeList) {
			if (this.gradeId === this.gradeList[gradeIndex].id) {
				this.activeTab = Number(gradeIndex);
				console.log(this.activeTab);
			}
		}
	}

	/**
	 * 切换年级
	 * @param index
	 */
	changeGrade(index) {
		this.gradeId = this.gradeList[index].id;
		this.getClassesList();
	}

	/**
	 * 获取班级列表
	 */
	private getClassesList() {
		this.videoClassesInterface.getAttentionClassesList({gradeId: this.gradeId}).subscribe(res => {
			this.classesList = res;
		});
	}

	/**
	 * 跳转到详情页
	 * @param item
	 */
	goDetail(item) {
		this.classesId = item.id;
		this.router.navigate(['video/live/' + item.id]);
	}
}
