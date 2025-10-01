import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchPractitionersRoutingModule } from './search-practitioners-routing.module';
import { SearchPractitionersComponent } from './search-practitioners.component';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [
    SearchPractitionersComponent
  ],
  imports: [
    CommonModule,
    SearchPractitionersRoutingModule,
    SharedModule
]
})
export class SearchPractitionersModule { }
