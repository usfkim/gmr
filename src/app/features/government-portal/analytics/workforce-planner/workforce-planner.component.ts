import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface WorkforceProjection {
  specialty: string;
  region: string;
  currentCount: number;
  retirementForecast: {
    next12Months: number;
    next24Months: number;
    next60Months: number;
  };
  migrationRisk: {
    outboundRisk: number; // percentage
    inboundPotential: number;
    netProjection: number;
  };
  trainingPipeline: {
    currentStudents: number;
    graduatingNext12Months: number;
    graduatingNext24Months: number;
  };
  projectedNeed: {
    next12Months: number;
    next24Months: number;
    next60Months: number;
  };
  gapAnalysis: {
    currentGap: number;
    projectedGap12Months: number;
    projectedGap24Months: number;
    projectedGap60Months: number;
  };
  recommendations: string[];
}

@Component({
  selector: 'app-workforce-planner',
  templateUrl: './workforce-planner.component.html',
  styleUrls: ['./workforce-planner.component.css']
})
export class WorkforcePlannerComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedSpecialty = 'all';
  selectedRegion = 'all';
  selectedTimeframe = '12'; // months
  
  // Mock workforce projection data
  workforceProjections: WorkforceProjection[] = [
    {
      specialty: 'Cardiology',
      region: 'Central',
      currentCount: 45,
      retirementForecast: {
        next12Months: 8,
        next24Months: 15,
        next60Months: 28
      },
      migrationRisk: {
        outboundRisk: 25.5,
        inboundPotential: 12.3,
        netProjection: -13.2
      },
      trainingPipeline: {
        currentStudents: 24,
        graduatingNext12Months: 6,
        graduatingNext24Months: 12
      },
      projectedNeed: {
        next12Months: 52,
        next24Months: 58,
        next60Months: 67
      },
      gapAnalysis: {
        currentGap: -7,
        projectedGap12Months: -9,
        projectedGap24Months: -19,
        projectedGap60Months: -27
      },
      recommendations: [
        'Increase cardiology fellowship positions by 40%',
        'Implement retention incentives for senior cardiologists',
        'Establish rural cardiology outreach programs',
        'Partner with international institutions for training exchange'
      ]
    },
    {
      specialty: 'Anesthesiology',
      region: 'Northern',
      currentCount: 12,
      retirementForecast: {
        next12Months: 3,
        next24Months: 5,
        next60Months: 8
      },
      migrationRisk: {
        outboundRisk: 35.8,
        inboundPotential: 8.2,
        netProjection: -27.6
      },
      trainingPipeline: {
        currentStudents: 8,
        graduatingNext12Months: 2,
        graduatingNext24Months: 4
      },
      projectedNeed: {
        next12Months: 18,
        next24Months: 22,
        next60Months: 28
      },
      gapAnalysis: {
        currentGap: -6,
        projectedGap12Months: -9,
        projectedGap24Months: -18,
        projectedGap60Months: -24
      },
      recommendations: [
        'Critical shortage - immediate intervention required',
        'Fast-track anesthesiology training programs',
        'Offer significant financial incentives for northern postings',
        'Establish telemedicine support networks'
      ]
    },
    {
      specialty: 'Emergency Medicine',
      region: 'Eastern',
      currentCount: 28,
      retirementForecast: {
        next12Months: 4,
        next24Months: 8,
        next60Months: 15
      },
      migrationRisk: {
        outboundRisk: 18.7,
        inboundPotential: 15.4,
        netProjection: -3.3
      },
      trainingPipeline: {
        currentStudents: 18,
        graduatingNext12Months: 5,
        graduatingNext24Months: 9
      },
      projectedNeed: {
        next12Months: 35,
        next24Months: 42,
        next60Months: 48
      },
      gapAnalysis: {
        currentGap: -7,
        projectedGap12Months: -6,
        projectedGap24Months: -9,
        projectedGap60Months: -20
      },
      recommendations: [
        'Expand emergency medicine residency programs',
        'Improve working conditions in emergency departments',
        'Implement trauma care specialization tracks',
        'Strengthen referral networks with tertiary centers'
      ]
    }
  ];

  filteredProjections: WorkforceProjection[] = [];
  
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
    
    this.titleService.setTitle('Workforce Planner - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProjections = this.workforceProjections.filter(projection => {
      const matchesSpecialty = this.selectedSpecialty === 'all' || projection.specialty === this.selectedSpecialty;
      const matchesRegion = this.selectedRegion === 'all' || projection.region === this.selectedRegion;
      
      return matchesSpecialty && matchesRegion;
    });
  }

  onSpecialtyChange(specialty: string): void {
    this.selectedSpecialty = specialty;
    this.applyFilters();
  }

  onRegionChange(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
  }

  onTimeframeChange(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    // In production, this would update projections based on timeframe
  }

  getGapColor(gap: number): string {
    if (gap >= 0) return 'text-green-600';
    if (gap >= -10) return 'text-yellow-600';
    return 'text-red-600';
  }

  getRiskColor(risk: number): string {
    if (risk <= 15) return 'text-green-600';
    if (risk <= 30) return 'text-yellow-600';
    return 'text-red-600';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`;
  }

  exportProjections(): void {
    console.log('Exporting workforce projections...');
    alert('Exporting workforce projection data...');
  }

  generateReport(): void {
    console.log('Generating workforce planning report...');
    alert('Generating comprehensive workforce planning report...');
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}