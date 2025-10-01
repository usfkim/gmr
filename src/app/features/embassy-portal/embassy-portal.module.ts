import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { EmbassyPortalRoutingModule } from './embassy-portal-routing.module';
import { EmbassyDashboardComponent } from './dashboard/embassy-dashboard.component';
import { VerificationCenterComponent } from './verification-center/verification-center.component';
import { BatchVerificationComponent } from './batch-verification/batch-verification.component';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';
import { OfficialLettersComponent } from './official-letters/official-letters.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { BillingManagementComponent } from './billing-management/billing-management.component';

@NgModule({
  declarations: [
    EmbassyDashboardComponent,
    VerificationCenterComponent,
    BatchVerificationComponent,
    OfficialLettersComponent,
    AuditLogsComponent,
    BillingManagementComponent
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
    EmbassyPortalRoutingModule,
    SharedModule
  ]
})
export class EmbassyPortalModule { }