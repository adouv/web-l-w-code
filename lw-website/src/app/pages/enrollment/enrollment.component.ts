import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebSiteService } from '../../service/website.service';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {
  id: any;
  articleDetail: any;
  articleType: any;
  title: any = '';
  author: any = '';
  contentHtml: any = '';
  contentText: any = '';
  guideContentHtml: any = '';
  path: any;
  rigesterStartTime: any;
  rigesterEndTime: any;
  rigesterStartTimeHour: any;
  rigesterEndTimeHour: any;
  registerUrl: any;
  registerTitle: any = {};
  overTime = false;
  date: any = '';
  bHeight: any = document.body.clientHeight + 'px'; 
  height: any = document.body.clientHeight - 828;
  antBottomBox: any = document.body.clientHeight - 721 + 'px';
  constructor(
    private route : Router,
    private activeRoute: ActivatedRoute,
    private website : WebSiteService, 
  ) { }

  ngOnInit() {
    this.defaultData();
    // 页面监听
			fromEvent(window,'resize').subscribe((event) => {
        this.bHeight = document.body.clientHeight + 'px'; 
        this.height = document.body.clientHeight - 828;
        this.antBottomBox = this.height + 107 + 'px';
			});
  }

  defaultData(){
    this.website.getWelcomePage().subscribe(response => {
      if(!response){
        this.routeTo();
      }else{
        this.articleDetail = response;
        this.articleType = this.articleDetail.articleType;
        this.title = this.articleDetail.title;
        // this.id_list = this.articleDetail.columnId;
        this.author = this.articleDetail.author;
        this.contentHtml = this.articleDetail.contentHtml;
        this.contentText = this.articleDetail.contentText;
        this.guideContentHtml = this.articleDetail.registerGuide.guideContent;
        this.id = this.articleDetail.registerGuide.articleId;
        this.rigesterStartTime = this.articleDetail.registerGuide.registerBeginTime;
        this.rigesterEndTime = this.articleDetail.registerGuide.registerEndTime;
        this.rigesterStartTimeHour = this.articleDetail.registerGuide.startTime;
        this.rigesterEndTimeHour = this.articleDetail.registerGuide.endTime;
        this.registerUrl = this.articleDetail.registerGuide.registerPageUrl;
        this.getRegisterDate(this.rigesterStartTime,this.rigesterEndTime,this.rigesterStartTimeHour,this.rigesterEndTimeHour);
        this.showTitle(this.articleDetail.currentTime,this.articleDetail.registerGuide.registerPageUrl);
        this.getDetailPath(this.id);
      }   
			});
  }

  getDetailPath(id){
      let obj = {
        path : '',
      };
      this.website.getWelcomeParentPath(id).subscribe(res => {
        res.forEach((element,index) => {
            obj[`key${index+1}`] = element.id;
            obj[`value${index+1}`] = element.name;
            if((res.length - 1) == index && index==1){
              obj['path'] += '/' + element.id + '/0/' + this.id;
            }else if ((res.length - 1) == index && index==2){
                obj['path'] += '/' + element.id + '/' + this.id;
            }else{
              obj['path'] += '/' + element.id;
            };
        });
      });
      this.path = obj;
  }

  routeTo(data?) {
    if(data){
      this.route.navigate([`/layout/listDetail/${data.path}`]);
    }else{
      this.route.navigate(['/layout/home']);
    }
  }

  redirectTo(){
    if(this.registerUrl){
      window.open(this.registerUrl);
    }
  }


  getRegisterDate(rigesterStartTime,rigesterEndTime,rigesterStartTimeHour,rigesterEndTimeHour){
    let start = this.getFormat(rigesterStartTime);
    let end = this.getFormat(rigesterEndTime);
    this.date = `报名时间:${start}~${end}(每天:${rigesterStartTimeHour}~${rigesterEndTimeHour})`
  }

  // 格式化时间
  getFormat(time){
    let d = new Date(time);
    let year: number = d.getFullYear();
    let month: string = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
    let day: string = (d.getDate() < 10 ? '0' : '') + d.getDate(); 
    let data = `${year}/${month}/${day}`;
    return data;
  }

  // 比较时间
	getDate(data: any, url: string) : {}{  
    let str = {};
	  let registerStart =  new Date(this.rigesterStartTime).getTime();
    let registerEnd =  new Date(this.rigesterEndTime).getTime();
    let indeedRegisterEnd = new Date(this.getFormat(registerEnd) + ' ' + this.rigesterEndTimeHour).getTime();
    // if(registerStart === registerEnd) registerEnd += 24*3600*1000;
			if(data < registerStart){
				let day = Math.ceil((registerStart - data) /1000 / 60 / 60 / 24);
				str['name'] = `距离正式报名还有${day}天`;
				str['key'] = 1;
			}else if(data > indeedRegisterEnd && data > (registerEnd += 24*3600*1000)){
				str['name'] = '该报名活动已经过期';
				str['key'] = 2;
			}else{
				let d = new Date(data);
				let year: number = d.getFullYear();
				let month: string = (d.getMonth() < 10 ? '0' : '') + (d.getMonth() + 1);
				let day: string = (d.getDate() < 10 ? '0' : '') + d.getDate(); 
				let time = `${year}-${month}-${day}`;
				let startValidTime = time + ' ' + this.rigesterStartTimeHour;
				let endValidTime = time + ' ' + this.rigesterEndTimeHour;
				let startSeconds = new Date(startValidTime).getTime();
				let endSeconds = new Date(endValidTime).getTime();
				if(data < startSeconds || data > endSeconds){
          // let start = this.rigesterStartTimeHour.split(':');
          // start[0] += '时:';
          // start[1] += '分';
          // let end = this.rigesterEndTimeHour.split(':');
          // end[0] += '时:';
          // end[1] += '分';
					str['name'] = `不在报名时间范围内（请于${this.rigesterStartTimeHour}~${this.rigesterEndTimeHour}进行操作）`;
          str['key'] = 3;
          this.overTime = true;
				}else{
          if(url){
            str['name'] = '现在开始报名';
            str['key'] = 4;
          }else{
            str['name'] = '查看招生简章';
            str['key'] = 5;
          }
				}
			}

			return str;
	}
	
	// 招生简章的时间标题显示
	showTitle(time,url){
			let obj = this.getDate(time, url);
			this.registerTitle['title'] = obj['name'];
			if(obj['key'] == 1){
				this.registerTitle['value'] = 'rest';
			}else if(obj['key'] == 2){
				this.registerTitle['value'] = 'over';
			}else if(obj['key'] == 3){
				this.registerTitle['value'] = 'dayOver';
			}else if(obj['key'] == 4){
				this.registerTitle['value'] = 'start';
			}else if(obj['key'] == 5){
				this.registerTitle['value'] = 'simply';
			}
			// console.log(this.registerTitle)
	}
}
