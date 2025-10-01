import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PublicVerificationRoutingModule } from './public-verification-routing.module';
import { PublicVerificationComponent } from './public-verification.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ReportConcernComponent } from './report-concern/report-concern.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PublicVerificationComponent,
    QrScannerComponent,
    ReportConcernComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublicVerificationRoutingModule,
    SharedModule
  ]
})
export class PublicVerificationModule { }