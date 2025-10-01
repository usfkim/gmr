import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MfaChallengeComponent } from './components/mfa-challenge/mfa-challenge.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'mfa-challenge',
    component: MfaChallengeComponent
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }