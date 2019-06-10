import { loadAddressFail } from './../../components/select-person/actions/select-person.actions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
					// if(response.statusCode == 200){
					// 	response.pipe(writer);
					// }
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
					const os = window.require('os');
					const { exec, spawn } = window.require('child_process');
					return Observable.create(observer => {
						if (os.type().toLowerCase() == 'windows_nt') {
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
						} else if (os.type().toLowerCase() == 'darwin') {
							let res = spawn('open', [path]);
							res.stdout.on('data', function (data) {
								console.log('标准输出：\n' + data);
							});
							res.stderr.on('data', function (data) {
								observer.error({
									type: 1,
									err: '该文件不支持预览！'
								});
							});
							res.on('exit', function (code, signal) {
								observer.next('');
							});
						}

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
	isFileExistList(fileDirectory, fileNames) {
		const fs = window.require('fs');
		if (fs.existsSync(fileDirectory)) {
			fs.readdir(fileDirectory, function (err, files) {
				if (err) {
					console.log(err);
					return;
				}
				var count = files.length;
				var results = {};
				files.forEach(function (filename) {
					fs.readFile(filename, function (data) {
						console.log('data:', data.path);
						fs.exists(fileDirectory + fileNames, (result) => {
							console.log("result:", result);
						})
						results[filename] = data;
						count--;
						if (count <= 0) {
							//对文件进行处理
						}
					});
				});
				console.log(results);
			})
		} else {
			console.log(fileDirectory + ' Not Found!');
		}

	}
	changeFileName(fileName) {
		if (this.hasEnvNode()) {
			let fs = window.require("fs")
			let pa = fs.readdirSync(this.getAppPath().download);
			let _fileName = '';
			let exists = fs.existsSync(this.getAppPath().download + fileName);
			let arr = [];
			var name = fileName.split('.');
			if (exists) {
				pa.forEach(function (ele, index) {
					let splitFile = ele.split("（");
					if (splitFile.length >= 2) {
						if (splitFile[0] == name[0]) {
							arr.push(splitFile);
						}
					}

				});
				if (arr.length == 0) {
					_fileName = name[0] + "（1）.doc";
				} else {
					let args = arr[arr.length - 1];
					_fileName = args[0] + "（" + (parseInt(args[1].split("）")[0]) + 1) + "）.doc";
				}

			} else {
				_fileName = fileName;
			}

			return _fileName;
		}

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
			const { exec, spawn } = window.require('child_process');
			const os = window.require('os');
			let folderPath: string = path.substring(0, path.lastIndexOf((os.type().toLowerCase() == 'windows_nt') ? '\\' : '/'));
			folderPath = this.resolvePath(folderPath);
			return Observable.create(observer => {
				if (os.type().toLowerCase() == 'windows_nt') {
					exec('explorer ' + folderPath, (err, stdout, stderr) => {
						if (err) {
							observer.error(err);
							return;
						}
						observer.next(stdout);
					});
				} else if (os.type().toLowerCase() == 'darwin') {
					let ps = folderPath.replace(/\\/g, '/') + '/';
					let res = spawn('open', [ps]);
					res.stdout.on('data', function (data) {
						console.log('标准输出：\n' + data);
					});
					res.stderr.on('data', function (data) {
						observer.error({
							type: 1,
							err: '该文件不支持预览！'
						});
					});
					res.on('exit', function (code, signal) {
						observer.next('');
					});
				}
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
			try {
				const os = window.require('os');
				let splitter: string = '';
				if (os.type().toLowerCase() == 'windows_nt') {
					splitter = '\\';
				} else if (os.type().toLowerCase() == 'darwin') {
					splitter = '/';
				}
				const root = os.homedir() + splitter + 'Downloads';
				const path = {
					root: root,
					app: root + splitter + 'zhihui' + splitter,
					datas: root + splitter + 'zhihui' + splitter + 'datas' + splitter,
					download: root + splitter + 'zhihui' + splitter + 'datas' + splitter + 'download' + splitter,
					temp: root + splitter + 'zhihui' + splitter + 'datas' + splitter + 'temp' + splitter
				};

				for (const pa in path) {
					this.mkdirSync(path[pa]);
				}

				return path;
			} catch {
				throw new Error("当前电脑权限设置不支持下载文件！");
			}

		} else {
			throw new Error("请在客户端上下载！");
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
