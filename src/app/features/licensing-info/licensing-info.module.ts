import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicensingInfoRoutingModule } from './licensing-info-routing.module';
import { LicensingInfoComponent } from './licensing-info.component';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [
    LicensingInfoComponent
  ],
  imports: [
    CommonModule,
    LicensingInfoRoutingModule,
    SharedModule
]
})
export class LicensingInfoModule { }
