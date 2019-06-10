import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ManageModule } from './manage/manage.module';

import { DialogModule } from 'lw-primeng/primeng';

import { appRoutes } from './app.routes';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HomeModule,
    ManageModule,
    DialogModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
