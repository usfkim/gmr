import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface Practitioner {
  id: string;
  name: string;
  licenseNumber: string;
  profession: string;
  specialty: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired' | 'provisional' | 'pending';
  registrationDate: Date;
  expiryDate: Date;
  facility: string;
  region: string;
  district: string;
  email: string;
  phone: string;
  nationalId: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  cpdCredits: number;
  requiredCredits: number;
  lastActivity: Date;
  riskScore: number;
  photo?: string;
}

@Component({
  selector: 'app-practitioner-registry',
  templateUrl: './practitioner-registry.component.html',
  styleUrls: ['./practitioner-registry.component.css']
})
export class PractitionerRegistryComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  searchTerm = '';
  selectedStatus = 'all';
  selectedProfession = 'all';
  selectedRegion = 'all';
  showFilters = false;
  
  // Mock practitioners data
  practitioners: Practitioner[] = [
    {
      id: 'UMC-UG-2458',
      name: 'Dr. Yusuf AbdulHakim Addo',
      licenseNumber: 'UMC-UG-2458',
      profession: 'Medical Doctor',
      specialty: 'Cardiology',
      status: 'active',
      registrationDate: new Date('2023-01-15'),
      expiryDate: new Date('2025-12-31'),
      facility: 'Mulago National Referral Hospital',
      region: 'Central',
      district: 'Kampala',
      email: 'yusuf.addo@mulago.go.ug',
      phone: '+256 700 123 456',
      nationalId: 'CM94050123456789',
      kycStatus: 'verified',
      cpdCredits: 52,
      requiredCredits: 60,
      lastActivity: new Date('2024-12-22'),
      riskScore: 2,
      photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish'
    },
    {
      id: 'NMC-UG-5721',
      name: 'Nurse Akandwanaho Richard',
      licenseNumber: 'NMC-UG-5721',
      profession: 'Nurse',
      specialty: 'Critical Care Nursing',
      status: 'active',
      registrationDate: new Date('2022-08-10'),
      expiryDate: new Date('2025-08-10'),
      facility: 'Mulago National Referral Hospital',
      region: 'Central',
      district: 'Kampala',
      email: 'richard.akandwanaho@mulago.go.ug',
      phone: '+256 700 234 567',
      nationalId: 'CM89120234567890',
      kycStatus: 'verified',
      cpdCredits: 28,
      requiredCredits: 30,
      lastActivity: new Date('2024-12-20'),
      riskScore: 1
    },
    {
      id: 'UMC-UG-4521',
      name: 'Dr. John Mukasa',
      licenseNumber: 'UMC-UG-4521',
      profession: 'Medical Doctor',
      specialty: 'General Practice',
      status: 'suspended',
      registrationDate: new Date('2021-03-22'),
      expiryDate: new Date('2024-03-22'),
      facility: 'Kampala International University Hospital',
      region: 'Central',
      district: 'Kampala',
      email: 'john.mukasa@kiu.ac.ug',
      phone: '+256 700 345 678',
      nationalId: 'CM85060345678901',
      kycStatus: 'pending',
      cpdCredits: 15,
      requiredCredits: 60,
      lastActivity: new Date('2024-11-15'),
      riskScore: 8
    },
    {
      id: 'TMPC-UG-0842',
      name: 'Nana Kwesi Amankwah',
      licenseNumber: 'TMPC-UG-0842',
      profession: 'Traditional Medicine',
      specialty: 'Herbal Medicine',
      status: 'provisional',
      registrationDate: new Date('2024-06-01'),
      expiryDate: new Date('2025-06-01'),
      facility: 'Traditional Medicine Center - Kampala',
      region: 'Central',
      district: 'Kampala',
      email: 'kwesi.amankwah@tmpc.go.ug',
      phone: '+256 700 456 789',
      nationalId: 'CM92080456789012',
      kycStatus: 'verified',
      cpdCredits: 12,
      requiredCredits: 20,
      lastActivity: new Date('2024-12-18'),
      riskScore: 3
    },
    {
      id: 'UMC-UG-4789',
      name: 'Dr. Michael Okello',
      licenseNumber: 'UMC-UG-4789',
      profession: 'Medical Doctor',
      specialty: 'Surgery',
      status: 'pending',
      registrationDate: new Date('2024-12-01'),
      expiryDate: new Date('2025-12-01'),
      facility: 'Pending Assignment',
      region: 'Northern',
      district: 'Gulu',
      email: 'michael.okello@pending.ug',
      phone: '+256 700 567 890',
      nationalId: 'CM90100567890123',
      kycStatus: 'pending',
      cpdCredits: 0,
      requiredCredits: 60,
      lastActivity: new Date('2024-12-01'),
      riskScore: 6
    }
  ];

  filteredPractitioners: Practitioner[] = [];
  
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
    
    this.titleService.setTitle('Practitioner Registry - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredPractitioners = this.practitioners.filter(practitioner => {
      const matchesSearch = !this.searchTerm || 
        practitioner.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        practitioner.licenseNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        practitioner.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || practitioner.status === this.selectedStatus;
      const matchesProfession = this.selectedProfession === 'all' || practitioner.profession === this.selectedProfession;
      const matchesRegion = this.selectedRegion === 'all' || practitioner.region === this.selectedRegion;
      
      return matchesSearch && matchesStatus && matchesProfession && matchesRegion;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onProfessionChange(profession: string): void {
    this.selectedProfession = profession;
    this.applyFilters();
  }

  onRegionChange(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  viewPractitioner(id: string): void {
    this.router.navigate(['/government/registries/practitioners', id]);
  }

  approvePractitioner(id: string): void {
    const practitioner = this.practitioners.find(p => p.id === id);
    if (practitioner) {
      practitioner.status = 'active';
      this.applyFilters();
      alert(`Practitioner ${practitioner.name} has been approved and activated.`);
    }
  }

  rejectPractitioner(id: string): void {
    const practitioner = this.practitioners.find(p => p.id === id);
    if (practitioner) {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        practitioner.status = 'revoked';
        this.applyFilters();
        alert(`Practitioner ${practitioner.name} has been rejected. Reason: ${reason}`);
      }
    }
  }

  suspendPractitioner(id: string): void {
    const practitioner = this.practitioners.find(p => p.id === id);
    if (practitioner) {
      const reason = prompt('Please provide a reason for suspension:');
      if (reason) {
        practitioner.status = 'suspended';
        this.applyFilters();
        alert(`Practitioner ${practitioner.name} has been suspended. Reason: ${reason}`);
      }
    }
  }

  revokeLicense(id: string): void {
    const practitioner = this.practitioners.find(p => p.id === id);
    if (practitioner) {
      const confirmation = confirm(`Are you sure you want to revoke the license for ${practitioner.name}? This action cannot be undone.`);
      if (confirmation) {
        const reason = prompt('Please provide a reason for revocation:');
        if (reason) {
          practitioner.status = 'revoked';
          this.applyFilters();
          alert(`License for ${practitioner.name} has been revoked. Reason: ${reason}`);
        }
      }
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'provisional': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getKycStatusColor(status: string): string {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRiskColor(score: number): string {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  exportData(): void {
    console.log('Exporting practitioner registry data...');
    alert('Exporting practitioner registry data...');
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}