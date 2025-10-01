import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlsComponent } from './access-controls/access-controls.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'access-controls',
    pathMatch: 'full'
  },
  {
    path: 'access-controls',
    component: AccessControlsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataGovernanceRoutingModule { }