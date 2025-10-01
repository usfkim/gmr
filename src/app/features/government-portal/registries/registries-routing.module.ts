import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PractitionerRegistryComponent } from './practitioner-registry/practitioner-registry.component';
import { FacilityRegistryComponent } from './facility-registry/facility-registry.component';
import { AccreditationBodiesComponent } from './accreditation-bodies/accreditation-bodies.component';
import { PractitionerDetailComponent } from './practitioner-detail/practitioner-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'practitioners',
    pathMatch: 'full'
  },
  {
    path: 'practitioners',
    component: PractitionerRegistryComponent
  },
  {
    path: 'practitioners/:id',
    component: PractitionerDetailComponent
  },
  {
    path: 'facilities',
    component: FacilityRegistryComponent
  },
  {
    path: 'accreditation',
    component: AccreditationBodiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistriesRoutingModule { }