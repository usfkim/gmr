import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface PractitionerStats {
  total: number;
  active: number;
  suspended: number;
  revoked: number;
  expired: number;
  provisional: number;
}

interface ProfessionBreakdown {
  profession: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface RegionData {
  region: string;
  district: string;
  practitioners: number;
  population: number;
  ratio: number; // per 10k population
  shortage: boolean;
}

interface FraudAlert {
  id: string;
  type: 'duplicate_id' | 'forged_document' | 'suspicious_cluster' | 'invalid_credentials';
  severity: 'high' | 'medium' | 'low';
  description: string;
  practitioner: string;
  licenseNumber: string;
  dateDetected: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
}

interface ComplianceMetrics {
  cpdCompliance: number;
  renewalOnTime: number;
  documentationComplete: number;
  facilityAccreditation: number;
}

interface WorkforceGap {
  specialty: string;
  region: string;
  currentCount: number;
  requiredCount: number;
  shortagePercentage: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  prediction6Months: number;
  prediction12Months: number;
}

@Component({
  selector: 'app-executive-dashboard',
  templateUrl: './executive-dashboard.component.html',
  styleUrls: ['./executive-dashboard.component.css']
})
export class ExecutiveDashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedTimeframe = '30'; // days
  selectedRegion = 'all';
  
  // Mock data - in production, this would come from backend APIs
  practitionerStats: PractitionerStats = {
    total: 28547,
    active: 24892,
    suspended: 156,
    revoked: 89,
    expired: 3410,
    provisional: 1247
  };

  professionBreakdown: ProfessionBreakdown[] = [
    { profession: 'Medical Doctors', count: 8547, percentage: 29.9, trend: 'up', trendValue: 5.2 },
    { profession: 'Nurses', count: 12456, percentage: 43.6, trend: 'up', trendValue: 3.8 },
    { profession: 'Midwives', count: 2847, percentage: 10.0, trend: 'stable', trendValue: 0.2 },
    { profession: 'Pharmacists', count: 1456, percentage: 5.1, trend: 'up', trendValue: 7.1 },
    { profession: 'Dentists', count: 892, percentage: 3.1, trend: 'down', trendValue: -2.1 },
    { profession: 'Physiotherapists', count: 654, percentage: 2.3, trend: 'up', trendValue: 12.5 },
    { profession: 'Lab Scientists', count: 578, percentage: 2.0, trend: 'up', trendValue: 8.9 },
    { profession: 'Radiographers', count: 445, percentage: 1.6, trend: 'stable', trendValue: 1.2 },
    { profession: 'Traditional Medicine', count: 387, percentage: 1.4, trend: 'up', trendValue: 15.7 },
    { profession: 'Psychologists', count: 285, percentage: 1.0, trend: 'up', trendValue: 9.8 }
  ];

  regionData: RegionData[] = [
    { region: 'Central', district: 'Kampala', practitioners: 8547, population: 1650000, ratio: 51.8, shortage: false },
    { region: 'Central', district: 'Wakiso', practitioners: 2156, population: 2007700, ratio: 10.7, shortage: true },
    { region: 'Central', district: 'Mukono', practitioners: 1247, population: 596804, ratio: 20.9, shortage: false },
    { region: 'Western', district: 'Mbarara', practitioners: 1854, population: 472625, ratio: 39.2, shortage: false },
    { region: 'Eastern', district: 'Jinja', practitioners: 987, population: 471242, ratio: 20.9, shortage: true },
    { region: 'Northern', district: 'Gulu', practitioners: 654, population: 194013, ratio: 33.7, shortage: false },
    { region: 'Eastern', district: 'Mbale', practitioners: 578, population: 488900, ratio: 11.8, shortage: true },
    { region: 'Western', district: 'Fort Portal', practitioners: 445, population: 54375, ratio: 81.8, shortage: false },
    { region: 'Northern', district: 'Lira', practitioners: 387, population: 119323, ratio: 32.4, shortage: false },
    { region: 'Eastern', district: 'Soroti', practitioners: 298, population: 40360, ratio: 73.8, shortage: false }
  ];

  fraudAlerts: FraudAlert[] = [
    {
      id: 'FA-2025-001',
      type: 'duplicate_id',
      severity: 'high',
      description: 'Same national ID used for multiple practitioner registrations',
      practitioner: 'Dr. John Mukasa',
      licenseNumber: 'UMC-UG-4521',
      dateDetected: new Date('2025-01-15'),
      status: 'investigating',
      assignedTo: 'Inspector Sarah Nambi'
    },
    {
      id: 'FA-2025-002',
      type: 'forged_document',
      severity: 'high',
      description: 'Suspected forged medical degree certificate from unrecognized institution',
      practitioner: 'Dr. Michael Okello',
      licenseNumber: 'UMC-UG-4789',
      dateDetected: new Date('2025-01-12'),
      status: 'pending',
      assignedTo: 'Inspector David Kiggundu'
    },
    {
      id: 'FA-2025-003',
      type: 'suspicious_cluster',
      severity: 'medium',
      description: 'Multiple practitioners registered with same address and phone number',
      practitioner: 'Multiple (5 practitioners)',
      licenseNumber: 'Various',
      dateDetected: new Date('2025-01-10'),
      status: 'investigating'
    },
    {
      id: 'FA-2025-004',
      type: 'invalid_credentials',
      severity: 'medium',
      description: 'Medical degree from institution not recognized by Uganda Medical Council',
      practitioner: 'Dr. Grace Atim',
      licenseNumber: 'UMC-UG-4892',
      dateDetected: new Date('2025-01-08'),
      status: 'resolved'
    }
  ];

  complianceMetrics: ComplianceMetrics = {
    cpdCompliance: 78.5,
    renewalOnTime: 85.2,
    documentationComplete: 92.1,
    facilityAccreditation: 67.8
  };

  workforceGaps: WorkforceGap[] = [
    {
      specialty: 'Cardiology',
      region: 'Northern',
      currentCount: 12,
      requiredCount: 35,
      shortagePercentage: 65.7,
      urgency: 'critical',
      prediction6Months: 14,
      prediction12Months: 18
    },
    {
      specialty: 'Pediatrics',
      region: 'Eastern',
      currentCount: 45,
      requiredCount: 78,
      shortagePercentage: 42.3,
      urgency: 'high',
      prediction6Months: 48,
      prediction12Months: 55
    },
    {
      specialty: 'Anesthesiology',
      region: 'Western',
      currentCount: 28,
      requiredCount: 42,
      shortagePercentage: 33.3,
      urgency: 'high',
      prediction6Months: 30,
      prediction12Months: 35
    },
    {
      specialty: 'Psychiatry',
      region: 'Central',
      currentCount: 67,
      requiredCount: 89,
      shortagePercentage: 24.7,
      urgency: 'medium',
      prediction6Months: 70,
      prediction12Months: 75
    }
  ];

  // Recent activity data
  recentActivities = [
    {
      id: 1,
      type: 'new_registration',
      title: 'New Medical Doctor Registered',
      description: 'Dr. Patricia Nakato - Pediatrician - Mulago Hospital',
      timestamp: new Date('2025-01-15T14:30:00'),
      user: 'MDC Admin',
      icon: 'ri-user-add-line',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'license_suspension',
      title: 'License Suspended',
      description: 'Dr. James Okello - Failure to complete CPD requirements',
      timestamp: new Date('2025-01-15T11:45:00'),
      user: 'MDC Inspector',
      icon: 'ri-pause-circle-line',
      iconColor: 'text-red-600'
    },
    {
      id: 3,
      type: 'fraud_investigation',
      title: 'Fraud Investigation Initiated',
      description: 'Suspected forged credentials - Case FA-2025-002',
      timestamp: new Date('2025-01-15T09:15:00'),
      user: 'System Alert',
      icon: 'ri-shield-cross-line',
      iconColor: 'text-orange-600'
    },
    {
      id: 4,
      type: 'bulk_renewal',
      title: 'Bulk License Renewals Processed',
      description: '247 nurses renewed licenses - Kampala region',
      timestamp: new Date('2025-01-14T16:20:00'),
      user: 'NMC Admin',
      icon: 'ri-refresh-line',
      iconColor: 'text-blue-600'
    },
    {
      id: 5,
      type: 'facility_accreditation',
      title: 'New Facility Accredited',
      description: 'Mbarara Regional Referral Hospital - Full accreditation',
      timestamp: new Date('2025-01-14T13:10:00'),
      user: 'MoH Inspector',
      icon: 'ri-hospital-line',
      iconColor: 'text-purple-600'
    }
  ];

  // API usage statistics
  apiUsageStats = {
    totalRequests: 156789,
    successRate: 98.7,
    averageResponseTime: 245, // milliseconds
    topConsumers: [
      { name: 'Ministry of Health', requests: 45678, percentage: 29.1 },
      { name: 'Mulago Hospital', requests: 23456, percentage: 15.0 },
      { name: 'Uganda Embassy - UK', requests: 12789, percentage: 8.2 },
      { name: 'Private Hospitals Network', requests: 9876, percentage: 6.3 },
      { name: 'Insurance Companies', requests: 8765, percentage: 5.6 }
    ],
    monthlyTrend: [
      { month: 'Jul', requests: 142000 },
      { month: 'Aug', requests: 138000 },
      { month: 'Sep', requests: 145000 },
      { month: 'Oct', requests: 152000 },
      { month: 'Nov', requests: 148000 },
      { month: 'Dec', requests: 156789 }
    ]
  };

  // Cross-border mobility data
  crossBorderData = {
    inboundRequests: 1247,
    outboundRequests: 2156,
    recognitionsGranted: 987,
    pendingApplications: 234,
    topDestinations: [
      { country: 'Kenya', requests: 456, recognitions: 398 },
      { country: 'Tanzania', requests: 387, recognitions: 342 },
      { country: 'Rwanda', requests: 298, recognitions: 267 },
      { country: 'South Sudan', requests: 234, recognitions: 189 },
      { country: 'United Kingdom', requests: 189, recognitions: 156 }
    ],
    topOrigins: [
      { country: 'Kenya', requests: 298, recognitions: 245 },
      { country: 'India', requests: 234, recognitions: 198 },
      { country: 'South Africa', requests: 189, recognitions: 167 },
      { country: 'Nigeria', requests: 156, recognitions: 134 },
      { country: 'Ghana', requests: 123, recognitions: 98 }
    ]
  };

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if user is logged in and has admin privileges
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    
    // Check if user has admin role
    if (this.currentUser.role !== 'admin') {
      alert('Access denied. This portal is restricted to government officials and regulators.');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    this.titleService.setTitle('Government Portal - Uganda Medical Registry');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'suspended': return 'text-orange-600';
      case 'revoked': return 'text-red-600';
      case 'expired': return 'text-gray-600';
      case 'provisional': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'ri-arrow-up-line text-green-600';
      case 'down': return 'ri-arrow-down-line text-red-600';
      case 'stable': return 'ri-subtract-line text-gray-600';
      default: return 'ri-subtract-line text-gray-600';
    }
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`;
  }

  onTimeframeChange(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    // In production, this would trigger API calls to refresh data
    console.log('Timeframe changed to:', timeframe);
  }

  onRegionChange(region: string): void {
    this.selectedRegion = region;
    // In production, this would filter data by region
    console.log('Region changed to:', region);
  }

  exportData(type: string): void {
    // In production, this would generate and download reports
    console.log('Exporting data:', type);
    alert(`Exporting ${type} data...`);
  }

  investigateAlert(alertId: string): void {
    // In production, this would open investigation workflow
    console.log('Investigating alert:', alertId);
    alert(`Opening investigation for alert ${alertId}`);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  // Helper methods for template
  getPendingAlertsCount(): number {
    return this.fraudAlerts.filter(alert => alert.status === 'pending').length;
  }

  getTopConsumers() {
    return this.apiUsageStats.topConsumers.slice(0, 3);
  }

  getTopDestinations() {
    return this.crossBorderData.topDestinations.slice(0, 3);
  }
}