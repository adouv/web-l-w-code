import { Component, OnInit, Input } from '@angular/core';

declare var $;
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @Input() public articleList: any = [];
    tooltip = {
        txt: "报名已经过期"
    }
    constructor() {
        
    }

    ngOnInit() {
        // console.log(this.articleList);
        // setTimeout(() => {
        //     const wparent = document.querySelector('#container');
        //     const wchildren: any = wparent.querySelectorAll('.box');
        //     const parentWidth = wparent.clientWidth;
        //     const num = Math.floor((parentWidth) / wchildren[0].offsetWidth);
        //     let hArr = [];
        //     for (let i = 0; i < wchildren.length; i++) {
        //         if (i < num) {
        //             hArr.push(wchildren[i].offsetHeight);
        //         } else {
        //             let minH = Math.min(...hArr);
        //             let index;
        //             for (const j in hArr) {
        //                 if (hArr[j] === minH) {
        //                     index = j;
        //                 }
        //             }
        //             wchildren[i].style.position = "absolute";
        //             wchildren[i].style.top = minH + "px";
        //             // wchildren[i].style.left = wchildren[0].offsetWidth * index + "px";
        //             wchildren[i].style.left = wchildren[index].offsetLeft + "px";
        //             hArr[index] += wchildren[i].offsetHeight;

        //         }
        //     }
        // })
    }
}
