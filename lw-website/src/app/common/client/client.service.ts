import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    require: any;
  }
}

@Injectable()
export class LwClientService {

  currentWindow: any = this.getCurrentWindow();

  constructor() {
  }

  hasEnvNode(): boolean {
    return !!window.require;
  }

  getCurrentWindow() {
    let electron = null;
    try {
      electron = window.require('electron');
      if (this.hasEnvNode() && electron) {
        return window.require('electron').remote.getCurrentWindow();
      }
    } catch (e) {
    }
    return null;
  }

  hideCurrentWindow() {
    if (this.hasEnvNode() && this.currentWindow) {
      this.currentWindow.hide();
    }
  }

  showCurrentWindow() {
    if (this.hasEnvNode() && this.currentWindow) {
      this.currentWindow.show();
    }
  }

  setCurrentWindowOpacity(deg: number) {
    if (this.hasEnvNode() && this.currentWindow) {
      if (deg >= 0 && deg <= 1) {
        this.currentWindow.setOpacity(deg);
      }
    }
  }

  /**
   * 最大化反最大化切换
   */
  toggleMaximize() {
    if (this.hasEnvNode() && this.currentWindow) {
      this.currentWindow.webContents.send('tagger-toggle');
    }
  }

  /**
   * 文件下载
   * @param {string | Array<string>} links
   */
  download(downloadUrl: string, localPath: string) {
    if (this.hasEnvNode()) {
      const fs = window.require('fs');
      const http = window.require('http');
      const https = window.require('https');
      return Observable.create(observer => {
        const httpClient = downloadUrl.slice(0, 5) === 'https' ? https : http;
        const writer = fs.createWriteStream(localPath);
        writer.on('finish', function (data) {
          observer.next(localPath);
        });
        writer.on('error', function (data) {
          observer.error(data);
        });
        httpClient.get(downloadUrl, function (response) {
          response.pipe(writer);
        });
      });
    }
  }

  /**
   * 打开本地文件
   * @param {string} path
   */
  openFile(path: string) {
    if (this.hasEnvNode()) {
      return this.isFileExist(path).switchMap((result) => {
        if (result) {
          const {exec} = window.require('child_process');
          return Observable.create(observer => {
            exec('"' + path + '"', (err, stdout, stderr) => {
              if (err) {
                observer.error({
                  type: 1,
                  err: '该文件不支持预览！'
                });
                return;
              }
              observer.next(stdout);
            });
          });
        } else {
          return Observable.create(observer => {
            observer.error({
              type: 0,
              err: '文件已被移走！'
            });
          });
        }

      });

    }
  }

  isFileExist(path) {
    const fs = window.require('fs');
    return Observable.create(observer => {
      fs.exists(path, (result) => {
        observer.next(result);
      });
    });
  }

  controlButtons(options: { close?: boolean; minimize?: boolean; toggle?: boolean }) {
    if (this.hasEnvNode() && this.currentWindow) {
      const win = this.currentWindow;
      win.webContents.send('control-buttons', options);
    }
  }

  setCurrentWindowSize(width: number = 1020, height: number = 625) {
    if (this.hasEnvNode() && this.currentWindow) {
      this.currentWindow.setSize(width, height);
      this.currentWindow.center();
    }
  }

  on(event: string, fn: () => void) {
    if (this.hasEnvNode() && this.currentWindow) {
      this.currentWindow.on(event, fn);
    }
  }

  openFolder(path: string) {
    if (this.hasEnvNode()) {
      const {exec} = window.require('child_process');
      path = this.resolvePath(path);
      return Observable.create(observer => {
        exec('explorer ' + path, (err, stdout, stderr) => {
          if (err) {
            observer.error(err);
            return;
          }
          observer.next(stdout);
        });
      });
    }
  }

  private resolvePath(path: string) {
    return path.replace(/\//g, '\\');
  }

  /**
   * 文件预览
   * @param {string} path
   * @param {string} filename
   */
  previewFile(path: string, filename?: string) {
    if (this.hasEnvNode()) {
      const pathSplit = path.split('/');
      const tempDir = this.getAppPath().temp;
      const tempPath = tempDir + (filename || pathSplit[pathSplit.length - 1]);
      if (path.includes('http')) {
        return this.download(path, tempPath).switchMap(() => this.openFile(tempPath));
      } else {
        return this.openFile(path);
      }
    }
  }

  getAppPath() {
    if (this.hasEnvNode()) {
      const root = window['process'].cwd();
      const path = {
        root: root,
        datas: root + '/datas/',
        download: root + '/datas/download/',
        temp: root + '/datas/temp/'
      };
      for (const pa in path) {
        this.mkdirSync(path[pa]);
      }
      return path;
    }
  }

  mkdirSync(folder: string) {
    if (this.hasEnvNode()) {
      const fs = window.require('fs');
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
    }
  }
}
