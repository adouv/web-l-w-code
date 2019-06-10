/**
 * @Author hejialin
 * @Description 针对调用nw或者electron的API封装的服务
 */

export default class clientService {
    constructor($timeout, $cookies) {
        this.$timeout = $timeout;
        this.$cookies = $cookies;
        this.initClient();
    }

    /**
     * 初始化客户端获取 win对象
     * @param $window
     */
    initClient() {
        this.win = {};
        this.nwwin = {};
        if (window.nw && !window.win) {
            const gui = window['require']('nw.gui');
            this.nwWindow = gui.Window;
            window.shell = gui.Shell;
            window.win = this.win = gui.Window.get() || {};
            window.nwwin = this.nwwin = gui.Window;
        }
        window.winList = [];
        window.openWindow = this.open;
    }

    /**
     * 判断是否是客户端
     * @return {boolean}
     */
    isClient() {
        return !!window.nw;
    }

    /**
     * 打开nw新窗口
     * @param url
     */
    open(url, options, callback) {
        if (window.nw) {

            let minWidth = 1366;
            let minHeight = 773;
            let transparent = true;

            if (this.win.isTransparent === false) {
                minWidth = 1366;
                minHeight = 773;
                transparent = false;
            }

            let args = {
                transparent: transparent,
                show: false,
                frame: false,
                resizable: true,
                'min_width': minWidth,
                'min_height': minHeight,
                "show_in_taskbar": true,
                position: 'center',
                focus: true
            };

            args = angular.extend(args, options || {});

            window['require']('nw.gui').Window.open(url, args, win => {
                console.log(win);
                // window.localStorage.removeItem(`win_${win.frameId}`);
                // window.localStorage.setItem(`win_${win.frameId}`, win.frameId);

                // window.winList.push(win);
                callback && callback(win);
            });

        } else {
            window.open(url);
        }
    }

    /**
     * 设置窗口大小
     * @param width
     * @param height
     */
    setWindowSize(width, height) {
        if (window.nw) {
            if (this.win.isTransparent) {
                this.setMinimumSize(width + 20, height + 25);
            } else {
                this.setMinimumSize(width + 4, height + 4);
            }
            this.win.width = width;
            this.win.height = height;
        }
    }

    /**
     * 设置窗口位置
     * @param position 有三个有效位置：null或center或mouse
     */
    setPosition(position) {
        if (window.nw) {
            this.$timeout(() => {
                this.win.setPosition(position);
            }, 0)
        }
    }

    /**
     * 切换全屏事件
     * @param entryCallback
     * @param leaveCallback
     */
    toggleMaximize(entryCallback, leaveCallback) {
        if (window.nw) {
            if (entryCallback && typeof entryCallback === 'function') {
                this.win.on('maximize', () => {
                    entryCallback();
                });
            }
            if (leaveCallback && typeof leaveCallback === 'function') {
                this.win.on('restore', function() {
                    leaveCallback();
                });
            }
        }
    }

    /**
     * 关闭窗口
     * @param handerCallBack 关闭窗口后回调
     */
    close(handerCallBack) {
        if (window.nw) {
            if (handerCallBack && angular.isFunction(handerCallBack)) {
                this.win.on('close', function() {

                    handerCallBack();
                });
            }
            this.win.close();
        }
    }

    closeListener() {
        if (window.win) {
            this.win.on('close', function() {
                this.hide(); // Pretend to be closed already
                this.close(true); // then close it forcely
                localStorage.clear();
            });
        }
    }

    resize(callback) {
        if (window.nw) {
            this.win.on('resize', callback)
        }
    }

    setResizable(flag) {
        if (window.nw) {
            this.win.setResizable(flag || true);
        }
    }

    /**
     * 最大化
     */
    maximize() {
        if (window.nw) {
            this.win.maximize();
        }
    }

    /**
     * 反最大化
     */
    restore() {
        if (window.nw) {
            this.win.restore();
        }
    }

    /**
     * 设置窗口最小值
     * @param width
     * @param height
     */
    setMinimumSize(width, height) {
        if (window.nw) {
            this.win.setMinimumSize(width, height);
        }
    }

    /**
     * 最小化
     */
    minimize() {
        if (window.nw) {
            this.win.minimize();
        }
    }

    /**
     * 相对位移
     */
    moveBy(x, y) {
        if (window.nw) {
            this.win.moveBy(x, y);
        }
    }

    /**
     * 展示窗口
     */
    show() {
        if (window.nw) {
            this.win.show();
        }
    }

    hide() {
        if (window.nw) {
            this.win.hide();
        }
    }
}
clientService.$inject = ['$timeout', '$cookies'];