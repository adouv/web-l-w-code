process.env.NODE_ENV = 'production'

const path = require('path');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const electron = require('electron');
const browserWindow = electron.BrowserWindow;
const app = electron.app;
const ipcMain = electron.ipcMain;
const globalShortcut = electron.globalShortcut

let bufferPool = [];
let windowWidth = 80;
let windowHeight = 400;

function _createWindow() {
    let options = {};

    options.width = windowWidth;
    options.height = windowHeight;
    options.frame = false;
    options.resizable = false;
    options.minimizable = false;
    options.maximizable = false;
    options.transparent = true;
    options.alwaysOnTop = true;
    options.useContentSize = true;
    options.webPreferences = {
        webSecurity: false
    };

    let win = new browserWindow(options);

    if (process.env.BUILD_TARGET === 'prod' || process.env.BUILD_TARGET === 'production') {
        win.loadURL(`file://${path.resolve(__dirname, '..')}/dist/modules/menus/index.html`);
    }

    if (process.env.BUILD_TARGET === 'dev') {
        win.loadURL(`http://localhost:9530/modules/menus/index.html`);
    }

    // win.webContents.openDevTools({
    //   mode: 'undocked'
    // });

    win.on('closed', () => {
        win = null;
    });

    //通讯中转站
    ipcMain.on('lw-global', (err, args) => {
        win.webContents.send(args.key, args.val);
    });

    //点击下了退出程序
    ipcMain.on('close', (err, args) => {
        console.log('close', args);
        win.close();
    });
}

function udpService(prod, win) {

    server.bind(prod);

    server.on('close', () => {
        console.log(`the udp server is down`);
    });

    server.on('error', err => {
        console.log(err);
    });

    server.on('listening', () => {
        console.log('udp server has started...');
    });

    server.on('message', (msg, rinfo) => {
        //console.log(`server got:${JSON.stringify(msg.toJSON().data)} from ${rinfo.address}:${rinfo.port}`);
        console.log(`server got:${JSON.stringify(msg.toJSON().data)}`);

        if (msg.toJSON().data.length > 20) {
            server.send(msg, rinfo.port, rinfo.address);
        }

        bufferPool.push(msg.toJSON().data);

    });

    //定时器
    setInterval(() => {
        const data = bufferPool.shift();
        if (data && data.length > 0) {
            win.webContents.send('udp-pen-buffer', data);
        }
    }, 5);
}


app.on('ready', _createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (browserWindow == null) {
        _createWindow();
    }
});

/** 
 * Electron 3 audio not allowed before user interaction with the page (Chrome 66 autoplay policy) #13525
 * 问题
 * 使用 Electron打包的应用不能自动播放音频文件。
 * 问题的起源
 * Chrome 66 之后更新了，自动播放的策略以提供更友好的交互体验。
 * 解决方法
 */
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');