import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseQueueComponent } from './case-queue/case-queue.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'queue',
    pathMatch: 'full'
  },
  {
    path: 'queue',
    component: CaseQueueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigationsRoutingModule { }