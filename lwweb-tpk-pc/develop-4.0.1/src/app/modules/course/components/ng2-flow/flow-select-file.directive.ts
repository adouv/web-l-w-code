import {Directive, Input, Optional, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {FlowEventKey, FlowEventParams, FlowParamKey, FlowUploader} from './flow-uploader.model';
import * as NgFlow from '@flowjs/flow.js/dist/flow';
import {isFunction} from 'rxjs/util/isFunction';
import {MessageService} from 'primeng/components/common/messageservice';

export class FlowDefaultUploader extends FlowUploader {

	target = '/lw-fileserver/fs/file/upload';

	fileParameterName = 'filedata';
}

@Directive({selector: '[flowSelectFile]'})
export class FlowSelectFile implements OnChanges {
	flowUploader: any;

	@Input() flowSelectFile: FlowUploader;

	@Input() flowValidFile: any;
	@Output() flowValidFileChange = new EventEmitter<any>();

	@Output() fileSuccess = new EventEmitter<any>();

	@Output() fileProgress = new EventEmitter<any>();

	@Output() fileAdded = new EventEmitter<any>();

	@Output() filesAdded = new EventEmitter<any>();

	@Output() filesSubmitted = new EventEmitter<any>();

	@Output() fileRetry = new EventEmitter<any>();

	@Output() fileRemoved = new EventEmitter<any>();

	@Output() fileError = new EventEmitter<any>();

	@Output() uploadStart = new EventEmitter<any>();

	@Output() complete = new EventEmitter<any>();

	@Output() progress = new EventEmitter<any>();

	@Output() error = new EventEmitter<any>();

	constructor(@Optional() public upload: FlowUploader,
				private elemRef: ElementRef,
				private messageService: MessageService) {
	}

	initialParams() {
		const uploader = Object.assign(
			this.upload || new FlowDefaultUploader(),
			this.flowSelectFile
		);
		this.flowUploader = new NgFlow(uploader);
		this.flowUploader.assignBrowse(
			this.elemRef.nativeElement,
			uploader.isDirectory,
			uploader.singleFile,
			uploader.attributes
		);
		this.updateFlowOptions();
		this.registerEvents();
		if (uploader.autoUpload || this.flowValidFile) {
			this.autoUploader();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.flowSelectFile.firstChange) {
			this.initialParams();
		}
	}

	autoUploader() {
		const eventName = FlowEventKey.FILES_ADDED;
		this.flowUploader.on(eventName, (...args) => {
			if (this.flowUploader.opts.autoUpload) {
				setTimeout(() => {
					this.flowUploader.upload();
				}, 0);
			}
			if (this.flowValidFile) {
				let validRs = true;
				for (const file of args[0]) {
					if (this.flowValidFile.ext.includes(file.getExtension())) {
						if (this.flowValidFile.size < file.size) {
							this.messageService.add({
								severity: 'warn',
								detail: this.flowValidFile.sizeError
							});
							return false;
						}
					} else {
						this.messageService.add({
							severity: 'warn',
							detail: this.flowValidFile.extError
						});
						return false;
					}
				}
				if (validRs !== true && validRs !== false) {
					validRs = true;
				}
				if (!validRs) {
					return false;
				}
			}
			if (this[eventName].observers.length > 0) {
				const emitValue = this.handleBackParams(eventName, args);
				this[eventName].emit(emitValue);
			}
		});
	}

	updateFlowOptions() {
		const eventName = FlowEventKey.FILES_SUBMITTED;
		this.flowUploader.on(eventName, (...args) => {
			if (this[eventName].observers.length > 0) {
				const emitValue = this.handleBackParams(eventName, args);
				this[eventName].emit(emitValue);
			}
			Object.assign(this.flowUploader.opts, this.flowSelectFile);
		});
	}

	registerEvents() {
		for (const event in FlowEventKey) {
			const eventName = FlowEventKey[event];
			if (this[eventName].observers.length > 0 &&
				eventName !== FlowEventKey.FILES_ADDED &&
				eventName !== FlowEventKey.FILES_SUBMITTED) {
				this.flowUploader.on(eventName, (...args) => {
					const emitValue = this.handleBackParams(eventName, args);
					this[eventName].emit(emitValue);
				});
			}
		}
	}

	handleBackParams(eventName, args) {
		const eventParams = FlowEventParams.get(eventName);
		const emitValue = {};
		eventParams.forEach((name, index) => {
			emitValue[name] = FlowParamKey.DATA !== name ? args[index] : JSON.parse(args[index]);
		});
		if (eventName === FlowEventKey.PROGRESS) {
			emitValue[FlowParamKey.FILES] = this.flowUploader.files;
		}
		emitValue['upload'] = this.flowUploader;
		return emitValue;
	}
}


