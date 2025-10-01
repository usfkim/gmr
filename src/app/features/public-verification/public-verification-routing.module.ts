import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicVerificationComponent } from './public-verification.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ReportConcernComponent } from './report-concern/report-concern.component';

const routes: Routes = [
  {
    path: '',
    component: PublicVerificationComponent
  },
  {
    path: 'qr-scanner',
    component: QrScannerComponent
  },
  {
    path: 'report-concern',
    component: ReportConcernComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicVerificationRoutingModule { }