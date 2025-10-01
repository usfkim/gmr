import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsDashboardComponent } from './dashboard/analytics-dashboard.component';
import { WorkforceDensityComponent } from './workforce-density/workforce-density.component';
import { TrainingPipelineComponent } from './training-pipeline/training-pipeline.component';
import { AttritionMigrationComponent } from './attrition-migration/attrition-migration.component';
import { FraudHeatmapComponent } from './fraud-heatmap/fraud-heatmap.component';
import { ComplianceCurvesComponent } from './compliance-curves/compliance-curves.component';
import { AccessGapsComponent } from './access-gaps/access-gaps.component';
import { RevenueDashboardComponent } from './revenue-dashboard/revenue-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsDashboardComponent
  },
  {
    path: 'workforce-density',
    component: WorkforceDensityComponent
  },
  {
    path: 'training-pipeline',
    component: TrainingPipelineComponent
  },
  {
    path: 'attrition-migration',
    component: AttritionMigrationComponent
  },
  {
    path: 'fraud-heatmap',
    component: FraudHeatmapComponent
  },
  {
    path: 'compliance-curves',
    component: ComplianceCurvesComponent
  },
  {
    path: 'access-gaps',
    component: AccessGapsComponent
  },
  {
    path: 'revenue-dashboard',
    component: RevenueDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }