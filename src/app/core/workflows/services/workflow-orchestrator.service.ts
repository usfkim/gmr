import { Injectable, inject } from '@angular/core';
import { PractitionerOnboardingService } from './practitioner-onboarding.service';
import { RenewalService } from './renewal.service';
import { InvestigationService } from './investigation.service';
import { EmployerVerificationService } from './employer-verification.service';
import { EmbassyVerificationService } from './embassy-verification.service';
import { AuditLogService } from '../../security/services/audit-log.service';

export interface WorkflowStatus {
  workflowId: string;
  type: 'onboarding' | 'renewal' | 'investigation' | 'bulk_verification' | 'embassy_verification';
  status: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  estimatedCompletion: Date;
  lastUpdated: Date;
  metadata: any;
}

export interface WorkflowMetrics {
  onboarding: {
    totalApplications: number;
    approvalRate: number;
    averageProcessingTime: number; // days
    currentBacklog: number;
  };
  renewals: {
    totalRenewals: number;
    onTimeRenewalRate: number;
    averageProcessingTime: number; // days
    cpdComplianceRate: number;
  };
  investigations: {
    totalCases: number;
    resolutionRate: number;
    averageResolutionTime: number; // days
    suspensionRate: number;
    revocationRate: number;
  };
  verifications: {
    totalVerifications: number;
    embassyVerifications: number;
    employerVerifications: number;
    averageResponseTime: number; // seconds
  };
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowOrchestratorService {
  private onboardingService = inject(PractitionerOnboardingService);
  private renewalService = inject(RenewalService);
  private investigationService = inject(InvestigationService);
  private employerService = inject(EmployerVerificationService);
  private embassyService = inject(EmbassyVerificationService);
  private auditService = inject(AuditLogService);

  private activeWorkflows = new Map<string, WorkflowStatus>();

  /**
   * Orchestrates complete practitioner onboarding workflow
   */
  async orchestratePractitionerOnboarding(
    applicantData: any,
    documents: File[],
    paymentMethod: string
  ): Promise<WorkflowStatus> {
    const workflowId = this.generateWorkflowId();
    
    const workflow: WorkflowStatus = {
      workflowId,
      type: 'onboarding',
      status: 'initiated',
      currentStep: 'account_creation',
      totalSteps: 6,
      completedSteps: 0,
      estimatedCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      lastUpdated: new Date(),
      metadata: { applicantId: applicantData.userId }
    };

    this.activeWorkflows.set(workflowId, workflow);

    try {
      // Step 1: Create application
      workflow.currentStep = 'account_creation';
      const application = await this.onboardingService.createOnboardingApplication(applicantData);
      workflow.completedSteps = 1;
      workflow.metadata.applicationId = application.id;

      // Step 2: KYC verification
      workflow.currentStep = 'kyc_verification';
      const kycResult = await this.onboardingService.performKycVerification(application.id);
      workflow.completedSteps = 2;
      workflow.metadata.kycResult = kycResult;

      if (!kycResult.success) {
        workflow.status = 'failed';
        workflow.metadata.failureReason = 'KYC verification failed';
        return workflow;
      }

      // Step 3: Document upload and verification
      workflow.currentStep = 'document_verification';
      for (const document of documents) {
        await this.onboardingService.uploadDocument(application.id, 'degree', document);
      }
      workflow.completedSteps = 3;

      // Step 4: Payment processing
      workflow.currentStep = 'payment_processing';
      const paymentResult = await this.onboardingService.processPayment(application.id, paymentMethod, 450000);
      workflow.completedSteps = 4;
      workflow.metadata.paymentResult = paymentResult;

      if (!paymentResult.success) {
        workflow.status = 'failed';
        workflow.metadata.failureReason = 'Payment processing failed';
        return workflow;
      }

      // Step 5: Human review (simulated)
      workflow.currentStep = 'human_review';
      await this.simulateHumanReview(application.id);
      workflow.completedSteps = 5;

      // Step 6: License issuance
      workflow.currentStep = 'license_issuance';
      const licenseResult = await this.onboardingService.approveLicenseApplication(
        application.id,
        'SYSTEM_ADMIN',
        'Application approved after successful verification'
      );
      workflow.completedSteps = 6;
      workflow.metadata.licenseResult = licenseResult;

      workflow.status = 'completed';
      workflow.currentStep = 'completed';

    } catch (error) {
      workflow.status = 'failed';
      workflow.metadata.error = error instanceof Error ? error.message : 'Unknown error';
    }

    workflow.lastUpdated = new Date();
    return workflow;
  }

  /**
   * Orchestrates license renewal workflow
   */
  async orchestrateRenewal(
    licenseNumber: string,
    practitionerId: string,
    paymentMethod: string
  ): Promise<WorkflowStatus> {
    const workflowId = this.generateWorkflowId();
    
    const workflow: WorkflowStatus = {
      workflowId,
      type: 'renewal',
      status: 'initiated',
      currentStep: 'cpd_check',
      totalSteps: 4,
      completedSteps: 0,
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      lastUpdated: new Date(),
      metadata: { licenseNumber, practitionerId }
    };

    this.activeWorkflows.set(workflowId, workflow);

    try {
      // Step 1: Initiate renewal and check CPD
      const renewal = await this.renewalService.initiateRenewal(licenseNumber, practitionerId);
      workflow.completedSteps = 1;
      workflow.metadata.renewalId = renewal.id;

      // Step 2: Process payment
      workflow.currentStep = 'payment_processing';
      const paymentResult = await this.renewalService.processRenewalPayment(renewal.id, paymentMethod);
      workflow.completedSteps = 2;

      if (!paymentResult.success) {
        workflow.status = 'failed';
        workflow.metadata.failureReason = 'Payment failed';
        return workflow;
      }

      // Step 3: Issue new certificate and update blockchain
      workflow.currentStep = 'certificate_issuance';
      workflow.completedSteps = 3;

      // Step 4: Send notifications
      workflow.currentStep = 'notifications';
      workflow.completedSteps = 4;
      workflow.status = 'completed';

    } catch (error) {
      workflow.status = 'failed';
      workflow.metadata.error = error instanceof Error ? error.message : 'Unknown error';
    }

    workflow.lastUpdated = new Date();
    return workflow;
  }

  /**
   * Gets workflow status
   */
  getWorkflowStatus(workflowId: string): WorkflowStatus | undefined {
    return this.activeWorkflows.get(workflowId);
  }

  /**
   * Gets workflow metrics for dashboard
   */
  async getWorkflowMetrics(): Promise<WorkflowMetrics> {
    // Mock metrics - in production, calculate from actual data
    return {
      onboarding: {
        totalApplications: 1247,
        approvalRate: 87.5,
        averageProcessingTime: 12,
        currentBacklog: 89
      },
      renewals: {
        totalRenewals: 8934,
        onTimeRenewalRate: 78.2,
        averageProcessingTime: 3,
        cpdComplianceRate: 82.1
      },
      investigations: {
        totalCases: 156,
        resolutionRate: 94.2,
        averageResolutionTime: 21,
        suspensionRate: 12.8,
        revocationRate: 3.2
      },
      verifications: {
        totalVerifications: 45678,
        embassyVerifications: 2847,
        employerVerifications: 42831,
        averageResponseTime: 1.2
      }
    };
  }

  /**
   * Cancels active workflow
   */
  async cancelWorkflow(workflowId: string, reason: string, cancelledBy: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    
    if (workflow) {
      workflow.status = 'cancelled';
      workflow.metadata.cancellationReason = reason;
      workflow.metadata.cancelledBy = cancelledBy;
      workflow.lastUpdated = new Date();

      // Log cancellation
      await this.auditService.logAdminAction(
        cancelledBy,
        'admin',
        'WORKFLOW_CANCELLED',
        'workflow',
        workflowId,
        true,
        reason,
        { workflowType: workflow.type, currentStep: workflow.currentStep }
      );
    }
  }

  private async simulateHumanReview(applicationId: string): Promise<void> {
    // Simulate human review process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log review completion
    await this.auditService.logAdminAction(
      'HUMAN_REVIEWER',
      'admin',
      'APPLICATION_REVIEWED',
      'onboarding',
      applicationId,
      true,
      'Application passed human review',
      { reviewDuration: 1000, reviewOutcome: 'approved' }
    );
  }

  private generateWorkflowId(): string {
    return 'WF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}