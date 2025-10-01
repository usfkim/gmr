import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MyLicenseComponent } from './my-license/my-license.component';
import { DocumentVaultComponent } from './document-vault/document-vault.component';
import { CpdTrackerComponent } from './cpd-tracker/cpd-tracker.component';
import { DigitalIdCardComponent } from './digital-id-card/digital-id-card.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { PaymentsComponent } from './payments/payments.component';
import { SupportTicketsComponent } from './support-tickets/support-tickets.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'license',
    component: MyLicenseComponent
  },
  {
    path: 'documents',
    component: DocumentVaultComponent
  },
  {
    path: 'cpd',
    component: CpdTrackerComponent
  },
  {
    path: 'payments',
    component: PaymentsComponent
  },
  {
    path: 'id-card',
    component: DigitalIdCardComponent
  },
  {
    path: 'privacy',
    component: PrivacySettingsComponent
  },
  {
    path: 'support',
    component: SupportTicketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PractitionerDashboardRoutingModule { }