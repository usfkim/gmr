import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface FacilityProfile {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health_center' | 'pharmacy' | 'laboratory' | 'imaging_center';
  licenseNumber: string;
  status: 'active' | 'suspended' | 'provisional' | 'revoked';
  region: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  bedCapacity?: number;
  serviceScope: string[];
  accreditationScore: number;
  lastInspection: Date;
  nextInspection: Date;
  complianceRate: number;
  staffCount: number;
  verifiedStaff: number;
  establishedDate: Date;
  operatingHours: {
    [day: string]: string;
  };
}

interface StaffAlert {
  id: string;
  type: 'expiry_warning' | 'license_suspended' | 'license_revoked' | 'cpd_deficient' | 'new_sanction';
  severity: 'critical' | 'high' | 'medium' | 'low';
  staffMember: {
    name: string;
    licenseNumber: string;
    position: string;
    department: string;
  };
  message: string;
  actionRequired: string;
  deadline?: Date;
  dateCreated: Date;
  acknowledged: boolean;
}

@Component({
  selector: 'app-facility-dashboard',
  templateUrl: './facility-dashboard.component.html',
  styleUrls: ['./facility-dashboard.component.css']
})
export class FacilityDashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  
  // Mock facility profile
  facility: FacilityProfile = {
    id: 'FAC-001',
    name: 'Mulago National Referral Hospital',
    type: 'hospital',
    licenseNumber: 'MoH-H-001',
    status: 'active',
    region: 'Central',
    district: 'Kampala',
    address: 'Mulago Hill, Kampala, Uganda',
    phone: '+256 414 530 692',
    email: 'info@mulago.go.ug',
    website: 'https://mulago.go.ug',
    bedCapacity: 1500,
    serviceScope: [
      'Emergency Care', 'Surgery', 'Cardiology', 'Oncology', 
      'Pediatrics', 'Maternity', 'ICU', 'Laboratory', 'Radiology'
    ],
    accreditationScore: 94.7,
    lastInspection: new Date('2024-11-15'),
    nextInspection: new Date('2025-05-15'),
    complianceRate: 96.2,
    staffCount: 2847,
    verifiedStaff: 2698,
    establishedDate: new Date('1962-01-01'),
    operatingHours: {
      'Monday': '24/7',
      'Tuesday': '24/7',
      'Wednesday': '24/7',
      'Thursday': '24/7',
      'Friday': '24/7',
      'Saturday': '24/7',
      'Sunday': '24/7'
    }
  };

  // Dashboard statistics
  dashboardStats = {
    totalStaff: this.facility.staffCount,
    verifiedStaff: this.facility.verifiedStaff,
    complianceRate: this.facility.complianceRate,
    expiringIn30Days: 47,
    expiringIn60Days: 89,
    expiringIn90Days: 156,
    suspendedStaff: 3,
    revokedStaff: 1,
    pendingApprovals: 12,
    monthlyVerifications: 234,
    accreditationScore: this.facility.accreditationScore,
    lastInspectionScore: 92.5,
    correctiveActionsOpen: 2,
    correctiveActionsCompleted: 8
  };

  // Recent staff alerts
  staffAlerts: StaffAlert[] = [
    {
      id: 'ALT-001',
      type: 'expiry_warning',
      severity: 'high',
      staffMember: {
        name: 'Dr. Sarah Nakato',
        licenseNumber: 'UMC-UG-3456',
        position: 'Senior Consultant',
        department: 'Cardiology'
      },
      message: 'Medical license expires in 15 days',
      actionRequired: 'Ensure renewal application is submitted immediately',
      deadline: new Date('2025-02-15'),
      dateCreated: new Date('2025-01-15T09:00:00'),
      acknowledged: false
    },
    {
      id: 'ALT-002',
      type: 'license_suspended',
      severity: 'critical',
      staffMember: {
        name: 'Nurse Patricia Nambi',
        licenseNumber: 'NMC-UG-7891',
        position: 'Registered Nurse',
        department: 'ICU'
      },
      message: 'License suspended due to CPD non-compliance',
      actionRequired: 'Remove from active duty immediately and arrange CPD completion',
      dateCreated: new Date('2025-01-14T14:30:00'),
      acknowledged: true
    },
    {
      id: 'ALT-003',
      type: 'cpd_deficient',
      severity: 'medium',
      staffMember: {
        name: 'Dr. James Okello',
        licenseNumber: 'UMC-UG-2789',
        position: 'Medical Officer',
        department: 'Emergency Medicine'
      },
      message: 'CPD credits below required threshold (35/60 credits)',
      actionRequired: 'Arrange additional CPD training within 60 days',
      deadline: new Date('2025-03-15'),
      dateCreated: new Date('2025-01-12T11:15:00'),
      acknowledged: false
    }
  ];

  // Recent activities
  recentActivities = [
    {
      id: 1,
      type: 'staff_verification',
      title: 'Staff Verification Completed',
      description: '247 staff members verified - 3 issues found',
      timestamp: new Date('2025-01-15T10:30:00'),
      user: 'HR Manager - Grace Atim',
      icon: 'ri-shield-check-line',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'new_staff',
      title: 'New Staff Member Added',
      description: 'Dr. Patricia Nakato - Pediatrician - Verification pending',
      timestamp: new Date('2025-01-14T15:20:00'),
      user: 'HR Officer - John Mukasa',
      icon: 'ri-user-add-line',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'inspection_scheduled',
      title: 'Inspection Scheduled',
      description: 'Quarterly compliance inspection - May 15, 2025',
      timestamp: new Date('2025-01-13T09:45:00'),
      user: 'Quality Assurance',
      icon: 'ri-calendar-line',
      iconColor: 'text-purple-600'
    },
    {
      id: 4,
      type: 'qr_poster_updated',
      title: 'QR Poster Updated',
      description: 'Lobby poster updated with latest verified staff list',
      timestamp: new Date('2025-01-12T16:00:00'),
      user: 'System Automation',
      icon: 'ri-qr-code-line',
      iconColor: 'text-indigo-600'
    }
  ];

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    this.titleService.setTitle('Facility Portal - Uganda Medical Registry');
  }

  getAlertSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getAlertTypeIcon(type: string): string {
    switch (type) {
      case 'expiry_warning': return 'ri-time-line';
      case 'license_suspended': return 'ri-pause-circle-line';
      case 'license_revoked': return 'ri-close-circle-line';
      case 'cpd_deficient': return 'ri-book-line';
      case 'new_sanction': return 'ri-shield-cross-line';
      default: return 'ri-alert-line';
    }
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.staffAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      window.alert(`Alert ${alertId} acknowledged`);
    }
  }

  resolveAlert(alertId: string): void {
    const alertIndex = this.staffAlerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.staffAlerts.splice(alertIndex, 1);
      window.alert(`Alert ${alertId} resolved and removed`);
    }
  }

  getUnacknowledgedAlertsCount(): number {
    return this.staffAlerts.filter(alert => !alert.acknowledged).length;
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}