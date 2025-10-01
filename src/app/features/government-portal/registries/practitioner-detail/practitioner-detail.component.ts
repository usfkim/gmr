import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

interface PractitionerDetail {
  id: string;
  name: string;
  licenseNumber: string;
  profession: string;
  specialty: string;
  status: string;
  registrationDate: Date;
  expiryDate: Date;
  facility: string;
  region: string;
  district: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  kycStatus: string;
  cpdCredits: number;
  requiredCredits: number;
  lastActivity: Date;
  riskScore: number;
  photo?: string;
  
  // Detailed information
  education: Array<{
    degree: string;
    institution: string;
    year: number;
    country: string;
    verified: boolean;
  }>;
  
  certifications: Array<{
    name: string;
    issuer: string;
    issued: Date;
    expires: Date;
    status: string;
  }>;
  
  licenseHistory: Array<{
    action: string;
    date: Date;
    reason?: string;
    performedBy: string;
    notes?: string;
  }>;
  
  documents: Array<{
    type: string;
    name: string;
    uploadDate: Date;
    status: string;
    verifiedBy?: string;
  }>;
  
  cpdActivities: Array<{
    title: string;
    provider: string;
    credits: number;
    completedDate: Date;
    category: string;
    certificate?: string;
  }>;
}

@Component({
  selector: 'app-practitioner-detail',
  templateUrl: './practitioner-detail.component.html',
  styleUrls: ['./practitioner-detail.component.css']
})
export class PractitionerDetailComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  currentUser: any = null;
  practitionerId: string = '';
  practitioner: PractitionerDetail | null = null;
  activeTab = 'overview';
  
  // Mock detailed practitioner data
  mockPractitioner: PractitionerDetail = {
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
    dateOfBirth: new Date('1985-05-12'),
    gender: 'Male',
    nationality: 'Ugandan',
    kycStatus: 'verified',
    cpdCredits: 52,
    requiredCredits: 60,
    lastActivity: new Date('2024-12-22'),
    riskScore: 2,
    photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish',
    
    education: [
      {
        degree: 'Doctor of Medicine (MBChB)',
        institution: 'Makerere University',
        year: 2012,
        country: 'Uganda',
        verified: true
      },
      {
        degree: 'Master of Medicine in Internal Medicine',
        institution: 'Makerere University',
        year: 2016,
        country: 'Uganda',
        verified: true
      },
      {
        degree: 'Fellowship in Interventional Cardiology',
        institution: 'University of Cape Town',
        year: 2019,
        country: 'South Africa',
        verified: true
      }
    ],
    
    certifications: [
      {
        name: 'Board Certification in Cardiology',
        issuer: 'Uganda Medical Council',
        issued: new Date('2019-06-15'),
        expires: new Date('2029-06-15'),
        status: 'active'
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        issuer: 'Uganda Heart Institute',
        issued: new Date('2024-12-15'),
        expires: new Date('2026-12-15'),
        status: 'active'
      },
      {
        name: 'Basic Life Support (BLS)',
        issuer: 'Uganda Red Cross',
        issued: new Date('2024-06-10'),
        expires: new Date('2026-06-10'),
        status: 'active'
      }
    ],
    
    licenseHistory: [
      {
        action: 'License Issued',
        date: new Date('2023-01-15'),
        reason: 'Initial registration after housemanship completion',
        performedBy: 'MDC Admin - Dr. Sarah Kiggundu',
        notes: 'All requirements met. Excellent academic record.'
      },
      {
        action: 'License Renewed',
        date: new Date('2024-01-15'),
        reason: 'Annual renewal',
        performedBy: 'MDC System',
        notes: 'CPD requirements met. No disciplinary issues.'
      },
      {
        action: 'Specialty Added',
        date: new Date('2019-06-15'),
        reason: 'Cardiology board certification completed',
        performedBy: 'MDC Admin - Dr. James Mukasa',
        notes: 'Fellowship completed at University of Cape Town.'
      }
    ],
    
    documents: [
      {
        type: 'Medical Degree',
        name: 'MBChB_Certificate_Makerere_2012.pdf',
        uploadDate: new Date('2023-01-10'),
        status: 'verified',
        verifiedBy: 'MDC Document Verification Team'
      },
      {
        type: 'Housemanship Certificate',
        name: 'Housemanship_Completion_Mulago_2013.pdf',
        uploadDate: new Date('2023-01-10'),
        status: 'verified',
        verifiedBy: 'MDC Document Verification Team'
      },
      {
        type: 'Police Clearance',
        name: 'Police_Clearance_2023.pdf',
        uploadDate: new Date('2023-01-12'),
        status: 'verified',
        verifiedBy: 'MDC Background Check Unit'
      },
      {
        type: 'Fellowship Certificate',
        name: 'Cardiology_Fellowship_UCT_2019.pdf',
        uploadDate: new Date('2019-06-10'),
        status: 'verified',
        verifiedBy: 'MDC Specialty Board'
      }
    ],
    
    cpdActivities: [
      {
        title: 'Interventional Cardiology Masterclass',
        provider: 'Uganda Heart Institute',
        credits: 15,
        completedDate: new Date('2024-12-20'),
        category: 'Clinical Skills',
        certificate: 'IC-MASTER-2024-458.pdf'
      },
      {
        title: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'Uganda Heart Institute',
        credits: 8,
        completedDate: new Date('2024-12-15'),
        category: 'Emergency Medicine',
        certificate: 'ACLS-2024-458.pdf'
      },
      {
        title: 'Cardiac Electrophysiology Workshop',
        provider: 'Makerere University',
        credits: 12,
        completedDate: new Date('2024-11-20'),
        category: 'Specialty Training',
        certificate: 'EP-WORKSHOP-2024-458.pdf'
      },
      {
        title: 'Medical Ethics and Patient Safety',
        provider: 'Uganda Medical Association',
        credits: 6,
        completedDate: new Date('2024-10-10'),
        category: 'Professional Development',
        certificate: 'ETHICS-2024-458.pdf'
      }
    ]
  };
  
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
    
    // Get practitioner ID from route
    this.practitionerId = this.route.snapshot.params['id'];
    
    // In production, this would fetch from API
    this.practitioner = this.mockPractitioner;
    
    this.titleService.setTitle(`${this.practitioner.name} - Practitioner Registry`);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
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

  getDocumentStatusColor(status: string): string {
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

  updateStatus(newStatus: string): void {
    if (this.practitioner) {
      const reason = prompt(`Please provide a reason for changing status to ${newStatus}:`);
      if (reason) {
        this.practitioner.status = newStatus;
        alert(`Status updated to ${newStatus}. Reason: ${reason}`);
      }
    }
  }

  addNote(): void {
    const note = prompt('Add a note to this practitioner\'s record:');
    if (note) {
      // In production, this would save to backend
      alert(`Note added: ${note}`);
    }
  }

  sendReminder(): void {
    if (this.practitioner) {
      alert(`CPD reminder sent to ${this.practitioner.email}`);
    }
  }

  verifyDocument(documentType: string): void {
    alert(`Document verification initiated for: ${documentType}`);
  }

  downloadDocument(documentName: string): void {
    alert(`Downloading document: ${documentName}`);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}