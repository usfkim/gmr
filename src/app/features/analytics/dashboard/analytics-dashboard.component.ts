import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface AnalyticsOverview {
  totalPractitioners: number;
  workforceDensity: number; // per 10k population
  trainingPipelineHealth: number; // percentage
  attritionRate: number; // percentage
  fraudCases: number;
  complianceRate: number; // percentage
  accessGaps: number; // regions without specialists
  monthlyRevenue: number; // UGX
}

interface QuickMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedTimeframe = '30'; // days
  
  // Analytics overview data
  analyticsOverview: AnalyticsOverview = {
    totalPractitioners: 28547,
    workforceDensity: 12.4,
    trainingPipelineHealth: 78.5,
    attritionRate: 8.2,
    fraudCases: 23,
    complianceRate: 85.7,
    accessGaps: 12,
    monthlyRevenue: 2450000000 // UGX
  };

  // Quick metrics for dashboard cards
  quickMetrics: QuickMetric[] = [
    {
      title: 'Workforce Density',
      value: '12.4/10k',
      change: 2.3,
      trend: 'up',
      icon: 'ri-team-line',
      color: 'blue',
      route: '/analytics/workforce-density'
    },
    {
      title: 'Training Pipeline',
      value: '78.5%',
      change: -1.2,
      trend: 'down',
      icon: 'ri-graduation-cap-line',
      color: 'green',
      route: '/analytics/training-pipeline'
    },
    {
      title: 'Attrition Rate',
      value: '8.2%',
      change: 0.8,
      trend: 'up',
      icon: 'ri-flight-takeoff-line',
      color: 'orange',
      route: '/analytics/attrition-migration'
    },
    {
      title: 'Fraud Cases',
      value: '23',
      change: -5.0,
      trend: 'down',
      icon: 'ri-shield-cross-line',
      color: 'red',
      route: '/analytics/fraud-heatmap'
    },
    {
      title: 'Compliance Rate',
      value: '85.7%',
      change: 3.1,
      trend: 'up',
      icon: 'ri-check-double-line',
      color: 'purple',
      route: '/analytics/compliance-curves'
    },
    {
      title: 'Access Gaps',
      value: '12 regions',
      change: -2.0,
      trend: 'down',
      icon: 'ri-map-pin-line',
      color: 'indigo',
      route: '/analytics/access-gaps'
    },
    {
      title: 'Monthly Revenue',
      value: 'UGX 2.45B',
      change: 12.5,
      trend: 'up',
      icon: 'ri-money-dollar-circle-line',
      color: 'emerald',
      route: '/analytics/revenue-dashboard'
    }
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
      alert('Access denied. Analytics portal is restricted to government officials and regulators.');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    this.titleService.setTitle('Analytics Dashboard - Uganda Medical Registry');
  }

  onTimeframeChange(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    // In production, this would refresh analytics data
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'ri-arrow-up-line text-green-600';
      case 'down': return 'ri-arrow-down-line text-red-600';
      case 'stable': return 'ri-subtract-line text-gray-600';
      default: return 'ri-subtract-line text-gray-600';
    }
  }

  getCardColor(color: string): string {
    const colors: { [key: string]: string } = {
      'blue': 'border-blue-500',
      'green': 'border-green-500',
      'orange': 'border-orange-500',
      'red': 'border-red-500',
      'purple': 'border-purple-500',
      'indigo': 'border-indigo-500',
      'emerald': 'border-emerald-500'
    };
    return colors[color] || 'border-gray-500';
  }

  getIconColor(color: string): string {
    const colors: { [key: string]: string } = {
      'blue': 'text-blue-600',
      'green': 'text-green-600',
      'orange': 'text-orange-600',
      'red': 'text-red-600',
      'purple': 'text-purple-600',
      'indigo': 'text-indigo-600',
      'emerald': 'text-emerald-600'
    };
    return colors[color] || 'text-gray-600';
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

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}