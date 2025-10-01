import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  currentUser: any = null;
  
  // Current date for verification display
  currentDate = new Date();
  
  // Mock practitioner data - in production, this would come from API
  practitioner = {
    name: 'Dr. Yusuf AbdulHakim Addo',
    licenseNumber: 'UMC-UG-2458',
    specialty: 'Cardiology',
    subSpecialties: ['Interventional Cardiology', 'Cardiac Electrophysiology', 'Cardiac Surgery'],
    licenseExpiry: new Date('2025-12-31'),
    licenseIssued: new Date('2023-01-15'),
    status: 'Active',
    email: 'yusuf.addo@example.com',
    phone: '+256 700 123 456',
    facility: 'Mulago National Referral Hospital',
    department: 'Department of Cardiology',
    region: 'Central Region (Kampala)',
    district: 'Kampala',
    address: 'Mulago Hill, Kampala, Uganda',
    yearsOfExperience: 15,
    nationalId: 'CM94050123456789',
    dateOfBirth: new Date('1985-05-12'),
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Ugandan',
    languages: ['English', 'Luganda', 'Swahili', 'Arabic'],
    emergencyContact: {
      name: 'Fatima Addo',
      relationship: 'Spouse',
      phone: '+256 700 123 457',
      email: 'fatima.addo@gmail.com'
    },
    education: [
      {
        degree: 'Doctor of Medicine (MBChB)',
        institution: 'Makerere University',
        year: 2012,
        country: 'Uganda'
      },
      {
        degree: 'Master of Medicine in Internal Medicine',
        institution: 'Makerere University',
        year: 2016,
        country: 'Uganda'
      },
      {
        degree: 'Fellowship in Interventional Cardiology',
        institution: 'University of Cape Town',
        year: 2019,
        country: 'South Africa'
      },
      {
        degree: 'Certificate in Cardiac Electrophysiology',
        institution: 'Johns Hopkins University',
        year: 2021,
        country: 'USA'
      }
    ],
    certifications: [
      {
        name: 'Board Certification in Cardiology',
        issuer: 'Uganda Medical Council',
        issued: new Date('2019-06-15'),
        expires: new Date('2029-06-15')
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'Uganda Heart Institute',
        issued: new Date('2024-12-15'),
        expires: new Date('2026-12-15')
      },
      {
        name: 'Basic Life Support (BLS)',
        issuer: 'Uganda Red Cross',
        issued: new Date('2024-06-10'),
        expires: new Date('2026-06-10')
      },
      {
        name: 'Interventional Cardiology Certification',
        issuer: 'East African College of Physicians',
        issued: new Date('2019-08-20'),
        expires: new Date('2029-08-20')
      },
      {
        name: 'Pacemaker Implantation Certification',
        issuer: 'Uganda Heart Institute',
        issued: new Date('2020-03-10'),
        expires: new Date('2025-03-10')
      },
      {
        name: 'Research Ethics Certification',
        issuer: 'Makerere University',
        issued: new Date('2023-09-05'),
        expires: new Date('2026-09-05')
      }
    ],
    consultationFee: {
      initial: 200000,
      followUp: 120000,
      procedure: 500000,
      currency: 'UGX'
    },
    availability: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Emergency Only'
    },
    services: [
      'General Cardiology Consultation',
      'Cardiac Catheterization',
      'Coronary Angioplasty',
      'Pacemaker Implantation',
      'Echocardiography',
      'Stress Testing',
      'Holter Monitoring',
      'Cardiac Electrophysiology Studies',
      'Ablation Procedures',
      'Device Follow-up',
      'Heart Failure Management'
    ],
    achievements: [
      {
        title: 'Outstanding Physician Award 2024',
        organization: 'Ministry of Health Uganda',
        year: 2024
      },
      {
        title: 'Best Young Cardiologist Award',
        organization: 'Uganda Medical Association',
        year: 2023
      },
      {
        title: 'Research Excellence Award',
        organization: 'East African Heart Society',
        year: 2022
      },
      {
        title: 'Community Service Recognition',
        organization: 'Ministry of Health Uganda',
        year: 2021
      },
      {
        title: 'Innovation in Healthcare Award',
        organization: 'Uganda Medical Innovation Hub',
        year: 2020
      }
    ],
    publications: [
      {
        title: 'Outcomes of Primary PCI in Resource-Limited Settings: A 5-Year Experience',
        journal: 'African Heart Journal',
        year: 2024,
        authors: 'Addo Y.A., Mukasa J., Nambi R., Ssali F.',
        impact: 'High Impact'
      },
      {
        title: 'Prevalence of Coronary Artery Disease in Urban Uganda',
        journal: 'East African Medical Journal',
        year: 2023,
        authors: 'Addo Y.A., Mukasa J., Nambi R.',
        impact: 'Medium Impact'
      },
      {
        title: 'Cardiac Electrophysiology in Sub-Saharan Africa: Challenges and Opportunities',
        journal: 'Heart Rhythm International',
        year: 2022,
        authors: 'Addo Y.A., Kiggundu B., Nambi R.',
        impact: 'High Impact'
      },
      {
        title: 'Cost-Effectiveness of Cardiac Interventions in Uganda',
        journal: 'Global Health Economics',
        year: 2021,
        authors: 'Addo Y.A., Mukasa J., Ssebunya P.',
        impact: 'Medium Impact'
      }
    ],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/yusuf-addo-md',
      twitter: '@DrYusufAddo',
      researchGate: 'https://researchgate.net/profile/Yusuf-Addo',
      orcid: '0000-0002-1234-5678'
    },
    membershipNumber: 'UMA-2023-0458',
    registrationDate: new Date('2023-01-15'),
    photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish',
    verified: true,
    publicProfile: true,
    profileViews: 3247,
    lastLogin: new Date('2024-12-22'),
    joinedDate: new Date('2023-01-15'),
    totalProcedures: 1247,
    successRate: 98.5,
    patientReviews: 4.9,
    researchProjects: 8,
    mentorshipPrograms: 3
  };

  // Professional statistics
  professionalStats = {
    totalPatients: 3247,
    successfulProcedures: 1247,
    yearsOfExperience: this.practitioner.yearsOfExperience,
    patientSatisfaction: 4.9,
    profileViews: this.practitioner.profileViews,
    verificationScore: 98,
    publicationsCount: this.practitioner.publications.length,
    certificationsCount: this.practitioner.certifications.length,
    achievementsCount: this.practitioner.achievements.length
  };

  // Recent patient reviews/testimonials
  patientReviews = [
    {
      id: 1,
      patientName: 'Sarah Nakato',
      rating: 5,
      comment: 'Dr. Addo is an exceptional cardiologist. His expertise and compassionate care helped me through a difficult time. The angioplasty procedure was successful and I feel much better now.',
      date: new Date('2024-12-15'),
      verified: true,
      procedure: 'Coronary Angioplasty'
    },
    {
      id: 2,
      patientName: 'John Kiprotich',
      rating: 5,
      comment: 'Professional, knowledgeable, and takes time to explain everything clearly. The pacemaker implantation went smoothly and follow-up care has been excellent.',
      date: new Date('2024-12-10'),
      verified: true,
      procedure: 'Pacemaker Implantation'
    },
    {
      id: 3,
      patientName: 'Mary Namubiru',
      rating: 5,
      comment: 'Great doctor with excellent bedside manner. The cardiac catheterization procedure went smoothly and recovery was faster than expected. Very thorough in explanations.',
      date: new Date('2024-12-05'),
      verified: true,
      procedure: 'Cardiac Catheterization'
    },
    {
      id: 4,
      patientName: 'David Okello',
      rating: 5,
      comment: 'Dr. Addo saved my life during an emergency heart attack. His quick thinking and expertise in performing emergency angioplasty made all the difference.',
      date: new Date('2024-11-28'),
      verified: true,
      procedure: 'Emergency PCI'
    },
    {
      id: 5,
      patientName: 'Grace Atim',
      rating: 4,
      comment: 'Very professional and caring. The echocardiography was thorough and Dr. Addo explained all the results clearly. Highly recommend for cardiac care.',
      date: new Date('2024-11-20'),
      verified: true,
      procedure: 'Echocardiography'
    }
  ];

  // Contact and emergency information
  contactInfo = {
    primaryPhone: this.practitioner.phone,
    emergencyPhone: '+256 700 123 999',
    email: this.practitioner.email,
    alternateEmail: 'dr.yusuf.addo@gmail.com',
    officeAddress: this.practitioner.address,
    consultationHours: this.practitioner.availability,
    hospitalPhone: '+256 414 530 692',
    departmentExtension: '2547'
  };
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    // Update practitioner data based on logged in user
    this.practitioner.name = this.currentUser.name;
    this.titleService.setTitle('Public Profile - Uganda Medical Registry');
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}