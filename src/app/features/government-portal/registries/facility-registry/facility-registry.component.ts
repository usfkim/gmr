import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health_center' | 'pharmacy' | 'laboratory' | 'imaging_center';
  licenseNumber: string;
  status: 'active' | 'suspended' | 'revoked' | 'pending';
  region: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  bedCapacity?: number;
  serviceScope: string[];
  accreditationScore: number;
  lastInspection: Date;
  nextInspection: Date;
  violations: number;
  staffCount: number;
  linkedPractitioners: number;
}

@Component({
  selector: 'app-facility-registry',
  templateUrl: './facility-registry.component.html',
  styleUrls: ['./facility-registry.component.css']
})
export class FacilityRegistryComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  searchTerm = '';
  selectedType = 'all';
  selectedStatus = 'all';
  selectedRegion = 'all';
  
  // Mock facilities data
  facilities: Facility[] = [
    {
      id: 'FAC-001',
      name: 'Mulago National Referral Hospital',
      type: 'hospital',
      licenseNumber: 'MoH-H-001',
      status: 'active',
      region: 'Central',
      district: 'Kampala',
      address: 'Mulago Hill, Kampala',
      phone: '+256 414 530 692',
      email: 'info@mulago.go.ug',
      bedCapacity: 1500,
      serviceScope: ['Emergency Care', 'Surgery', 'Cardiology', 'Oncology', 'Pediatrics', 'Maternity'],
      accreditationScore: 92,
      lastInspection: new Date('2024-11-15'),
      nextInspection: new Date('2025-05-15'),
      violations: 2,
      staffCount: 2847,
      linkedPractitioners: 1247
    },
    {
      id: 'FAC-002',
      name: 'Kampala International University Hospital',
      type: 'hospital',
      licenseNumber: 'MoH-H-045',
      status: 'active',
      region: 'Central',
      district: 'Kampala',
      address: 'Kansanga, Kampala',
      phone: '+256 414 266 813',
      email: 'info@kiu.ac.ug',
      bedCapacity: 300,
      serviceScope: ['General Medicine', 'Surgery', 'Pediatrics', 'Maternity', 'Laboratory'],
      accreditationScore: 87,
      lastInspection: new Date('2024-10-20'),
      nextInspection: new Date('2025-04-20'),
      violations: 1,
      staffCount: 456,
      linkedPractitioners: 234
    },
    {
      id: 'FAC-003',
      name: 'Mbarara Regional Referral Hospital',
      type: 'hospital',
      licenseNumber: 'MoH-H-012',
      status: 'active',
      region: 'Western',
      district: 'Mbarara',
      address: 'Mbarara Municipality',
      phone: '+256 485 420 763',
      email: 'info@mbarara.go.ug',
      bedCapacity: 600,
      serviceScope: ['Emergency Care', 'Surgery', 'Internal Medicine', 'Pediatrics', 'Obstetrics'],
      accreditationScore: 89,
      lastInspection: new Date('2024-12-01'),
      nextInspection: new Date('2025-06-01'),
      violations: 0,
      staffCount: 789,
      linkedPractitioners: 387
    },
    {
      id: 'FAC-004',
      name: 'Gulu Regional Referral Hospital',
      type: 'hospital',
      licenseNumber: 'MoH-H-018',
      status: 'suspended',
      region: 'Northern',
      district: 'Gulu',
      address: 'Gulu Municipality',
      phone: '+256 471 432 271',
      email: 'info@gulu.go.ug',
      bedCapacity: 400,
      serviceScope: ['General Medicine', 'Surgery', 'Pediatrics', 'Emergency Care'],
      accreditationScore: 65,
      lastInspection: new Date('2024-09-15'),
      nextInspection: new Date('2025-03-15'),
      violations: 8,
      staffCount: 345,
      linkedPractitioners: 156
    }
  ];

  filteredFacilities: Facility[] = [];
  
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
    
    this.titleService.setTitle('Facility Registry - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredFacilities = this.facilities.filter(facility => {
      const matchesSearch = !this.searchTerm || 
        facility.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        facility.licenseNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.selectedType === 'all' || facility.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || facility.status === this.selectedStatus;
      const matchesRegion = this.selectedRegion === 'all' || facility.region === this.selectedRegion;
      
      return matchesSearch && matchesType && matchesStatus && matchesRegion;
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

  onRegionChange(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getAccreditationColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'hospital': return 'ri-hospital-line';
      case 'clinic': return 'ri-health-book-line';
      case 'health_center': return 'ri-first-aid-kit-line';
      case 'pharmacy': return 'ri-medicine-bottle-line';
      case 'laboratory': return 'ri-test-tube-line';
      case 'imaging_center': return 'ri-scan-line';
      default: return 'ri-building-line';
    }
  }

  inspectFacility(id: string): void {
    alert(`Scheduling inspection for facility ${id}`);
  }

  updateAccreditation(id: string): void {
    alert(`Updating accreditation for facility ${id}`);
  }

  viewStaffRoster(id: string): void {
    alert(`Viewing staff roster for facility ${id}`);
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