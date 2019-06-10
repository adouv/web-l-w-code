import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({selector: 'button'})
export class BlurDirective {


	constructor(private erf: ElementRef) {

	}

	@HostListener('click') onMouseClick() {
		this.erf.nativeElement.blur();
	}
}
