import { Component, OnInit,  } from '@angular/core';
import { fadeInAnimation } from '../../directives/animate';

@Component({
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    animations: [fadeInAnimation]
})
export class HomePage implements OnInit {

    constructor() { }

    ngOnInit() {}

}
