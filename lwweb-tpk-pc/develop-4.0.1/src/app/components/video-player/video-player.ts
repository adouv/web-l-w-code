import { Router } from '@angular/router';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, AfterViewInit, OnInit } from '@angular/core';
import * as videojs from 'video.js';
import 'videojs-flash';

videojs['options'].flash.swf = 'assets/videojs/video-js.swf';
declare var window: any;
import * as $ from 'jquery';
// window.$ = window.jQuery = require('../../../../node_modules/jquery/dist/jquery.min.js')
@Component({
	selector: 'video-player',
	templateUrl: "./video-player.html",
	styleUrls: ['./video-player.scss']
})

export class VideoPlayerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
	@Input() source;
	@Input() playType;
	// @Input() videoNum;
	videoNum;
	private video: videojs.Player = {} as videojs.Player;
	playerId: any;
	// 新增
	fullscreenEnabled = false;
	prefixName = "";
	timer = null;
	rightPlayer = null;
	playTimer = null;
	duration = 0;
	currentTime = 0;
	isPlay = true; //是否开始播放
	isDrag = false; //是否拖拽进度条
	isSound = false; //是否拖拽音量区域
	isSoundOn = true; //是否开启声音
	isRePlay = false;
	isClick = 0; //仅限第一次点击
	soundValue = 0;
	isLive = true;
	currentProcess = 0;
	dragProcessEl;
	soundTarget; //音量滑动块
	soundProcess; //音量进度条
	dragTarget; //播放滑动块
	dragProcess; //播放进度条;
	playStartBtn; //播放按钮
	soundSwitchBtn; //音频开关
	playStopBtn; //停止按钮
	fullScreenBtn;//全屏开关
	processWidth = 0;
	soundDis = 0;
	leftInit = 55; //进度条整体距离左侧偏移
	rightInit = 30; //音量条整体距离右侧偏移
	dragProcessWidth = 0; //当前视频进度条长度
	soundMaxLength = 0; //音量进度条总长
	soundProcessWidth = 0; //当前音量进度条长度 
	playerArr = [];
	firstSeek = -1;
	firstVolumeSeek = -1;
	clickInfoArr = [];//避免短时间点击两个画面，导致第一个画面全屏，单独记录每个播放器单双击事件
	oneScreenFlag = false;//单画面全屏
	threeScreenFlag = false;//三画面全屏
	triggerMode = "unset";
	changeVideoInfo = { time: 0, isChange: false };
	processInterval;
	currentProcessWidth = 0;
	menuWidth = 0;
	isFullscreenData = false;
	isFirst = true;
	loadingInterval;
	urlArr = [];
	videoFormat;
	idArr = [];
	isOthers = true;
	screenType;
	fullScreenTimer;
	dbClickEle;
	errorPage: boolean = false;
	outerThis;
	msfullscreenchangeFunc;
	mozfullscreenchangeFunc;
	webkitfullscreenchangeFunc;
	fullscreenchangeFunc;
	hasInit = false;
	isExchanged=false;
	mainPlayerObj: any = {};
	videoStyles = {
		"live": {
			"oneScreen": [{ "width": "auto", height: "100%", "max-width": "100%", "left": "0", "top": "0" }],
			"twoScreen": [{ "width": "auto", "max-width": "100%", height: "100%", "left": "0", "top": "0" }, { "width": "100%", "max-width": "100%", height: "auto", "left": "0", "top": "0" }],
			"threeScreen": [{ "width": "151.9713%", "max-width": "151.9713%", height: "151.9713%", "left": "-25.9856%", "top": "-25.9856%" }, { "width": "151.9713%", "max-width": "151.9713%", height: "151.9713%", "left": "-25.9856%", "top": "-25.9856%" }, { "width": "151.076%", "max-width": "151.076%", height: "151.076%", "left": "-25.538%", "top": "-25.538%" }]
		},
		"video": {
			"oneScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "0", "top": "0" }],
			"twoScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "0", "top": "0" }, { "width": "auto", height: "100%", "max-width": "unset", "left": "0", "top": "0" }],
			"threeScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "-25.9856%", "top": "0" },
			{ "width": "auto", height: "100%", "max-width": "unset", "left": "-25.9856%", "top": "0" },
			{ "width": "auto", height: "100%", "max-width": "unset", "left": "-25.538%", "top": "0" }]
		}
		/* 	 "video": {
				"oneScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "0", "top": "0" }],
				"twoScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "-51.3852%", "top": "0" }, { "width": "auto", height: "100%", "max-width": "unset", "left": "-51.3852%", "top": "0" }],
				"threeScreen": [{ "width": "151.9713%", "max-width": "151.9713%", height: "100%","left": "-25.9856%", "top": "0" },
				{  "width": "151.9713%", "max-width": "151.9713%", height: "100%", "left": "-25.9856%", "top": "0" },
				{ "width": "151.9713%", "max-width": "151.9713%",  height: "100%", "left": "-25.538%", "top": "0" }]
			} */
	}

	ngOnChanges(changes: SimpleChanges): void {
		//console.log("监听到参数变化-->changes:", changes, "this.video:", this.video);
		if (changes.source.currentValue !== changes.source.previousValue && !this.hasInit) {
			this.hasInit = true;
			this.source = changes.source.currentValue;
					// 设置最后位置为主画面，切换顺序
			if(!this.isExchanged){
				this.isExchanged=true;
			let temp=this.source[0];
			this.source[0]=this.source[this.source.length-1];
			this.source[this.source.length-1]=temp;
			}
			this.setPlayType();
			// 销毁播放器
			this.destoryVideo();
			this.setListener();
			this.createVideo("ngOnChanges");
		}
	}
	destoryVideo() {
		this.playerArr.forEach((item, index, arr) => {
			//console.log("销毁播放器组件", item.player.dispose);
			item.player.dispose();
			let videoEle = $(item.id);//销毁元素
			if (videoEle) {
				//console.log("销毁播放元素：", videoEle);
				videoEle.remove();
			}
		})
	}
	private getSuffixName(name: string) {
		return name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
	}

	setPlayType(videoType?) {
		this.isLive = this.playType == "live" ? true : false;
		if (videoType != undefined) {
			this.videoFormat = videoType;
		} else {
			this.videoFormat = this.isLive ? "rtmp/flv" : "video/mp4";
		}
		this.videoNum = this.source.length;
		this.screenType = this.videoNum == 1 ? "oneScreen" : (this.videoNum == 2 ? "twoScreen" : "threeScreen");
		//console.log("ngOnChanges-->playType:" + this.playType + ",source:", this.source, "isLive:" + this.isLive, "videoNum:" + this.videoNum, "videoFormat:" + this.videoFormat);
		// 生成id数组
		for (let i = 0; i < this.videoNum; i++) {
			this.idArr.push("video_" + new Date().getTime() + i);
		}
	}
	constructor(private router: Router) {
		//console.log("执行构造函数了...");
	}
	ngAfterViewInit() {

	}
	ngOnInit() {
		//console.log("ngOninit执行了,source:", this.source);
		// 预览窗口加载播放组件,构造函数拿不到参数
		if (this.playType == undefined && !this.hasInit) {
			//console.log("从预览窗口进入的");
			this.hasInit = true;
			this.playType = "video";
			if (this.source && this.source.length > 0) {		
				// 设置最后位置为主画面，切换顺序
				if(!this.isExchanged){
					this.isExchanged=true;
				let temp=this.source[0];
				this.source[0]=this.source[this.source.length-1];
				this.source[this.source.length-1]=temp;
				}
				let type = this.getSuffixName(this.source[this.source.length-1].pcPlayUrl);
				this.setPlayType("video/" + type);
				setTimeout(() => {
					this.setListener();
					this.createVideo("ngOnInit");
				}, 0);
			}
		}
	}
	setListener() {
		this.msfullscreenchangeFunc = () => {
			//console.log("监听到全屏mode变化了...4");
			this.handleFullscreenChange();
		}
		this.fullscreenchangeFunc = () => {
			//console.log("监听到全屏mode变化了...", (document as any).fullscreen);
			this.handleFullscreenChange();
		}
		this.mozfullscreenchangeFunc = () => {
			//console.log("监听到全屏mode变化了...2");
			this.handleFullscreenChange();
		}
		this.webkitfullscreenchangeFunc = () => {
			//console.log("监听到全屏mode变化了...3");
			this.handleFullscreenChange();
			// 如果是单画面全屏模式，则显示进度条
			if (this.oneScreenFlag) {
				if (this.fullScreenTimer) {
					clearInterval(this.fullScreenTimer);
				}
				if ($(this.dbClickEle).css("visibility") != "visible") {
					$(this.dbClickEle).css("visibility", "visible");
				}
			}
			this.dbClickEle = null;
		}
	}
	ngOnDestroy() {
		//console.log("页面销毁了...");
		let self = this;
		this.destoryVideo();
		if (this.processInterval) clearInterval(this.processInterval);
		if (this.timer) clearInterval(this.timer);
		this.clickInfoArr.forEach((item, index, arr) => {
			clearInterval(item["timer" + index]);
		})
		self = null;
		// this.destroyVariables();
		this.destroyListener();
	}
	destroyListener() {
		$(window).off();
		$(window).off("resize");
		$(document).off();
		document.removeEventListener("fullscreenchange", this.fullscreenchangeFunc, false)
		document.removeEventListener("mozfullscreenchange", this.mozfullscreenchangeFunc, false)
		document.removeEventListener("webkitfullscreenchange", this.webkitfullscreenchangeFunc, false)
		document.removeEventListener("msfullscreenchange", this.msfullscreenchangeFunc, false)
	}
	destroyVariables() {
		// 新增
		this.fullscreenEnabled = false;
		this.prefixName = "";
		this.timer = null;
		this.rightPlayer = null;
		this.playTimer = null;
		this.duration = 0;
		this.currentTime = 0;
		this.isPlay = true; //是否开始播放
		this.isDrag = false; //是否拖拽进度条
		this.isSound = false; //是否拖拽音量区域
		this.isSoundOn = true; //是否开启声音
		this.isRePlay = false;
		this.isClick = 0; //仅限第一次点击
		this.soundValue = 0;
		this.isLive = true;
		this.currentProcess = 0;
		this.dragProcessEl;
		this.soundTarget; //音量滑动块
		this.soundProcess; //音量进度条
		this.dragTarget; //播放滑动块
		this.dragProcess; //播放进度条;
		this.playStartBtn; //播放按钮
		this.soundSwitchBtn; //音频开关
		this.playStopBtn; //停止按钮
		this.fullScreenBtn;//全屏开关
		this.processWidth = 0;
		this.soundDis = 0;
		this.leftInit = 55; //进度条整体距离左侧偏移
		this.rightInit = 30; //音量条整体距离右侧偏移
		this.dragProcessWidth = 0; //当前视频进度条长度
		this.soundMaxLength = 0; //音量进度条总长
		this.soundProcessWidth = 0; //当前音量进度条长度 
		this.playerArr = [];
		this.firstSeek = -1;
		this.firstVolumeSeek = -1;
		this.clickInfoArr = [];//避免短时间点击两个画面，导致第一个画面全屏，单独记录每个播放器单双击事件
		this.oneScreenFlag = false;//单画面全屏
		this.threeScreenFlag = false;//三画面全屏
		this.triggerMode = "unset";
		this.changeVideoInfo = { time: 0, isChange: false };
		this.processInterval = null;
		this.currentProcessWidth = 0;
		this.menuWidth = 0;
		this.isFullscreenData = false;
		this.isFirst = true;
		this.videoNum;
		this.urlArr = null;
		this.videoFormat = null;
		this.idArr = null;
		this.isOthers = true;
		this.screenType = null;
		this.fullScreenTimer = null;
		this.dbClickEle = null;
		this.errorPage = false;
		this.videoStyles = null;
	}
	private createVideo(from) {
		//console.log(from + "调用createVideo函数了");
		if (!this.source || this.source.length < 0) {
			//console.log("当前视频播放地址不存在！", this.source);
			return;
		}

		//console.log("获取到当前this.videoStyles[this.playType]", this.videoStyles[this.playType], this.videoStyles[this.playType][this.screenType]);

		if (this.videoNum == 1) {
			console.log('一画面');
			$("#video-container").html(`'
				<!-- 一画面 -->
				<section style="width:100%;height:100%;position:absolute;top:0;">
					<div style="width:100%;height:100%;float:left;border:1px solid #333333;" id="subContainer0">
						<video id="${this.idArr[0]}" style="width:auto;" class="video-js vjs-big-play-centered" autoplay="autoplay" muted controls preload="auto" data-setup="{}" poster="">
							<source src="${this.source[0].pcPlayUrl}" type="${this.videoFormat}">
								<p class="vjs-no-js">
									播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。 To view this video please enable
									JavaScript, and consider upgrading to a web browser that
									<a href="http://videojs.com/html5-video-support/" target="_blank">
										supports HTML5 video
									</a>
								</p>
						</video>
						<div style="width:100%;height:100%;display:none;flex-direction:column;justify-content:center;align-items:center">
							<img src="/assets/images/video-error.png">
							<span style="color: #999999; margin-top: 15px; font-size: 15px">
								视频源错误
							</span>
						</div>
					</div>
				</section>
			'`);
		} else if (this.videoNum == 2) {
			console.log('两画面');
			$("#video-container").html(`'
			<!-- 两画面 -->
			<section style="width:100%;height:100%;position:absolute;top:0;" *ngIf="videoNum==2">
			<!--===小画面==-->
				<div style="    width: 23.4211%;
				height: 23.4883721%;
				overflow: hidden;
				position: absolute;
				left: 10px;
				z-index: 100;
				bottom: 1.3953488%;
				overflow: hidden;
				position: absolute;
				bottom: 45px;" id="subContainer0">
					<div style="   height: 100%;
					width: 100%;
					border: 3px solid #fff;
					box-shadow: 0px 0px 50px #000;
					overflow: hidden;
					position: absolute;">
						<video id="${this.idArr[0]}" style="width:${this.videoStyles[this.playType][this.screenType][0].width};
						max-width: ${this.videoStyles[this.playType][this.screenType][0][" max-width "]};
						height: ${this.videoStyles[this.playType][this.screenType][0].height};
						left: ${this.videoStyles[this.playType][this.screenType][0].left};
						top:${this.videoStyles[this.playType][this.screenType][0].top};" class="video-js vjs-big-play-centered"
						autoplay="autoplay" controls preload="auto" data-setup="{}" poster="">
							<source src="${this.source[0].pcPlayUrl}" type="${this.videoFormat}">
								<p class="vjs-no-js">
									播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。 To view this video please enable
									JavaScript, and consider upgrading to a web browser that
									<a href="http://videojs.com/html5-video-support/" target="_blank">
										supports HTML5 video
									</a>
								</p>
						</video>
						<div style="width:100%;height:100%;display:none;flex-direction:column; justify-content: center; align-items: center">
							<img src="/assets/images/video-error.png">
							<span style="color: #999999; margin-top: 15px; font-size: 15px">
								视频源错误
							</span>
						</div>
					</div>	
				</div>

				<div style="width:100%;height:100%;float:left;border:1px solid #333333;" id="subContainer1">
					<video id="${this.idArr[1]}" style="width:auto;" class="video-js vjs-big-play-centered" autoplay="autoplay" muted controls preload="auto" data-setup="{}" poster="">
						<source src="${this.source[1].pcPlayUrl}" type="${this.videoFormat}">
							<p class="vjs-no-js">
								播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。 To view this video please enable
								JavaScript, and consider upgrading to a web browser that
								<a href="http://videojs.com/html5-video-support/" target="_blank">
									supports HTML5 video
								</a>
							</p>
					</video>
					<div style="width:100%;height:100%;display:none;flex-direction:column;justify-content:center;align-items:center">
						<img src="/assets/images/video-error.png">
						<span style="color: #999999; margin-top: 15px; font-size: 15px">
							视频源错误
						</span>
					</div>
				</div>
				
			</section>
			'`);
		} else if (this.videoNum == 3) {
			console.log('三画面');
			$("#video-container").html(`'
				<!-- 三画面 -->
				<section style="width:100%;height:100%;position:absolute;top:0px;" *ngIf="videoNum==3">
					<div style="width:32.7816%;height:100%;float:left;margin-right:0.4884%;overflow: hidden;">
						<div style="height:49.3023256%;border:1px solid #333333;margin-bottom:1.3953488%;overflow: hidden;" id="subContainer0">
							<video id="${this.idArr[0]}" style="width:${this.videoStyles[this.playType][this.screenType][0].width};
							max-width: ${this.videoStyles[this.playType][this.screenType][0][" max-width "]};
							height: ${this.videoStyles[this.playType][this.screenType][0].height};
							left: ${this.videoStyles[this.playType][this.screenType][0].left};
							top:${this.videoStyles[this.playType][this.screenType][0].top};" class="video-js vjs-big-play-centered"
							autoplay="autoplay" muted controls preload="auto" data-setup="{}" poster="">
								<source src="${this.source[0].pcPlayUrl}" type="${this.videoFormat}">
									<p class="vjs-no-js">
										播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。 To view this video please enable
										JavaScript, and consider upgrading to a web browser that
										<a href="http://videojs.com/html5-video-support/" target="_blank">
											supports HTML5 video
										</a>
									</p>
							</video>
							<div style="width:100%;height:100%;display:none;flex-direction:column;justify-content:center;align-items:center">
								<img src="/assets/images/video-error.png">
								<span style="color:#999999;margin-top:15px;font-size:15px">
									视频源错误
								</span>
							</div>
						</div>
						<div style="height:49.3023256%;border:1px solid #333333;overflow:hidden;" id="subContainer1">
							<video id="${this.idArr[1]}" style="width:${this.videoStyles[this.playType][this.screenType][1].width};
							max-width: ${this.videoStyles[this.playType][this.screenType][1][" max-width "]};
							height: ${this.videoStyles[this.playType][this.screenType][1].height};
							left: ${this.videoStyles[this.playType][this.screenType][1].left};
							top:${this.videoStyles[this.playType][this.screenType][1].top};" class="video-js vjs-big-play-centered"
							autoplay="autoplay" muted controls preload="auto" data-setup="{}" poster="">
								<source src="${this.source[1].pcPlayUrl}" type="${this.videoFormat}">
									<p class="vjs-no-js">
										播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。 To view this video please enable
										JavaScript, and consider upgrading to a web browser that
										<a href="http://videojs.com/html5-video-support/" target="_blank">
											supports HTML5 video
										</a>
									</p>
							</video>
							<div style="width:100%;height:100%;display:none;flex-direction:column;justify-content:center;align-items:center">
								<img src="/assets/images/video-error.png">
								<span style="color:#999999;margin-top:15px;font-size:15px">
									视频源错误
								</span>
							</div>
						</div>
					</div>
					<div style="float:left;border:1px solid #333333;width:66.73%;height:100%;overflow:hidden;" id="subContainer2">
						<video id="${this.idArr[2]}" style="width:${this.videoStyles[this.playType][this.screenType][2].width};
						max-width: ${this.videoStyles[this.playType][this.screenType][2][" max-width "]};
						height: ${this.videoStyles[this.playType][this.screenType][2].height};
						left: ${this.videoStyles[this.playType][this.screenType][2].left};
						top:${this.videoStyles[this.playType][this.screenType][2].top};" class="video-js vjs-big-play-centered"
						autoplay="autoplay" controls preload="auto" data-setup="{}" poster="">
							<source src="${this.source[2].pcPlayUrl}" type="${this.videoFormat}">
								<p class="vjs-no-js">
									播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。 To view this video please enable
									JavaScript, and consider upgrading to a web browser that
									<a href="http://videojs.com/html5-video-support/" target="_blank">
										supports HTML5 video
									</a>
								</p>
						</video>
						<div style="width:100%;height:100%;display:none;flex-direction:column;justify-content:center;align-items:center">
							<img src="/assets/images/video-error.png">
							<span style="color:#999999;margin-top:15px;font-size:15px">
								视频源错误
							</span>
						</div>
					</div>
				</section>
			'`);
		}
		/* 	this.videoStyles[this.playType]={
				"oneScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "0", "top": "0" }],
				"twoScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "-51.3852%", "top": "0" }, { "width": "auto", height: "100%", "max-width": "unset", "left": "-51.3852%", "top": "0" }],
				"threeScreen": [{ "width": "auto", height: "100%", "max-width": "unset", "left": "-25.9856%", "top": "0" },
				{ "width": "auto", height: "100%", "max-width": "unset", "left": "-25.9856%", "top": "0" },
				{ "width": "auto", height: "100%", "max-width": "unset", "left": "-25.538%", "top": "0" }]
			} 
			 */
		/* 	this.loadingInterval=setInterval(()=>{
				let loadingEle=$(".vjs-poster");
				if(loadingEle.length!=0){
					debugger;
					//console.log("查询到元素loadingEle",loadingEle);
					loadingEle.css("left","25.9856%");
					loadingEle.css("width","100%");
					clearInterval(this.loadingInterval);
				}
			},10); */
		if (!this.isLive) {
			$(".video-js").css("left", "0");
		}

		this.customInit(this.videoNum);
	}
	handleDbClick(event, i) {
		let displayStyle = $("#" + this.playerArr[i].id).next().css("display");
		if (displayStyle == "flex") {
			////console.log("视频源错误，不执行双击事件");
			return;
		}
		//console.log("handleDbClick点击事件...", event, i);
		let self = this;
		// //console.log("双击,此时是否为全屏？",document.fullscreen);
		if (self.oneScreenFlag) {
			//console.log("单画面退出全屏-->self.videoNum:", self.videoNum);
			self.oneScreenFlag = false;
			self.currentProcessWidth = $('.play-process').width();
			self.hideAllControls();
			self.changeMuted(self.playerArr[self.playerArr.length - 1].player);
			// self.exitFullscreen();
			self.playerArr[i].player.exitFullscreen();
		} else {//三画面全屏，双击单画面全屏；
			//console.log("单画面全屏-->self.videoNum:", self.videoNum);
			// 特例：当单视频点击按钮全屏，双击要退出全屏
			if (self.threeScreenFlag && self.videoNum == 1) {
				self.oneScreenFlag = false;
				self.currentProcessWidth = $('.play-process').width();
				self.hideAllControls();
				self.changeMuted(self.playerArr[self.playerArr.length - 1].player);
				// self.exitFullscreen();
				self.playerArr[i].player.exitFullscreen();
				return;
			}
			self.oneScreenFlag = true;
			self.currentProcessWidth = $('.play-process').width();
			self.firstSeek = -1;
			self.changeMuted(self.playerArr[i].player);
			//单画面全屏时，显示当前播放器控制条
			let controlEle = $(self.playerArr[i].id + " .vjs-control-bar")[0] || $(".vjs-control-bar")[i];
			$(controlEle).css("visibility", "visible");
			//记录当前双击的元素
			self.dbClickEle = controlEle;
			self.playerArr[i].player.requestFullscreen();
			// self.requestFullScreen("#"+self.playerArr[i].id);
		}
		self.triggerMode = "one";
	}
	/**
* 初始化入口
* @param id
*/
	customInit(videoNum) {
		//console.log("调用init函数了...");
		let self = this;
		this.dragProcessEl = $('.play-process-drag');
		this.soundTarget = $('.play-sound-btn'); //音量滑动块
		this.soundProcess = $('.play-sound-drag'); //音量进度条
		this.dragTarget = $('.play-process-btn'); //播放滑动块
		this.dragProcess = $('.play-process-drag'); //播放进度条;
		this.playStartBtn = $('.btn-wrapper-start'); //播放按钮
		this.soundSwitchBtn = $('#sound-switch'); //音频开关
		this.playStopBtn = $('.btn-wrapper-stop'); //停止按钮
		this.fullScreenBtn = $('.play-screen-not-full');//全屏开关
		this.processWidth = $('.play-process').width();
		//console.log("当前获得的this.processWidth,当前进度 ：", this.processWidth, this.currentProcess);
		this.dragProcessWidth = this.dragProcess.width(); //当前视频进度条长度
		this.soundMaxLength = $('.play-sound-wrapper').width(); //音量进度条总长
		this.soundProcessWidth = this.soundProcess.width() //当前音量进度条长度 

		// 如果为单视频则使用自定义控制条
		if (videoNum == 1) {
			// $(".player-control").css("display", "block");
			$($(".vjs-control-bar")[0]).css("visibility", "hidden");
		}
		this.isReady(videoNum);
		/* $(".video-js")[0].onclick=function () {
			 //console.log("手动监听-->播放器1号被点击了");
		 }*/
		//  监听全屏变化
		this.listenFullScreen();
		//播放按钮，进度条 设置禁止点击pointer-events:none
		if (this.isLive) {
			$("#separator").css("display", "none");
			// $(".vjs-play-control").css("pointer-events", "none");//取消事件后，无法捕获到该事件
			// 直播时 click无法监听到，单独处理	
			// vjs-progress-control vjs-control
			$(".vjs-progress-control").css("pointer-events", "none");
			/* 	let controlProgressArr = $(".vjs-control");
				for (let i = 0; i < controlProgressArr.length; i++) {
					controlProgressArr[i].addEventListener("click", function (e) {
						//console.log("拦截video进度条事件");
						e.preventDefault();
						e.stopPropagation();
					},true);
				} */
		} else {
		}
		// vjs-fullscreen-control vjs-control vjs-button
		// 监听videojs播放器自带全屏按钮
		let vjsFullScreenArr = $(".vjs-fullscreen-control");
		for (let i = 0; i < vjsFullScreenArr.length; i++) {
			vjsFullScreenArr[i].setAttribute("index", i + "");
			vjsFullScreenArr[i].addEventListener("click", function (e) {
				self.oneScreenFlag = !self.oneScreenFlag;
				if (!self.oneScreenFlag) {
					self.hideAllControls();
				}
				//console.log("点击播放器" + this.getAttribute("index") + "全屏按钮了", self.oneScreenFlag);
				if (!self.isLive) {//为啥播放器中还能监听到click事件？
					e.preventDefault();
					e.stopPropagation();
				}
			});
		}
		// videojs底部菜单栏禁止冒泡，video收不到click事件。
		let controlBarArr = $(".vjs-control-bar");
		for (let i = 0; i < controlBarArr.length; i++) {
			controlBarArr[i].addEventListener("click", function (e) {
				//console.log("拦截控制栏事件");
				e.preventDefault();
				e.stopPropagation();
			});
		}

		// 公共： 播放按钮，进度条，声音，全屏 禁止冒泡
		//    当直播情况下，如果点击播放暂停按钮，捕获并终止，自己处理点击和播放
		let playControlArr = $(".vjs-play-control");
		for (let i = 0; i < playControlArr.length; i++) {
			playControlArr[i].setAttribute("index", i + "");
			playControlArr[i].addEventListener("click", function (e) {
				let index = this.getAttribute("index");
				//console.log("拦截播放暂停事件", index);
				if (!self.isLive) {
					if (self.isPlay) {
						self.isPlay = false;
						self.customBarPause(self);
					} else {
						self.isPlay = true;
						self.customBarPlay(self);
					}
				}
				e.preventDefault();
				e.stopPropagation();
				// });//这种方式为禁止冒泡，video收不到click事件。
			}, true);//禁止videojs自带click操作
		}

	}
	isFullscreen() {
		return (document as any).fullscreenElement ||
			(document as any).msFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).webkitFullscreenElement || false;
	}

	resetVideoSize(myPlayer, id, index) {
		let vjsEle = $($("#" + id + " .vjs-tech")[0]);//$($(".vjs-tech")[index]);
		let videoEle = $($(".video-js")[index]);
		let obj = this.videoStyles[this.playType][this.screenType][index];
		// 如果单击全屏，不计算
		if (!this.oneScreenFlag) {//单画面退出全屏
			//video ==vjs-tech
			// $(".vjs-tech").css("left","-16.6665%");
			if (this.isLive) {
				vjsEle.css("left", "0");
				vjsEle.css("top", "0");
				videoEle.css("left", obj.left);
				videoEle.css("top", obj.top);
			} else {
				videoEle.css("left", "0");
				videoEle.css("top", "0");
				vjsEle.css("left", obj.left);
				vjsEle.css("top", obj.top);
			}
		} else {//单画面全屏
			videoEle.css("left", "0");
			videoEle.css("top", "0");
			vjsEle.css("left", "0");
			vjsEle.css("top", "0");
		}
	}

	setLiveRatio(index) {
		$(".video-js .vjs-volume-panel").css("display", "none");
		/* width: 133.333%;
		height: 133.333%;
		margin-left: -16.6667%;
		top: -16.6665%; */
		/* 	$(".video-js").css("width", "133.333%");
			$(".video-js").css("max-width", "133.333%");
			$(".video-js").css("height", "133.333%");
			$(".video-js").css("left", "-16.6665%");
			$(".video-js").css("top", "-16.6665%"); */
		if (this.isLive) {
			$(".video-js").css("max-width", "unset");//此处设置为宽度的比例也是一样的效果
			// 直播去掉系统宽高限制
			/* $(".video-js .vjs-fullscreen").css("width","auto");
			$(".video-js .vjs-fullscreen").css("height","auto"); */
		} else {//点播设置video-js left:0 子元素video left  -16.6667%;
			/* 	width: auto;
				height: 100%;
				left: -16.6667%;
				top: 0; */
			$(".video-js").css("left", "0");
			$(".video-js").css("max-width", "unset");
			/* 	// 设置系统自带进度框位置
				let videoWidth=$($(".video-js")[index]).width();
				$($(".vjs-loading-spinner")[index]).css("left",videoWidth/2); */
			/* 	$(".video-js").css("max-width", "unset");
				$(".video-js").css("width", "auto");
				$($(".vjs-tech")[index]).css("max-width", "unset");
				$($(".vjs-tech")[index]).css("width", "auto"); */
			//video ==vjs-tech
			let left = this.videoStyles[this.playType][this.screenType][index].left;
			$($(".vjs-tech")[index]).css("left", left);

		}
	}
	/**
	 * 播放器状态
	 */
	isReady(videoNum) {
		/* 		//监听键盘按键事件
				document.addEventListener("keydown",function(event){
					if (event.keyCode == 27) {
						alert("执行退出全屏操作...");
					}
				},true);
				$(document).keydown(function (event) {
					if (event.keyCode == 27) {
						alert("执行退出全屏操作...");
					}
				}); */
		this.playerArr = [];
		let outerSelf = this;
		let realUrlArr = [];
		// this.videojs.options.flash.swf = "video-js.swf";
		let ratio = (1280.0 / 720.0).toFixed(2);
		//console.log("得到的比例：", ratio);
		let options = {
			techOrder: ["html5", "flash"],
			poster: '../../../assets/images/video-load.gif'
			// , aspectRatio: "248:187"//加上比例之后，控制条不出来了
			, aspectRatio: "16:9"//加上比例之后，控制条不出来了
		};
		/* 		let options = {
					controls: true,
					techOrder: ['html5', 'flash'],
					language: 'zh',
					autoplay: true,
					// sources: [{type:"rtmp/flv",src:"rtmp://media3.sinovision.net:1935/live/livestream"}],
					// sources: self.source[0],
					poster: '../../../assets/images/video-load.gif'
				} */
		if (videoNum > 1) {
			let that = this;
			//设置播放器宽高
			let width = $(".video-js").parent().width();
			let height = $(".video-js").parent().height();
			let ratio = 202.7704 / 100;
			// this.size(ratio*width,height*ratio);

			// let player1 = videojs('videoOne', Object.assign(options,{sources: [{type:this.videoFormat,src:this.source[1].pcPlayUrl}]}), function onPlayerReady() {
			// let player1 = videojs(this.idArr[1],  Object.assign(options,{width:ratio*width}), function onPlayerReady() {
			let player1 = videojs(this.idArr[0], options, function onPlayerReady() {
				/* let player1 = videojs(this.idArr[1], {
					techOrder: ["html5", "flash"],
					poster: '../../../assets/images/video-load.gif'
					, aspectRatio: "16:9"//加上比例之后，控制条不出来了
					,width:ratio*width,
					height:height*ratio
				}, function onPlayerReady() { */
				//console.log('播放器1已经准备好了!');
				let self = this;
				let index = 0;
				// outerSelf.resetVideoSize(this, outerSelf.idArr[1], 0.327816);
				outerSelf.setLiveRatio(0);
				this.muted(true);//设置静音
				this.on("pause", function () {
					//console.log("播放器1暂停了...");
					//changeVideo(0);
				});

				this.on("play", function () {
					//console.log("播放器1播放中...");
				});
				this.on("ended", function () {
					//console.log("播放器1结束了...");
				});

				this.on('click', function (e) {//此处的click事件要想生效不能设置vjs pointer-event:none。
					//console.log('播放器1 --> click');
					outerSelf.clickVideo(event, index);
				});
				this.on("volumechange", function (e) {
					//console.log("播放器1音量变化了...");
					/* 	if (outerSelf.firstVolumeSeek == -1) {
							outerSelf.firstVolumeSeek = index;
						}
						if (outerSelf.firstVolumeSeek == index) {
							outerSelf.changeAllVolume(self);
						} */
				});
				this.on("seeking", function () {
					//console.log("播放器1号跳跃播放了");
					// 获取播放进度，统一设置
					// if (!isLive&&seekIndex==index){
					if (outerSelf.firstSeek == -1) {
						outerSelf.firstSeek = index;
					}
					if (!outerSelf.isLive && outerSelf.firstSeek == index) {
						outerSelf.seekAllVideo(self);//传递self有问题？？？0 为啥调试一遍又没问题了，缓存么？奇怪了
					}
				});
				this.on("error", function (e) {
					//console.log("播放器监听到错误...>1", e);
					that.errorPage = true;
					$("#" + outerSelf.idArr[0]).css("display", "none");
					$("#" + outerSelf.idArr[0]).next().css("display", "flex");
				});
				//该函数需要在设备准备好的时候调用
				outerSelf.hideAllControls();
				this.on("fullscreenchange", function () {
					//console.log("videojs监听到屏幕变化了...");
				})
			});
			this.playerArr.push({ player: player1, id: this.idArr[0], src: this.source[0].pcPlayUrl, type: this.videoFormat });
		}

		if (videoNum == 3) {
			let player2 = videojs(this.idArr[1], options, function onPlayerReady() {
				//console.log('播放器2已经准备好了!');
				// outerSelf.resetVideoSize(this, outerSelf.idArr[2], 0.327816);
				outerSelf.setLiveRatio(1);
				let self = this;
				let index = 1;
				this.muted(true);//设置静音
				this.on("pause", function () {
					//console.log("播放器2暂停了...");
					//            changeVideo(0);
				});
				this.on("play", function () {
					//console.log("播放器2播放中...");
				});
				this.on('click', function (e) {//此处的click事件要想生效不能设置vjs pointer-event:none。另外次数监听click之后会导致handleclick失效
					//console.log('播放器2 --> click');
					outerSelf.clickVideo(event, index);
				});
				this.on("volumechange", function (e) {
					//console.log("播放器2音量变化了...");
					/* 	if (outerSelf.firstVolumeSeek == -1) {
							outerSelf.firstVolumeSeek = index;
						}
						if (outerSelf.firstVolumeSeek == index) {
							outerSelf.changeAllVolume(self);
						} */
				});
				this.on("seeking", function () {
					//console.log("播放器2跳跃播放了");
					//    获取播放进度，统一设置
					if (outerSelf.firstSeek == -1) {
						outerSelf.firstSeek = index;
					}
					if (!outerSelf.isLive && outerSelf.firstSeek == index) {
						outerSelf.seekAllVideo(self);//传递self有问题？？？0 为啥调试一遍又没问题了，缓存么？奇怪了
					}
				});
				this.on("error", function (e) {
					//console.log("播放器监听到错误...>1", e);
					that.errorPage = true;
					$("#" + outerSelf.idArr[1]).css("display", "none");
					$("#" + outerSelf.idArr[1]).next().css("display", "flex");
				});
				//该函数需要在设备准备好的时候调用
				outerSelf.hideAllControls();
			});
			this.playerArr.push({ player: player2, id: this.idArr[1], src: this.source[1].pcPlayUrl, type: this.videoFormat });
		}
		if (videoNum == 3) {
			options.aspectRatio = "248:187";
		}
		let that = this;
		let bigPlayer = videojs(this.idArr[this.videoNum-1], options, function onPlayerReady() {
			//console.log('播放器3已经准备好了!');
			// outerSelf.resetVideoSize(this, outerSelf.idArr[0], 0.6673);
			outerSelf.setLiveRatio(outerSelf.videoNum - 1);

			$(".vjs-text-track-display").css("pointer-events", "visible");
			let index = outerSelf.videoNum - 1;
			this.muted(false);//设置静音
			this.volume(0.5);
			this.on('click', function (event) {//此处的click事件要想生效不能设置vjs pointer-event:none。
				//console.log('播放器3 --> click');
				outerSelf.clickVideo(event, index);
			});
			this.on("pause", function () {
				//console.log("播放器3暂停了...");
			});
			this.on("volumechange", function (e) {
				//console.log("播放器3音量变化了...");
				/* 	if (outerSelf.firstVolumeSeek == -1) {
						outerSelf.firstVolumeSeek = index;
					}
					if (outerSelf.firstVolumeSeek == index) {
						outerSelf.changeAllVolume(self);
					} */
			});
			this.on("seeking", function () {
				//console.log("播放器3跳跃播放了");
				//            获取播放进度，统一设置
				//             if (!isLive&&seekIndex==index){
				if (outerSelf.firstSeek == -1) {
					outerSelf.firstSeek = index;
				}
				if (!outerSelf.isLive && outerSelf.firstSeek == index) {
					outerSelf.seekAllVideo(self);//传递self有问题？？？0 为啥调试一遍又没问题了，缓存么？奇怪了
				}
			});
			this.on("error", function (e) {
				//console.log("播放器监听到错误...3", e);
				that.errorPage = true;
				$("#" + outerSelf.idArr[ outerSelf.videoNum - 1]).css("display", "none");
				$("#" + outerSelf.idArr[ outerSelf.videoNum - 1]).next().css("display", "flex");
			});

			outerSelf.getTotalDuration(outerSelf);

			//该函数需要在设备准备好的时候调用
			outerSelf.hideAllControls();
		});
		this.mainPlayerObj.mainScreenUrl = this.source[0].pcPlayUrl;
		this.mainPlayerObj.mainPlayer = bigPlayer;
		//console.log('this.mainPlayerObj.mainPlayer:', this.mainPlayerObj.mainPlayer);
		this.playerArr.push({ player: bigPlayer, id: this.idArr[ this.videoNum - 1], src: this.source[this.videoNum - 1].pcPlayUrl, type: this.videoFormat });
		let myThis = this;
		$(window).on("resize", () => {
			//console.log("resize当前this-------------------->", this);
			let isFullscreen = myThis.isFullscreen();
			//console.log("监听到窗口大小变化了...outerSelf.videoNum", myThis.videoNum, `是否全屏：` + isFullscreen);
			if (!isFullscreen) {
				myThis.hideAllControls();
			}
			if (myThis.videoNum >= 2) {
				// 重新计算进度条位置
				outerSelf.processWidth = $('.play-process').width();
				outerSelf.currentProcess = outerSelf.currentTime / outerSelf.duration * (outerSelf.processWidth - 5)//5为拖拽条小图标的宽度的一半
				//console.log("resize...processWidth:", outerSelf.processWidth, "currentProcess:", outerSelf.currentProcess);
				outerSelf.dragProcessEl.css({
					width: outerSelf.currentProcess
				})
				outerSelf.dragTarget.css({
					left: outerSelf.currentProcess
				})

				if (myThis.videoNum >= 2) {
					outerSelf.playerArr.forEach((item, index, arr) => {
						let percent;
						percent = index < 2 ? 0.327816 : 0.6673
						outerSelf.resetVideoSize(item.player, item.id, index);
					})
				}
			}

		});

		for (let i = 0; i < this.playerArr.length; i++) {
			// 监听所有播放器双击事件
			$("#subContainer" + i).dblclick((event) => {
				this.handleDbClick(event, i);
			});
			let obj = {};
			obj["timer" + i] = null;
			obj["count" + i] = 0;
			this.clickInfoArr.push(obj);
		}
		// //console.log("初始化后this.clickInfoArr：", this.clickInfoArr);
	}


	/**
	 * 获取mp4总播放时间
	 * @param player
	 */
	getTotalDuration(player) {
		let self = this;
		if (!this.isLive) {
			let videoEleArr = $("video");
			let videoEle = videoEleArr && videoEleArr.length > 0 && videoEleArr[videoEleArr.length - 1];
			if (videoEle) {
				videoEle.addEventListener('loadedmetadata', function () {
					//console.log('video duration information available');
					//console.log('loadedmetadata播放器3获取到总时长是：', player.duration());
					if (self.isFirst) {
						self.playVideo(player);
						self.isFirst = false;
					}
				});
			}
		} else {
			self.playVideo(player);
		}
	}
	/**
	 * 设置全屏
	 * @param domName
	 */
	requestFullScreen(domName) {
		let element = document.querySelector(domName);
		const methodName =
			this.prefixName === ""
				? "requestFullscreen"
				: this.prefixName + "RequestFullScreen";
		element[methodName]();
	}
	/**
	 * 退出全屏
	 *
	 */
	exitFullscreen() {
		const methodName =
			this.prefixName === ''
				? 'exitFullscreen'
				: this.prefixName + "ExitFullscreen"; // API 前缀
		document[methodName](); // 调用
	}
	handleFullscreenChange() {
		let self = this;
		let flag = true;
		//console.log("handleFullscreenChange当前this-------------------->", this);
		//console.log("handleFullscreenChange:self.videoNum", self.videoNum);
		//console.log("handleFullscreenChange三个变量", self.triggerMode, self.threeScreenFlag, self.oneScreenFlag);
		if (self.threeScreenFlag && self.triggerMode == "one" && self.isFullscreen()) {
			//console.log("此时为三画面全屏，triggerMode=one模式");
			flag = false;
		} else if (!self.isFullscreen()) {//非全屏
			self.triggerMode = "unset"
			self.threeScreenFlag = false;
			self.oneScreenFlag = false;
			//console.log("非全屏重置三个变量", self.triggerMode, self.threeScreenFlag, self.oneScreenFlag);
			if (self.videoNum >= 2) {
				self.playerArr.forEach((item, index, arr) => {
					let percent;
					percent = index < 2 ? 0.327816 : 0.6673
					self.resetVideoSize(item.player, item.id, index);
				})
			}
		}
		if (self.isFullscreen()) {//进入全屏
			//console.log("handleFullscreenChange进入全屏");
			if (flag) {
				$(self.dbClickEle).css("visibility", "visible");
			}
			//客户端在三画面全屏时无法监听到单画面全屏
			if (self.videoNum >= 2) {
				self.playerArr.forEach((item, index, arr) => {
					let percent;
					percent = index < 2 ? 0.327816 : 0.6673
					self.resetVideoSize(item.player, item.id, index);
				})
			}
		} else {//退出全屏
			//console.log("handleFullscreenChange退出全屏");
			// 重新设置控制条的播放状态
			if (self.isPlay) {
				$('#play-start-hover').attr('src', 'assets/images/pause_hover.png')
				$('#play-start').attr('src', 'assets/images/pause.png')
			} else {
				$('#play-start-hover').attr('src', 'assets/images/play_btn_hover.png')
				$('#play-start').attr('src', 'assets/images/play_btn.png')
			}
			self.menuWidth = $('.playerPop').width();
			//console.log("获取到容器宽度：", self.menuWidth);
			self.hideAllControls();
			if (self.processInterval != null) {
				clearInterval(self.processInterval);
			}
			if (!self.isLive) {
				// 校正底部进度条
				self.processInterval = setInterval(self.correctProgress.bind(self), 500);
			}
		}
		self.dbClickEle = null;
	}
	/**
	 * 监听全屏变化
	 */
	listenFullScreen() {
		let self = this;
		document.addEventListener("fullscreenchange", this.fullscreenchangeFunc, false);
		document.addEventListener("mozfullscreenchange", this.mozfullscreenchangeFunc, false);
		document.addEventListener("webkitfullscreenchange", this.webkitfullscreenchangeFunc, false);
		document.addEventListener("msfullscreenchange", this.msfullscreenchangeFunc, false);
	}


	/**
	 * 校正底部进度条
	 */
	correctProgress() {
		this.processWidth = $('.play-process').width();
		if (this.currentProcessWidth == this.processWidth) {
			this.currentProcess = this.currentTime / this.duration * (this.processWidth - 5)//5为拖拽条小图标的宽度的一半
			// //console.log("correctProgress窗口大小变化了...processWidth:", this.processWidth, "currentProcess:", this.currentProcess);
			this.dragProcessEl.css({
				width: this.currentProcess
			})
			this.dragTarget.css({
				left: this.currentProcess
			})
			clearInterval(this.processInterval);
		}
	}


	/**
	 * 所有播放器跳跃播放
	 * @param self
	 */
	seekAllVideo(player) {
		let time = player.currentTime();
		this.playerArr.forEach(function (item, index, arr) {
			// //console.log("当前播放技术：", item.player.techName_);
			if (player != item.player) {
				item.player.currentTime(time);
			}

		})
	}
	getFullScreenEle() {
		const fullscreenElement =
			(document as any).fullscreenElement ||
			(document as any).msFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).webkitFullscreenElement;
		return fullscreenElement;
	}
	/**
	 * 处理点击--优先于videojs中click监听
	 * @param event
	 * @param index
	 */
	/* 	handleClick(event, i) {
			//console.log("handleClick被调用了", i);
		} */

	/**
 * 
 * @param index 切换视频位置
 */
	switchVideo(index) {
		if (this.isLive) {
			this.changeVideo(index);
		} else {//交换后click事件不生效了
			let currentEle = $('.video-js').eq(index)//.parent();
			let bigEle = $('.video-js').eq(this.videoNum - 1)//.parent();
			let temp, obj, tempClassName, tempId;
			tempClassName = currentEle.parent().prop("className");
			tempId = currentEle.parent().attr("id");
			currentEle.parent().removeClass();
			currentEle.parent().addClass(bigEle.parent().prop("className"));
			currentEle.parent().attr("id", bigEle.parent().attr("id"));

			bigEle.parent().removeClass();
			bigEle.parent().addClass(tempClassName);
			bigEle.parent().attr("id", tempId);

			bigEle.html(temp);

			temp = currentEle.html();
			currentEle.html(bigEle.html());
			bigEle.html(temp);
			obj = this.playerArr[index];
			this.playerArr[index] = this.playerArr[this.videoNum - 1];
			this.playerArr[this.videoNum - 1] = obj;
		}
	}

	/**
	 * 切换地址播放画面
	 */
	changeVideo(index) {
		let self = this;
		//如果点击的是当前正在全屏播放的视频，则不交换
		let fullScreenEle = this.getFullScreenEle();
		let videoEle = $(this.playerArr[index].id);
		// //console.log("获取到全屏元素",fullScreenEle,videoEle);
		if (fullScreenEle && fullScreenEle.getAttribute("id") == videoEle.attr("id")) {
			//console.log("changeVideo-->当前播放器为全屏播放，不切换视频地址");
			return;
		}
		if(this.videoNum ==1) return;
		// 针对2画面处理
 		if(this.videoNum==2&&index==1){
			index=0;
		}  
		// if (index == this.videoNum - 1) return;
		// //console.log("交换前的播放器" + index, playerArr[index].src);
		// //console.log("交换前的播放器3：", playerArr[playerArr.length-1].src);
		let player = this.playerArr[index].player;
		let time = 0;
		let volume = player.volume();
		//console.log("changeVideo-->this.soundValue", this.soundValue);
		//console.log("当前播放技术为：", player.techName_);
		// 如果暂停状态则设置为播放状态
		this.customBarPlay(this);
		if (player.techName_ === "Html5") {
			console.log(this.playerArr);
			time = this.playerArr[this.playerArr.length - 1].player.currentTime();
			let temp = this.playerArr[index].src;
			player.src(this.playerArr[this.playerArr.length - 1].src);
			this.playerArr[this.playerArr.length - 1].player.src(temp);
			// this.playerArr[this.playerArr.length - 1].player.volume(this.soundValue);
			player.muted(true);//设置静音
			if (!this.isLive) {
				this.playerArr[index].player.on('loadedmetadata', function () {
					self.playerArr[index].player.play();            			//自动播放
					self.playerArr[index].player.currentTime(time);		    //跳转
				});
				this.playerArr[self.playerArr.length - 1].player.on('loadedmetadata', function () {
					self.playerArr[self.playerArr.length - 1].player.play();            			//自动播放
					self.playerArr[self.playerArr.length - 1].player.currentTime(time);		    //跳转
				});
			}
		} else {//flash
			let temp = this.playerArr[index].src;
			player.loadTech_(player.techName_, { src: this.playerArr[this.playerArr.length - 1].src });
			this.playerArr[this.playerArr.length - 1].player.loadTech_(player.techName_, { src: temp });
			player.muted(true);//设置静音
			// this.playerArr[this.playerArr.length - 1].player.volume(this.soundValue);
			if (!this.isLive) {
				time = this.playerArr[this.playerArr.length - 1].player.currentTime();
				player.currentTime(time);
				this.playerArr[this.playerArr.length - 1].player.currentTime(time);
				this.changeVideoInfo = { time: time, isChange: true }
			}
		}
		let tempSrc = this.playerArr[index].src;
		this.playerArr[index].src = this.playerArr[this.playerArr.length - 1].src;
		this.playerArr[this.playerArr.length - 1].src = tempSrc;
		// 设置主画面声音
		this.setMainScreenVolume();
		// //console.log("交换后的播放器" + index, playerArr[index].src);
		// //console.log("交换后的播放器3：", playerArr[playerArr.length-1].src);
	}
	setMainScreenVolume() {
		this.playerArr.forEach((item, index, arr) => {
			if (this.mainPlayerObj.mainScreenUrl == item.src) {
				this.mainPlayerObj.mainPlayer = item.player;
				item.player.muted(false);
				item.player.volume(this.soundValue);
			} else {
				item.player.muted(true);
			}
		});
	}

	/**
	 * 实时更新进度条
	 */
	drawProcess() {
		if (this.isLive) return;
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.timer = setInterval(() => {
			if (!this.isDrag) {
				if (parseInt(this.currentTime + "") < parseInt(this.duration + "")) {//时间取整
					this.currentTime = this.rightPlayer.currentTime();
					$('.play-current-time').html(this.changeSecond(this.currentTime))
					this.processWidth = $('.play-process').width();//总宽度不准确，重新获取
					this.currentProcess = this.currentTime / this.duration * (this.processWidth - 10)//5为拖拽条小图标的宽度的一半
					// //console.log("drawProcess更新进度,当前进度条宽度", this.currentProcess, "总宽度", this.processWidth);
					this.dragProcessEl.css({
						width: this.currentProcess
					})
					this.dragTarget.css({
						left: this.currentProcess
					})
				} else {//播放完毕
					$('.play-sym').show()
					$('.play-start').attr('src', 'assets/images/play_btn.png')
					$('.play-start-hover').attr('src', 'assets/images/play_btn_hover.png')
					this.isRePlay = true
					this.isPlay = false;
					this.resetProgress();
					clearInterval(this.timer);
				}
			}
		}, 500);

	}
	resetProgress() {
		this.currentTime = 0;
		this.dragProcessEl.css({
			width: 0
		})
		this.dragTarget.css({
			left: 0
		})
		$('.play-current-time').html(this.changeSecond(this.currentTime))
	}

	/**
	 * 所有播放器暂停
	 * @param self
	 */
	pauseAll() {
		this.playerArr.forEach(function (item, index, arr) {
			item.player.pause();
		})
	}
	/**
	 * 所有播放器播放
	 * @param self
	 */
	playAll() {
		this.playerArr.forEach(function (item, index, arr) {
			//   item.player.load();
			item.player.play();
		})
	}
	/**
	 * 所有播放器停止播放
	 * @param self
	 */
	stopAll() {
		this.playerArr.forEach(function (item, index, arr) {
			//                    item.player.load();
			item.player.pause();
			item.player.currentTime(0);
		})
	}
	/**
	 * 隐藏所有播放器控制条
	 */
	hideAllControls() {

		let controlsArr = $(".vjs-control-bar");
		for (let i = 0; i < controlsArr.length; i++) {
			$(controlsArr[i]).css("visibility", "hidden");
		}
	}

	/**
	 * 点击视频
	 */
	clickVideo(event, i) {
		let displayStyle = $("#" + this.playerArr[i].id).next().css("display");
		if (displayStyle == "flex") {
			//console.log("视频源错误，不执行单击事件");
			return;
		}

		//console.log("当前点击的播放器是：" + i + ",count:" + this.clickInfoArr[i]["count" + i]);
		// //console.log("点击目标元素：",event.target);
		this.clickInfoArr[i]["count" + i]++;
		let self = this;
		this.clickInfoArr[i]["timer" + i] = window.setTimeout(() => {
			if (this.clickInfoArr[i]["count" + i] == 1) {
				//console.log("单击事件");
				//判断如果是全屏模式下的单击，则不交换元素
				let clickEleId, flag = false;
				//当前播放器非全屏时，交换元素
				let fullScreenEle = self.getFullScreenEle();
				//如果是直播的话，video-js id；点播则是ele  video id
				if (fullScreenEle) {
					if (self.isLive) {
						let fullScreenEleId = fullScreenEle && fullScreenEle.getAttribute("id");
						flag = $(event.target).parent().attr("id") == fullScreenEleId || $(event.target).parent().parent().attr("id") == fullScreenEleId;
					} else {
						//比对id fullScreenEle获取的最外层div元素，event.target可能是video，可能是vjs-text-track-display 子元素
						let fullScreenEleId = $(fullScreenEle).attr("id");
						//console.log("被点击父元素id,爷节点id", $(event.target).parent().attr("id"), $(event.target).parent().parent());
						flag = $(event.target).parent().attr("id") == fullScreenEleId || $(event.target).parent().parent().attr("id") == fullScreenEleId;
					}
				}
				if (flag) {
					//console.log("播放器" + i + "在全屏模式下被单击了");
				} else {
					//  调换视频源
					self.changeVideo(i);
					// self.switchVideo(i);
				}
			}
			else {//双击不操作
			}
			clearTimeout(self.clickInfoArr[i]["timer" + i]);
			self.clickInfoArr[i]["count" + i] = 0;
		}, 500);

	}
	/**
	 * 设置其它静音
	 */
	changeMuted(player) {
		player.muted(false);
		this.playerArr.forEach(function (item, index, arr) {
			if (player != item.player) {
				item.player.muted(true);
			}
		})
	}
	/**
	 * 改变音量
	 * @param player
	 */
	changeAllVolume(player) {
		this.playerArr.forEach(function (item, index, arr) {
			if (player != item.player) {
				item.player.volume(player.volume());
			}
		})
		//设置音量进度条位置
		this.soundChangeProcess(player.volume())
	}


	/**
	 * 设置音量进度条
	 * @param soundValue
	 */
	soundChangeProcess(soundValue) {
		this.soundDis = soundValue * this.soundMaxLength
		this.soundProcess.css({
			width: this.soundDis
		})
		this.soundTarget.css({
			left: this.soundDis
		})
		$('.play-sound-btn-hover').css({
			left: this.soundDis
		})
	}


	/**
	 * 秒格式化
	 * @param value
	 * @returns {Number}
	 */
	changeSecond(value) {
		let showHour = false;
		let sec = parseInt(value)// 秒
		let min = 0// 分
		let hour = 0;//时
		if (sec >= 60) {
			min = parseInt(sec / 60 + "")
			sec = parseInt(sec % 60 + "")
			if (min >= 60) {
				hour = parseInt(min / 60 + "");
				min = min % 60;
			}
		}
		// 对时分秒进行格式化
		hour = this.formatTime(hour);
		min = this.formatTime(min);
		sec = this.formatTime(sec);
		if (showHour) {
			return hour + ":" + min + ":" + sec;
		} else {
			let minNum = parseInt(hour + "") * 60 + parseInt(min + "");
			minNum
			return this.formatTime(minNum) + ":" + sec;
		}

	}
	formatTime(num) {
		return num < 10 ? "0" + num : num;
	}
	changeSecond1(value) {
		let sec = parseInt(value)// 秒
		let min = 0// 分
		let hour = 0// 小时
		if (sec > 60) {
			min = parseInt(sec / 60 + "")
			sec = parseInt(sec % 60 + "")
			if (min >= 60) {
				hour = parseInt(min / 60 + "")
				min = parseInt(min % 60 + "")
			}
		}
		let result: any = parseInt(sec + "")
		if (min === 0) {
			if (result < 10) {
				result = "00:0" + result
			} else {
				result = "00:" + result
			}
		}
		if (min > 0) {
			if (min < 10) {
				if (result < 10) {
					result = "0" + parseInt(min + "") + ":" + "0" + result
				} else {
					result = "0" + parseInt(min + "") + ":" + result
				}
			} else {
				result = "" + parseInt(min + "") + ":" + result
			}
		}
		return result
	}


	/**
	  * 是否支持全屏
	  * @param fn
	  */
	isSupportFullScreen(fn?) {
		// 判断浏览器前缀
		if (document.fullscreenEnabled) {
			this.fullscreenEnabled = document.fullscreenEnabled;
		} else if ((document as any).webkitFullscreenEnabled) {
			this.fullscreenEnabled = (document as any).webkitFullscreenEnabled;
			this.prefixName = "webkit";
		} else if ((document as any).mozFullScreenEnabled) {
			this.fullscreenEnabled = (document as any).mozFullScreenEnabled;
			this.prefixName = "moz";
		} else if ((document as any).msFullscrefullscreenEnabledenEnabled) {
			this.fullscreenEnabled = (document as any).msFullscreenEnabled;
			this.prefixName = "ms";
		}
		if (!this.fullscreenEnabled) {
			this.isFullscreenData = false;
			fn && fn(); // 执行不支持全屏的回调
		}
		//console.log("全屏前缀是:", this.prefixName);
	}

	/**
	* 拖拽进度条
	*/
	dragControl(videoSource) { //拖动元素、进度条元素、拖动总长
		let self = this;
		let startX = 0,
			moveX = 0,
			disX = 0,
			dragDis = 0,
			soundDis = 0;
		//设置时间文本
		if (!self.isLive) {
			$('.play-all-time').html(this.changeSecond(this.duration));
		}
		self.soundValue = videoSource.volume();
		//设置音量进度条位置
		self.soundChangeProcess(this.soundValue)
		//监听进度条拖拽
		$('.player-control').mousedown(function (e) {
			// 减去播放器容器距离左侧宽度
			let containerLeft = $("#video-container").offset().left;
			startX = e.clientX - containerLeft;
			//console.log("点击控制栏了，startX：", startX);
			$('.play-process-btn').css({
				'transition': 'all 0s',
				'-moz-transition': 'all 0s', /* Firefox 4 */
				'-webkit-transition': 'all 0s', /* Safari 和 Chrome */
				'-o-transition': 'all 0s',
			})
			$('.play-sound-btn').css({
				'transition': 'all 0s',
				'-moz-transition': 'all 0s', /* Firefox 4 */
				'-webkit-transition': 'all 0s', /* Safari 和 Chrome */
				'-o-transition': 'all 0s',
			})
			//如果点击播放进度条
			if (!self.isLive && ($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process'))) {
				self.isDrag = true
				// self.isPlay = false
				dragDis = startX - self.leftInit
				self.dragTarget.css({
					left: dragDis - 5
				})
				// $('.play-process-btn-hover').css({
				// 	left: dragDis - 5
				// })
				self.dragProcess.css({
					width: dragDis
				})
				// $('.play-start').attr('src', 'assets/images/pause.png')
				// $('.play-start-hover').attr('src', 'assets/images/pause_hover.png')
				// videoSource.pause()
				$('.play-sym').hide()
				$('.play-sym-hover').hide()
				clearTimeout(self.timer)//拖拽时以该拖拽点为准，不根据播放进度更新进度条位置
			}
			//如果是点击声音进度条
			if ($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
				self.isSound = true
				self.isSoundOn = true
				let clientWidth = self.threeScreenFlag ? $(window).width() : $('.playerPop').width()
				self.soundDis = 110 - (clientWidth - startX) - 20 // 110为进度条右侧总长，20为播放按钮占用长度
				self.soundProcess.css({
					width: self.soundDis
				})
				self.soundTarget.css({
					left: self.soundDis
				})
				$('.play-sound-btn-hover').css({
					left: self.soundDis
				})
				self.soundSwitchBtn.attr('src', 'assets/images/sound_on.png')
				videoSource.volume(self.soundDis / self.soundMaxLength)
				if (videoSource.volume() < 0.05) {
					videoSource.volume(0);
					self.soundSwitchBtn.attr('src', 'assets/images/sound_off.png')
				}
				self.soundValue = videoSource.volume()
			}
		}).mousemove(function (e) {
			// 减去播放器容器距离左侧宽度
			let containerLeft = $("#video-container").offset().left;
			moveX = e.clientX - containerLeft;
			// //console.log("movex:", moveX);
			disX = moveX - startX
			if (self.isDrag) {
				if (!self.isLive && ($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process'))) {
					let left = dragDis + disX;
					self.processWidth = $('.play-process').width();
					// //console.log("拖拽mousemove事件获取进度条宽度：", self.processWidth);
					if (left > self.processWidth - 5) { //9为拖拽条小图标的宽度
						left = self.processWidth - 5
					} else if (left < 0) {
						left = 0
					}
					self.dragTarget.css({
						left: left - 5
					})
					// $('.play-process-btn-hover').css({
					// 	left: left - 5
					// })
					self.dragProcess.css({
						width: left
					})
				}
			}
			if (self.isSound) {
				if ($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
					let left = self.soundDis + disX
					if (left > self.soundMaxLength) {
						left = self.soundMaxLength
					} else if (left < 0) { // 减去1/2的小按钮宽
						left = 0
					}
					self.soundTarget.css({
						left: left - 5
					})
					$('.play-sound-btn-hover').css({
						left: left - 5
					})
					self.soundProcess.css({
						width: left - 5
					})
					videoSource.volume(left / self.soundMaxLength)
					if (videoSource.volume() < 0.05) {
						videoSource.volume(0)
						self.soundSwitchBtn.attr('src', 'assets/images/sound_off.png')
					}
					self.soundValue = videoSource.volume()
				}
			}
		}).mouseup(function (e) {
			if (self.isDrag) {
				self.isDrag = false
				// self.isPlay = true
				if (!self.isLive) {
					// videoSource.play()
					//同步所有播放器跳跃播放
					self.seekAll();
					//重新实时更新视频进度条
					self.drawProcess()
				}
			}
			if (self.isSound) {
				self.isSound = false
			}
		})
	}

	/**
	* 所有播放器跳跃播放
	* @param self
	*/
	seekAll() {
		//console.log("seekAll-->当前拖拽进度,总进度：", $('.play-process-drag').width(), this.processWidth, $('.play-process').width());
		this.processWidth = $('.play-process').width();
		let time = $('.play-process-drag').width() / this.processWidth * this.duration;
		//console.log("当前跳跃播放时间点：", time);
		this.playerArr.forEach(function (item, index, arr) {
			//console.log("当前播放技术：", item.player.techName_);
			item.player.currentTime(time);
		})
	}

	customBarPause(self) {
		self.isPlay = false;
		self.pauseAll();
		clearInterval(self.timer);
		$('.play-sym').show()
		$('.play-sym-hover').fadeIn()
		$('#play-start-hover').attr('src', 'assets/images/play_btn_hover.png')
		$('#play-start').attr('src', 'assets/images/play_btn.png')
	}
	customBarPlay(self) {
		self.isPlay = true;
		self.playAll();
		self.drawProcess();
		// videoSource.play()
		$('.play-sym').hide()
		$('.play-sym-hover').hide()
		$('#play-start-hover').attr('src', 'assets/images/pause_hover.png')
		$('#play-start').attr('src', 'assets/images/pause.png')
	}
	/**
	 * 准备播放
	 * @param videoSource
	 */
	playVideo(videoSource) {
		videoSource = this.mainPlayerObj.mainPlayer || videoSource;
		let self = this;
		this.rightPlayer = videoSource;
		// let videoSource = document.getElementsByClassName('video-js')[0],
		let menuWidth;
		//点击播放暂停按钮
		if (!self.isLive) {
			this.duration = videoSource.duration() || 0;
			this.duration = parseInt(this.duration + "");
			this.playStartBtn.click(function () {
				if (self.isPlay) {
					// videoSource.pause()
					//暂停所有播放器
					self.customBarPause(self);
				} else {
					//播放所有播放器
					self.customBarPlay(self);
				}
			});
			this.playStopBtn.click(function () { //直播无法停止
				// videoSource.currentTime(0)
				// videoSource.pause()
				self.stopAll();
				$('.play-sym').show()
				$('.play-sym-hover').fadeIn()
				self.dragTarget.css({ left: 0 })
				$('.play-process-btn-hover').css({ left: 0 })
				self.dragProcess.width(0)
				self.isPlay = false
				$('.play-start').attr('src', 'assets/images/play_btn.png')
				$('.play-start-hover').attr('src', 'assets/images/play_btn_hover.png')
			})
		}
		$('.play-sound-switch').click(function () {
			if (self.isSoundOn) {
				self.soundSwitchBtn.attr('src', 'assets/images/sound_off.png')
				self.isSoundOn = false
				// videoSource.muted(true);
				// videoSource.volume(0);
				self.mainPlayerObj.mainPlayer.muted(true);
				self.mainPlayerObj.mainPlayer.volume(0);
				$('.play-sound-btn').css({ left: 0 })
				$('.play-sound-btn-hover').css({ left: 0 })
				$('.play-sound-drag').width(0)
			} else {
				self.soundSwitchBtn.attr('src', 'assets/images/sound_on.png')
				self.mainPlayerObj.mainPlayer.muted(false);
				self.mainPlayerObj.mainPlayer.volume(self.soundValue)
				self.soundChangeProcess(self.soundValue)
				self.isSoundOn = true
			}
		})

		//监听全屏按钮点击
		$('.play-screen').click(function () {
			//console.log("点击自定义全屏按钮了");
			// fullScreen()
			if (self.threeScreenFlag) {
				//console.log("退出三全屏");
				self.threeScreenFlag = false;
				self.currentProcessWidth = $('.play-process').width();
				self.exitFullscreen();
			} else {
				//console.log("进入三全屏");
				self.threeScreenFlag = true;
				self.currentProcessWidth = $('.play-process').width();
				self.requestFullScreen("#player_body");
			}
			self.triggerMode = "three";
		});
		$('.play-sym-wrapper').remove();
		$('.start-wrapper-btn').append('<img class="play-sym" src="assets/images/start.png"><img class="play-sym-hover" src="assets/images/start_hover.png">')
		self.isSupportFullScreen();
		// videoSource.play()
		//实时更新进度条
		if (!self.isLive) {
			self.drawProcess()
		}
		self.dragControl(videoSource);
		videoSource.oncanplay = null;
	}
}