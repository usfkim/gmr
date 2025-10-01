import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerDashboardComponent } from './dashboard/employer-dashboard.component';
import { BulkVerificationComponent } from './bulk-verification/bulk-verification.component';
import { StaffMonitoringComponent } from './staff-monitoring/staff-monitoring.component';
import { HirePipelineComponent } from './hire-pipeline/hire-pipeline.component';
import { FacilityRosterComponent } from './facility-roster/facility-roster.component';
import { ComplianceReportsComponent } from './compliance-reports/compliance-reports.component';
import { BillingDashboardComponent } from './billing-dashboard/billing-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerDashboardComponent
  },
  {
    path: 'bulk-verification',
    component: BulkVerificationComponent
  },
  {
    path: 'staff-monitoring',
    component: StaffMonitoringComponent
  },
  {
    path: 'hire-pipeline',
    component: HirePipelineComponent
  },
  {
    path: 'facility-roster',
    component: FacilityRosterComponent
  },
  {
    path: 'compliance-reports',
    component: ComplianceReportsComponent
  },
  {
    path: 'billing',
    component: BillingDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerPortalRoutingModule { }