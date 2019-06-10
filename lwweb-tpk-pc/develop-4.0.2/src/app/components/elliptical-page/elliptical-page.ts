/**
 * 缺省页组件
 */
import { Component, Input } from '@angular/core';

@Component({
	selector: 'elliptical-page',
	template: `
		<div class="elliptical-page" flex="main:center cross:center">
			<div>
				<img *ngIf="_imgName" src="../../../assets/images/{{_imgName}}"/>
				<div>{{_title}}</div>
			</div>
		</div>`,
	styleUrls: ['./elliptical-page.scss']

})

export class EllipticalPage {
	_imgName: string;
	@Input() set imgName(value: string) {
		this._imgName = value;
	}

	_title: string;
	@Input() set title(value: string) {
		this._title = value;
	}

}
