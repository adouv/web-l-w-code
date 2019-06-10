import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { LwPaginatorModule, DialogModule } from 'lw-primeng/primeng';

import { homeRoutes } from './home.routes';

@NgModule({
  imports: [
    CommonModule,
    LwPaginatorModule,
    DialogModule,
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    HomeComponent
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
