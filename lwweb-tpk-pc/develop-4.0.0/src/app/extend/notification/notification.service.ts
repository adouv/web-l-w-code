import {
	ApplicationRef,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Injectable,
	ModuleWithComponentFactories,
	TemplateRef,
	Type,
	Component
} from '@angular/core';
import {NotificationComponent} from './notification';

export interface ConfigInterface {
	type?: string;
	title?: string;
	time?: number;
	/* tslint:disable-next-line:no-any */
	content?: string | Type<any>;
	componentParams?: object;
}

@Injectable()
export class NotificationService {
	_content: ComponentFactory<NotificationComponent>;

	constructor(private _appRef: ApplicationRef,
				private _cfr: ComponentFactoryResolver) {
		this._content = this._cfr.resolveComponentFactory(NotificationComponent);
	}

	private _initConfig(config) {
		const props = {};
		const optionalParams: string[] = [
			'componentParams', // 将componentParams放在第一位是因为必须在content赋值前进行赋值
			'type',
			'title',
			'content',
			'time'
		];
		optionalParams.forEach(key => {
			if (config[key] !== undefined) {
				props[key] = config[key];
			}
		});
		return props;
	}

	private open(props, factory: ComponentFactory<NotificationComponent>) {
		if (!document.querySelector('#tpk-notifications')) {
			const divView = document.createElement('div');
			divView.setAttribute('id', 'tpk-notifications');
			divView.style.cssText = 'position:fixed;right:0;z-index:999999;padding:16px;';
			document.body.insertBefore(divView, document.body.firstChild);
		}
		document.querySelector('#tpk-notifications').insertBefore(document.createElement(factory.selector), document.querySelector('#tpk-notifications').firstChild);
		let customComponentFactory: ComponentFactory<NotificationComponent>;
		let compRef: ComponentRef<NotificationComponent>;
		let instance: NotificationComponent;
		if (props['content'] instanceof Type) {
			customComponentFactory = this._cfr.resolveComponentFactory(props['content']);
			// 将编译出来的ngmodule中的用户component的factory作为modal内容存入
			props['content'] = customComponentFactory;
		}
		compRef = this._appRef.bootstrap(factory);
		instance = compRef.instance;
		Object.assign(instance, props, {
			visible: true
		});
		instance.close.subscribe(value => {
			setTimeout(() => {
				compRef.destroy();
			}, 200);
		})
		if (props.time == null) props.time = 4000;
		if (props.time !== 0) {
			setTimeout(() => {
				compRef.destroy();
			}, props.time);
		}
		return instance;
	}

	openNotification(config) {
		return this.open(this._initConfig(config), this._content);
	}

	success(title, content, options?: { time?: number, componentParams?: Object }) {
		options = options == null ? {} : options;
		return this.open(this._initConfig({
			title: title,
			content: content,
			time: 0,
			componentParams: options.componentParams ? options.componentParams : {},
			type: 'success'
		}), this._content);
	}

	error(title, content, options?: { time?: number, componentParams?: Object }) {
		options = options == null ? {} : options;
		return this.open(this._initConfig({
			title: title,
			content: content,
			time: options.time ? options.time : 3000,
			componentParams: options.componentParams ? options.componentParams : {},
			type: 'error'
		}), this._content);
	}

	close(element) {
		this.getTPKNOTIFICATIONS(element);
		// let tpkNotificationsEle = this.getTPKNOTIFICATIONS(element);
		// tpkNotificationsEle.parentElement.removeChild(tpkNotificationsEle);
	}

	private getTPKNOTIFICATIONS(element) {
		if (element.nodeName === 'TPK-NOTIFICATIONS') {
			element.parentElement.removeChild(element);
		} else {
			this.getTPKNOTIFICATIONS(element.parentElement);
		}
	}
}
