import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PractitionerDashboardRoutingModule } from './practitioner-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MyLicenseComponent } from './my-license/my-license.component';
import { DocumentVaultComponent } from './document-vault/document-vault.component';
import { CpdTrackerComponent } from './cpd-tracker/cpd-tracker.component';
import { DigitalIdCardComponent } from './digital-id-card/digital-id-card.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { PaymentsComponent } from './payments/payments.component';
import { SupportTicketsComponent } from './support-tickets/support-tickets.component';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    MyLicenseComponent,
    DocumentVaultComponent,
    CpdTrackerComponent,
    PaymentsComponent,
    DigitalIdCardComponent,
    PrivacySettingsComponent,
    SupportTicketsComponent
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
    PractitionerDashboardRoutingModule,
    SharedModule
  ]
})
export class PractitionerDashboardModule { }