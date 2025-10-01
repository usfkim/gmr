import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsUpdatesRoutingModule } from './news-updates-routing.module';
import { NewsUpdatesComponent } from './news-updates.component';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [
    NewsUpdatesComponent
  ],
  imports: [
    CommonModule,
    NewsUpdatesRoutingModule,
    SharedModule
]
})
export class NewsUpdatesModule { }
