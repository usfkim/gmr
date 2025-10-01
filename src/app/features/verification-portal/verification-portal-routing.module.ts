import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationPortalComponent } from './verification-portal.component';

const routes: Routes = [
  {
    path: '',
    component: VerificationPortalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationPortalRoutingModule { }
