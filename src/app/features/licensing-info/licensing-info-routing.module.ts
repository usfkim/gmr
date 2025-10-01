import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicensingInfoComponent } from './licensing-info.component';

const routes: Routes = [
  {
    path: '',
    component: LicensingInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensingInfoRoutingModule { }
