import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyEngineComponent } from './policy-engine/policy-engine.component';
import { BulkActionsComponent } from './bulk-actions/bulk-actions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'policy-engine',
    pathMatch: 'full'
  },
  {
    path: 'policy-engine',
    component: PolicyEngineComponent
  },
  {
    path: 'bulk-actions',
    component: BulkActionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensingRoutingModule { }