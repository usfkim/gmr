import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  // Mock practitioner data - in production, this would come from backend API
  practitioner = {
    name: 'Dr. Yusuf AbdulHakim Addo',
    licenseNumber: 'UMC-UG-2458',
    specialty: 'Cardiology',
    subSpecialties: ['Interventional Cardiology', 'Cardiac Surgery', 'Electrophysiology'],
    licenseExpiry: new Date('2025-12-31'),
    licenseIssued: new Date('2023-01-15'),
    status: 'Active',
    email: 'yusuf.addo@mulago.go.ug',
    phone: '+256 700 123 456',
    facility: 'Mulago National Referral Hospital',
    department: 'Department of Cardiology',
    region: 'Central Region (Kampala)',
    district: 'Kampala',
    cpdCredits: 52,
    requiredCpdCredits: 60,
    membershipNumber: 'UMA-2023-0458',
    registrationDate: new Date('2023-01-15'),
    photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish',
    nationalId: 'CM94050123456789',
    dateOfBirth: new Date('1985-05-12'),
    gender: 'Male',
    maritalStatus: 'Married',
    emergencyContact: {
      name: 'Fatima Addo',
      relationship: 'Spouse',
      phone: '+256 700 123 457'
    }
  };
  
  currentUser: any = null;
  
  // Dashboard statistics
  dashboardStats = {
    totalPatients: 2847,
    monthlyConsultations: 156,
    upcomingAppointments: 18,
    pendingReports: 7,
    completedProcedures: 342,
    cpdProgress: (this.practitioner.cpdCredits / this.practitioner.requiredCpdCredits) * 100,
    licenseValidityDays: this.getDaysUntilExpiry(),
    verificationScore: 98,
    patientSatisfactionScore: 4.8,
    averageConsultationTime: 25, // minutes
    monthlyRevenue: 45600000, // UGX
    yearlyRevenue: 487200000 // UGX
  };

  // Recent activities data
  recentActivities = [
    {
      id: 1,
      type: 'patient_consultation',
      title: 'Completed cardiac catheterization',
      description: 'Successfully performed diagnostic catheterization for 65-year-old patient',
      date: new Date('2024-12-22'),
      icon: 'ri-heart-pulse-line',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 2,
      type: 'license_renewal',
      title: 'License renewed successfully',
      description: 'Annual license renewal completed',
      date: new Date('2024-12-20'),
      icon: 'ri-check-line',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'emergency_procedure',
      title: 'Emergency angioplasty performed',
      description: 'Primary PCI for STEMI patient - successful outcome',
      date: new Date('2024-12-18'),
      icon: 'ri-alarm-warning-line',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 4,
      type: 'cpd_upload',
      title: 'CPD certificate uploaded',
      description: 'Advanced Cardiac Life Support (ACLS) - 8 credits',
      date: new Date('2024-12-15'),
      icon: 'ri-file-line',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 5,
      type: 'research_publication',
      title: 'Research paper published',
      description: 'Outcomes of Primary PCI in Uganda - African Heart Journal',
      date: new Date('2024-12-12'),
      icon: 'ri-book-line',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 6,
      type: 'profile_update',
      title: 'Profile information updated',
      description: 'Contact information and facility details updated',
      date: new Date('2024-12-10'),
      icon: 'ri-user-line',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 7,
      type: 'payment',
      title: 'Annual fee payment processed',
      description: 'UGX 450,000 - License renewal fee',
      date: new Date('2024-12-08'),
      icon: 'ri-money-dollar-circle-line',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 8,
      type: 'conference_attendance',
      title: 'Attended cardiology conference',
      description: 'East African Cardiology Society Annual Meeting - 12 CPD credits',
      date: new Date('2024-12-06'),
      icon: 'ri-presentation-line',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      id: 9,
      type: 'verification',
      title: 'Credentials verified by employer',
      description: 'Mulago Hospital HR Department',
      date: new Date('2024-12-05'),
      icon: 'ri-shield-check-line',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      id: 10,
      type: 'patient_feedback',
      title: 'Excellent patient review received',
      description: '5-star rating: "Dr. Addo saved my life with his expertise"',
      date: new Date('2024-12-03'),
      icon: 'ri-star-line',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  // Upcoming deadlines and alerts
  upcomingDeadlines = [
    {
      id: 1,
      title: 'CPD Credits Due',
      description: 'Complete remaining 8 credits before March 31, 2025',
      dueDate: new Date('2025-03-31'),
      priority: 'medium',
      type: 'cpd'
    },
    {
      id: 2,
      title: 'Medical Indemnity Renewal',
      description: 'Professional indemnity insurance expires soon',
      dueDate: new Date('2025-02-15'),
      priority: 'high',
      type: 'insurance'
    },
    {
      id: 3,
      title: 'Pacemaker Certification Renewal',
      description: 'Device implantation certification expires',
      dueDate: new Date('2025-04-20'),
      priority: 'medium',
      type: 'certification'
    },
    {
      id: 4,
      title: 'Annual Health Check',
      description: 'Mandatory health screening for healthcare workers',
      dueDate: new Date('2025-04-30'),
      priority: 'low',
      type: 'health'
    },
    {
      id: 5,
      title: 'Research Ethics Training',
      description: 'Mandatory ethics training for research activities',
      dueDate: new Date('2025-05-15'),
      priority: 'low',
      type: 'training'
    }
  ];

  // Payment history
  paymentHistory = [
    {
      id: 1,
      description: 'Annual License Renewal 2024',
      amount: 450000,
      currency: 'UGX',
      date: new Date('2024-12-08'),
      status: 'completed',
      method: 'Mobile Money',
      reference: 'UMR-2024-458-001'
    },
    {
      id: 2,
      description: 'Medical Indemnity Insurance 2024',
      amount: 850000,
      currency: 'UGX',
      date: new Date('2024-11-28'),
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'UMR-2024-458-004'
    },
    {
      id: 3,
      description: 'CPD Course Fee - ACLS Training',
      amount: 180000,
      currency: 'UGX',
      date: new Date('2024-11-22'),
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'UMR-2024-458-002'
    },
    {
      id: 4,
      description: 'Conference Registration - EACS 2024',
      amount: 320000,
      currency: 'UGX',
      date: new Date('2024-11-01'),
      status: 'completed',
      method: 'Credit Card',
      reference: 'UMR-2024-458-005'
    },
    {
      id: 5,
      description: 'Specialty Certification Fee',
      amount: 275000,
      currency: 'UGX',
      date: new Date('2024-09-15'),
      status: 'completed',
      method: 'Mobile Money',
      reference: 'UMR-2024-458-006'
    },
    {
      id: 6,
      description: 'Late Renewal Penalty',
      amount: 50000,
      currency: 'UGX',
      date: new Date('2024-01-15'),
      status: 'completed',
      method: 'Mobile Money',
      reference: 'UMR-2024-458-003'
    }
  ];

  // CPD/CME tracking data
  cpdData = {
    currentCredits: 52,
    requiredCredits: this.practitioner.requiredCpdCredits,
    categories: [
      {
        name: 'Clinical Skills',
        earned: 22,
        required: 25,
        percentage: 88
      },
      {
        name: 'Research & Publications',
        earned: 12,
        required: 10,
        percentage: 100
      },
      {
        name: 'Teaching & Training',
        earned: 14,
        required: 15,
        percentage: 93
      },
      {
        name: 'Professional Development',
        earned: 4,
        required: 10,
        percentage: 40
      }
    ],
    recentCourses: [
      {
        title: 'Interventional Cardiology Masterclass',
        provider: 'Uganda Heart Institute',
        credits: 15,
        completedDate: new Date('2024-12-20'),
        certificate: 'IC-MASTER-2024-458.pdf'
      },
      {
        title: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'Uganda Heart Institute',
        credits: 8,
        completedDate: new Date('2024-12-15'),
        certificate: 'ACLS-2024-458.pdf'
      },
      {
        title: 'Cardiac Electrophysiology Workshop',
        provider: 'Makerere University',
        credits: 12,
        completedDate: new Date('2024-11-20'),
        certificate: 'EP-WORKSHOP-2024-458.pdf'
      },
      {
        title: 'Medical Ethics and Patient Safety',
        provider: 'Uganda Medical Association',
        credits: 6,
        completedDate: new Date('2024-10-10'),
        certificate: 'ETHICS-2024-458.pdf'
      },
      {
        title: 'Research Methodology in Cardiology',
        provider: 'East African College of Physicians',
        credits: 8,
        completedDate: new Date('2024-09-25'),
        certificate: 'RESEARCH-2024-458.pdf'
      },
      {
        title: 'Quality Improvement in Healthcare',
        provider: 'Ministry of Health Uganda',
        credits: 4,
        completedDate: new Date('2024-08-15'),
        certificate: 'QI-2024-458.pdf'
      }
    ]
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
    this.titleService.setTitle('Practitioner Dashboard - Uganda Medical Registry');
  }
  
  getDaysUntilExpiry(): number {
    const today = new Date();
    const expiry = this.practitioner.licenseExpiry;
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  getCpdProgress(): number {
    return (this.practitioner.cpdCredits / this.practitioner.requiredCpdCredits) * 100;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }
}