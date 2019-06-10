import Vue from 'vue'
const path = window.require('path')
const electron = window.require('electron')
const browserWindow = electron.remote.BrowserWindow
const ipcRenderer = electron.ipcRenderer
const remote = electron.remote
const globalShortcut = electron.remote.globalShortcut
    /** 
     * 窗体服务
     */
export default {
    /**
     * 打开一个窗体
     * @param {*} url 窗口地址
     * @param {*} options 选项参数
     */
    openWindow(url, options = {}) {
        options.transparent = true;
        options.frame = false;
        options.show = false;
        options.resizable = false;
        options.minimizable = false;
        options.useContentSize = true;
        options.webPreferences = {
            webSecurity: false
        };

        let window = new browserWindow(options);

        if (options.maximizable) {
            window.maximize();
        }

        window.on('close', () => {
            //关闭窗体时移除对应的key
            Vue.local.removeItem(`win_id_${url}`);
            //关闭窗体回调函数
            if (options.closeCallback) {
                options.closeCallback(remote, ipcRenderer);
            }
            window = null;
        });

        let loadUrl = "";

        if (process.env.NODE_ENV === 'production') {
            loadUrl = `file://${path.resolve()}/resources/app/modules/${url}/index.html`;
        }

        if (process.env.NODE_ENV === 'dist') {
            loadUrl = `file://${path.resolve()}/dist/modules/${url}/index.html`;
        }

        if (process.env.NODE_ENV === 'development') {
            loadUrl = `http://localhost:9530/modules/${url}`;
        }

        if (options.urlParams) {
            loadUrl += `?${Vue.utils.parseJsonToUrl(options.urlParams)}`;
        }

        window.loadURL(loadUrl);

        // if (process.env.NODE_ENV === 'production') {
        //   //快捷键注册
        // globalShortcut.register('CommandOrControl+F12', () => {
        //   console.log('...F12.sub');
        //   window.webContents.openDevTools({
        //     mode: 'undocked'
        //   });
        // });

        //   console.log('快捷键注册成功：', globalShortcut.isRegistered('CommandOrControl+F12'))
        // } else {
        // window.webContents.openDevTools({
        //     mode: 'undocked'
        // });
        // }

        //记录每个打开窗体的标识
        let winItem = {
            id: window.id,
            name: url
        };

        Vue.local.removeItem(`win_id_${winItem.name}`);
        Vue.local.setItem(`win_id_${winItem.name}`, winItem.id);

        window.show();
    },
    /**
     * 
     * @param {*} url 
     * @param {*} args 
     */
    to(url, args) {
        args.url = url;
        ipcRenderer.send('open', args);
    },
    /**
     * 当前是否node环境
     * @return boolean 
     */
    hasEnvNode() {
        return !!window.require;
    },
    /**
     * 获取当前窗体实例
     * @return BrowserWindow 
     */
    getCurrentWindow() {
        if (this.hasEnvNode()) {
            return remote.getCurrentWindow();
        } else {
            return null;
        }
    },
    /**
     * 获取当前窗体的：x轴、y轴
     * @return number[] 
     */
    getCurrentWindowPosition() {
        return this.getCurrentWindow().getPosition();
    },
    /**
     * 设置当前窗体的宽度和高度
     * @param width 窗体宽度
     * @param height 窗体高度
     */
    setCurrentWindowSize(width, height) {
        this.getCurrentWindow().setSize(width, height);
    },
    /**
     * 设置当前窗体所在位置
     * @param x x轴
     * @param y y轴
     */
    setCurrentWindowPosition(x, y) {
        this.getCurrentWindow().setPosition(x, y);
    },
    /**
     * 设置当前窗体透明度
     * @param deg 透明度数值
     */
    setCurrentWindowOpacity(deg) {
        if (deg >= 0 && deg <= 1) {
            this.getCurrentWindow().setOpacity(deg);
        }
    },
    /**
     * 隐藏当前窗体
     */
    hideCurrentWindow() {
        this.getCurrentWindow().hide();
    },
    /**
     * 显示当前窗体
     */
    showCurrentWindow() {
        this.getCurrentWindow().show();
    },
    /*
     * 关闭当前窗体
     */
    closeCurrentWindow() {
        this.getCurrentWindow().close();
    },
    penSend(key, args) {
        ipcRenderer.send(key, args);
    },
    ipcRenderer() {
        return ipcRenderer;
    },
    /**
     * 发送消息
     * @param {*} key 键
     * @param {*} val 值
     */
    send(key, val) {
        ipcRenderer.send('lw-global', {
            key: key,
            val: val
        });
    },
    /**
     * 接收消息
     * @param {*} key 键
     */
    receive(key, callback) {
        return ipcRenderer.on(key, callback);
    },
    /**
     * 获取当前window实例
     */
    getRemote() {
        return remote;
    }
}