import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

interface Stakeholder {
  id: string;
  name: string;
  type: 'government' | 'regulatory' | 'academic' | 'international' | 'technology' | 'healthcare';
  country: string;
  logo: string;
  website: string;
  partnership: 'strategic' | 'implementation' | 'technology' | 'advisory';
  description: string;
  since: Date;
  featured: boolean;
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
}

@Component({
  selector: 'app-stakeholder-logos',
  templateUrl: './stakeholder-logos.component.html',
  styleUrls: ['./stakeholder-logos.component.css']
})
export class StakeholderLogosComponent implements OnInit {
  titleService = inject(Title);
  
  selectedType = 'all';
  selectedCountry = 'all';
  
  // Computed properties for template
  stakeholdersWithTestimonials: Stakeholder[] = [];
  
  // Stakeholder data
  stakeholders: Stakeholder[] = [
    {
      id: 'STK-001',
      name: 'Ministry of Health Uganda',
      type: 'government',
      country: 'Uganda',
      logo: 'mohgh.png',
      website: 'https://health.go.ug',
      partnership: 'strategic',
      description: 'Primary government partner overseeing healthcare policy and regulation in Uganda',
      since: new Date('2023-01-01'),
      featured: true,
      testimonial: {
        quote: 'The Uganda Medical Registry has transformed our ability to regulate healthcare professionals and ensure public safety.',
        author: 'Hon. Jane Ruth Aceng',
        title: 'Minister of Health, Uganda'
      }
    },
    {
      id: 'STK-002',
      name: 'Medical & Dental Council Uganda',
      type: 'regulatory',
      country: 'Uganda',
      logo: 'mdcgh.png',
      website: 'https://mdc.go.ug',
      partnership: 'implementation',
      description: 'Primary regulatory body for medical and dental practitioners in Uganda',
      since: new Date('2023-01-01'),
      featured: true
    },
    {
      id: 'STK-003',
      name: 'Makerere University',
      type: 'academic',
      country: 'Uganda',
      logo: 'logo.png',
      website: 'https://mak.ac.ug',
      partnership: 'advisory',
      description: 'Leading medical education institution and research partner',
      since: new Date('2023-02-15'),
      featured: true
    },
    {
      id: 'STK-004',
      name: 'World Health Organization',
      type: 'international',
      country: 'Global',
      logo: 'whogh.png',
      website: 'https://who.int',
      partnership: 'advisory',
      description: 'International health organization providing technical guidance and standards',
      since: new Date('2023-03-01'),
      featured: true,
      testimonial: {
        quote: 'This digital registry model represents best practices in healthcare workforce management and should be replicated across the region.',
        author: 'Dr. Matshidiso Moeti',
        title: 'WHO Regional Director for Africa'
      }
    },
    {
      id: 'STK-005',
      name: 'Uganda Medical Association',
      type: 'healthcare',
      country: 'Uganda',
      logo: 'logo.png',
      website: 'https://uma.ug',
      partnership: 'implementation',
      description: 'Professional association representing medical practitioners in Uganda',
      since: new Date('2023-01-15'),
      featured: false
    },
    {
      id: 'STK-006',
      name: 'East African Community',
      type: 'international',
      country: 'Regional',
      logo: 'logo.png',
      website: 'https://eac.int',
      partnership: 'strategic',
      description: 'Regional integration body supporting cross-border healthcare mobility',
      since: new Date('2023-06-01'),
      featured: true
    },
    {
      id: 'STK-007',
      name: 'African Union',
      type: 'international',
      country: 'Continental',
      logo: 'logo.png',
      website: 'https://au.int',
      partnership: 'advisory',
      description: 'Continental organization supporting healthcare system strengthening',
      since: new Date('2023-09-01'),
      featured: true
    },
    {
      id: 'STK-008',
      name: 'USAID',
      type: 'international',
      country: 'USA',
      logo: 'logo.png',
      website: 'https://usaid.gov',
      partnership: 'technology',
      description: 'Development partner supporting digital health initiatives',
      since: new Date('2023-04-01'),
      featured: false
    }
  ];

  filteredStakeholders: Stakeholder[] = [];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('Stakeholder Partners - Uganda Medical Registry');
    this.stakeholdersWithTestimonials = this.stakeholders.filter(s => s.testimonial);
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredStakeholders = this.stakeholders.filter(stakeholder => {
      const matchesType = this.selectedType === 'all' || stakeholder.type === this.selectedType;
      const matchesCountry = this.selectedCountry === 'all' || stakeholder.country === this.selectedCountry;
      
      return matchesType && matchesCountry;
    });
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  onCountryChange(country: string): void {
    this.selectedCountry = country;
    this.applyFilters();
  }

  getPartnershipColor(partnership: string): string {
    switch (partnership) {
      case 'strategic': return 'bg-purple-100 text-purple-800';
      case 'implementation': return 'bg-blue-100 text-blue-800';
      case 'technology': return 'bg-green-100 text-green-800';
      case 'advisory': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'government': return 'ri-government-line';
      case 'regulatory': return 'ri-shield-check-line';
      case 'academic': return 'ri-graduation-cap-line';
      case 'international': return 'ri-global-line';
      case 'technology': return 'ri-code-line';
      case 'healthcare': return 'ri-hospital-line';
      default: return 'ri-building-line';
    }
  }

  getFeaturedStakeholders(): Stakeholder[] {
    return this.stakeholders.filter(s => s.featured);
  }

  getStakeholdersByType(type: string): Stakeholder[] {
    return this.stakeholders.filter(s => s.type === type);
  }

  getPartnershipDisplayName(partnership: string): string {
    return partnership.charAt(0).toUpperCase() + partnership.slice(1);
  }

  getYear(date: Date): number {
    return date.getFullYear();
  }
}