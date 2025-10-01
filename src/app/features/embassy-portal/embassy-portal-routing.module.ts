import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbassyDashboardComponent } from './dashboard/embassy-dashboard.component';
import { VerificationCenterComponent } from './verification-center/verification-center.component';
import { BatchVerificationComponent } from './batch-verification/batch-verification.component';
import { OfficialLettersComponent } from './official-letters/official-letters.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { BillingManagementComponent } from './billing-management/billing-management.component';

const routes: Routes = [
  {
    path: '',
    component: EmbassyDashboardComponent
  },
  {
    path: 'verification',
    component: VerificationCenterComponent
  },
  {
    path: 'batch-verification',
    component: BatchVerificationComponent
  },
  {
    path: 'official-letters',
    component: OfficialLettersComponent
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent
  },
  {
    path: 'billing',
    component: BillingManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbassyPortalRoutingModule { }