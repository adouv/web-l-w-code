import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';


import { ManageComponent } from './manage.component';
import { LwPaginatorModule, DialogModule } from 'lw-primeng/primeng';
import { manageRoutes } from './manage.routes';
import { EditComponent } from './edit/edit.component';
import { BaiduMapModule } from 'angular2-baidu-map';
import { BaseInfoComponent} from './edit/base-info/base-info.component';
import { MapComponent } from './edit/map/map.component';


@NgModule({
  imports: [
    CommonModule,
    LwPaginatorModule,
    DialogModule,
    FormsModule,
    BaiduMapModule.forRoot({ ak: '1IYC0xFPFwgiRGNcyAsbsk6iO2zQ5PAi' }),
    RouterModule.forChild(manageRoutes)
  ],
  exports: [
    ManageComponent
  ],
  declarations: [ManageComponent, EditComponent, BaseInfoComponent, MapComponent]
})
export class ManageModule { }








