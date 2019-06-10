import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';


@Pipe({
	name: 'backgroundImgCss',
})
export class BackgroundImgCss implements PipeTransform {

	constructor(
		private domSanitizer: DomSanitizer,
	) {
	}

	transform(subjectCode: string, ...args) {
		const subjectArr = ['art', 'biology', 'calligraphy', 'chemistry', 'chinese', 'english',
			'geography', 'history', 'math', 'message', 'music', 'physics', 'plant',
			'political', 'sport', 'weiqi'
		];
		let imgPath = '';
		if (subjectCode !== null && subjectCode !== '' && subjectArr.indexOf(subjectCode) !== -1) {
			imgPath = '/assets/images/subjects/' + subjectCode + '.png';
		} else {
			imgPath = '/assets/images/subjects/other.png';
		}
		return this.domSanitizer.bypassSecurityTrustStyle('url(\'' + imgPath + '\') no-repeat center center');
	}
}
