import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { DataGovernanceRoutingModule } from './data-governance-routing.module';
import { AccessControlsComponent } from './access-controls/access-controls.component';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    AccessControlsComponent
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
    DataGovernanceRoutingModule,
    SharedModule
  ]
})
export class DataGovernanceModule { }