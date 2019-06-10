import { Component, OnInit, Input, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LW_MODULE_CODE, ModuleCode } from '../../common/config';
declare var $: any;
import { lory } from '../../../assets/js/lory.min';
import { disableDebugTools } from '@angular/platform-browser';
import { DISABLED } from '@angular/forms/src/model';

@Component({
	selector: 'image-detail',
	templateUrl: 'image-detail.component.html',
	styleUrls: ['./image-detail.component.scss']
})

export class ImageDetailComponent implements OnInit, AfterViewInit {
	@Input() public content;
	
	title: string;
	description: string;
	contentText: string;
	imgLength: number;
	selectIndex: number;
	imgUrl: string;
	img: HTMLImageElement;
	apiUrl: string;
	@ViewChild('left') leftBtn: ElementRef;
	@ViewChild('right') rightBtn: ElementRef;
	index = 0;
	count = 1;
	constructor(private route: ActivatedRoute, @Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
		this.apiUrl = this.moduleCode.WEBSITE_CMS;
	}

	ngOnInit() {
		if (this.content.imgList.length > 0) {
			this.title = this.content.imgList[0].title;
			this.description = this.content.imgList[0].description;
			this.imgLength = this.content.imgList.length;
			this.selectIndex = 0;
			this.imgUrl = this.content.imgList[0].url;
			this.content.imgList.forEach((element,index) => {
				if(index == 0){
					element['cursor']="n"
				}else{
					element['cursor']="y"
				}
			});
		}
		else {
			this.title = "";
			this.description = "";
		}
		this.contentText = this.content.contentText;

		//计算选中大图高度
		// this.imgSizeSetting();
	}

	ngAfterViewInit() {

		//计算选中图片大小
		// this.imgSizeSetting();


		let js_slides: HTMLStyleElement = document.querySelector(".js_slides");
		let liCount: number = 0;
		if (js_slides.childElementCount > 0) {
			liCount = ((214 + 20) * js_slides.childElementCount) - 20;
		}
		js_slides.style.width = liCount + "px";
		//图片列表左右切换
		let variableWidth: Element = document.querySelector('.js_variablewidth');




		function afterHandleEvent(e) {
			// js_slides.style.cursor = 'not-allowed'
			// js_slides.style.transform = 'translate3d(-214px,0px,0px)'
			// this.content.imgList
		}

		variableWidth.addEventListener('after.lory.slide', afterHandleEvent);
		lory(
			variableWidth,
			{
				rewind: false,
			}
		);
	}

	imgSizeSetting(numX) {
		// let width: number = 920;
		// let height: number = 517;
		// let coverImage: Element = document.querySelector('.cover-img');

		// let img: HTMLImageElement = new Image();
		// img.src = "http://10.15.10.250:8082/lw-website-cms/" + this.imgUrl;

		// let coverImageWidth: number = img.width;
		// let coverImageHeight: number = img.height;


		// if (coverImageWidth > width && coverImageHeight > height) {
		// 	coverImage.classList.remove("imgAuto");
		// 	coverImage.classList.remove("imgWidthAuto");
		// 	coverImage.classList.remove("imgHeightAuto");
		// 	coverImage.classList.add("imgCenter");
		// }
		// else if (coverImageWidth < width && coverImageHeight < height) {
		// 	coverImage.classList.remove("imgCenter");
		// 	coverImage.classList.remove("imgWidthAuto");
		// 	coverImage.classList.remove("imgHeightAuto");
		// 	coverImage.classList.add("imgAuto");
		// }
		// else if (coverImageWidth < width && coverImageHeight > height) {
		// 	coverImage.classList.remove("imgCenter");
		// 	coverImage.classList.remove("imgAuto");
		// 	coverImage.classList.remove("imgHeightAuto");
		// 	coverImage.classList.add("imgWidthAuto");
		// }
		// else if (coverImageWidth > width && coverImageHeight < height) {
		// 	coverImage.classList.remove("imgCenter");
		// 	coverImage.classList.remove("imgAuto");
		// 	coverImage.classList.remove("imgWidthAuto");
		// 	coverImage.classList.add("imgHeightAuto");
		// }
		if(numX != null || numX != undefined || numX != 0) {
			var isWidth = document.getElementById('js_frame').offsetWidth;
			if(numX < 3) {
				document.getElementById('js_slides').style.transform = 'translate3d(0px,0px,0px)';
			} else if(numX > this.imgLength - 4) {
				document.getElementById('js_slides').style.transform = 'translate3d('+ (-234*(this.imgLength-4)-116) +'px,0px,0px)';
			} else {
				if((numX+1) * 234 > isWidth){
					document.getElementById('js_slides').style.transform = 'translate3d('+ (isWidth-(numX+1)*234+20) +'px,0px,0px)';
				}
			}
		}
	}

	onImgClicked(obj: any, i: number): void {
		this.title = obj.title;
		this.description = obj.description;
		this.selectIndex = i;
		this.imgUrl = obj.url;
		
		this.imgSizeSetting(this.selectIndex);
	}

	leftMove(evt){
		evt.cancelBubble = true &&evt.stopPropagation();
		this.selectIndex--;
		if(this.selectIndex < 0) return this.selectIndex = 0;	
		let obj = this.content.imgList[this.selectIndex];
		this.title = obj.title;
		this.description = obj.description;
		this.imgUrl = obj.url;
		this.imgSizeSetting(this.selectIndex);

	}
	rightMove(evt){
		evt.cancelBubble = true &&evt.stopPropagation();
		this.selectIndex++;
		if(this.selectIndex > (this.content.imgList.length-1)) return this.selectIndex = this.content.imgList.length-1;
		let obj = this.content.imgList[this.selectIndex];
		this.title = obj.title;
		this.description = obj.description;
		this.imgUrl = obj.url;
		this.imgSizeSetting(this.selectIndex);
	}
}