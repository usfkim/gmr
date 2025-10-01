import { Component, Input, OnInit, inject } from '@angular/core';
import { WorkflowOrchestratorService, WorkflowStatus } from '../../services/workflow-orchestrator.service';

@Component({
  selector: 'app-workflow-status',
  templateUrl: './workflow-status.component.html',
  styleUrls: ['./workflow-status.component.css']
})
export class WorkflowStatusComponent implements OnInit {
  @Input() workflowId!: string;
  @Input() showDetails = true;
  
  private orchestratorService = inject(WorkflowOrchestratorService);
  
  workflow: WorkflowStatus | null = null;
  refreshInterval: any;

  ngOnInit(): void {
    this.loadWorkflowStatus();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private loadWorkflowStatus(): void {
    this.workflow = this.orchestratorService.getWorkflowStatus(this.workflowId) || null;
  }

  private startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.loadWorkflowStatus();
    }, 5000); // Refresh every 5 seconds
  }

  getProgressPercentage(): number {
    if (!this.workflow) return 0;
    return (this.workflow.completedSteps / this.workflow.totalSteps) * 100;
  }

  getStatusColor(): string {
    if (!this.workflow) return 'bg-gray-500';
    
    switch (this.workflow.status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  }

  getStatusIcon(): string {
    if (!this.workflow) return 'ri-question-line';
    
    switch (this.workflow.status) {
      case 'completed': return 'ri-check-line';
      case 'failed': return 'ri-close-line';
      case 'cancelled': return 'ri-stop-line';
      case 'in_progress': return 'ri-loader-4-line animate-spin';
      default: return 'ri-time-line';
    }
  }

  getStepIcon(stepNumber: number): string {
    if (!this.workflow) return 'ri-circle-line';
    
    if (stepNumber < this.workflow.completedSteps) {
      return 'ri-check-line text-green-600';
    } else if (stepNumber === this.workflow.completedSteps) {
      return 'ri-loader-4-line animate-spin text-blue-600';
    } else {
      return 'ri-circle-line text-gray-400';
    }
  }

  getWorkflowSteps(): string[] {
    if (!this.workflow) return [];
    
    const stepMaps: { [key: string]: string[] } = {
      'onboarding': [
        'Account Creation',
        'KYC Verification', 
        'Document Upload',
        'Payment Processing',
        'Human Review',
        'License Issuance'
      ],
      'renewal': [
        'CPD Check',
        'Payment Processing',
        'Certificate Issuance',
        'Stakeholder Notifications'
      ],
      'investigation': [
        'Case Creation',
        'Inspector Assignment',
        'Evidence Collection',
        'Decision Making',
        'Public Updates'
      ],
      'bulk_verification': [
        'Data Processing',
        'Verification Checks',
        'Results Compilation',
        'Monitoring Setup'
      ],
      'embassy_verification': [
        'License Verification',
        'Letter Generation',
        'Digital Signing',
        'Audit Logging'
      ]
    };
    
    return stepMaps[this.workflow.type] || [];
  }

  formatEstimatedCompletion(): string {
    if (!this.workflow) return '';
    
    const now = new Date();
    const completion = this.workflow.estimatedCompletion;
    const diffHours = Math.ceil((completion.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} days`;
    }
  }
}