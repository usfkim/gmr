import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface AccreditationBody {
  id: string;
  name: string;
  type: 'medical_school' | 'training_program' | 'specialty_board' | 'international_body';
  country: string;
  status: 'recognized' | 'provisional' | 'suspended' | 'revoked';
  recognitionDate: Date;
  validityWindow: {
    start: Date;
    end: Date;
  };
  graduatesCount: number;
  specialties: string[];
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  lastReview: Date;
  nextReview: Date;
  accreditationScore: number;
}

@Component({
  selector: 'app-accreditation-bodies',
  templateUrl: './accreditation-bodies.component.html',
  styleUrls: ['./accreditation-bodies.component.css']
})
export class AccreditationBodiesComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  searchTerm = '';
  selectedType = 'all';
  selectedStatus = 'all';
  selectedCountry = 'all';
  
  // Mock accreditation bodies data
  accreditationBodies: AccreditationBody[] = [
    {
      id: 'ACC-001',
      name: 'Makerere University College of Health Sciences',
      type: 'medical_school',
      country: 'Uganda',
      status: 'recognized',
      recognitionDate: new Date('1990-01-01'),
      validityWindow: {
        start: new Date('1990-01-01'),
        end: new Date('2030-12-31')
      },
      graduatesCount: 12547,
      specialties: ['Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Public Health'],
      contactInfo: {
        email: 'info@chs.mak.ac.ug',
        phone: '+256 414 530 020',
        website: 'https://chs.mak.ac.ug'
      },
      lastReview: new Date('2023-06-15'),
      nextReview: new Date('2028-06-15'),
      accreditationScore: 95
    },
    {
      id: 'ACC-002',
      name: 'Mbarara University of Science and Technology',
      type: 'medical_school',
      country: 'Uganda',
      status: 'recognized',
      recognitionDate: new Date('1995-03-15'),
      validityWindow: {
        start: new Date('1995-03-15'),
        end: new Date('2030-03-15')
      },
      graduatesCount: 8934,
      specialties: ['Medicine', 'Nursing', 'Pharmacy', 'Medical Laboratory Sciences'],
      contactInfo: {
        email: 'info@must.ac.ug',
        phone: '+256 485 421 373',
        website: 'https://must.ac.ug'
      },
      lastReview: new Date('2022-11-20'),
      nextReview: new Date('2027-11-20'),
      accreditationScore: 92
    },
    {
      id: 'ACC-003',
      name: 'University of Cape Town Faculty of Medicine',
      type: 'medical_school',
      country: 'South Africa',
      status: 'recognized',
      recognitionDate: new Date('2010-08-01'),
      validityWindow: {
        start: new Date('2010-08-01'),
        end: new Date('2025-08-01')
      },
      graduatesCount: 456,
      specialties: ['Cardiology Fellowship', 'Surgery', 'Internal Medicine'],
      contactInfo: {
        email: 'info@health.uct.ac.za',
        phone: '+27 21 406 6000',
        website: 'https://www.health.uct.ac.za'
      },
      lastReview: new Date('2023-08-01'),
      nextReview: new Date('2025-08-01'),
      accreditationScore: 98
    },
    {
      id: 'ACC-004',
      name: 'East African College of Physicians',
      type: 'specialty_board',
      country: 'Regional',
      status: 'recognized',
      recognitionDate: new Date('2005-01-01'),
      validityWindow: {
        start: new Date('2005-01-01'),
        end: new Date('2030-01-01')
      },
      graduatesCount: 2847,
      specialties: ['Internal Medicine', 'Pediatrics', 'Surgery', 'Obstetrics & Gynecology'],
      contactInfo: {
        email: 'info@eacp.org',
        phone: '+254 20 271 9974',
        website: 'https://eacp.org'
      },
      lastReview: new Date('2024-01-15'),
      nextReview: new Date('2029-01-15'),
      accreditationScore: 94
    },
    {
      id: 'ACC-005',
      name: 'International Medical University - Malaysia',
      type: 'medical_school',
      country: 'Malaysia',
      status: 'provisional',
      recognitionDate: new Date('2023-06-01'),
      validityWindow: {
        start: new Date('2023-06-01'),
        end: new Date('2025-06-01')
      },
      graduatesCount: 89,
      specialties: ['Medicine', 'Dentistry'],
      contactInfo: {
        email: 'info@imu.edu.my',
        phone: '+60 3 2731 7272',
        website: 'https://www.imu.edu.my'
      },
      lastReview: new Date('2023-06-01'),
      nextReview: new Date('2025-06-01'),
      accreditationScore: 78
    }
  ];

  filteredBodies: AccreditationBody[] = [];
  
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
    
    this.titleService.setTitle('Accreditation Bodies - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBodies = this.accreditationBodies.filter(body => {
      const matchesSearch = !this.searchTerm || 
        body.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.selectedType === 'all' || body.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || body.status === this.selectedStatus;
      const matchesCountry = this.selectedCountry === 'all' || body.country === this.selectedCountry;
      
      return matchesSearch && matchesType && matchesStatus && matchesCountry;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onCountryChange(country: string): void {
    this.selectedCountry = country;
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'recognized': return 'bg-green-100 text-green-800';
      case 'provisional': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'medical_school': return 'ri-school-line';
      case 'training_program': return 'ri-graduation-cap-line';
      case 'specialty_board': return 'ri-award-line';
      case 'international_body': return 'ri-global-line';
      default: return 'ri-building-line';
    }
  }

  getAccreditationColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  }

  reviewAccreditation(id: string): void {
    alert(`Starting accreditation review for ${id}`);
  }

  updateStatus(id: string, newStatus: string): void {
    const body = this.accreditationBodies.find(b => b.id === id);
    if (body) {
      const reason = prompt(`Please provide a reason for changing status to ${newStatus}:`);
      if (reason) {
        body.status = newStatus as any;
        this.applyFilters();
        alert(`Status updated to ${newStatus}. Reason: ${reason}`);
      }
    }
  }

  extendValidity(id: string): void {
    alert(`Extending validity period for accreditation body ${id}`);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}