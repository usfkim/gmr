import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkflowStatusComponent } from './components/workflow-status/workflow-status.component';
import { PractitionerOnboardingService } from './services/practitioner-onboarding.service';
import { RenewalService } from './services/renewal.service';
import { InvestigationService } from './services/investigation.service';
import { EmployerVerificationService } from './services/employer-verification.service';
import { EmbassyVerificationService } from './services/embassy-verification.service';
import { WorkflowOrchestratorService } from './services/workflow-orchestrator.service';

@NgModule({
  declarations: [
    WorkflowStatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    WorkflowStatusComponent
  ],
  providers: [
    PractitionerOnboardingService,
    RenewalService,
    InvestigationService,
    EmployerVerificationService,
    EmbassyVerificationService,
    WorkflowOrchestratorService
  ]
})
export class WorkflowsModule { }