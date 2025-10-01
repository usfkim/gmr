import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkforcePlannerComponent } from './workforce-planner/workforce-planner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'workforce-planner',
    pathMatch: 'full'
  },
  {
    path: 'workforce-planner',
    component: WorkforcePlannerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }