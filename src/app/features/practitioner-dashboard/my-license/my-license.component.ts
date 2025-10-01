import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface LicenseDetails {
  licenseNumber: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired' | 'provisional';
  issueDate: Date;
  expiryDate: Date;
  renewalEligible: boolean;
  renewalDeadline: Date;
  gracePeriodEnd: Date;
  profession: string;
  specialty: string[];
  regulatoryBody: string;
  facilityRestrictions?: string[];
  conditions?: string[];
  endorsements?: string[];
}

interface RenewalRequirement {
  type: 'cpd_credits' | 'payment' | 'documentation' | 'examination' | 'medical_fitness';
  description: string;
  status: 'completed' | 'pending' | 'overdue';
  dueDate?: Date;
  completedDate?: Date;
  details?: string;
}

interface LicenseHistory {
  action: 'issued' | 'renewed' | 'suspended' | 'revoked' | 'reinstated' | 'amended';
  date: Date;
  reason: string;
  performedBy: string;
  referenceNumber: string;
  notes?: string;
  documents?: string[];
}

@Component({
  selector: 'app-my-license',
  templateUrl: './my-license.component.html',
  styleUrls: ['./my-license.component.css']
})
export class MyLicenseComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  
  // Mock license data
  licenseDetails: LicenseDetails = {
    licenseNumber: 'UMC-UG-2458',
    status: 'active',
    issueDate: new Date('2023-01-15'),
    expiryDate: new Date('2025-12-31'),
    renewalEligible: true,
    renewalDeadline: new Date('2025-11-30'),
    gracePeriodEnd: new Date('2025-12-31'),
    profession: 'Medical Doctor',
    specialty: ['Cardiology', 'Interventional Cardiology'],
    regulatoryBody: 'Medical and Dental Council of Uganda',
    endorsements: ['Board Certified Cardiologist', 'Fellowship Trained']
  };

  renewalRequirements: RenewalRequirement[] = [
    {
      type: 'cpd_credits',
      description: 'Complete 60 CPD credits (52/60 completed)',
      status: 'pending',
      dueDate: new Date('2025-11-30'),
      details: '8 credits remaining - Clinical Skills: 3, Professional Development: 5'
    },
    {
      type: 'payment',
      description: 'Annual license renewal fee',
      status: 'pending',
      dueDate: new Date('2025-11-30'),
      details: 'UGX 450,000 + UGX 200,000 specialist surcharge'
    },
    {
      type: 'documentation',
      description: 'Updated professional information',
      status: 'completed',
      completedDate: new Date('2024-12-15'),
      details: 'Contact information and facility details updated'
    },
    {
      type: 'medical_fitness',
      description: 'Annual health screening',
      status: 'pending',
      dueDate: new Date('2025-10-31'),
      details: 'Mandatory health check for healthcare workers'
    }
  ];

  licenseHistory: LicenseHistory[] = [
    {
      action: 'issued',
      date: new Date('2023-01-15'),
      reason: 'Initial registration after housemanship completion',
      performedBy: 'MDC Registration Office',
      referenceNumber: 'MDC-REG-2023-0458',
      notes: 'All requirements met. Excellent academic record.',
      documents: ['Medical Degree Certificate', 'Housemanship Certificate', 'Police Clearance']
    },
    {
      action: 'renewed',
      date: new Date('2024-01-15'),
      reason: 'Annual license renewal',
      performedBy: 'MDC Renewal System',
      referenceNumber: 'MDC-REN-2024-0458',
      notes: 'CPD requirements met. No disciplinary issues.',
      documents: ['CPD Certificate', 'Payment Receipt']
    },
    {
      action: 'amended',
      date: new Date('2019-06-15'),
      reason: 'Specialty endorsement added - Cardiology',
      performedBy: 'MDC Specialty Board',
      referenceNumber: 'MDC-AMD-2019-0458',
      notes: 'Fellowship completed at University of Cape Town.',
      documents: ['Fellowship Certificate', 'Board Examination Results']
    }
  ];

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    this.titleService.setTitle('My License - Uganda Medical Registry');
  }

  getDaysUntilExpiry(): number {
    const today = new Date();
    const expiry = this.licenseDetails.expiryDate;
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysUntilRenewalDeadline(): number {
    const today = new Date();
    const deadline = this.licenseDetails.renewalDeadline;
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'provisional': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getRequirementStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRequirementIcon(type: string): string {
    switch (type) {
      case 'cpd_credits': return 'ri-book-read-line';
      case 'payment': return 'ri-money-dollar-circle-line';
      case 'documentation': return 'ri-file-list-3-line';
      case 'examination': return 'ri-file-text-line';
      case 'medical_fitness': return 'ri-heart-pulse-line';
      default: return 'ri-checkbox-line';
    }
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'issued': return 'ri-award-line text-blue-600';
      case 'renewed': return 'ri-refresh-line text-green-600';
      case 'suspended': return 'ri-pause-line text-orange-600';
      case 'revoked': return 'ri-close-line text-red-600';
      case 'reinstated': return 'ri-check-line text-green-600';
      case 'amended': return 'ri-edit-line text-purple-600';
      default: return 'ri-file-line text-gray-600';
    }
  }

  getExpiryDateClass(): string {
    const days = this.getDaysUntilExpiry();
    if (days <= 30) return 'text-red-600 font-bold';
    if (days <= 90) return 'text-orange-600';
    return '';
  }

  getCountdownTextClass(): string {
    const days = this.getDaysUntilExpiry();
    if (days <= 30) return 'text-red-600';
    if (days <= 90) return 'text-orange-600';
    return 'text-green-600';
  }

  getProgressRingClass(): string {
    const days = this.getDaysUntilExpiry();
    if (days <= 30) return 'text-red-500';
    if (days <= 90) return 'text-orange-500';
    return 'text-green-500';
  }

  getRequirementBgClass(status: string): string {
    return ''; // No additional background class needed
  }

  getRequirementIconBgClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100';
      case 'overdue': return 'bg-red-100';
      default: return 'bg-yellow-100';
    }
  }

  getRequirementIconTextClass(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  }

  startRenewal(): void {
    // In production, this would navigate to renewal workflow
    alert('Starting license renewal process...');
  }

  payRenewalFee(): void {
    // In production, this would integrate with payment gateway
    alert('Redirecting to payment gateway...');
  }

  uploadCpdEvidence(): void {
    // In production, this would open file upload dialog
    alert('Opening CPD evidence upload...');
  }

  requestExtension(): void {
    const reason = prompt('Please provide a reason for requesting an extension:');
    if (reason) {
      alert(`Extension request submitted. Reason: ${reason}`);
    }
  }

  downloadCertificate(): void {
    alert('Downloading digital license certificate...');
  }

  reportIssue(): void {
    alert('Opening support ticket system...');
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getActionDisplayName(action: string): string {
    return action.charAt(0).toUpperCase() + action.slice(1).replace(/_/g, ' ');
  }
}