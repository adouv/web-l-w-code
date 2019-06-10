/**
 * Created by cuishiyong on 2017/12/12.
 */
import {Component, OnInit, Inject, ViewChild, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {EnvDefaultConfig, LW_MODULE_CODE} from '../../../../app.export';
import {Carousel} from 'primeng/primeng';

@Component({
	selector: 'image-dialog',
	templateUrl: './image.html',
	styleUrls: ['./image.scss']
})

export class ImageDialogComponent implements OnInit, OnChanges {


	list: Array<any>; // 所有轮播图片
	listCount: number; // 所有轮播图片数量
	private baseUrl: string;
	currentImg: any; // 选中数据
	itemIndex: number; // 预览图片下标
	hideHandle: boolean;
	private isFilstIn: boolean; // 是否第一次进入

	@ViewChild(Carousel) carousel: Carousel;

	@Input()
	data: any = {};

	@Output()
	closeDialog = new EventEmitter<any>();

	constructor(private envDefaultConfig: EnvDefaultConfig,
				@Inject(LW_MODULE_CODE) private moduleCode) {
	}

	ngOnChanges(): void {
		const data = this.data;
		// 初始化数据
		this.list = data.listImg || []; // 避免为null时报错
		this.currentImg = !data.hideHandle ? data.currentImg || {} : this.list[0]; // 避免为null时报错
		this.hideHandle = data.hideHandle || false; // 默认显示上下翻页
		this.baseUrl = !data.hideHandle ? this.envDefaultConfig.getModuleUrl(this.moduleCode.FILE_SERVER) + '/fs/file/download?fileName=' : '';
		this.listCount = this.list.length;
		this.isFilstIn = true;
	}

	ngOnInit() {
		this.initDialog(); // 初始化图片预览样式
		this.itemIndex = this.getIndex(this.data);
		this.carousel.setPage(this.itemIndex);
	}

	// 原因不明，不执行的话 翻页会报错
	private hackPage(): void {
		if (!this.isFilstIn) {
			return;
		}
		this.isFilstIn = false;
		this.carousel.setPage(this.itemIndex);
	}

	// 下一页
	nextClick(): void {
		if ((this.itemIndex + 1) === this.listCount) {
			return;
		} // 判断是否是最后一页
		this.hackPage();
		this.carousel.onNextNav();
		this.itemIndex = this.carousel.page;
		this.currentImg = this.list[this.carousel.page];
	}

	// 上一页
	prevClick(): void {
		if (this.itemIndex === 0) {
			return;
		} // 判断是否是第一页
		this.hackPage();
		this.carousel.onPrevNav();
		this.itemIndex = this.carousel.page;
		this.currentImg = this.list[this.carousel.page];
	}

	// 根据规则获得选中数据下标
	private getIndex(data): number {
		if (!data.matchRule) {
			return 0;
		}
		let num = 0;
		for (let i = 0; i < this.list.length; i++) {
			if (this.list[i][data.matchRule] === this.currentImg[data.matchRule]) {
				num = i;
			}
		}
		return num;
	}

	private initDialog() {
		// 全屏透明显示
		// const dialogEle = document.getElementsByTagName('md-dialog-container')[0];
		// const backEle = document.querySelectorAll('.cdk-overlay-backdrop')[0];
		// if (!dialogEle.className.match(RegExp('(\\s|^)fullscreen(\\s|$)'))) {
		// 	const className = dialogEle.className;
		// 	dialogEle.className = className + ' fullscreen';
		// }
		// backEle.setAttribute('style', 'opacity:.8;');
		// dialogEle.setAttribute('style', 'background:transparent !important;box-shadow: none;');
		this.carousel.styleClass = 'image-carousel';
	}

	close() {
		this.closeDialog.emit(false);
	}
}
