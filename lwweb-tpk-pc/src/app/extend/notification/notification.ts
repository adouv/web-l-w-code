import {
	Component, ViewContainerRef, ComponentFactoryResolver, Input, Output, EventEmitter,
	ComponentFactory,
	ComponentRef,
	ViewChild,
	ElementRef,
	TemplateRef
} from '@angular/core';

@Component({
	selector: 'tpk-notifications',
	templateUrl: './notification.html',
	styleUrls: ['./notification.scss']
})

export class NotificationComponent {
	_title: any;
	_type: any;
	_visible: boolean;
	_bodyComponent: ComponentFactory<void>;
	_componentParams: object = {};
	_contentTpl: TemplateRef<void>;
	_content = '';
	@ViewChild('modal_content') contentEl: ElementRef;
	@ViewChild('modal_component', { read: ViewContainerRef }) bodyEl: ViewContainerRef;
	@Input() set title(value: any) {
		this._title = value;
	}
	@Input() set visible(value: boolean) {
		this._visible = value;
	}
	@Input() set type(value: boolean) {
		this._type = value;
	}
	@Output() close: EventEmitter<string> = new EventEmitter();
	@Input()
	set componentParams(value: object) {
		this._componentParams = value;
	}
	@Input()
	set content(value: string | TemplateRef<void> | ComponentFactory<void>) {
		if (value instanceof ComponentFactory) {
			// 如果容器对象已存在，则直接渲染，如果不存在，则设置到_bodyComponent，在ngAfterViewInit中执行
			if (this.bodyEl) {
				const compRef: ComponentRef<void> = this.bodyEl.createComponent(value, null, this._vcr.injector);
				Object.assign(compRef.instance, this._componentParams);
			} else {
				this._bodyComponent = value;
			}
		} else if (value instanceof TemplateRef) {
			this._contentTpl = value;
		} else {
			this._content = value;
		}
	}

	constructor(private view: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver, private _vcr: ViewContainerRef) {
	}

	closeNotification() {
		this.close.emit('');
	}
}
