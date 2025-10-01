import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: {
    [module: string]: {
      read: boolean;
      write: boolean;
      delete: boolean;
      export: boolean;
    };
  };
  fieldLevelAccess: {
    [field: string]: 'full' | 'masked' | 'denied';
  };
  userCount: number;
  lastModified: Date;
  modifiedBy: string;
}

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

@Component({
  selector: 'app-access-controls',
  templateUrl: './access-controls.component.html',
  styleUrls: ['./access-controls.component.css']
})
export class AccessControlsComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedRole = 'all';
  
  // Mock user roles with field-level permissions
  userRoles: UserRole[] = [
    {
      id: 'ROLE-001',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: {
        practitioners: { read: true, write: true, delete: true, export: true },
        facilities: { read: true, write: true, delete: true, export: true },
        investigations: { read: true, write: true, delete: true, export: true },
        analytics: { read: true, write: true, delete: true, export: true },
        communications: { read: true, write: true, delete: true, export: true },
        governance: { read: true, write: true, delete: true, export: true }
      },
      fieldLevelAccess: {
        nationalId: 'full',
        personalData: 'full',
        medicalHistory: 'full',
        financialData: 'full',
        investigationNotes: 'full'
      },
      userCount: 3,
      lastModified: new Date('2024-12-15'),
      modifiedBy: 'System Administrator'
    },
    {
      id: 'ROLE-002',
      name: 'Council Admin',
      description: 'Administrative access for regulatory council operations',
      permissions: {
        practitioners: { read: true, write: true, delete: false, export: true },
        facilities: { read: true, write: true, delete: false, export: true },
        investigations: { read: true, write: true, delete: false, export: false },
        analytics: { read: true, write: false, delete: false, export: true },
        communications: { read: true, write: true, delete: false, export: false },
        governance: { read: true, write: false, delete: false, export: false }
      },
      fieldLevelAccess: {
        nationalId: 'masked',
        personalData: 'full',
        medicalHistory: 'full',
        financialData: 'masked',
        investigationNotes: 'full'
      },
      userCount: 12,
      lastModified: new Date('2024-11-20'),
      modifiedBy: 'Super Admin - Dr. Sarah Kiggundu'
    },
    {
      id: 'ROLE-003',
      name: 'Inspector',
      description: 'Field inspection and investigation access',
      permissions: {
        practitioners: { read: true, write: true, delete: false, export: false },
        facilities: { read: true, write: true, delete: false, export: false },
        investigations: { read: true, write: true, delete: false, export: false },
        analytics: { read: true, write: false, delete: false, export: false },
        communications: { read: false, write: false, delete: false, export: false },
        governance: { read: false, write: false, delete: false, export: false }
      },
      fieldLevelAccess: {
        nationalId: 'masked',
        personalData: 'full',
        medicalHistory: 'full',
        financialData: 'denied',
        investigationNotes: 'full'
      },
      userCount: 8,
      lastModified: new Date('2024-10-10'),
      modifiedBy: 'Council Admin - Dr. James Mukasa'
    },
    {
      id: 'ROLE-004',
      name: 'Analyst',
      description: 'Read-only access for data analysis and reporting',
      permissions: {
        practitioners: { read: true, write: false, delete: false, export: true },
        facilities: { read: true, write: false, delete: false, export: true },
        investigations: { read: true, write: false, delete: false, export: true },
        analytics: { read: true, write: false, delete: false, export: true },
        communications: { read: true, write: false, delete: false, export: false },
        governance: { read: true, write: false, delete: false, export: false }
      },
      fieldLevelAccess: {
        nationalId: 'denied',
        personalData: 'masked',
        medicalHistory: 'masked',
        financialData: 'denied',
        investigationNotes: 'masked'
      },
      userCount: 15,
      lastModified: new Date('2024-09-05'),
      modifiedBy: 'Council Admin - Patricia Nakato'
    }
  ];

  // Mock access logs
  recentAccessLogs: AccessLog[] = [
    {
      id: 'LOG-001',
      userId: 'USR-001',
      userName: 'Dr. Sarah Kiggundu',
      action: 'VIEW_PRACTITIONER_DETAILS',
      resource: 'Practitioner: UMC-UG-2458',
      timestamp: new Date('2025-01-15T14:30:00'),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      success: true
    },
    {
      id: 'LOG-002',
      userId: 'USR-002',
      userName: 'Inspector David Kiggundu',
      action: 'SUSPEND_LICENSE',
      resource: 'License: UMC-UG-4521',
      timestamp: new Date('2025-01-15T11:45:00'),
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      success: true,
      details: 'Reason: Failure to complete CPD requirements'
    },
    {
      id: 'LOG-003',
      userId: 'USR-003',
      userName: 'Analyst Patricia Nakato',
      action: 'EXPORT_PRACTITIONER_DATA',
      resource: 'Practitioners: Central Region',
      timestamp: new Date('2025-01-15T09:15:00'),
      ipAddress: '172.16.0.25',
      userAgent: 'Mozilla/5.0 (Ubuntu; Linux x86_64) AppleWebKit/537.36',
      success: true,
      details: 'Export format: CSV, Records: 2,847'
    },
    {
      id: 'LOG-004',
      userId: 'USR-004',
      userName: 'Unknown User',
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      resource: 'Investigation Case: INV-2025-001',
      timestamp: new Date('2025-01-15T08:30:00'),
      ipAddress: '203.0.113.45',
      userAgent: 'curl/7.68.0',
      success: false,
      details: 'Access denied: Insufficient permissions'
    }
  ];

  filteredRoles: UserRole[] = [];
  
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
    
    this.titleService.setTitle('Access Controls - Data Governance');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRoles = this.userRoles.filter(role => {
      return this.selectedRole === 'all' || role.id === this.selectedRole;
    });
  }

  onRoleChange(role: string): void {
    this.selectedRole = role;
    this.applyFilters();
  }

  createRole(): void {
    alert('Opening role creation wizard...');
  }

  editRole(id: string): void {
    alert(`Editing role: ${id}`);
  }

  cloneRole(id: string): void {
    alert(`Cloning role: ${id}`);
  }

  getPermissionIcon(hasPermission: boolean): string {
    return hasPermission ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600';
  }

  getAccessLevelColor(level: string): string {
    switch (level) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'masked': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getLogStatusColor(success: boolean): string {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  getModuleEntries(permissions: any) {
    return Object.entries(permissions).map(([key, value]) => ({ key, value }));
  }

  getFieldEntries(fieldAccess: any) {
    return Object.entries(fieldAccess).map(([key, value]) => ({ key, value }));
  }

  getModulePermissions(module: any): { read: boolean; write: boolean; delete: boolean; export: boolean } {
    return module.value as { read: boolean; write: boolean; delete: boolean; export: boolean };
  }

  getFieldValue(field: any): string {
    return field.value as string;
  }

  formatFieldName(fieldName: string): string {
    return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}