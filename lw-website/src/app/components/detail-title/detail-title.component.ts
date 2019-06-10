import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-title',
  templateUrl: './detail-title.component.html',
  styleUrls: ['./detail-title.component.scss']
})
export class DetailTitleComponent implements OnInit {
  @Input() public content;
  title: string;
  author: string;
  time: string;
  summary: string;
  startTime: string;
  endTime: string;
  registerBeginTime: string;
  registerEndTime: string;
  articleType: string;

  isShow: boolean = false;
  constructor(private activated: ActivatedRoute) { }

  ngOnInit() {
    this.activated.params.subscribe(params => {
      if (params.type === "html5") {
        this.isShow = true;
      }
    })
    this.articleType = this.content.type;
    if (this.content.type == "richText") {
      this.time = this.content.time;
    }
    if (this.content.type == "register") {
      this.startTime = this.content.registerBeginTime;
      this.endTime = this.content.registerEndTime;
      // console.log(this.startTime);
      // console.log(this.endTime);
    }
    this.title = this.content.title;
    this.author = this.content.author;
    this.summary = this.content.summary;
  }
}
