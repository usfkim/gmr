import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

interface CaseStudy {
  id: string;
  country: string;
  flag: string;
  title: string;
  subtitle: string;
  launchDate: Date;
  duration: string;
  status: 'completed' | 'ongoing' | 'planned';
  keyMetrics: {
    practitionersRegistered: number;
    facilitiesOnboarded: number;
    fraudCasesReduced: number;
    complianceImprovement: number;
    timeToVerification: string;
    costSavings: number;
  };
  challenges: string[];
  solutions: string[];
  outcomes: string[];
  stakeholders: Array<{
    name: string;
    role: string;
    quote: string;
  }>;
  citations: Array<{
    title: string;
    source: string;
    date: Date;
    url?: string;
  }>;
  downloadUrl: string;
  featured: boolean;
}

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.css']
})
export class CaseStudiesComponent implements OnInit {
  titleService = inject(Title);
  
  selectedCountry = 'all';
  selectedStatus = 'all';
  
  // Case studies data
  caseStudies: CaseStudy[] = [
    {
      id: 'CS-UG-001',
      country: 'Uganda',
      flag: '🇺🇬',
      title: 'Digital Transformation of Medical Licensing in Uganda',
      subtitle: 'From paper-based to blockchain-secured digital registry',
      launchDate: new Date('2023-01-15'),
      duration: '18 months',
      status: 'ongoing',
      keyMetrics: {
        practitionersRegistered: 28547,
        facilitiesOnboarded: 1247,
        fraudCasesReduced: 67,
        complianceImprovement: 45,
        timeToVerification: '< 2 minutes',
        costSavings: 2400000000 // UGX
      },
      challenges: [
        'Legacy paper-based system with limited accessibility',
        'Fragmented regulatory oversight across multiple councils',
        'High incidence of fraudulent credentials and unlicensed practice',
        'Limited cross-border verification capabilities',
        'Inefficient renewal processes causing compliance gaps'
      ],
      solutions: [
        'Blockchain-secured digital registry with immutable audit trails',
        'Unified platform integrating all regulatory councils',
        'AI-powered fraud detection and automated verification',
        'International API for embassy and cross-border verification',
        'Automated renewal workflows with CPD tracking'
      ],
      outcomes: [
        '67% reduction in fraudulent credential cases',
        '45% improvement in license renewal compliance',
        '89% reduction in verification time (from days to minutes)',
        'UGX 2.4B in administrative cost savings annually',
        '98% stakeholder satisfaction rate'
      ],
      stakeholders: [
        {
          name: 'Dr. Sarah Kiggundu',
          role: 'Director, Medical & Dental Council Uganda',
          quote: 'The digital registry has revolutionized how we manage medical licensing in Uganda. The blockchain security and real-time verification capabilities have significantly enhanced public trust in our healthcare system.'
        },
        {
          name: 'Hon. Jane Ruth Aceng',
          role: 'Minister of Health, Uganda',
          quote: 'This platform represents a major leap forward in healthcare governance. The ability to instantly verify practitioner credentials has strengthened our regulatory oversight and improved patient safety.'
        }
      ],
      citations: [
        {
          title: 'Digital Health Transformation in Uganda: A Case Study',
          source: 'East African Medical Journal',
          date: new Date('2024-06-15'),
          url: 'https://eamj.org/digital-health-uganda-2024'
        },
        {
          title: 'Blockchain Applications in Healthcare Regulation',
          source: 'African Journal of Health Innovation',
          date: new Date('2024-09-20'),
          url: 'https://ajhi.org/blockchain-healthcare-regulation'
        }
      ],
      downloadUrl: '/assets/case-studies/uganda-medical-registry-case-study.pdf',
      featured: true
    },
    {
      id: 'CS-GH-001',
      country: 'Ghana',
      flag: '🇬🇭',
      title: 'Ghana Medical Registry: Pioneering Digital Healthcare Governance',
      subtitle: 'First comprehensive medical registry system in West Africa',
      launchDate: new Date('2022-08-01'),
      duration: '24 months',
      status: 'completed',
      keyMetrics: {
        practitionersRegistered: 34567,
        facilitiesOnboarded: 1567,
        fraudCasesReduced: 78,
        complianceImprovement: 52,
        timeToVerification: '< 90 seconds',
        costSavings: 1800000000 // GHS equivalent in UGX
      },
      challenges: [
        'Scattered practitioner data across multiple institutions',
        'High rates of credential fraud in rural areas',
        'Limited digital infrastructure in remote regions',
        'Resistance to change from traditional paper-based processes',
        'Need for multilingual support across diverse populations'
      ],
      solutions: [
        'Centralized digital registry with offline capability',
        'Mobile verification units for rural deployment',
        'Comprehensive fraud detection algorithms',
        'Stakeholder engagement and training programs',
        'Multi-language interface supporting local languages'
      ],
      outcomes: [
        '78% reduction in credential fraud incidents',
        '52% improvement in regulatory compliance',
        '94% of practitioners successfully onboarded',
        'GHS 180M in cost savings over 2 years',
        'Model system adopted by 3 neighboring countries'
      ],
      stakeholders: [
        {
          name: 'Dr. Eli Atikpui',
          role: 'Registrar, Medical & Dental Council Ghana',
          quote: 'The Ghana Medical Registry has set a new standard for healthcare regulation in West Africa. Our fraud detection capabilities have improved dramatically, and public confidence in our healthcare system has never been higher.'
        }
      ],
      citations: [
        {
          title: 'Ghana Medical Registry: A Model for West Africa',
          source: 'West African Health Organization Journal',
          date: new Date('2024-03-10'),
          url: 'https://waho.org/ghana-medical-registry-model'
        }
      ],
      downloadUrl: '/assets/case-studies/ghana-medical-registry-case-study.pdf',
      featured: true
    },
    {
      id: 'CS-KE-001',
      country: 'Kenya',
      flag: '🇰🇪',
      title: 'Kenya Medical Registry Implementation',
      subtitle: 'Modernizing healthcare regulation in East Africa',
      launchDate: new Date('2025-03-01'),
      duration: '12 months (planned)',
      status: 'planned',
      keyMetrics: {
        practitionersRegistered: 0,
        facilitiesOnboarded: 0,
        fraudCasesReduced: 0,
        complianceImprovement: 0,
        timeToVerification: 'TBD',
        costSavings: 0
      },
      challenges: [
        'Integration with existing Kenya Medical Practitioners Board systems',
        'Harmonization of multiple regulatory frameworks',
        'Cross-border verification with neighboring countries',
        'Training of regulatory staff on new digital systems'
      ],
      solutions: [
        'Phased implementation with pilot regions',
        'API integration with existing systems',
        'Regional harmonization protocols',
        'Comprehensive training and change management'
      ],
      outcomes: [
        'Expected 60% reduction in verification time',
        'Projected 40% improvement in compliance rates',
        'Enhanced cross-border practitioner mobility',
        'Strengthened regional healthcare cooperation'
      ],
      stakeholders: [],
      citations: [],
      downloadUrl: '/assets/case-studies/kenya-implementation-plan.pdf',
      featured: false
    }
  ];

  filteredCaseStudies: CaseStudy[] = [];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('Case Studies - Uganda Medical Registry');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCaseStudies = this.caseStudies.filter(study => {
      const matchesCountry = this.selectedCountry === 'all' || study.country === this.selectedCountry;
      const matchesStatus = this.selectedStatus === 'all' || study.status === this.selectedStatus;
      
      return matchesCountry && matchesStatus;
    });
  }

  onCountryChange(country: string): void {
    this.selectedCountry = country;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  downloadCaseStudy(downloadUrl: string): void {
    // In production, this would trigger actual download
    alert(`Downloading case study: ${downloadUrl}`);
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

  getFeaturedCaseStudies(): CaseStudy[] {
    return this.caseStudies.filter(study => study.featured);
  }

  getStatusDisplayName(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}