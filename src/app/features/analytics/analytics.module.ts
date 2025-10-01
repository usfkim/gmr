import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { WorkforceDensityComponent } from './workforce-density/workforce-density.component';
import { TrainingPipelineComponent } from './training-pipeline/training-pipeline.component';
import { AttritionMigrationComponent } from './attrition-migration/attrition-migration.component';
import { FraudHeatmapComponent } from './fraud-heatmap/fraud-heatmap.component';
import { ComplianceCurvesComponent } from './compliance-curves/compliance-curves.component';
import { AccessGapsComponent } from './access-gaps/access-gaps.component';
import { RevenueDashboardComponent } from './revenue-dashboard/revenue-dashboard.component';
import { AnalyticsDashboardComponent } from './dashboard/analytics-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule, CheckBoxModule, DatePickerModule, InputModule, SelectModule } from 'side-components';

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    WorkforceDensityComponent,
    TrainingPipelineComponent,
    AttritionMigrationComponent,
    FraudHeatmapComponent,
    ComplianceCurvesComponent,
    AccessGapsComponent,
    RevenueDashboardComponent
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
    AnalyticsRoutingModule,
    SharedModule
  ]
})
export class AnalyticsModule { }