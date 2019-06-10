import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  public pageSize: number = 10;
  public totalCount: number = 100;
  public isShow: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  showDialog() {
    this.isShow = true;
  }
}
