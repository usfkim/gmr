import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegistriesRoutingModule } from './registries-routing.module';
import { PractitionerRegistryComponent } from './practitioner-registry/practitioner-registry.component';
import { FacilityRegistryComponent } from './facility-registry/facility-registry.component';
import { AccreditationBodiesComponent } from './accreditation-bodies/accreditation-bodies.component';
import { PractitionerDetailComponent } from './practitioner-detail/practitioner-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    PractitionerRegistryComponent,
    FacilityRegistryComponent,
    AccreditationBodiesComponent,
    PractitionerDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputModule,
    SelectModule,
    CheckBoxModule,
    DatePickerModule,
    RegistriesRoutingModule,
    SharedModule
  ]
})
export class RegistriesModule { }