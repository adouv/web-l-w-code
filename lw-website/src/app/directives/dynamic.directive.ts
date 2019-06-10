import {Directive, Input, OnChanges, SimpleChanges, HostBinding} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Directive({selector: '[dynamicHtml]'})
export class DynamicHtmlDirective implements OnChanges {

	@Input() dynamicHtml: any;

	constructor(private domSanitizer: DomSanitizer) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const dynamicHtml = changes.dynamicHtml;
		if (dynamicHtml.currentValue && dynamicHtml.currentValue != dynamicHtml.previousValue) {
			this.dynamicHtml = this.domSanitizer.bypassSecurityTrustHtml(dynamicHtml.currentValue);
		}
	}

	@HostBinding() get innerHTML() {
		return this.dynamicHtml;
	}
}
