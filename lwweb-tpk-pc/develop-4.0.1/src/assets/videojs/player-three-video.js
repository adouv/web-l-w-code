
var fullscreenEnabled,
    prefixName = "",
    timer,
    rightPlayer,
    playTimer,
    duration = 0,
    currentTime,
    isPlay = true, //是否开始播放
    isDrag = false, //是否拖拽进度条
    isSound = false, //是否拖拽音量区域
    isSoundOn = true, //是否开启声音
    isRePlay = false,
    isClick = 0, //仅限第一次点击
    soundValue = 0,

    currentProcess,
    dragProcessEl = $('.play-process-drag'),
    soundTarget = $('.play-sound-btn'), //音量滑动块
    soundProcess = $('.play-sound-drag'), //音量进度条
    dragTarget = $('.play-process-btn'), //播放滑动块
    dragProcess = $('.play-process-drag'), //播放进度条,
    playStartBtn = $('.btn-wrapper-start'), //播放按钮
    soundSwitchBtn = $('#sound-switch'), //音频开关
    playStopBtn = $('.btn-wrapper-stop'), //停止按钮
    fullScreenBtn = $('.play-screen-not-full'),//全屏开关
    processWidth = $('.play-process').width(),
    soundDis = 0,
    leftInit = 55, //进度条整体距离左侧偏移
    rightInit = 30, //音量条整体距离右侧偏移
    dragProcessWidth = dragProcess.width(), //当前视频进度条长度
    soundMaxLength = $('.play-sound-wrapper').width(), //音量进度条总长
    soundProcessWidth = soundProcess.width() //当前音量进度条长度
/**
 * 准备播放
 * @param videoSource
 */
function playVideo(videoSource) {
    rightPlayer=videoSource;
    duration=videoSource.duration() || 0;
    // var videoSource = document.getElementsByClassName('video-js')[0],
    /**
     * 是否支持全屏
     * @param fn
     */
    var isSupportFullScreen = function (fn) {
// 判断浏览器前缀
        if (document.fullscreenEnabled) {
            fullscreenEnabled = document.fullscreenEnabled;
        } else if (document.webkitFullscreenEnabled) {
            fullscreenEnabled = document.webkitFullscreenEnabled;
            prefixName = "webkit";
        } else if (document.mozFullScreenEnabled) {
            fullscreenEnabled = document.mozFullScreenEnabled;
            prefixName = "moz";
        } else if (document.msFullscreenEnabled) {
            fullscreenEnabled = document.msFullscreenEnabled;
            prefixName = "ms";
        }
        if (!fullscreenEnabled) {
            isFullscreenData = false;
            fn && fn(); // 执行不支持全屏的回调
        }
        console.log("全屏前缀是:", prefixName);
    }

    /**
     * 拖拽进度条
     */
    var dragControl = function () { //拖动元素、进度条元素、拖动总长
        var startX = 0,
            moveX = 0,
            disX = 0,
            dragDis = 0,


        soundDis = 0;
        //设置时间文本
        $('.play-all-time').html(changeSecond(duration));
        soundValue = videoSource.volume();
        //设置音量进度条位置
        soundChangeProcess(soundValue)
        //监听进度条拖拽
        $('.player-control').mousedown(function (e) {
            console.log("点击控制栏了",e);
            startX = e.clientX
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
            if ($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
                isDrag = true
                isPlay = false
                dragDis = startX - leftInit
                dragTarget.css({
                    left: dragDis - 5
                })
                // $('.play-process-btn-hover').css({
                // 	left: dragDis - 5
                // })
                dragProcess.css({
                    width: dragDis
                })
                $('.play-start').attr('src', './images/pause.png')
                $('.play-start-hover').attr('src', './images/pause_hover.png')
                // videoSource.pause()
                $('.play-sym').hide()
                $('.play-sym-hover').hide()
                clearTimeout(timer)//拖拽时以该拖拽点为准，不根据播放进度更新进度条位置
            }
            //如果是点击声音进度条
            if ($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
                isSound = true
                isSoundOn = true
                var clientWidth = $('.playerPop').width()
                soundDis = 110 - (clientWidth - startX) - 20 // 110为进度条右侧总长，20为播放按钮占用长度
                soundProcess.css({
                    width: soundDis
                })
                soundTarget.css({
                    left: soundDis
                })
                $('.play-sound-btn-hover').css({
                    left: soundDis
                })
                soundSwitchBtn.attr('src', './images/sound_on.png')
                videoSource.volume(soundDis / soundMaxLength)
                if (videoSource.volume() < 0.05) {
                    videoSource.volume(0);
                    soundSwitchBtn.attr('src', './images/sound_off.png')
                }
                soundValue = videoSource.volume()
            }
        }).mousemove(function (e) {
            moveX = e.clientX
            disX = moveX - startX
            if (isDrag) {
                if ($(e.target).hasClass('play-process') || $(e.target).parent().hasClass('play-process')) {
                    var left = dragDis + disX
                    if (left > processWidth - 5) { //9为拖拽条小图标的宽度
                        left = processWidth - 5
                    } else if (left < 0) {
                        left = 0
                    }
                    dragTarget.css({
                        left: left - 5
                    })
                    // $('.play-process-btn-hover').css({
                    // 	left: left - 5
                    // })
                    dragProcess.css({
                        width: left
                    })
                }
            }
            if (isSound) {
                if ($(e.target).hasClass('play-sound-wrapper') || $(e.target).parent().hasClass('play-sound-wrapper')) {
                    var left = soundDis + disX
                    if (left > soundMaxLength) {
                        left = soundMaxLength
                    } else if (left < 0) { // 减去1/2的小按钮宽
                        left = 0
                    }
                    soundTarget.css({
                        left: left - 5
                    })
                    $('.play-sound-btn-hover').css({
                        left: left - 5
                    })
                    soundProcess.css({
                        width: left - 5
                    })
                    videoSource.volume(left / soundMaxLength)
                    if (videoSource.volume() < 0.05) {
                        videoSource.volume(0)
                        soundSwitchBtn.attr('src', './images/sound_off.png')
                    }
                    soundValue = videoSource.volume()
                }
            }
        }).mouseup(function (e) {
            if (isDrag) {
                isDrag = false
                isPlay = true
                // videoSource.play()
                //同步所有播放器跳跃播放
                seekAll();
                //重新实时更新视频进度条
                drawProcess()
            }
            if (isSound) {
                isSound = false
            }
        })
    }
    /**
     * 所有播放器跳跃播放
     * @param self
     */
    var seekAll=function() {
        var time = $('.play-process-drag').width() / processWidth * duration;
        console.log("当前跳跃播放时间点：", time);
        playerArr.forEach(function (item, index, arr) {
            console.log("当前播放技术：", item.player.techName_);
//                item.player.setCurrentTime(time);
            item.player.currentTime(time);
        })
    }



    var menuWidth;
    // var fullScreen = function () {
    //     if (isFullScreen) {
    //         isFullScreen = false
    //         fullScreenBtn.attr('src', './images/screen_on.png')
    //         $('.play-screen-not-full-hover').attr('src', './images/screen_on_hover.png')
    //         if (document.exitFullscreen) {
    //             document.exitFullscreen();
    //         }
    //         else if (document.mozCancelFullScreen) {
    //             document.mozCancelFullScreen();
    //         }
    //         else if (document.webkitCancelFullScreen) {
    //             document.webkitCancelFullScreen();
    //         }
    //         else if (document.msExitFullscreen) {
    //             document.msExitFullscreen();
    //         }
    //         $('.playerPop').css({
    //             width: 800,
    //             height: 500
    //         })
    //         $('.start-wrapper-btn').css({
    //             bottom: '6%'
    //         })
    //     } else {
    //         isFullScreen = true
    //         fullScreenBtn.attr('src', './images/screen_off.png')
    //         $('.play-screen-not-full-hover').attr('src', './images/screen_off_hover.png')
    //         var docElm = document.documentElement;
    //         //W3C
    //         if (docElm.requestFullscreen) {
    //             docElm.requestFullscreen();
    //         }
    //         //FireFox
    //         else if (docElm.mozRequestFullScreen) {
    //             docElm.mozRequestFullScreen();
    //         }
    //         //Chrome等
    //         else if (docElm.webkitRequestFullScreen) {
    //             docElm.webkitRequestFullScreen();
    //         }
    //         //IE11
    //         else if (elem.msRequestFullscreen) {
    //             elem.msRequestFullscreen();
    //         }
    //         $('.playerPop').css({
    //             width: '100%',
    //             height: '100%'
    //         })
    //         $('.start-wrapper-btn').css({
    //             bottom: '3%'
    //         })
    //     }
    // }

    $('.playerPop').hover(function () {//鼠标移入视频容器
        /*  $('.player-control').css({
         bottom: 0
         })*/
        if (isClick && !isPlay) {
            $('.play-sym-hover').fadeIn()//视频中播放图标激活

            $('.play-sym, .play-sym-hover').css({
                'top': 0,
                'transition': 'all 0s',
                '-moz-transition': 'all 0s', /* Firefox 4 */
                '-webkit-transition': 'all 0s', /* Safari 和 Chrome */
                '-o-transition': 'all 0s',
            })
        }
        $('.play-sym, .play-sym-hover').css({
            'top': 0,
            'transition': 'all 0.5s',
            '-moz-transition': 'all 0.5s', /* Firefox 4 */
            '-webkit-transition': 'all 0.5s', /* Safari 和 Chrome */
            '-o-transition': 'all 0.5s',
        })
    }, function () {//鼠标移出视频容器
        $('.player-control').css({
            // bottom: -25
        })
        if (isClick) {
            $('.play-sym-hover').fadeOut()
            $('.play-sym').css({
                top: 27
            })
            $('.play-sym-hover').css({
                top: 27
            })
        }
    })
    $('.play-process').hover(function () {//鼠标移入播放进度条
        $('.play-process-btn').css({
            'transition': 'all 0s',
            '-moz-transition': 'all 0s', /* Firefox 4 */
            '-webkit-transition': 'all 0s', /* Safari 和 Chrome */
            '-o-transition': 'all 0s',
            // 'background-color': '#ff8921'
        })
    }, function () {//鼠标移出播放进度条
        $('.play-process-btn').css({
            'transition': 'all 0.5s',
            '-moz-transition': 'all 0.5s', /* Firefox 4 */
            '-webkit-transition': 'all 0.5s', /* Safari 和 Chrome */
            '-o-transition': 'all 0.5s',
            // 'background-color': '#ffffff'
        })
    })
    $('.play-sound-wrapper').hover(function () {//鼠标移入声音进度条
        $('.play-sound-btn').css({
            'transition': 'all 0.5s',
            '-moz-transition': 'all 0.5s', /* Firefox 4 */
            '-webkit-transition': 'all 0.5s', /* Safari 和 Chrome */
            '-o-transition': 'all 0.5s',
            // 'background-color': '#ff8921'
        })
    }, function () {//鼠标移出声音进度条
        $('.play-sound-btn').css({
            'transition': 'all 0.5s',
            '-moz-transition': 'all 0.5s', /* Firefox 4 */
            '-webkit-transition': 'all 0.5s', /* Safari 和 Chrome */
            '-o-transition': 'all 0.5s',
            // 'background-color': '#ff8921'
        })
    });


    //点击播放暂停按钮
    playStartBtn.click(function () {
        if (isPlay) {
            // videoSource.pause()
            //暂停所有播放器
            if (!isLive){
                pauseAll();
                $('.play-sym').show()
                $('.play-sym-hover').fadeIn()
                $('#play-start-hover').attr('src', './images/play_btn_hover.png')
                $('#play-start').attr('src', './images/play_btn.png')
                isPlay = false;
            }

        } else {
            if (!isLive) {
                //播放所有播放器
                playAll();
                // videoSource.play()
                $('.play-sym').hide()
                $('.play-sym-hover').hide()
                $('#play-start-hover').attr('src', './images/pause_hover.png')
                $('#play-start').attr('src', './images/pause.png')
                isPlay = true;
                drawProcess()
            }
        }
    })
    playStartBtn.hover(function () {
        // $('#play-start-hover').fadeIn()
    }, function () {
        // $('#play-start-hover').fadeOut()
    })
    $('.play-sound-switch').click(function () {
        if (isSoundOn) {
            soundSwitchBtn.attr('src', './images/sound_off.png')
            isSoundOn = false
            videoSource.muted(true);
            videoSource.volume(0);
            $('.play-sound-btn').css({left: 0})
            $('.play-sound-btn-hover').css({left: 0})
            $('.play-sound-drag').width(0)
        } else {
            soundSwitchBtn.attr('src', './images/sound_on.png')
            videoSource.muted(false);
            videoSource.volume(soundValue)
            soundChangeProcess(soundValue)
            isSoundOn = true
        }
    })
    playStopBtn.click(function () {
        if (!isLive){//直播无法停止
            // videoSource.currentTime(0)
            // videoSource.pause()
            stopAll();
            $('.play-sym').show()
            $('.play-sym-hover').fadeIn()
            dragTarget.css({left: 0})
            $('.play-process-btn-hover').css({left: 0})
            dragProcess.width(0)
            isPlay = false
            $('.play-start').attr('src', './images/play_btn.png')
            $('.play-start-hover').attr('src', './images/play_btn_hover.png')
        }
    })
    playStopBtn.hover(function () {
        $('.play-stop-hover').fadeIn()
    }, function () {
        $('.play-stop-hover').fadeOut()
    })
    //监听全屏按钮点击
    $('.play-screen').click(function () {
        console.log("点击自定义全屏按钮了");
        // fullScreen()
        if (threeScreenFlag=="full"){
            threeScreenFlag="notfull";
            currentProcessWidth=$('.play-process').width();
            exitFullscreen();
        }else{
            currentProcessWidth=$('.play-process').width();
            requestFullScreen("#player_body");
            threeScreenFlag="full";
        }
        triggerMode="one";
    }).hover(function () {
       /* if (threeScreenFlag=="full") {
            $('.play-screen-not-full-hover').attr('src', './images/screen_off_hover.png').fadeIn()
        } else {
            $('.play-screen-not-full-hover').attr('src', './images/screen_on_hover.png').fadeIn()
        }*/
    }, function () {
        // $('.play-screen-not-full-hover').fadeOut()
    })
    $(window).keypress(function (event) {//无法监听到esc按键
        event.preventDefault()
        console.log('当前keycode被监听event.keyCode', event.keyCode)
        if (event.keyCode === 27 && threeScreenFlag=="full") {
            // fullScreen()
            requestFullScreen()
        }
    })
    $('.play-sym-wrapper').remove()
    $('.start-wrapper-btn').append('<img class="play-sym" src="./images/start.png"><img class="play-sym-hover" src="./images/start_hover.png">')
    // $('#videoSource, .start-wrapper-btn').click(function () {
    //     // clearTimeout(playTimer)
    //     // playTimer = setTimeout(function() {
    //     if (isPlay) {
    //         isPlay = false
    //         videoSource.pause()
    //         $('.play-start').attr('src', './images/play_btn.png')
    //         $('.play-start-hover').attr('src', './images/play_btn_hover.png')
    //         isClick++
    //         $('.play-sym').fadeIn().css({
    //             'top': 0,
    //             'transition': 'all 0s',
    //             '-moz-transition': 'all 0s', /* Firefox 4 */
    //             '-webkit-transition': 'all 0s', /* Safari 和 Chrome */
    //             '-o-transition': 'all 0s',
    //         })
    //         $('.play-sym-hover').fadeIn().css({
    //             'top': 0,
    //             'transition': 'all 0s',
    //             '-moz-transition': 'all 0s', /* Firefox 4 */
    //             '-webkit-transition': 'all 0s', /* Safari 和 Chrome */
    //             '-o-transition': 'all 0s',
    //         })
    //         // setTimeout(function() {
    //         $('.play-sym, .play-sym-hover').css({
    //             'transition': 'all 0.5s',
    //             '-moz-transition': 'all 0.5s', /* Firefox 4 */
    //             '-webkit-transition': 'all 0.5s', /* Safari 和 Chrome */
    //             '-o-transition': 'all 0.5s',
    //         })
    //         // }, 500)
    //         clearTimeout(timer)
    //     } else {
    //         if (isRePlay) {
    //             dragProcess.css({
    //                 width: 0
    //             })
    //             dragTarget.css({
    //                 left: 0
    //             })
    //             // $('.play-process-btn-hover').css({left:0})
    //         }
    //         isPlay = true
    //         videoSource.play()
    //         $('.play-sym').hide()
    //         $('.play-sym-hover').hide()
    //         drawProcess()
    //         $('.play-start').attr('src', './images/pause.png')
    //         $('.play-start-hover').attr('src', './images/pause_hover.png')
    //         // $('.start-wrapper-btn').fadeOut()
    //     }
    //     // }, 300)
    // })
    //检测是否支持全屏
    isSupportFullScreen();
    // videoSource.play()
    //实时更新进度条
    drawProcess()
   /* $(window).resize(function () {
        processWidth = $('.play-process').width()
        currentProcess = currentTime / duration * (processWidth - 5)//5为拖拽条小图标的宽度的一半
        console.log("窗口大小变化了...processWidth:",processWidth,"currentProcess:",currentProcess);
        dragProcessEl.css({
            width: currentProcess
        })
        dragTarget.css({
            left: currentProcess
        })
        // $('.play-process-btn-hover').css({left:currentProcess})
        if (isFullScreen) {
            if (!document.webkitIsFullScreen) {
                console.log('document.webkitIsFullScreen')
                isFullScreen = false
                fullScreenBtn.attr('src', './images/screen_on.png')
            }
        }
    })*/
    dragControl();
    videoSource.oncanplay = null;
}
/**
 * 设置音量进度条
 * @param soundValue
 */
var soundChangeProcess = function (soundValue) {
    soundDis = soundValue * soundMaxLength
    soundProcess.css({
        width: soundDis
    })
    soundTarget.css({
        left: soundDis
    })
    $('.play-sound-btn-hover').css({
        left: soundDis
    })
}


/**
 * 秒格式化
 * @param value
 * @returns {Number}
 */
var changeSecond = function (value) {
    var sec = parseInt(value)// 秒
    var min = 0// 分
    var hour = 0// 小时
    if (sec > 60) {
        min = parseInt(sec / 60)
        sec = parseInt(sec % 60)
        if (min > 60) {
            hour = parseInt(min / 60)
            min = parseInt(min % 60)
        }
    }
    var result = parseInt(sec)
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
                result = "0" + parseInt(min) + ":" + "0" + result
            } else {
                result = "0" + parseInt(min) + ":" + result
            }
        } else {
            result = "" + parseInt(min) + ":" + result
        }
    }
    return result
}
/**
 * 实时更新进度条
 */
    function drawProcess() {
    $('.play-process-btn').css({
        'transition': 'all 0s',
        '-moz-transition': 'all 0s', /* Firefox 4 */
        '-webkit-transition': 'all 0s', /* Safari 和 Chrome */
        '-o-transition': 'all 0s',
    })
    if (!isDrag) {
        currentTime = rightPlayer.currentTime()
        $('.play-current-time').html(changeSecond(currentTime))
        currentProcess = currentTime / duration * (processWidth - 10)//5为拖拽条小图标的宽度的一半
        dragProcessEl.css({
            width: currentProcess
        })
        dragTarget.css({
            left: currentProcess
        })
        // $('.play-process-btn-hover').css({
        // 	left: currentProcess
        // })
        if (currentTime < duration) {
            timer = setTimeout(drawProcess, 10)
        } else {//播放完毕
            $('.play-sym').show()
            $('.play-start').attr('src', './images/play_btn.png')
            $('.play-start-hover').attr('src', './images/play_btn_hover.png')
            isRePlay = true
            isPlay = false
            clearTimeout(timer)
        }
    }
}

var isLive = false;//是否直播

/**
 * 所有播放器暂停
 * @param self
 */
function  pauseAll(){
    playerArr.forEach(function (item, index, arr) {
        item.player.pause();
    })
}
/**
 * 所有播放器播放
 * @param self
 */
function playAll () {
    playerArr.forEach(function (item, index, arr) {
//                    item.player.load();
        item.player.play();
    })
}
/**
 * 所有播放器停止播放
 * @param self
 */
function stopAll() {
    playerArr.forEach(function (item, index, arr) {
//                    item.player.load();
        item.player.pause();
        item.player.currentTime(0);
    })
}
/**
 * 隐藏所有播放器控制条
 */
function hideAllControls(){
    var controlsArr=$(".vjs-control-bar");
    for (var i=0;i<controlsArr.length;i++){
        $(controlsArr[i]).css("visibility","hidden");
    }
}
var firstSeek=-1;
var firstVolumeSeek=-1;
/**
 * 播放器状态
 */
function isReady() {
    window.playerArr = [];
    var realUrlArr = [];
    var liveUrlArr;

    liveUrlArr = ["rtmp://ns8.indexforce.com/home/mystream",
        "rtmp://ns8.indexforce.com/home/mystream",
        "rtmp://ns8.indexforce.com/home/mystream"
    ];
    var videoUrlArr = [
        /* "http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4",
         "http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4",
         "http://media.dl.wanmei.com/media/media/csgonewtrailerenglish.mp4"*/
        // "http://221.228.226.5/15/t/s/h/v/tshvhsxwkbjlipfohhamjkraxuknsc/sh.yinyuetai.com/88DC015DB03C829C2126EEBBB5A887CB.mp4",
        // "http://221.228.226.5/15/t/s/h/v/tshvhsxwkbjlipfohhamjkraxuknsc/sh.yinyuetai.com/88DC015DB03C829C2126EEBBB5A887CB.mp4",
        // "http://221.228.226.5/15/t/s/h/v/tshvhsxwkbjlipfohhamjkraxuknsc/sh.yinyuetai.com/88DC015DB03C829C2126EEBBB5A887CB.mp4"
        "http://vjs.zencdn.net/v/oceans.mp4",
        "http://vjs.zencdn.net/v/oceans.mp4",
        "http://vjs.zencdn.net/v/oceans.mp4"
    ];
    if (isLive) {
        realUrlArr = liveUrlArr;
    } else {
        realUrlArr = videoUrlArr;
    }
    videojs.options.flash.swf = "video-js.swf";
    var options = {
        techOrder: ["html5", "flash"],
        poster: "http://10.0.0.10:74/assets/images/video-load.gif"
//        ,
//        aspectRatio:"4:3"//加上比例之后，控制条不出来了
    };
    // $(".player-control").hide();
    var player1 = videojs('videoOne', options, function onPlayerReady() {
        videojs.log('播放器1已经准备好了!');
        var self = this;
        var index=0;
        this.muted(true);//设置静音
        this.on("pause", function () {
            console.log("播放器1暂停了...");
//            changeVideo(0);
        });

        this.on("play", function () {
            console.log("播放器1播放中...");
        });
          this.on("ended", function () {
            console.log("播放器1结束了...");
        });

        this.on('click',function(e) {//此处的click事件要想生效不能设置vjs pointer-event:none。
            console.log('播放器1 --> click');
            clickVideo(event,index);
        });
        this.on("volumechange", function (e) {
            console.log("播放器1音量变化了...");
            if (firstVolumeSeek==-1){
                firstVolumeSeek=index;
            }
            if (firstVolumeSeek==index) {
                changeAllVolume(self);
            }
        });
        this.on("seeking",function () {
            console.log("播放器1号跳跃播放了");
//            获取播放进度，统一设置
//             if (!isLive&&seekIndex==index){
            if (firstSeek==-1){
                firstSeek=index;
            }
            if (!isLive&&firstSeek==index){
                seekAllVideo(self);//传递self有问题？？？0 为啥调试一遍又没问题了，缓存么？奇怪了
            }

        });
        //该函数需要在设备准备好的时候调用
        hideAllControls();
    });
    playerArr.push({player: player1, id: "#videoOne", src: realUrlArr[0], type: "rtmp/flv"});

    var player2= videojs('videoTwo', options, function onPlayerReady() {
        videojs.log('播放器1已经准备好了!');
        var self = this;
        var index=1;
        this.muted(true);//设置静音
        this.on("pause", function () {
            console.log("播放器1暂停了...");
//            changeVideo(0);
        });
        this.on("play", function () {
            console.log("播放器1播放中...");
        });
        this.on('click',function(e) {//此处的click事件要想生效不能设置vjs pointer-event:none。另外次数监听click之后会导致handleclick失效
            console.log('播放器2 --> click');
            clickVideo(event, index);
        });
        this.on("volumechange", function (e) {
            console.log("播放器2音量变化了...");
            if (firstVolumeSeek==-1){
                firstVolumeSeek=index;
            }
            if (firstVolumeSeek==index) {
                changeAllVolume(self);
            }
        });
        this.on("seeking",function () {
         console.log("播放器2跳跃播放了");
         //            获取播放进度，统一设置
         //    if (!isLive&&seekIndex==index){
            if (firstSeek==-1){
                firstSeek=index;
            }
            if (!isLive&&firstSeek==index){
                seekAllVideo(self);//传递self有问题？？？0 为啥调试一遍又没问题了，缓存么？奇怪了
            }
         });
        //该函数需要在设备准备好的时候调用
        hideAllControls();
    });
    playerArr.push({player: player2, id: "#videoTwo", src: realUrlArr[1], type: "rtmp/flv"});
    // var videoSource = document.getElementById('videoSource'),

    var bigPlayer = videojs('videoSource', options, function onPlayerReady() {
        videojs.log('播放器3已经准备好了!');
        var self = this;
        var index=2;
        this.muted(false);//设置静音
        this.volume(0.2);
        this.on('click',function(event) {//此处的click事件要想生效不能设置vjs pointer-event:none。
            console.log('播放器3 --> click');
            clickVideo(event, index);
        });
        this.on("pause", function () {
            console.log("播放器3暂停了...");
        });
        this.on("volumechange", function (e) {
            console.log("播放器3音量变化了...");
            if (firstVolumeSeek==-1){
                firstVolumeSeek=index;
            }
            if (firstVolumeSeek==index) {
                changeAllVolume(self);
            }
        });
        this.on("seeking",function () {
            console.log("播放器3跳跃播放了");
//            获取播放进度，统一设置
//             if (!isLive&&seekIndex==index){
            if (firstSeek==-1){
                firstSeek=index;
            }
            if (!isLive&&firstSeek==index){
                seekAllVideo(self);//传递self有问题？？？0 为啥调试一遍又没问题了，缓存么？奇怪了
            }
        });
        if (!isLive) {
            getTotalDuration(self);
        }
        //该函数需要在设备准备好的时候调用
        hideAllControls();
    });
    playerArr.push({player: bigPlayer, id: "#videoSource", src: realUrlArr[2], type: "rtmp/flv"});
    for (var i=0;i<playerArr.length;i++){
        var obj={};
        obj["timer"+i]=null;
        obj["count"+i]=0;
        clickInfoArr.push(obj);
    }
    console.log(clickInfoArr[0]==clickInfoArr[1]);
    /* $('.play-start').attr('src', './images/waiting.png').css({
     'margin-left': 7,
     'margin-top': 3,
     }).addClass('animate')
     $('.play-sym-wrapper').remove()
     $('.playerPop').append('<div class="play-sym-wrapper">' +
     '<img class="play-sym-wanmei" src="./images/loading.gif"></div>')
     $(videoSource).hide()
     playTimer = setTimeout(ifState, 10)*/
}
/**
 * 点击视频
 */
function clickVideo(event,i){
    console.log("当前点击的播放器是："+i+",count:"+clickInfoArr[i]["count"+i]);
    // console.log("点击目标元素：",event.target);
    clickInfoArr[i]["count"+i]++;
    clickInfoArr[i]["timer"+i] = window.setTimeout(function () {
        if (clickInfoArr[i]["count"+i] == 1) {
            console.log("单击事件");
            //判断如果是全屏模式下的单击，则不交换元素
            var clickEleId,flag=false;
            //当前播放器非全屏时，交换元素
            var fullScreenEle=getFullScreenEle();
            //如果是直播的话，video-js id；点播则是ele  video id
            if (fullScreenEle){
                if (isLive){
                    clickEleId =event.target.getAttribute("id");
                    flag=fullScreenEle&&fullScreenEle.getAttribute("id")==clickEleId
                }else{
                    // if ($(event.target).hasClass('vjs-tech')){//点击视频区域
                    clickEleId =$(event.target).children("video")[0].getAttribute("id")
                    //比对id
                    flag=fullScreenEle&&$(fullScreenEle).children("video")[0]&&$(fullScreenEle).children("video")[0].getAttribute("id")==clickEleId
                    // }
                }
            }
            if(flag){
                console.log("播放器3在全屏模式下被单击了");
            }else{
                //  调换视频源
                changeVideo(i);
            }
        }
        else {
            // console.log("双击,此时是否为全屏？",document.fullscreen);
            if (oneScreenFlag=="full") {
                oneScreenFlag="notfull";
                currentProcessWidth=$('.play-process').width();
                hideAllControls();
                changeMuted(playerArr[playerArr.length-1].player);
                // exitFullscreen();
                playerArr[i].player.exitFullscreen();
            } else {//三画面全屏，双击单画面全屏；双击单画面全屏
                currentProcessWidth=$('.play-process').width();
                oneScreenFlag="full";
                firstSeek=-1;
                changeMuted(playerArr[i].player);
                //单画面全屏时，显示当前播放器控制条
                var controlEle=$(playerArr[i].id+" .vjs-control-bar")[0];
                $(controlEle).css("visibility","visible");
                // requestFullScreen(playerArr[i].id);
                playerArr[i].player.requestFullscreen();
            }
            triggerMode="one";
        }
        window.clearTimeout(clickInfoArr[i]["timer"+i]);
        clickInfoArr[i]["count"+i] = 0;
    }, 500);

}
/**
 * 设置其它静音
 */
function changeMuted(player){
    player.muted(false);
    playerArr.forEach(function (item, index, arr) {
        if (player!=item.player){
            item.player.muted(true);
        }
    })
}
/**
 * 改变音量
 * @param player
 */
function changeAllVolume(player){
        playerArr.forEach(function (item, index, arr) {
            if (player!=item.player){
                item.player.volume(player.volume());
            }
        })
    //设置音量进度条位置
    soundChangeProcess(player.volume())
    }
/**
 * 获取mp4总播放时间
 * @param player
 */
function getTotalDuration(player) {
    var videoEleArr = $("video");
    var videoEle = videoEleArr && videoEleArr.length > 0 && videoEleArr[videoEleArr.length - 1];
    if (videoEle) {
        videoEle.addEventListener('loadedmetadata', function () {
            console.log('video duration information available');
            videojs.log('loadedmetadata播放器3获取到总时长是：', player.duration());
            playVideo(player);
        });
    }
    // playVideo(player);
}
/**
 * 设置全屏
 * @param domName
 */
function requestFullScreen(domName) {
    const element = document.querySelector(domName);
    const methodName =
        prefixName === ""
            ? "requestFullscreen"
            : prefixName + "RequestFullScreen";
    element[methodName]();
}
/**
 * 退出全屏
 *
 */
function  exitFullscreen() {
    const methodName =
        prefixName === ''
            ? 'exitFullscreen'
            : prefixName + "ExitFullscreen"; // API 前缀
    document[methodName](); // 调用
}
/**
 * 监听全屏变化
 */
function listenFullScreen(){
    document.addEventListener("fullscreenchange", function () {
        console.log("监听到全屏mode变化了...",document.fullscreen);

        // $('.play-process-btn-hover').css({left:currentProcess})
       /* if (isThreeFullScreen) {
            if (!document.webkitIsFullScreen) {
                console.log('document.webkitIsFullScreen')
                isThreeFullScreen = false
                fullScreenBtn.attr('src', './images/screen_on.png')
            }
        }*/

        if (document.fullscreen) {//进入全屏
            $('.player-control').width($(window).width());
            // var controlEle=$(playerArr[i].id+" .vjs-control-bar")[0];
            //获取全屏元素
            var fullscreenEle=getFullScreenEle();
            $(fullscreenEle).children(".vjs-control-bar").css("visibility","visible");
            if (processInterval!=null){
                clearInterval(processInterval);
            }
            processInterval=setInterval(coreectProgress,50);
        } else {//退出全屏
            menuWidth = $('.playerPop').width();
            console.log("获取到容器宽度：", menuWidth);
            // $('.player-control').width(menuWidth);
            //退出全屏时需要重新设置拖拽进度条宽度，它超过了
            // clearTimeout(timer);
            // drawProcess();
            hideAllControls();
            if (processInterval!=null){
                clearInterval(processInterval);
            }
            processInterval=setInterval(coreectProgress,50);
        }


    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        console.log("监听到全屏mode变化了...2");
        fullscreenState.innerHTML = (document.mozFullScreen)? "" : "not ";
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        console.log("监听到全屏mode变化了...3");
        fullscreenState.innerHTML = (document.webkitIsFullScreen)? "" : "not ";}, false);

    document.addEventListener("msfullscreenchange", function () {
        console.log("监听到全屏mode变化了...4");
        fullscreenState.innerHTML = (document.msFullscreenElement)? "" : "not ";}, false);

}
var processInterval,currentProcessWidth;

/**
 * 校正底部进度条
 */
function coreectProgress(){
    processWidth = $('.play-process').width();
    if (currentProcessWidth==processWidth){
        currentProcess = currentTime / duration * (processWidth - 5)//5为拖拽条小图标的宽度的一半
        console.log("窗口大小变化了...processWidth:",processWidth,"currentProcess:",currentProcess);
        dragProcessEl.css({
            width: currentProcess
        })
        dragTarget.css({
            left: currentProcess
        })
        clearInterval(processInterval);
    }
}
/*var count = 0;
 var timer;*/
var clickInfoArr=[];//避免短时间点击两个画面，导致第一个画面全屏，单独记录每个播放器单双击事件
var oneScreenFlag = "unset";//单画面全屏
var threeScreenFlag = "unset";//三画面全屏
var triggerMode="unset";
var changeVideoInfo={time:0,isChange:false};

/**
 * 所有播放器跳跃播放
 * @param self
 */
var seekAllVideo=function(player) {
    var time=player.currentTime();
    playerArr.forEach(function (item, index, arr) {
        // console.log("当前播放技术：", item.player.techName_);
//                item.player.setCurrentTime(time);
        if (player!=item.player){
            item.player.currentTime(time);
        }

    })
}
function getFullScreenEle() {
    const fullscreenElement =
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
    return fullscreenElement;
}
/**
 * 处理点击--优先于videojs中click监听
 * @param event
 * @param index
 */
function handleClick(event, i) {
    console.log("handleClick被调用了",i);
}
/**
 * 切换地址播放画面
 */
function changeVideo(index) {
    //如果点击的是当前正在播放的视频，则不交换
    var fullScreenEle=getFullScreenEle();
    // var videoEle=document.getElementById(playerArr[index].id);
    var videoEle=$(playerArr[index].id);
    // console.log("获取到全屏元素",fullScreenEle,videoEle);
    // if(fullScreenEle&&fullScreenEle.isSameNode(videoEle)){
    if(fullScreenEle&&fullScreenEle.getAttribute("id")==videoEle.attr("id")){
        console.log("changeVideo-->当前播放器为全屏播放，不切换视频地址");
        return ;
    }
    if (index == 2||playerArr.length ==1) return;
    // console.log("交换前的播放器" + index, playerArr[index].src);
    // console.log("交换前的播放器3：", playerArr[playerArr.length-1].src);
    var player = playerArr[index].player;
    // player.pause();
    // playerArr[playerArr.length-1].player.pause();

    // if (!isLive){
    // pauseAll();
    // }
    var time=playerArr[playerArr.length-1].player.currentTime();
    console.log("当前播放技术为：", player.techName_);
    if (player.techName_ === "Html5") {
        var temp = playerArr[index].src;
        player.src(playerArr[playerArr.length-1].src);
        playerArr[playerArr.length-1].player.src(temp);
        player.muted(true);//设置静音
        if (!isLive){
            /*   player.currentTime(time);
             playerArr[playerArr.length-1].player.currentTime(time);
             //    直接设置跳转时间似乎不行，那就在重新加载时跳转
             changeVideoInfo={time:time,isChange:true}*/
            playerArr[index].player.on('loadedmetadata', function() {
                playerArr[index].player.play();            			//自动播放
                playerArr[index].player.currentTime(time);		    //跳转
            });
            playerArr[2].player.on('loadedmetadata', function() {
                playerArr[2].player.play();            			//自动播放
                playerArr[2].player.currentTime(time);		    //跳转
            });
        }
    } else {
        var temp = playerArr[index].src;
        player.loadTech_(player.techName_, {src: playerArr[playerArr.length-1].src});
        playerArr[playerArr.length-1].player.loadTech_(player.techName_, {src: temp});
        player.muted(true);//设置静音
        if (!isLive){
            player.currentTime(time);
            playerArr[playerArr.length-1].player.currentTime(time);
            changeVideoInfo={time:time,isChange:true}
        }
    }
    var tempSrc = playerArr[index].src;
    playerArr[index].src = playerArr[playerArr.length-1].src;
    playerArr[playerArr.length-1].src = tempSrc;
    // console.log("交换后的播放器" + index, playerArr[index].src);
    // console.log("交换后的播放器3：", playerArr[playerArr.length-1].src);
}
var isPlaying=true;
/**
 * 初始化入口
 * @param id
 */
customInit = function (id) {
    console.log("调用init函数了...", id);
    isReady();
   /* $(".video-js")[0].onclick=function () {
        console.log("手动监听-->播放器1号被点击了");
    }*/
    listenFullScreen();
    //播放按钮，进度条 设置禁止点击pointer-events:none
     if (isLive){
     $("#separator").css("display","none");
     console.log($(".vjs-play-control"));
     $(".vjs-play-control").css("pointer-events","none");//取消事件后，无法捕获到该事件
     }else{

     }

    // 底部菜单栏禁止冒泡，video收不到click事件。
    var controlBarArr=$(".vjs-control-bar");
    for(var i=0;i<controlBarArr.length;i++){
        controlBarArr[i].addEventListener("click",function (e) {
            console.log("拦截控制栏事件");
            e.preventDefault();
            e.stopPropagation();
            });
    }
    // 公共： 播放按钮，进度条，声音，全屏 禁止冒泡
//    当直播情况下，如果点击播放暂停按钮，捕获并终止，自己处理点击和播放
    var playControlArr=$(".vjs-play-control");
     for(var i=0;i<playControlArr.length;i++){
         playControlArr[i].setAttribute("index",i);
         playControlArr[i].addEventListener("click",function (e) {
             var index=this.getAttribute("index");
             console.log("拦截播放暂停事件",index);
             if (!isLive){
                 if (isPlaying){
                     isPlaying=false;
                     pauseAll();
                 }else{
                     isPlaying=true;
                     playAll();
                 }
             }
             e.preventDefault();
             e.stopPropagation();
         // });//这种方式为禁止冒泡，video收不到click事件。
         },true);//禁止videojs自带click操作
     }
}
