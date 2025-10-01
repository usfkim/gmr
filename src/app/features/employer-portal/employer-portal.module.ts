import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { EmployerPortalRoutingModule } from './employer-portal-routing.module';
import { EmployerDashboardComponent } from './dashboard/employer-dashboard.component';
import { BulkVerificationComponent } from './bulk-verification/bulk-verification.component';
import { StaffMonitoringComponent } from './staff-monitoring/staff-monitoring.component';
import { HirePipelineComponent } from './hire-pipeline/hire-pipeline.component';
import { FacilityRosterComponent } from './facility-roster/facility-roster.component';
import { ComplianceReportsComponent } from './compliance-reports/compliance-reports.component';
import { BillingDashboardComponent } from './billing-dashboard/billing-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    EmployerDashboardComponent,
    BulkVerificationComponent,
    StaffMonitoringComponent,
    HirePipelineComponent,
    FacilityRosterComponent,
    ComplianceReportsComponent,
    BillingDashboardComponent
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
    EmployerPortalRoutingModule,
    SharedModule
  ]
})
export class EmployerPortalModule { }