import {AfterViewInit, Attribute, Directive, ElementRef, HostListener} from '@angular/core';

declare global {
	interface Window {
		parseFloat: any;
	}
}

export interface ScrollPadding {
	left?: string;
	right?: string;
	top?: string;
	bottom?: string;
}

@Directive({selector: '[scrollWidth]'})
export class ScrollWidthDirective implements AfterViewInit {

	defaultPadding: ScrollPadding = {};

	constructor(private erf: ElementRef,
				@Attribute('scrollWidth') private scrollWidth?: number) {
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.defaultPadding = this.controlStyle({}, this.scrollWidth);
		}, 200);
	}

	@HostListener('window:resize')
	onWindowResize() {
		this.controlStyle(this.defaultPadding, this.scrollWidth);
	}

	/**
	 * 处理滚动条的宽度 默认是10px
	 * @param defaultPadding
	 * @returns {any}
	 */
	controlStyle(defaultPadding: ScrollPadding = {}, defaultWidth = 10) {
		const scroll = this.isScroll(this.erf.nativeElement);
		if (scroll.scrollY) {
			const paddingRight = this.getPaddingRight(defaultPadding);
			this.erf.nativeElement.style.paddingRight = paddingRight - defaultWidth + 'px';
			return {right: paddingRight};
		} else if (!scroll.scrollY && defaultPadding.right) {
			this.erf.nativeElement.style.paddingRight = defaultPadding.right + 'px';
		} else if (scroll.scrollX) {
			const paddingBottom = this.getPaddingLeft(defaultPadding);
			this.erf.nativeElement.style.paddingBottom = paddingBottom - defaultWidth + 'px';
			return {bottom: paddingBottom};
		} else if (!scroll.scrollX && defaultPadding.bottom) {
			this.erf.nativeElement.style.paddingBottom = defaultPadding.bottom + 'px';
		}
	}

	/**
	 * 获取padding-right值
	 * @param defaultPadding
	 * @returns {number}
	 */
	private getPaddingRight(defaultPadding) {
		let padding = defaultPadding.right !== undefined ? defaultPadding.right :
			getComputedStyle(this.erf.nativeElement).paddingRight;
			padding=padding+"";
		padding = padding.substring(0, padding.length - 2);
		return padding && padding !== '0' ? window.parseFloat(padding, 10) : padding;
	}

	/**
	 * 获取padding-left值
	 * @param defaultPadding
	 * @returns {number}
	 */
	private getPaddingLeft(defaultPadding) {
		let padding = defaultPadding.bottom !== undefined ? defaultPadding.bottom :
			getComputedStyle(this.erf.nativeElement).paddingBottom;
		padding = padding.substring(0, padding.length - 2);
		return padding && padding !== '0' ? window.parseFloat(padding, 10) : padding;
	}

	/**
	 * 判断x y 轴是否有滚动条
	 * @param el
	 * @returns {{scrollX: boolean; scrollY: boolean}}
	 */
	isScroll(el): { scrollX: boolean, scrollY: boolean } {
		const elems = el ? [el] : [document.documentElement, document.body];
		let scrollX = false, scrollY = false;
		for (let i = 0; i < elems.length; i++) {
			const o = elems[i];
			const sl = o.scrollLeft;
			o.scrollLeft += (sl > 0) ? -1 : 1;
			if (o.scrollLeft !== sl) {
				scrollX = scrollX || true;
			}
			o.scrollLeft = sl;
			const st = o.scrollTop;
			o.scrollTop += (st > 0) ? -1 : 1;
			if (o.scrollTop !== st) {
				scrollY = scrollY || true;
			}
			o.scrollTop = st;
		}
		return {
			scrollX: scrollX,
			scrollY: scrollY
		};
	}
}
