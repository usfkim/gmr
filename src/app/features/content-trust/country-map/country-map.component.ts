import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

interface CountryStatus {
  country: string;
  region: string;
  status: 'launched' | 'onboarding' | 'in_discussions' | 'planned';
  launchDate?: Date;
  practitioners: number;
  facilities: number;
  population: number;
  workforceDensity: number; // per 10k
  flag: string;
  capital: string;
  languages: string[];
  regulatoryBodies: string[];
  partnerInstitutions: string[];
  caseStudyAvailable: boolean;
}

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.css']
})
export class CountryMapComponent implements OnInit {
  titleService = inject(Title);
  
  selectedRegion = 'all';
  selectedStatus = 'all';
  
  // Country deployment status
  countries: CountryStatus[] = [
    {
      country: 'Uganda',
      region: 'East Africa',
      status: 'launched',
      launchDate: new Date('2023-01-15'),
      practitioners: 28547,
      facilities: 1247,
      population: 45741000,
      workforceDensity: 6.2,
      flag: '🇺🇬',
      capital: 'Kampala',
      languages: ['English', 'Luganda', 'Swahili'],
      regulatoryBodies: ['Medical & Dental Council', 'Nursing & Midwifery Council', 'Allied Health Council'],
      partnerInstitutions: ['Makerere University', 'Mbarara University', 'Uganda Medical Association'],
      caseStudyAvailable: true
    },
    {
      country: 'Kenya',
      region: 'East Africa',
      status: 'onboarding',
      launchDate: new Date('2025-03-01'),
      practitioners: 15234,
      facilities: 892,
      population: 54027000,
      workforceDensity: 2.8,
      flag: '🇰🇪',
      capital: 'Nairobi',
      languages: ['English', 'Swahili'],
      regulatoryBodies: ['Kenya Medical Practitioners Board', 'Nursing Council of Kenya'],
      partnerInstitutions: ['University of Nairobi', 'Moi University', 'Kenya Medical Association'],
      caseStudyAvailable: true
    },
    {
      country: 'Tanzania',
      region: 'East Africa',
      status: 'in_discussions',
      practitioners: 12456,
      facilities: 678,
      population: 61498000,
      workforceDensity: 2.0,
      flag: '🇹🇿',
      capital: 'Dodoma',
      languages: ['Swahili', 'English'],
      regulatoryBodies: ['Medical Council of Tanganyika', 'Tanzania Nursing Council'],
      partnerInstitutions: ['Muhimbili University', 'Kilimanjaro Christian Medical University'],
      caseStudyAvailable: false
    },
    {
      country: 'Rwanda',
      region: 'East Africa',
      status: 'in_discussions',
      practitioners: 8934,
      facilities: 456,
      population: 13276000,
      workforceDensity: 6.7,
      flag: '🇷🇼',
      capital: 'Kigali',
      languages: ['Kinyarwanda', 'English', 'French'],
      regulatoryBodies: ['Rwanda Medical Council', 'Rwanda Nursing Council'],
      partnerInstitutions: ['University of Rwanda', 'Rwanda Medical Association'],
      caseStudyAvailable: false
    },
    {
      country: 'Ghana',
      region: 'West Africa',
      status: 'launched',
      launchDate: new Date('2022-08-01'),
      practitioners: 34567,
      facilities: 1567,
      population: 32833000,
      workforceDensity: 10.5,
      flag: '🇬🇭',
      capital: 'Accra',
      languages: ['English', 'Twi', 'Ga', 'Ewe'],
      regulatoryBodies: ['Medical & Dental Council', 'Nurses & Midwifery Council'],
      partnerInstitutions: ['University of Ghana', 'Kwame Nkrumah University', 'Ghana Medical Association'],
      caseStudyAvailable: true
    },
    {
      country: 'Nigeria',
      region: 'West Africa',
      status: 'onboarding',
      launchDate: new Date('2025-06-01'),
      practitioners: 89234,
      facilities: 3456,
      population: 218541000,
      workforceDensity: 4.1,
      flag: '🇳🇬',
      capital: 'Abuja',
      languages: ['English', 'Hausa', 'Yoruba', 'Igbo'],
      regulatoryBodies: ['Medical & Dental Council of Nigeria', 'Nursing & Midwifery Council'],
      partnerInstitutions: ['University of Lagos', 'University of Ibadan', 'Nigerian Medical Association'],
      caseStudyAvailable: true
    },
    {
      country: 'South Africa',
      region: 'Southern Africa',
      status: 'planned',
      practitioners: 67890,
      facilities: 2345,
      population: 60414000,
      workforceDensity: 11.2,
      flag: '🇿🇦',
      capital: 'Cape Town',
      languages: ['English', 'Afrikaans', 'Zulu', 'Xhosa'],
      regulatoryBodies: ['Health Professions Council of South Africa'],
      partnerInstitutions: ['University of Cape Town', 'University of Witwatersrand'],
      caseStudyAvailable: false
    },
    {
      country: 'Ethiopia',
      region: 'East Africa',
      status: 'planned',
      practitioners: 23456,
      facilities: 789,
      population: 120283000,
      workforceDensity: 1.9,
      flag: '🇪🇹',
      capital: 'Addis Ababa',
      languages: ['Amharic', 'English', 'Oromo'],
      regulatoryBodies: ['Ethiopian Medical Council'],
      partnerInstitutions: ['Addis Ababa University', 'Jimma University'],
      caseStudyAvailable: false
    }
  ];

  filteredCountries: CountryStatus[] = [];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('Country Deployment Map - Uganda Medical Registry');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCountries = this.countries.filter(country => {
      const matchesRegion = this.selectedRegion === 'all' || country.region === this.selectedRegion;
      const matchesStatus = this.selectedStatus === 'all' || country.status === this.selectedStatus;
      
      return matchesRegion && matchesStatus;
    });
  }

  onRegionChange(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'launched': return 'bg-green-100 text-green-800 border-green-200';
      case 'onboarding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_discussions': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'launched': return 'ri-check-line text-green-600';
      case 'onboarding': return 'ri-loader-4-line text-blue-600';
      case 'in_discussions': return 'ri-chat-3-line text-yellow-600';
      case 'planned': return 'ri-calendar-line text-gray-600';
      default: return 'ri-question-line text-gray-600';
    }
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  getCountriesByStatus(status: string): CountryStatus[] {
    return this.countries.filter(c => c.status === status);
  }

  getTotalPractitioners(): number {
    return this.countries.reduce((total, country) => total + country.practitioners, 0);
  }

  getTotalFacilities(): number {
    return this.countries.reduce((total, country) => total + country.facilities, 0);
  }

  getAverageWorkforceDensity(): number {
    const totalDensity = this.countries.reduce((total, country) => total + country.workforceDensity, 0);
    return totalDensity / this.countries.length;
  }

  getStatusDisplayName(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}