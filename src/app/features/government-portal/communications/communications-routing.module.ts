import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BroadcastCenterComponent } from './broadcast-center/broadcast-center.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'broadcast-center',
    pathMatch: 'full'
  },
  {
    path: 'broadcast-center',
    component: BroadcastCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationsRoutingModule { }