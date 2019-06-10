import { Component, OnInit } from '@angular/core';

declare var $;
declare var Caroursel;

@Component({
	selector: 'app-school-exhibiton',
	templateUrl: './school-exhibiton.component.html',
	styleUrls: ['./school-exhibiton.component.scss']
})
export class SchoolExhibitonComponent implements OnInit {

	isVisible = false;
	title: string = "活动视频";
	constructor() { }
	ngOnInit() {
		$(function () {
			Caroursel.init($('.caroursel'));
			Caroursel.init($('.caroursel1'));
			

			$('.btn div').click(function () {
				const index = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				if (index == 0) {
					console.log($('.container-box').children())
					// $('.container-box').children([0]).animate({ 'z-index': '1', 'opacity': '1' });
					// $('.container-box').children(1).animate({ 'z-index': '0', 'opacity': '0' });
					$('.first').animate({ 'z-index': '1', 'opacity': '1' });
					$('.second').animate({ 'z-index': '0', 'opacity': '0' });
				} else {
					// $('.container-box').children(0).animate({ 'z-index': '0', 'opacity': '0' });
					// $('.container-box').children(1).animate({ 'z-index': '1', 'opacity': '1' });
					$('.first').animate({ 'z-index': '0', 'opacity': '0' });
					$('.second').animate({ 'z-index': '1', 'opacity': '1' });
				}
				// $('.wrap').eq(index).addClass('active').siblings().removeClass('active');
			});
		});
	}

	showModal(index: number): void {
		this.isVisible = true;
		if (index == 0) {
			this.title = "活动视频";
		} else {
			this.title = "精彩课堂";
		}
	}

	handleOk(): void {
		// console.log('Button ok clicked!');
		this.isVisible = false;
	}

	handleCancel(): void {
		// console.log('Button cancel clicked!');
		this.isVisible = false;
	}
}
