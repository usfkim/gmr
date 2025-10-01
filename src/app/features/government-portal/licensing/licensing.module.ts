import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { LicensingRoutingModule } from './licensing-routing.module';
import { PolicyEngineComponent } from './policy-engine/policy-engine.component';
import { BulkActionsComponent } from './bulk-actions/bulk-actions.component';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    PolicyEngineComponent,
    BulkActionsComponent
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
    LicensingRoutingModule,
    SharedModule
  ]
})
export class LicensingModule { }