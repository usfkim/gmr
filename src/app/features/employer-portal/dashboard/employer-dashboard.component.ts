import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface OrganizationProfile {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'ngo' | 'insurer' | 'telemedicine' | 'pharmacy' | 'laboratory';
  licenseNumber: string;
  region: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  bedCapacity?: number;
  staffCount: number;
  verifiedStaff: number;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
  subscriptionExpiry: Date;
  lastVerification: Date;
  complianceScore: number;
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
  selector: 'app-employer-dashboard',
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.css']
})
export class EmployerDashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  
  // Mock organization profile
  organization: OrganizationProfile = {
    id: 'ORG-001',
    name: 'Mulago National Referral Hospital',
    type: 'hospital',
    licenseNumber: 'MoH-H-001',
    region: 'Central',
    district: 'Kampala',
    address: 'Mulago Hill, Kampala, Uganda',
    phone: '+256 414 530 692',
    email: 'hr@mulago.go.ug',
    website: 'https://mulago.go.ug',
    bedCapacity: 1500,
    staffCount: 2847,
    verifiedStaff: 2698,
    subscriptionTier: 'enterprise',
    subscriptionExpiry: new Date('2025-12-31'),
    lastVerification: new Date('2024-12-22'),
    complianceScore: 94.7
  };

  // Dashboard statistics
  dashboardStats = {
    totalStaff: this.organization.staffCount,
    verifiedStaff: this.organization.verifiedStaff,
    complianceRate: (this.organization.verifiedStaff / this.organization.staffCount) * 100,
    expiringIn30Days: 47,
    expiringIn60Days: 89,
    expiringIn90Days: 156,
    suspendedStaff: 3,
    revokedStaff: 1,
    pendingVerifications: 12,
    monthlyVerifications: 234,
    apiCallsThisMonth: 15678,
    apiCallsRemaining: 34322
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
    },
    {
      id: 'ALT-004',
      type: 'new_sanction',
      severity: 'high',
      staffMember: {
        name: 'Dr. Michael Ssebunya',
        licenseNumber: 'UMC-UG-4567',
        position: 'Consultant Surgeon',
        department: 'Surgery'
      },
      message: 'Professional misconduct investigation initiated',
      actionRequired: 'Review employment status and consider temporary suspension',
      dateCreated: new Date('2025-01-10T16:45:00'),
      acknowledged: false
    }
  ];

  // Recent verification activities
  recentActivities = [
    {
      id: 1,
      type: 'bulk_verification',
      title: 'Bulk Staff Verification Completed',
      description: '247 staff members verified - 3 issues found',
      timestamp: new Date('2025-01-15T10:30:00'),
      user: 'HR Manager - Grace Atim',
      icon: 'ri-shield-check-line',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'new_hire',
      title: 'New Hire Verification',
      description: 'Dr. Patricia Nakato - Pediatrician - Verification passed',
      timestamp: new Date('2025-01-14T15:20:00'),
      user: 'HR Officer - John Mukasa',
      icon: 'ri-user-add-line',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'alert_resolved',
      title: 'License Alert Resolved',
      description: 'Nurse Richard Akandwanaho - License renewed successfully',
      timestamp: new Date('2025-01-13T09:45:00'),
      user: 'System Automation',
      icon: 'ri-check-line',
      iconColor: 'text-green-600'
    },
    {
      id: 4,
      type: 'compliance_report',
      title: 'Monthly Compliance Report Generated',
      description: 'December 2024 compliance report - 94.7% compliance rate',
      timestamp: new Date('2025-01-12T08:00:00'),
      user: 'System Automation',
      icon: 'ri-file-chart-line',
      iconColor: 'text-purple-600'
    }
  ];

  // Subscription usage data
  subscriptionUsage = {
    plan: this.organization.subscriptionTier,
    monthlyLimit: this.getMonthlyLimit(),
    used: this.dashboardStats.apiCallsThisMonth,
    remaining: this.getMonthlyLimit() - this.dashboardStats.apiCallsThisMonth,
    percentageUsed: (this.dashboardStats.apiCallsThisMonth / this.getMonthlyLimit()) * 100,
    billingCycle: 'Monthly',
    nextBillingDate: new Date('2025-02-01'),
    currentMonthCost: this.getCurrentMonthCost()
  };

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
    this.titleService.setTitle('Employer Portal - Uganda Medical Registry');
  }

  getMonthlyLimit(): number {
    switch (this.organization.subscriptionTier) {
      case 'basic': return 1000;
      case 'professional': return 10000;
      case 'enterprise': return 50000;
      default: return 1000;
    }
  }

  getCurrentMonthCost(): number {
    switch (this.organization.subscriptionTier) {
      case 'basic': return 150000; // UGX
      case 'professional': return 750000; // UGX
      case 'enterprise': return 2500000; // UGX
      default: return 150000;
    }
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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