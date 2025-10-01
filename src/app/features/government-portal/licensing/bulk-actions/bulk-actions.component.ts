import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface BulkAction {
  id: string;
  type: 'mass_renewal' | 'fee_waiver' | 'status_update' | 'cpd_reminder' | 'document_request';
  title: string;
  description: string;
  targetCriteria: {
    profession?: string;
    region?: string;
    status?: string;
    expiryDateRange?: {
      start: Date;
      end: Date;
    };
  };
  estimatedAffected: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'executing' | 'completed' | 'failed';
  createdBy: string;
  createdDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  executedDate?: Date;
  completedDate?: Date;
  results?: {
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  };
}

@Component({
  selector: 'app-bulk-actions',
  templateUrl: './bulk-actions.component.html',
  styleUrls: ['./bulk-actions.component.css']
})
export class BulkActionsComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedType = 'all';
  selectedStatus = 'all';
  
  // Mock bulk actions
  bulkActions: BulkAction[] = [
    {
      id: 'BA-2025-001',
      type: 'mass_renewal',
      title: 'Q1 2025 Nurse License Renewals',
      description: 'Bulk renewal processing for all nurses with licenses expiring in Q1 2025',
      targetCriteria: {
        profession: 'Nurse',
        status: 'active',
        expiryDateRange: {
          start: new Date('2025-01-01'),
          end: new Date('2025-03-31')
        }
      },
      estimatedAffected: 2847,
      status: 'executing',
      createdBy: 'NMC Admin - Patricia Nakato',
      createdDate: new Date('2025-01-10'),
      approvedBy: 'Director - Dr. James Mukasa',
      approvedDate: new Date('2025-01-12'),
      executedDate: new Date('2025-01-15'),
      results: {
        processed: 1247,
        successful: 1198,
        failed: 49,
        errors: ['Payment verification failed for 23 practitioners', 'CPD requirements not met for 26 practitioners']
      }
    },
    {
      id: 'BA-2025-002',
      type: 'fee_waiver',
      title: 'Rural Healthcare Worker Fee Waiver',
      description: 'Emergency fee waiver for healthcare workers in underserved rural areas',
      targetCriteria: {
        region: 'Northern',
        status: 'active'
      },
      estimatedAffected: 456,
      status: 'pending_approval',
      createdBy: 'Policy Officer - Sarah Nambi',
      createdDate: new Date('2025-01-14'),
    },
    {
      id: 'BA-2025-003',
      type: 'cpd_reminder',
      title: 'CPD Deadline Reminder - Specialists',
      description: 'Automated reminder for medical specialists with CPD deadlines approaching in next 30 days',
      targetCriteria: {
        profession: 'Medical Doctor'
      },
      estimatedAffected: 1247,
      status: 'completed',
      createdBy: 'System Automation',
      createdDate: new Date('2025-01-01'),
      approvedBy: 'Auto-approved',
      approvedDate: new Date('2025-01-01'),
      executedDate: new Date('2025-01-01'),
      completedDate: new Date('2025-01-01'),
      results: {
        processed: 1247,
        successful: 1247,
        failed: 0,
        errors: []
      }
    }
  ];

  filteredActions: BulkAction[] = [];
  
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
    
    this.titleService.setTitle('Bulk Actions - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredActions = this.bulkActions.filter(action => {
      const matchesType = this.selectedType === 'all' || action.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || action.status === this.selectedStatus;
      
      return matchesType && matchesStatus;
    });
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  createBulkAction(): void {
    alert('Opening bulk action creation wizard...');
  }

  approveAction(id: string): void {
    const action = this.bulkActions.find(a => a.id === id);
    if (action) {
      action.status = 'approved';
      action.approvedBy = this.currentUser.name;
      action.approvedDate = new Date();
      this.applyFilters();
      alert(`Bulk action ${id} approved`);
    }
  }

  executeAction(id: string): void {
    const action = this.bulkActions.find(a => a.id === id);
    if (action) {
      action.status = 'executing';
      action.executedDate = new Date();
      this.applyFilters();
      alert(`Bulk action ${id} execution started`);
    }
  }

  viewResults(id: string): void {
    alert(`Viewing results for bulk action: ${id}`);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'executing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'mass_renewal': return 'ri-refresh-line';
      case 'fee_waiver': return 'ri-money-dollar-circle-line';
      case 'status_update': return 'ri-edit-line';
      case 'cpd_reminder': return 'ri-notification-line';
      case 'document_request': return 'ri-file-list-line';
      default: return 'ri-settings-line';
    }
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