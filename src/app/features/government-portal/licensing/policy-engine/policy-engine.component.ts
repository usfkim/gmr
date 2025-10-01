import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface PolicyRule {
  id: string;
  name: string;
  category: 'fees' | 'grace_periods' | 'cpd_thresholds' | 'renewal_requirements' | 'sanctions';
  profession: string;
  description: string;
  parameters: {
    [key: string]: any;
  };
  status: 'active' | 'draft' | 'archived';
  effectiveDate: Date;
  expiryDate?: Date;
  createdBy: string;
  lastModified: Date;
  version: number;
}

@Component({
  selector: 'app-policy-engine',
  templateUrl: './policy-engine.component.html',
  styleUrls: ['./policy-engine.component.css']
})
export class PolicyEngineComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedCategory = 'all';
  selectedProfession = 'all';
  
  // Mock policy rules
  policyRules: PolicyRule[] = [
    {
      id: 'POL-001',
      name: 'Medical Doctor Annual License Fee',
      category: 'fees',
      profession: 'Medical Doctor',
      description: 'Annual licensing fee structure for medical doctors based on practice type and experience',
      parameters: {
        baseFee: 450000, // UGX
        specialistSurcharge: 200000,
        ruralDiscount: 0.2,
        newGraduateDiscount: 0.5,
        currency: 'UGX'
      },
      status: 'active',
      effectiveDate: new Date('2024-01-01'),
      createdBy: 'Policy Admin - Dr. Sarah Kiggundu',
      lastModified: new Date('2024-12-15'),
      version: 3
    },
    {
      id: 'POL-002',
      name: 'CPD Credit Requirements - Specialists',
      category: 'cpd_thresholds',
      profession: 'Medical Doctor',
      description: 'Continuing Professional Development credit requirements for medical specialists',
      parameters: {
        minimumCredits: 60,
        clinicalSkillsMin: 25,
        researchPublicationMin: 10,
        teachingTrainingMin: 15,
        professionalDevelopmentMin: 10,
        validityPeriod: 12 // months
      },
      status: 'active',
      effectiveDate: new Date('2024-01-01'),
      createdBy: 'MDC Policy Committee',
      lastModified: new Date('2024-06-20'),
      version: 2
    },
    {
      id: 'POL-003',
      name: 'License Renewal Grace Period',
      category: 'grace_periods',
      profession: 'All Professions',
      description: 'Grace period and late fee structure for license renewals',
      parameters: {
        gracePeriodDays: 30,
        lateFeePercentage: 0.25,
        maximumLateFee: 200000,
        suspensionAfterDays: 90,
        revocationAfterDays: 365
      },
      status: 'active',
      effectiveDate: new Date('2023-01-01'),
      createdBy: 'Regulatory Committee',
      lastModified: new Date('2024-03-10'),
      version: 4
    },
    {
      id: 'POL-004',
      name: 'Emergency Fee Waiver - COVID-19',
      category: 'fees',
      profession: 'All Professions',
      description: 'Emergency fee waiver policy for healthcare workers during national health emergencies',
      parameters: {
        waiverPercentage: 1.0, // 100% waiver
        eligibilityCriteria: ['frontline_worker', 'public_facility', 'rural_posting'],
        emergencyDeclarationRequired: true,
        maximumDuration: 12 // months
      },
      status: 'archived',
      effectiveDate: new Date('2020-03-15'),
      expiryDate: new Date('2022-12-31'),
      createdBy: 'Emergency Response Committee',
      lastModified: new Date('2022-12-31'),
      version: 1
    },
    {
      id: 'POL-005',
      name: 'Nurse CPD Requirements',
      category: 'cpd_thresholds',
      profession: 'Nurse',
      description: 'Continuing education requirements for registered nurses and nurse specialists',
      parameters: {
        minimumCredits: 30,
        clinicalPracticeMin: 15,
        professionalDevelopmentMin: 10,
        leadershipTrainingMin: 5,
        validityPeriod: 12 // months
      },
      status: 'active',
      effectiveDate: new Date('2024-01-01'),
      createdBy: 'NMC Policy Board',
      lastModified: new Date('2024-08-15'),
      version: 1
    }
  ];

  filteredRules: PolicyRule[] = [];
  
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
    
    this.titleService.setTitle('Policy Rules Engine - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRules = this.policyRules.filter(rule => {
      const matchesCategory = this.selectedCategory === 'all' || rule.category === this.selectedCategory;
      const matchesProfession = this.selectedProfession === 'all' || rule.profession === this.selectedProfession;
      
      return matchesCategory && matchesProfession;
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onProfessionChange(profession: string): void {
    this.selectedProfession = profession;
    this.applyFilters();
  }

  createRule(): void {
    alert('Opening policy rule creation wizard...');
  }

  editRule(id: string): void {
    alert(`Editing policy rule: ${id}`);
  }

  activateRule(id: string): void {
    const rule = this.policyRules.find(r => r.id === id);
    if (rule) {
      rule.status = 'active';
      rule.lastModified = new Date();
      this.applyFilters();
      alert(`Policy rule ${id} activated`);
    }
  }

  archiveRule(id: string): void {
    const rule = this.policyRules.find(r => r.id === id);
    if (rule) {
      rule.status = 'archived';
      rule.expiryDate = new Date();
      rule.lastModified = new Date();
      this.applyFilters();
      alert(`Policy rule ${id} archived`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'fees': return 'ri-money-dollar-circle-line';
      case 'grace_periods': return 'ri-time-line';
      case 'cpd_thresholds': return 'ri-book-read-line';
      case 'renewal_requirements': return 'ri-refresh-line';
      case 'sanctions': return 'ri-shield-cross-line';
      default: return 'ri-settings-line';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getParameterEntries(parameters: any) {
    return Object.entries(parameters).map(([key, value]) => ({ key, value }));
  }

  formatParameterName(paramName: string): string {
    return paramName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  formatParameterValue(key: string, value: any): string {
    if (key.toLowerCase().includes('fee') || key.toLowerCase().includes('cost')) {
      return this.formatCurrency(value);
    }
    if (key.toLowerCase().includes('percentage') || key.toLowerCase().includes('discount')) {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (key.toLowerCase().includes('days') || key.toLowerCase().includes('period')) {
      return `${value} days`;
    }
    return value.toString();
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}