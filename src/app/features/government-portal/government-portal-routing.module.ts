import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutiveDashboardComponent } from './executive-dashboard/executive-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ExecutiveDashboardComponent
  },
  {
    path: 'registries',
    loadChildren: () => import('./registries/registries.module').then(m => m.RegistriesModule)
  },
  {
    path: 'investigations',
    loadChildren: () => import('./investigations/investigations.module').then(m => m.InvestigationsModule)
  },
  {
    path: 'licensing',
    loadChildren: () => import('./licensing/licensing.module').then(m => m.LicensingModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
  },
  {
    path: 'communications',
    loadChildren: () => import('./communications/communications.module').then(m => m.CommunicationsModule)
  },
  {
    path: 'data-governance',
    loadChildren: () => import('./data-governance/data-governance.module').then(m => m.DataGovernanceModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GovernmentPortalRoutingModule { }