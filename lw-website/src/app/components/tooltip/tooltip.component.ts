import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  isShowNow: number = 0;
  constructor(private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      
      if(params.type === "list") {
        this.isShowNow = 1;
      }else if(params.type === "html5") {
        this.isShowNow = 2;
      }else {
        this.isShowNow = 0; 
      }
    });
  }

}
