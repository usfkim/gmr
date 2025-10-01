import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface StaffMember {
  id: string;
  name: string;
  licenseNumber: string;
  profession: string;
  specialty?: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: Date;
  licenseStatus: 'active' | 'suspended' | 'revoked' | 'expired' | 'provisional';
  licenseExpiry: Date;
  cpdCredits: number;
  requiredCredits: number;
  lastVerification: Date;
  riskScore: number;
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
    date: Date;
  }>;
  photo?: string;
}

@Component({
  selector: 'app-staff-monitoring',
  templateUrl: './staff-monitoring.component.html',
  styleUrls: ['./staff-monitoring.component.css']
})
export class StaffMonitoringComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  searchTerm = '';
  selectedDepartment = 'all';
  selectedStatus = 'all';
  selectedRiskLevel = 'all';
  
  // Mock staff data
  staffMembers: StaffMember[] = [
    {
      id: 'STF-001',
      name: 'Dr. Yusuf AbdulHakim Addo',
      licenseNumber: 'UMC-UG-2458',
      profession: 'Medical Doctor',
      specialty: 'Cardiology',
      position: 'Senior Consultant',
      department: 'Cardiology',
      email: 'yusuf.addo@mulago.go.ug',
      phone: '+256 700 123 456',
      hireDate: new Date('2023-01-15'),
      licenseStatus: 'active',
      licenseExpiry: new Date('2025-12-31'),
      cpdCredits: 52,
      requiredCredits: 60,
      lastVerification: new Date('2024-12-22'),
      riskScore: 2,
      alerts: [],
      photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish'
    },
    {
      id: 'STF-002',
      name: 'Dr. Sarah Nakato',
      licenseNumber: 'UMC-UG-3456',
      profession: 'Medical Doctor',
      specialty: 'Pediatrics',
      position: 'Senior Consultant',
      department: 'Pediatrics',
      email: 'sarah.nakato@mulago.go.ug',
      phone: '+256 700 234 567',
      hireDate: new Date('2022-06-01'),
      licenseStatus: 'active',
      licenseExpiry: new Date('2025-02-15'),
      cpdCredits: 45,
      requiredCredits: 60,
      lastVerification: new Date('2024-12-20'),
      riskScore: 5,
      alerts: [
        {
          type: 'expiry_warning',
          message: 'License expires in 15 days',
          severity: 'high',
          date: new Date('2025-01-15')
        }
      ]
    },
    {
      id: 'STF-003',
      name: 'Nurse Patricia Nambi',
      licenseNumber: 'NMC-UG-7891',
      profession: 'Nurse',
      position: 'Registered Nurse',
      department: 'ICU',
      email: 'patricia.nambi@mulago.go.ug',
      phone: '+256 700 345 678',
      hireDate: new Date('2021-03-10'),
      licenseStatus: 'suspended',
      licenseExpiry: new Date('2024-12-31'),
      cpdCredits: 18,
      requiredCredits: 30,
      lastVerification: new Date('2024-12-18'),
      riskScore: 8,
      alerts: [
        {
          type: 'license_suspended',
          message: 'License suspended due to CPD non-compliance',
          severity: 'critical',
          date: new Date('2025-01-14')
        }
      ]
    },
    {
      id: 'STF-004',
      name: 'Dr. James Okello',
      licenseNumber: 'UMC-UG-2789',
      profession: 'Medical Doctor',
      specialty: 'Emergency Medicine',
      position: 'Medical Officer',
      department: 'Emergency',
      email: 'james.okello@mulago.go.ug',
      phone: '+256 700 456 789',
      hireDate: new Date('2023-09-15'),
      licenseStatus: 'active',
      licenseExpiry: new Date('2025-09-15'),
      cpdCredits: 35,
      requiredCredits: 60,
      lastVerification: new Date('2024-12-15'),
      riskScore: 6,
      alerts: [
        {
          type: 'cpd_deficient',
          message: 'CPD credits below required threshold',
          severity: 'medium',
          date: new Date('2025-01-12')
        }
      ]
    }
  ];

  filteredStaff: StaffMember[] = [];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    this.titleService.setTitle('Staff Monitoring - Employer Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredStaff = this.staffMembers.filter(staff => {
      const matchesSearch = !this.searchTerm || 
        staff.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        staff.licenseNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = this.selectedDepartment === 'all' || staff.department === this.selectedDepartment;
      const matchesStatus = this.selectedStatus === 'all' || staff.licenseStatus === this.selectedStatus;
      
      let matchesRiskLevel = true;
      if (this.selectedRiskLevel !== 'all') {
        if (this.selectedRiskLevel === 'low') matchesRiskLevel = staff.riskScore <= 3;
        else if (this.selectedRiskLevel === 'medium') matchesRiskLevel = staff.riskScore > 3 && staff.riskScore <= 6;
        else if (this.selectedRiskLevel === 'high') matchesRiskLevel = staff.riskScore > 6;
      }
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesRiskLevel;
    });
  }

  onSearchChange(): void {
    const target = event?.target as HTMLInputElement;
    if (target) {
      this.searchTerm = target.value;
    }
    this.applyFilters();
  }

  onDepartmentChange(department: string): void {
    this.selectedDepartment = department;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onRiskLevelChange(riskLevel: string): void {
    this.selectedRiskLevel = riskLevel;
    this.applyFilters();
  }

  verifyStaff(staffId: string): void {
    const staff = this.staffMembers.find(s => s.id === staffId);
    if (staff) {
      staff.lastVerification = new Date();
      alert(`Verification initiated for ${staff.name}`);
    }
  }

  sendReminder(staffId: string): void {
    const staff = this.staffMembers.find(s => s.id === staffId);
    if (staff) {
      alert(`Renewal reminder sent to ${staff.name} (${staff.email})`);
    }
  }

  removeFromRoster(staffId: string): void {
    const staff = this.staffMembers.find(s => s.id === staffId);
    if (staff) {
      const confirmation = confirm(`Are you sure you want to remove ${staff.name} from the active roster?`);
      if (confirmation) {
        const index = this.staffMembers.findIndex(s => s.id === staffId);
        this.staffMembers.splice(index, 1);
        this.applyFilters();
        alert(`${staff.name} removed from roster`);
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
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRiskColor(score: number): string {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  }

  getDaysUntilExpiry(expiryDate: Date): number {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isExpiringSoon(expiryDate: Date): boolean {
    return this.getDaysUntilExpiry(expiryDate) <= 30;
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}