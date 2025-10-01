import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { InvestigationsRoutingModule } from './investigations-routing.module';
import { CaseQueueComponent } from './case-queue/case-queue.component';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    CaseQueueComponent
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
    InvestigationsRoutingModule,
    SharedModule
  ]
})
export class InvestigationsModule { }