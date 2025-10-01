import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface VerificationRequest {
  licenseNumber: string;
  country: string;
  purpose: 'visa_application' | 'work_permit' | 'credential_recognition' | 'immigration_assessment';
  requestedBy: string;
  department: string;
  notes?: string;
}

interface VerificationResult {
  practitioner: {
    name: string;
    licenseNumber: string;
    profession: string;
    specialty?: string;
    status: 'active' | 'suspended' | 'revoked' | 'expired' | 'provisional';
    registrationDate: Date;
    expiryDate: Date;
    facility: string;
    region: string;
    qualifications: Array<{
      degree: string;
      institution: string;
      year: number;
      country: string;
    }>;
    sanctions: Array<{
      type: string;
      date: Date;
      reason: string;
      status: string;
    }>;
    scopeOfPractice: string[];
  };
  verificationId: string;
  timestamp: Date;
  officialLetterAvailable: boolean;
}

@Component({
  selector: 'app-verification-center',
  templateUrl: './verification-center.component.html',
  styleUrls: ['./verification-center.component.css']
})
export class VerificationCenterComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  isVerifying = false;
  verificationResult: VerificationResult | null = null;
  verificationError: string | null = null;
  
  verificationForm = new FormGroup({
    licenseNumber: new FormControl('', [Validators.required]),
    country: new FormControl('Uganda', [Validators.required]),
    purpose: new FormControl('', [Validators.required]),
    requestedBy: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    notes: new FormControl('')
  });

  // Mock verification data
  mockPractitioners = [
    {
      licenseNumber: 'UMC-UG-2458',
      name: 'Dr. Yusuf AbdulHakim Addo',
      profession: 'Medical Doctor',
      specialty: 'Cardiology',
      status: 'active',
      registrationDate: new Date('2023-01-15'),
      expiryDate: new Date('2025-12-31'),
      facility: 'Mulago National Referral Hospital',
      region: 'Central Region (Kampala)',
      qualifications: [
        {
          degree: 'Doctor of Medicine (MBChB)',
          institution: 'Makerere University',
          year: 2012,
          country: 'Uganda'
        },
        {
          degree: 'Fellowship in Interventional Cardiology',
          institution: 'University of Cape Town',
          year: 2019,
          country: 'South Africa'
        }
      ],
      sanctions: [],
      scopeOfPractice: [
        'General Medicine',
        'Cardiology',
        'Interventional Cardiology',
        'Cardiac Catheterization',
        'Coronary Angioplasty'
      ]
    },
    {
      licenseNumber: 'NMC-UG-5721',
      name: 'Nurse Patricia Nakato',
      profession: 'Nurse',
      status: 'active',
      registrationDate: new Date('2022-08-10'),
      expiryDate: new Date('2025-08-10'),
      facility: 'Mulago National Referral Hospital',
      region: 'Central Region (Kampala)',
      qualifications: [
        {
          degree: 'Bachelor of Science in Nursing',
          institution: 'Makerere University',
          year: 2020,
          country: 'Uganda'
        }
      ],
      sanctions: [],
      scopeOfPractice: [
        'General Nursing',
        'Critical Care Nursing',
        'Patient Assessment',
        'Medication Administration'
      ]
    },
    {
      licenseNumber: 'UMC-UG-4521',
      name: 'Dr. John Mukasa',
      profession: 'Medical Doctor',
      status: 'suspended',
      registrationDate: new Date('2021-03-22'),
      expiryDate: new Date('2024-03-22'),
      facility: 'Private Clinic',
      region: 'Central Region (Kampala)',
      qualifications: [
        {
          degree: 'Doctor of Medicine (MBChB)',
          institution: 'Makerere University',
          year: 2019,
          country: 'Uganda'
        }
      ],
      sanctions: [
        {
          type: 'License Suspension',
          date: new Date('2024-12-15'),
          reason: 'Failure to complete required CPD credits',
          status: 'active'
        }
      ],
      scopeOfPractice: [
        'General Medicine'
      ]
    }
  ];
  
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
    this.titleService.setTitle('Verification Center - Embassy Portal');
  }

  onSubmit(): void {
    if (this.verificationForm.valid) {
      this.isVerifying = true;
      this.verificationError = null;
      this.verificationResult = null;
      
      const formData = this.verificationForm.value as VerificationRequest;
      
      // Simulate API call delay
      setTimeout(() => {
        const practitioner = this.mockPractitioners.find(
          p => p.licenseNumber.toUpperCase() === formData.licenseNumber.toUpperCase()
        );
        
        if (practitioner) {
          this.verificationResult = {
            practitioner: practitioner as any,
            verificationId: 'VER-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9999)).padStart(3, '0'),
            timestamp: new Date(),
            officialLetterAvailable: practitioner.status === 'active' || practitioner.status === 'suspended'
          };
        } else {
          this.verificationError = 'License number not found in Uganda Medical Registry';
        }
        
        this.isVerifying = false;
      }, 2000);
    } else {
      this.verificationError = 'Please fill in all required fields';
    }
  }

  generateOfficialLetter(): void {
    if (this.verificationResult) {
      const letterRef = `UKE-VL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(3, '0')}`;
      alert(`Official verification letter generated: ${letterRef}`);
    }
  }

  clearResults(): void {
    this.verificationResult = null;
    this.verificationError = null;
    this.verificationForm.reset();
    this.verificationForm.patchValue({ country: 'Uganda' });
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'ri-check-line text-green-600';
      case 'suspended': return 'ri-pause-line text-orange-600';
      case 'revoked': return 'ri-close-line text-red-600';
      case 'expired': return 'ri-time-line text-gray-600';
      case 'provisional': return 'ri-hourglass-line text-blue-600';
      default: return 'ri-question-line text-gray-600';
    }
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}