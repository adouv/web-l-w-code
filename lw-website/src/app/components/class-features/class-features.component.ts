import { Component, OnInit } from '@angular/core';
import { LwHttpService } from '../../common';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-class-features',
  templateUrl: './class-features.component.html',
  styleUrls: ['./class-features.component.scss']
})
export class ClassFeaturesComponent implements OnInit {

  isVisible = false;

  constructor(
    private $http: HttpClient,
    private http: LwHttpService,
    private message: NzMessageService,
  ) {}
  ngOnInit() {
  }
  redirectTo(){
      this.$http.get('http://192.168.64.250:96').subscribe(res =>{
        window.open('http://192.168.64.250:96');
      }, (error) => {
        if(error.status === 200){
          window.open('http://192.168.64.250:96');
        }else{
        this.message.warning('本系统目前只支持学校内部网络访问');
        }
      });
      
  }
  showModal(): void {
    this.isVisible = true;
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
