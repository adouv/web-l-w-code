import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  height = document.body.scrollHeight;
  constructor() { }

  ngOnInit() {
		fromEvent(window,'resize').subscribe((event) => {
			this.height = document.body.clientHeight;
		});
  }

}
