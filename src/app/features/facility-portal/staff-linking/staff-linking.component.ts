import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface StaffAffiliation {
  id: string;
  practitioner: {
    name: string;
    licenseNumber: string;
    profession: string;
    specialty?: string;
    photo?: string;
  };
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'terminated' | 'suspended' | 'pending_approval';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'locum' | 'volunteer';
  approvedBy?: string;
  approvalDate?: Date;
  terminationReason?: string;
  lastVerification: Date;
  verificationStatus: 'verified' | 'expired' | 'suspended' | 'revoked';
}

interface PendingRequest {
  id: string;
  practitioner: {
    name: string;
    licenseNumber: string;
    profession: string;
    specialty?: string;
  };
  requestedPosition: string;
  requestedDepartment: string;
  requestDate: Date;
  requestedBy: string;
  employmentType: string;
  contractDuration?: number;
  justification: string;
  documents: Array<{
    type: string;
    name: string;
    uploadDate: Date;
  }>;
}

@Component({
  selector: 'app-staff-linking',
  templateUrl: './staff-linking.component.html',
  styleUrls: ['./staff-linking.component.css']
})
export class StaffLinkingComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  searchTerm = '';
  selectedDepartment = 'all';
  selectedStatus = 'all';
  
  // Mock staff affiliations
  staffAffiliations: StaffAffiliation[] = [
    {
      id: 'AFF-001',
      practitioner: {
        name: 'Dr. Yusuf AbdulHakim Addo',
        licenseNumber: 'UMC-UG-2458',
        profession: 'Medical Doctor',
        specialty: 'Cardiology',
        photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish'
      },
      position: 'Senior Consultant',
      department: 'Cardiology',
      startDate: new Date('2023-01-15'),
      status: 'active',
      employmentType: 'full_time',
      approvedBy: 'HR Manager - Grace Atim',
      approvalDate: new Date('2023-01-10'),
      lastVerification: new Date('2024-12-22'),
      verificationStatus: 'verified'
    },
    {
      id: 'AFF-002',
      practitioner: {
        name: 'Dr. Sarah Nakato',
        licenseNumber: 'UMC-UG-3456',
        profession: 'Medical Doctor',
        specialty: 'Pediatrics'
      },
      position: 'Senior Consultant',
      department: 'Pediatrics',
      startDate: new Date('2022-06-01'),
      status: 'active',
      employmentType: 'full_time',
      approvedBy: 'HR Manager - Grace Atim',
      approvalDate: new Date('2022-05-25'),
      lastVerification: new Date('2024-12-20'),
      verificationStatus: 'verified'
    },
    {
      id: 'AFF-003',
      practitioner: {
        name: 'Nurse Patricia Nambi',
        licenseNumber: 'NMC-UG-7891',
        profession: 'Nurse'
      },
      position: 'Registered Nurse',
      department: 'ICU',
      startDate: new Date('2021-03-10'),
      status: 'suspended',
      employmentType: 'full_time',
      approvedBy: 'HR Manager - Grace Atim',
      approvalDate: new Date('2021-03-05'),
      lastVerification: new Date('2024-12-18'),
      verificationStatus: 'suspended'
    }
  ];

  // Mock pending requests
  pendingRequests: PendingRequest[] = [
    {
      id: 'REQ-001',
      practitioner: {
        name: 'Dr. Michael Ssebunya',
        licenseNumber: 'UMC-UG-4567',
        profession: 'Medical Doctor',
        specialty: 'Surgery'
      },
      requestedPosition: 'Consultant Surgeon',
      requestedDepartment: 'Surgery',
      requestDate: new Date('2025-01-10'),
      requestedBy: 'Department Head - Dr. James Mukasa',
      employmentType: 'full_time',
      justification: 'Urgent need for additional surgical capacity in the department',
      documents: [
        {
          type: 'CV',
          name: 'Dr_Michael_Ssebunya_CV.pdf',
          uploadDate: new Date('2025-01-10')
        },
        {
          type: 'License Certificate',
          name: 'Medical_License_Certificate.pdf',
          uploadDate: new Date('2025-01-10')
        }
      ]
    },
    {
      id: 'REQ-002',
      practitioner: {
        name: 'Nurse Grace Atim',
        licenseNumber: 'NMC-UG-8901',
        profession: 'Nurse'
      },
      requestedPosition: 'Senior Nurse',
      requestedDepartment: 'Emergency',
      requestDate: new Date('2025-01-12'),
      requestedBy: 'Emergency Department Head',
      employmentType: 'part_time',
      contractDuration: 6,
      justification: 'Additional nursing support needed for emergency department',
      documents: [
        {
          type: 'Nursing Certificate',
          name: 'Nursing_Certificate.pdf',
          uploadDate: new Date('2025-01-12')
        }
      ]
    }
  ];

  filteredAffiliations: StaffAffiliation[] = [];
  
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
    this.titleService.setTitle('Staff Linking - Facility Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAffiliations = this.staffAffiliations.filter(affiliation => {
      const matchesSearch = !this.searchTerm || 
        affiliation.practitioner.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        affiliation.practitioner.licenseNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        affiliation.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = this.selectedDepartment === 'all' || affiliation.department === this.selectedDepartment;
      const matchesStatus = this.selectedStatus === 'all' || affiliation.status === this.selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }

  onSearchChange(): void {
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

  approveRequest(requestId: string): void {
    const request = this.pendingRequests.find(r => r.id === requestId);
    if (request) {
      // Create new affiliation
      const newAffiliation: StaffAffiliation = {
        id: 'AFF-' + String(this.staffAffiliations.length + 1).padStart(3, '0'),
        practitioner: request.practitioner,
        position: request.requestedPosition,
        department: request.requestedDepartment,
        startDate: new Date(),
        status: 'active',
        employmentType: request.employmentType as any,
        approvedBy: this.currentUser.name || 'Current User',
        approvalDate: new Date(),
        lastVerification: new Date(),
        verificationStatus: 'verified'
      };
      
      this.staffAffiliations.push(newAffiliation);
      
      // Remove from pending requests
      const requestIndex = this.pendingRequests.findIndex(r => r.id === requestId);
      this.pendingRequests.splice(requestIndex, 1);
      
      this.applyFilters();
      alert(`Staff affiliation approved for ${request.practitioner.name}`);
    }
  }

  rejectRequest(requestId: string): void {
    const request = this.pendingRequests.find(r => r.id === requestId);
    if (request) {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        const requestIndex = this.pendingRequests.findIndex(r => r.id === requestId);
        this.pendingRequests.splice(requestIndex, 1);
        alert(`Request rejected for ${request.practitioner.name}. Reason: ${reason}`);
      }
    }
  }

  terminateAffiliation(affiliationId: string): void {
    const affiliation = this.staffAffiliations.find(a => a.id === affiliationId);
    if (affiliation) {
      const reason = prompt('Please provide a reason for termination:');
      if (reason) {
        affiliation.status = 'terminated';
        affiliation.endDate = new Date();
        affiliation.terminationReason = reason;
        this.applyFilters();
        alert(`Staff affiliation terminated for ${affiliation.practitioner.name}. Reason: ${reason}`);
      }
    }
  }

  suspendAffiliation(affiliationId: string): void {
    const affiliation = this.staffAffiliations.find(a => a.id === affiliationId);
    if (affiliation) {
      const reason = prompt('Please provide a reason for suspension:');
      if (reason) {
        affiliation.status = 'suspended';
        this.applyFilters();
        alert(`Staff affiliation suspended for ${affiliation.practitioner.name}. Reason: ${reason}`);
      }
    }
  }

  verifyStaff(affiliationId: string): void {
    const affiliation = this.staffAffiliations.find(a => a.id === affiliationId);
    if (affiliation) {
      affiliation.lastVerification = new Date();
      alert(`Verification initiated for ${affiliation.practitioner.name}`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getVerificationStatusColor(status: string): string {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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