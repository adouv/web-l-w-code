import { Component, OnInit, Input, AfterViewInit, Inject } from '@angular/core';
import { LW_MODULE_CODE, ModuleCode } from '../../common/config';
declare var $;
import { lory } from '../../../assets/js/lory.min';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit, AfterViewInit {
  @Input() public videoList;
  @Input() public content;
  videoTile: string;
  videoDes: string;
  contentText: string;
  videoLen: number;
  selectIndex: number;
  imgList = [];
  showImg: string;
  isVisible = false;
  showCover = true;
  videoUrl: string;
  showColor = false;
  video;
  output;
  scale = 0.3;
  apiUrl: string;
  constructor(@Inject(LW_MODULE_CODE) private moduleCode: ModuleCode) {
    this.apiUrl = this.moduleCode.WEBSITE_CMS;
  }

  ngOnInit() {
    this.videoLen = this.videoList.length;
    this.selectIndex = 0;
    this.videoTile = this.videoList[0].title;
    this.videoDes = this.videoList[0].description;
    this.showImg = this.videoList[0].videoCover;
    this.videoUrl = this.videoList[0].url;
    this.contentText = this.content.contentText;
  }
  ngAfterViewInit() {
    let js_slides: HTMLStyleElement = document.querySelector(".js_slides");
    let liCount: number = 0;
    if (js_slides.childElementCount > 0) {
      liCount = ((214 + 20) * js_slides.childElementCount) - 20;
    }
    js_slides.style.width = liCount + "px";

    let variableWidth: Element = document.querySelector('.js_variablewidth');
    lory(
      variableWidth,
      {
        rewind: true,
      }
    );

    let video: HTMLVideoElement = document.querySelector("#videoPlay1");
    let btnPlay: HTMLStyleElement = document.querySelector("#videoPlay");
    video.addEventListener('ended',function(){
      btnPlay.style.visibility = "visible";
    });
  }

  
  // 点击列表图片
  onImgClicked(item: any, i: number): void {
    this.selectIndex = i;
    this.videoDes = item.description;
    this.videoTile = item.title;
    this.videoUrl = item.url;
    this.showCover = true;
    this.showImg = item.videoCover;
    let video: HTMLVideoElement = document.querySelector("#videoPlay1");
    let btnPlay: HTMLStyleElement = document.querySelector("#videoPlay");
    btnPlay.style.visibility = "visible";
    video.pause();
    this.imgSizeSetting(this.selectIndex);
  }

  leftMove(evt){
    window[evt] ? window.event.cancelBubble = true : evt.stopPropagation();
		this.selectIndex--;
		if(this.selectIndex < 0) return this.selectIndex = 0;	
		let obj = this.videoList[this.selectIndex];
    // this.onImgClicked(obj,this.selectIndex);
    this.imgSizeSetting(this.selectIndex);
	}
	rightMove(evt){
    window[evt] ? window.event.cancelBubble = true : evt.stopPropagation();
    this.selectIndex++;
		if(this.selectIndex >= (this.videoList.length-1)) return this.selectIndex = this.videoList.length-1;
		let obj = this.videoList[this.selectIndex];
    // this.onImgClicked(obj,this.selectIndex);
    this.imgSizeSetting(this.selectIndex);
	}

  // 点击大图
  onCoverClicked(selectIndex: number): void {
    this.showCover = false;
    this.videoUrl = this.videoList[selectIndex - 1].url;
   
  }

  videoPlay(event?: MouseEvent) {
    let video: HTMLVideoElement = document.querySelector("#videoPlay1");
    let btnPlay: HTMLStyleElement = document.querySelector("#videoPlay");
    if (video.paused) {
      btnPlay.style.visibility = "hidden";
      video.play();
    } else {
      btnPlay.style.visibility = "visible";
      video.pause();
    }
  }

  imgSizeSetting(numX) {
		if(numX != null || numX != undefined || numX != 0) {
			var isWidth = document.getElementById('js_frame').offsetWidth;
			if(numX < 3) {
				document.getElementById('js_slides').style.transform = 'translate3d(0px,0px,0px)';
			} else if(numX > this.videoLen - 4) {
				document.getElementById('js_slides').style.transform = 'translate3d('+ (-234*(this.videoLen-4)-116) +'px,0px,0px)';
			} else {
				if((numX+1) * 234 > isWidth){
					document.getElementById('js_slides').style.transform = 'translate3d('+ (isWidth-(numX+1)*234+20) +'px,0px,0px)';
				}
			}
		}
	}
}
