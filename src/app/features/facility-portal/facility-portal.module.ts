import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { FacilityPortalRoutingModule } from './facility-portal-routing.module';
import { FacilityDashboardComponent } from './dashboard/facility-dashboard.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';
import { StaffLinkingComponent } from './staff-linking/staff-linking.component';
import { QrPosterGeneratorComponent } from './qr-poster-generator/qr-poster-generator.component';
import { InspectionReportsComponent } from './inspection-reports/inspection-reports.component';
import { ComplianceDashboardComponent } from './compliance-dashboard/compliance-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    FacilityDashboardComponent,
    ProfileManagementComponent,
    StaffLinkingComponent,
    QrPosterGeneratorComponent,
    InspectionReportsComponent,
    ComplianceDashboardComponent
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
    FacilityPortalRoutingModule,
    SharedModule
  ]
})
export class FacilityPortalModule { }