import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilityDashboardComponent } from './dashboard/facility-dashboard.component';
import { ProfileManagementComponent } from './profile-management/profile-management.component';
import { StaffLinkingComponent } from './staff-linking/staff-linking.component';
import { QrPosterGeneratorComponent } from './qr-poster-generator/qr-poster-generator.component';
import { InspectionReportsComponent } from './inspection-reports/inspection-reports.component';
import { ComplianceDashboardComponent } from './compliance-dashboard/compliance-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FacilityDashboardComponent
  },
  {
    path: 'profile',
    component: ProfileManagementComponent
  },
  {
    path: 'staff-linking',
    component: StaffLinkingComponent
  },
  {
    path: 'qr-poster',
    component: QrPosterGeneratorComponent
  },
  {
    path: 'inspections',
    component: InspectionReportsComponent
  },
  {
    path: 'compliance',
    component: ComplianceDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityPortalRoutingModule { }