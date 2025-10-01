import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface InvestigationCase {
  id: string;
  type: 'tip_off' | 'automated_flag' | 'complaint' | 'routine_audit' | 'cross_border';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'assigned' | 'investigating' | 'pending_review' | 'resolved' | 'closed';
  title: string;
  description: string;
  practitioner?: {
    name: string;
    licenseNumber: string;
    facility: string;
  };
  facility?: {
    name: string;
    licenseNumber: string;
    region: string;
  };
  reportedBy: string;
  reportedDate: Date;
  assignedTo?: string;
  assignedDate?: Date;
  slaDeadline: Date;
  evidence: Array<{
    type: 'document' | 'photo' | 'video' | 'audio' | 'witness_statement';
    name: string;
    uploadDate: Date;
    uploadedBy: string;
  }>;
  tags: string[];
  riskLevel: number;
  estimatedResolutionTime: number; // hours
}

@Component({
  selector: 'app-case-queue',
  templateUrl: './case-queue.component.html',
  styleUrls: ['./case-queue.component.css']
})
export class CaseQueueComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedPriority = 'all';
  selectedStatus = 'all';
  selectedType = 'all';
  searchTerm = '';
  
  // Mock investigation cases
  cases: InvestigationCase[] = [
    {
      id: 'INV-2025-001',
      type: 'automated_flag',
      priority: 'critical',
      status: 'new',
      title: 'Duplicate National ID Detection',
      description: 'System detected same national ID used for multiple practitioner registrations across different specialties',
      practitioner: {
        name: 'Dr. John Mukasa',
        licenseNumber: 'UMC-UG-4521',
        facility: 'Multiple Facilities'
      },
      reportedBy: 'Automated System',
      reportedDate: new Date('2025-01-15T09:30:00'),
      slaDeadline: new Date('2025-01-17T17:00:00'),
      evidence: [
        {
          type: 'document',
          name: 'Duplicate_ID_Analysis_Report.pdf',
          uploadDate: new Date('2025-01-15T09:30:00'),
          uploadedBy: 'System'
        }
      ],
      tags: ['fraud', 'identity', 'duplicate', 'high-risk'],
      riskLevel: 9,
      estimatedResolutionTime: 48
    },
    {
      id: 'INV-2025-002',
      type: 'tip_off',
      priority: 'high',
      status: 'assigned',
      title: 'Suspected Forged Medical Degree',
      description: 'Anonymous tip reporting suspected forged medical degree from unrecognized international institution',
      practitioner: {
        name: 'Dr. Michael Okello',
        licenseNumber: 'UMC-UG-4789',
        facility: 'Private Clinic - Gulu'
      },
      reportedBy: 'Anonymous Whistleblower',
      reportedDate: new Date('2025-01-12T14:20:00'),
      assignedTo: 'Inspector David Kiggundu',
      assignedDate: new Date('2025-01-13T08:00:00'),
      slaDeadline: new Date('2025-01-19T17:00:00'),
      evidence: [
        {
          type: 'document',
          name: 'Anonymous_Tip_Report.pdf',
          uploadDate: new Date('2025-01-12T14:20:00'),
          uploadedBy: 'System'
        },
        {
          type: 'photo',
          name: 'Suspected_Certificate_Photo.jpg',
          uploadDate: new Date('2025-01-13T10:15:00'),
          uploadedBy: 'Inspector David Kiggundu'
        }
      ],
      tags: ['fraud', 'education', 'forgery', 'international'],
      riskLevel: 8,
      estimatedResolutionTime: 120
    },
    {
      id: 'INV-2025-003',
      type: 'complaint',
      priority: 'medium',
      status: 'investigating',
      title: 'Patient Complaint - Unlicensed Practice',
      description: 'Patient complaint alleging practitioner is operating without valid license or with expired credentials',
      practitioner: {
        name: 'Dr. Grace Atim',
        licenseNumber: 'UMC-UG-4892',
        facility: 'Atim Medical Center'
      },
      reportedBy: 'Patient: Sarah Namubiru',
      reportedDate: new Date('2025-01-08T11:45:00'),
      assignedTo: 'Inspector Sarah Nambi',
      assignedDate: new Date('2025-01-09T09:00:00'),
      slaDeadline: new Date('2025-01-15T17:00:00'),
      evidence: [
        {
          type: 'witness_statement',
          name: 'Patient_Statement_Sarah_Namubiru.pdf',
          uploadDate: new Date('2025-01-08T11:45:00'),
          uploadedBy: 'Complaints Officer'
        },
        {
          type: 'photo',
          name: 'Facility_Inspection_Photos.zip',
          uploadDate: new Date('2025-01-10T14:30:00'),
          uploadedBy: 'Inspector Sarah Nambi'
        }
      ],
      tags: ['complaint', 'unlicensed', 'patient-safety'],
      riskLevel: 6,
      estimatedResolutionTime: 72
    },
    {
      id: 'INV-2025-004',
      type: 'routine_audit',
      priority: 'low',
      status: 'pending_review',
      title: 'Routine CPD Compliance Audit',
      description: 'Quarterly audit of CPD compliance for cardiology specialists in Central region',
      reportedBy: 'Audit Department',
      reportedDate: new Date('2025-01-05T08:00:00'),
      assignedTo: 'Inspector James Ssebunya',
      assignedDate: new Date('2025-01-05T08:30:00'),
      slaDeadline: new Date('2025-01-20T17:00:00'),
      evidence: [
        {
          type: 'document',
          name: 'CPD_Audit_Report_Q4_2024.pdf',
          uploadDate: new Date('2025-01-05T16:00:00'),
          uploadedBy: 'Inspector James Ssebunya'
        }
      ],
      tags: ['audit', 'cpd', 'compliance', 'cardiology'],
      riskLevel: 3,
      estimatedResolutionTime: 24
    }
  ];

  filteredCases: InvestigationCase[] = [];
  
  // Available inspectors for assignment
  inspectors = [
    { id: 'INS-001', name: 'Inspector Sarah Nambi', specialization: 'Fraud Investigation', workload: 5 },
    { id: 'INS-002', name: 'Inspector David Kiggundu', specialization: 'Document Verification', workload: 3 },
    { id: 'INS-003', name: 'Inspector James Ssebunya', specialization: 'Compliance Audit', workload: 7 },
    { id: 'INS-004', name: 'Inspector Patricia Nakato', specialization: 'Field Inspection', workload: 4 },
    { id: 'INS-005', name: 'Inspector Michael Owusu', specialization: 'Cross-Border Cases', workload: 2 }
  ];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check authentication and admin role
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    
    if (this.currentUser.role !== 'admin') {
      alert('Access denied. This portal is restricted to government officials and regulators.');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    this.titleService.setTitle('Investigation Case Queue - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCases = this.cases.filter(caseItem => {
      const matchesSearch = !this.searchTerm || 
        caseItem.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (caseItem.practitioner?.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesPriority = this.selectedPriority === 'all' || caseItem.priority === this.selectedPriority;
      const matchesStatus = this.selectedStatus === 'all' || caseItem.status === this.selectedStatus;
      const matchesType = this.selectedType === 'all' || caseItem.type === this.selectedType;
      
      return matchesSearch && matchesPriority && matchesStatus && matchesType;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  viewCase(id: string): void {
    this.router.navigate(['/government/investigations/case', id]);
  }

  assignCase(caseId: string): void {
    const inspectorId = prompt('Enter inspector ID to assign this case:');
    if (inspectorId) {
      const inspector = this.inspectors.find(i => i.id === inspectorId);
      if (inspector) {
        const caseItem = this.cases.find(c => c.id === caseId);
        if (caseItem) {
          caseItem.assignedTo = inspector.name;
          caseItem.assignedDate = new Date();
          caseItem.status = 'assigned';
          this.applyFilters();
          alert(`Case ${caseId} assigned to ${inspector.name}`);
        }
      } else {
        alert('Inspector not found');
      }
    }
  }

  escalateCase(caseId: string): void {
    const caseItem = this.cases.find(c => c.id === caseId);
    if (caseItem) {
      if (caseItem.priority === 'low') caseItem.priority = 'medium';
      else if (caseItem.priority === 'medium') caseItem.priority = 'high';
      else if (caseItem.priority === 'high') caseItem.priority = 'critical';
      
      this.applyFilters();
      alert(`Case ${caseId} escalated to ${caseItem.priority} priority`);
    }
  }

  closeCase(caseId: string): void {
    const reason = prompt('Please provide a reason for closing this case:');
    if (reason) {
      const caseItem = this.cases.find(c => c.id === caseId);
      if (caseItem) {
        caseItem.status = 'closed';
        this.applyFilters();
        alert(`Case ${caseId} closed. Reason: ${reason}`);
      }
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'tip_off': return 'ri-spy-line';
      case 'automated_flag': return 'ri-robot-line';
      case 'complaint': return 'ri-feedback-line';
      case 'routine_audit': return 'ri-file-search-line';
      case 'cross_border': return 'ri-global-line';
      default: return 'ri-file-line';
    }
  }

  getDaysUntilDeadline(deadline: Date): number {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(deadline: Date): boolean {
    return new Date() > deadline;
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}