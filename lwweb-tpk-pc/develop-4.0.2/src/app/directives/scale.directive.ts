import {AfterViewInit, Attribute, Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

enum ScaleOrigin {
	WIDTH = 'width',
	HEIGHT = 'height'
}

@Directive({selector: '[scaleWidth][scaleHeight][scaleOrigin]'})
export class ScaleDirective implements AfterViewInit {

	private hostElem: HTMLElement;

	private proportions: number;

	constructor(@Attribute('scaleWidth') private scaleWidth: number,
				@Attribute('scaleHeight') private scaleHeight: number,
				@Attribute('scaleOrigin') private scaleOrigin: ScaleOrigin,
				erf: ElementRef,
				private renderer: Renderer2) {
		this.hostElem = erf.nativeElement;
		this.proportions = scaleWidth / scaleHeight;
		this.renderer.setStyle(this.hostElem, 'transition', 'all .1s linear');
	}

	ngAfterViewInit(): void {
		let timeIndex = 0;
		const timer = setInterval(() => {
			timeIndex++;
			this.onWindowResize();
			if (timeIndex > 10) {
				clearTimeout(timer);
			}
		}, 50);
	}

	@HostListener('window:resize')
	onWindowResize() {
		const width = this.hostElem.offsetWidth;
		const height = this.hostElem.offsetHeight;
		this.scale(width, height);
	}

	scale(width: number, height: number) {
		if (this.scaleOrigin) {
			const scaleStyle = this.getScaleStyle(width, height);
			this.renderer.setStyle(this.hostElem, scaleStyle.styleName, scaleStyle.scale + 'px');
		} else {
			if (width / height > this.proportions) {
				this.renderer.setStyle(this.hostElem, 'width', height * this.scaleWidth / this.scaleHeight + 'px');
			} else if (width / height < this.proportions) {
				this.renderer.setStyle(this.hostElem, 'height', width * this.scaleHeight / this.scaleWidth + 'px');
			}
		}
	}

	getScaleStyle(width: number, height: number): { styleName: ScaleOrigin; scale: number } {
		const styleNames = [ScaleOrigin.WIDTH, ScaleOrigin.HEIGHT];
		const index = styleNames.indexOf(this.scaleOrigin);
		const styleName = <ScaleOrigin>styleNames.join('').replace(this.scaleOrigin, '');
		if (index === 0) {
			return {
				styleName: styleName,
				scale: width * this.scaleHeight / this.scaleWidth
			};
		} else if (index === 1) {
			return {
				styleName: styleName,
				scale: height * this.scaleWidth / this.scaleHeight
			};
		}
	}
}
