import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface EmbassyProfile {
  id: string;
  name: string;
  country: string;
  type: 'embassy' | 'high_commission' | 'consulate';
  address: string;
  phone: string;
  email: string;
  website?: string;
  subscriptionTier: 'per_lookup' | 'monthly' | 'annual';
  subscriptionExpiry?: Date;
  lastVerification: Date;
  totalVerifications: number;
  monthlyLimit?: number;
  whitelistedIPs: string[];
  mfaEnabled: boolean;
}

interface VerificationStats {
  totalThisMonth: number;
  successfulVerifications: number;
  failedVerifications: number;
  averageResponseTime: number;
  topRequestingOfficers: Array<{
    name: string;
    count: number;
    department: string;
  }>;
  verificationsByCountry: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  verificationsByProfession: Array<{
    profession: string;
    count: number;
    percentage: number;
  }>;
}

interface RecentVerification {
  id: string;
  practitionerName: string;
  licenseNumber: string;
  profession: string;
  specialty?: string;
  verificationDate: Date;
  requestedBy: string;
  purpose: 'visa_application' | 'work_permit' | 'credential_recognition' | 'immigration_assessment';
  status: 'verified' | 'not_found' | 'suspended' | 'revoked';
  officialLetterGenerated: boolean;
  letterReference?: string;
}

@Component({
  selector: 'app-embassy-dashboard',
  templateUrl: './embassy-dashboard.component.html',
  styleUrls: ['./embassy-dashboard.component.css']
})
export class EmbassyDashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  
  // Mock embassy profile
  embassy: EmbassyProfile = {
    id: 'EMB-001',
    name: 'Embassy of Uganda - United Kingdom',
    country: 'United Kingdom',
    type: 'embassy',
    address: '58-59 Trafalgar Square, London WC2N 5DX, UK',
    phone: '+44 20 7839 5783',
    email: 'info@ugandahighcommission.co.uk',
    website: 'https://london.mofa.go.ug',
    subscriptionTier: 'monthly',
    subscriptionExpiry: new Date('2025-12-31'),
    lastVerification: new Date('2024-12-22'),
    totalVerifications: 2847,
    monthlyLimit: 1000,
    whitelistedIPs: ['203.0.113.45', '198.51.100.67', '192.0.2.123'],
    mfaEnabled: true
  };

  // Dashboard statistics
  verificationStats: VerificationStats = {
    totalThisMonth: 156,
    successfulVerifications: 142,
    failedVerifications: 14,
    averageResponseTime: 1.2, // seconds
    topRequestingOfficers: [
      { name: 'Sarah Johnson', count: 45, department: 'Visa Section' },
      { name: 'Michael Brown', count: 38, department: 'Immigration' },
      { name: 'Patricia Wilson', count: 29, department: 'Consular Services' }
    ],
    verificationsByCountry: [
      { country: 'Uganda', count: 89, percentage: 57.1 },
      { country: 'Kenya', count: 23, percentage: 14.7 },
      { country: 'Tanzania', count: 18, percentage: 11.5 },
      { country: 'South Africa', count: 15, percentage: 9.6 },
      { country: 'Other', count: 11, percentage: 7.1 }
    ],
    verificationsByProfession: [
      { profession: 'Medical Doctor', count: 78, percentage: 50.0 },
      { profession: 'Nurse', count: 34, percentage: 21.8 },
      { profession: 'Pharmacist', count: 18, percentage: 11.5 },
      { profession: 'Dentist', count: 12, percentage: 7.7 },
      { profession: 'Allied Health', count: 14, percentage: 9.0 }
    ]
  };

  // Recent verifications
  recentVerifications: RecentVerification[] = [
    {
      id: 'VER-2025-001',
      practitionerName: 'Dr. Yusuf AbdulHakim Addo',
      licenseNumber: 'UMC-UG-2458',
      profession: 'Medical Doctor',
      specialty: 'Cardiology',
      verificationDate: new Date('2025-01-15T14:30:00'),
      requestedBy: 'Sarah Johnson - Visa Section',
      purpose: 'work_permit',
      status: 'verified',
      officialLetterGenerated: true,
      letterReference: 'UKE-VL-2025-001'
    },
    {
      id: 'VER-2025-002',
      practitionerName: 'Nurse Patricia Nakato',
      licenseNumber: 'NMC-UG-5721',
      profession: 'Nurse',
      verificationDate: new Date('2025-01-15T11:20:00'),
      requestedBy: 'Michael Brown - Immigration',
      purpose: 'visa_application',
      status: 'verified',
      officialLetterGenerated: true,
      letterReference: 'UKE-VL-2025-002'
    },
    {
      id: 'VER-2025-003',
      practitionerName: 'Dr. John Mukasa',
      licenseNumber: 'UMC-UG-4521',
      profession: 'Medical Doctor',
      verificationDate: new Date('2025-01-14T16:45:00'),
      requestedBy: 'Patricia Wilson - Consular',
      purpose: 'credential_recognition',
      status: 'suspended',
      officialLetterGenerated: true,
      letterReference: 'UKE-VL-2025-003'
    },
    {
      id: 'VER-2025-004',
      practitionerName: 'Dr. Grace Atim',
      licenseNumber: 'UMC-UG-9999',
      profession: 'Medical Doctor',
      verificationDate: new Date('2025-01-14T09:15:00'),
      requestedBy: 'Sarah Johnson - Visa Section',
      purpose: 'immigration_assessment',
      status: 'not_found',
      officialLetterGenerated: false
    }
  ];

  // Subscription usage
  subscriptionUsage = {
    plan: this.embassy.subscriptionTier,
    monthlyLimit: this.embassy.monthlyLimit || 0,
    used: this.verificationStats.totalThisMonth,
    remaining: (this.embassy.monthlyLimit || 0) - this.verificationStats.totalThisMonth,
    percentageUsed: ((this.verificationStats.totalThisMonth / (this.embassy.monthlyLimit || 1)) * 100),
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
    this.titleService.setTitle('Embassy Portal - Uganda Medical Registry');
  }

  getCurrentMonthCost(): number {
    switch (this.embassy.subscriptionTier) {
      case 'per_lookup': return this.verificationStats.totalThisMonth * 15000; // UGX per lookup
      case 'monthly': return 500000; // UGX
      case 'annual': return 5000000 / 12; // UGX monthly equivalent
      default: return 0;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'not_found': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPurposeIcon(purpose: string): string {
    switch (purpose) {
      case 'visa_application': return 'ri-passport-line';
      case 'work_permit': return 'ri-briefcase-line';
      case 'credential_recognition': return 'ri-award-line';
      case 'immigration_assessment': return 'ri-user-search-line';
      default: return 'ri-file-line';
    }
  }

  generateOfficialLetter(verificationId: string): void {
    const verification = this.recentVerifications.find(v => v.id === verificationId);
    if (verification) {
      verification.officialLetterGenerated = true;
      verification.letterReference = `UKE-VL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(3, '0')}`;
      alert(`Official verification letter generated: ${verification.letterReference}`);
    }
  }

  downloadLetter(letterReference: string): void {
    alert(`Downloading official letter: ${letterReference}`);
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

  getLettersGeneratedCount(): number {
    return this.recentVerifications.filter(v => v.officialLetterGenerated).length;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}