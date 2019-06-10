import {Component, OnInit, Input} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
	selector: 'bg-image',
	templateUrl: 'bg-image.component.html',
	styleUrls: ['bg-image.component.scss']
})
export class BgImageComponent implements OnInit {

	isHome = true;
	@Input() height;
	constructor(private router: Router) {
		router.events.pipe(filter(event => {
			return event instanceof NavigationEnd;
		})).subscribe((data: NavigationEnd) => {
			this.isHome = data.url.includes('home');
		});
	}

	ngOnInit() {
	}
}