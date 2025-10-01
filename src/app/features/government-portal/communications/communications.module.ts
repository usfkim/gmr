import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { CommunicationsRoutingModule } from './communications-routing.module';
import { BroadcastCenterComponent } from './broadcast-center/broadcast-center.component';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    BroadcastCenterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputModule,
    SelectModule,
    CheckBoxModule,
    DatePickerModule,
    CommunicationsRoutingModule,
    SharedModule
  ]
})
export class CommunicationsModule { }