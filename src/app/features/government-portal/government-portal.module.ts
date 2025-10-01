import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GovernmentPortalRoutingModule } from './government-portal-routing.module';
import { ExecutiveDashboardComponent } from './executive-dashboard/executive-dashboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ExecutiveDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovernmentPortalRoutingModule,
    SharedModule
  ]
})
export class GovernmentPortalModule { }