import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface ComplianceMetric {
  category: string;
  current: number;
  target: number;
  percentage: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface ExpiryForecast {
  timeframe: '30_days' | '60_days' | '90_days' | '6_months' | '1_year';
  count: number;
  departments: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  professions: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

interface ComplianceGap {
  type: 'missing_license' | 'expired_license' | 'suspended_staff' | 'cpd_deficient' | 'missing_documents';
  severity: 'critical' | 'high' | 'medium' | 'low';
  count: number;
  affectedStaff: Array<{
    name: string;
    licenseNumber: string;
    department: string;
    issue: string;
    deadline?: Date;
  }>;
  recommendedActions: string[];
}

@Component({
  selector: 'app-compliance-dashboard',
  templateUrl: './compliance-dashboard.component.html',
  styleUrls: ['./compliance-dashboard.component.css']
})
export class ComplianceDashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedTimeframe = '30_days';
  
  // Mock compliance metrics
  complianceMetrics: ComplianceMetric[] = [
    {
      category: 'Staff Verification',
      current: 2698,
      target: 2847,
      percentage: 94.8,
      status: 'excellent',
      trend: 'up',
      trendValue: 2.3
    },
    {
      category: 'License Validity',
      current: 2651,
      target: 2847,
      percentage: 93.1,
      status: 'good',
      trend: 'stable',
      trendValue: 0.1
    },
    {
      category: 'CPD Compliance',
      current: 2234,
      target: 2847,
      percentage: 78.5,
      status: 'needs_improvement',
      trend: 'up',
      trendValue: 5.7
    },
    {
      category: 'Document Completeness',
      current: 2620,
      target: 2847,
      percentage: 92.0,
      status: 'good',
      trend: 'up',
      trendValue: 1.8
    },
    {
      category: 'Background Clearance',
      current: 2789,
      target: 2847,
      percentage: 98.0,
      status: 'excellent',
      trend: 'stable',
      trendValue: 0.3
    }
  ];

  // Mock expiry forecasts
  expiryForecasts: ExpiryForecast[] = [
    {
      timeframe: '30_days',
      count: 47,
      departments: [
        { name: 'Cardiology', count: 12, percentage: 25.5 },
        { name: 'Pediatrics', count: 8, percentage: 17.0 },
        { name: 'ICU', count: 7, percentage: 14.9 },
        { name: 'Emergency', count: 6, percentage: 12.8 },
        { name: 'Surgery', count: 5, percentage: 10.6 },
        { name: 'Other', count: 9, percentage: 19.1 }
      ],
      professions: [
        { name: 'Medical Doctor', count: 28, percentage: 59.6 },
        { name: 'Nurse', count: 12, percentage: 25.5 },
        { name: 'Pharmacist', count: 4, percentage: 8.5 },
        { name: 'Allied Health', count: 3, percentage: 6.4 }
      ]
    },
    {
      timeframe: '60_days',
      count: 89,
      departments: [
        { name: 'Nursing', count: 23, percentage: 25.8 },
        { name: 'Laboratory', count: 15, percentage: 16.9 },
        { name: 'Radiology', count: 12, percentage: 13.5 },
        { name: 'Pharmacy', count: 11, percentage: 12.4 },
        { name: 'Emergency', count: 10, percentage: 11.2 },
        { name: 'Other', count: 18, percentage: 20.2 }
      ],
      professions: [
        { name: 'Nurse', count: 45, percentage: 50.6 },
        { name: 'Medical Doctor', count: 25, percentage: 28.1 },
        { name: 'Allied Health', count: 12, percentage: 13.5 },
        { name: 'Pharmacist', count: 7, percentage: 7.9 }
      ]
    }
  ];

  // Mock compliance gaps
  complianceGaps: ComplianceGap[] = [
    {
      type: 'expired_license',
      severity: 'critical',
      count: 12,
      affectedStaff: [
        {
          name: 'Dr. John Mukasa',
          licenseNumber: 'UMC-UG-4521',
          department: 'Surgery',
          issue: 'License expired 15 days ago',
          deadline: new Date('2025-01-01')
        },
        {
          name: 'Nurse Patricia Nambi',
          licenseNumber: 'NMC-UG-7891',
          department: 'ICU',
          issue: 'License expired 8 days ago'
        }
      ],
      recommendedActions: [
        'Immediately suspend affected staff from patient care',
        'Initiate emergency license renewal process',
        'Arrange temporary coverage for affected positions',
        'Review renewal reminder procedures'
      ]
    },
    {
      type: 'cpd_deficient',
      severity: 'high',
      count: 156,
      affectedStaff: [
        {
          name: 'Dr. James Okello',
          licenseNumber: 'UMC-UG-2789',
          department: 'Emergency',
          issue: 'CPD credits: 35/60 (58% complete)',
          deadline: new Date('2025-03-15')
        }
      ],
      recommendedActions: [
        'Arrange CPD training sessions for affected staff',
        'Partner with training providers for bulk discounts',
        'Implement mandatory CPD tracking system',
        'Set up automated reminder system'
      ]
    },
    {
      type: 'missing_documents',
      severity: 'medium',
      count: 89,
      affectedStaff: [
        {
          name: 'Dr. Grace Atim',
          licenseNumber: 'UMC-UG-4892',
          department: 'Obstetrics',
          issue: 'Missing police clearance certificate',
          deadline: new Date('2025-02-28')
        }
      ],
      recommendedActions: [
        'Request missing documents from affected staff',
        'Set document submission deadlines',
        'Implement document verification checklist',
        'Regular document audit schedule'
      ]
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
    this.titleService.setTitle('Compliance Dashboard - Facility Portal');
  }

  onTimeframeChange(timeframe: string): void {
    this.selectedTimeframe = timeframe;
  }

  getSelectedForecast(): ExpiryForecast | undefined {
    return this.expiryForecasts.find(f => f.timeframe === this.selectedTimeframe);
  }

  getMetricStatusColor(status: string): string {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs_improvement': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getGapSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  exportComplianceReport(): void {
    alert('Generating comprehensive compliance report...');
  }

  generateActionPlan(gapType: string): void {
    alert(`Generating action plan for: ${gapType}`);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`;
  }

  getCriticalGaps() {
    return this.complianceGaps.filter(g => g.severity === 'critical');
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}