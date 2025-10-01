import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface CpdActivity {
  id: string;
  title: string;
  provider: string;
  category: 'clinical_skills' | 'research' | 'teaching' | 'professional_development' | 'ethics';
  credits: number;
  completedDate: Date;
  expiryDate?: Date;
  status: 'completed' | 'pending_verification' | 'rejected' | 'expired';
  certificateUrl?: string;
  verifiedBy?: string;
  verificationDate?: Date;
  description: string;
  learningOutcomes: string[];
  evidence: Array<{
    type: 'certificate' | 'attendance' | 'assessment' | 'reflection';
    fileName: string;
    uploadDate: Date;
  }>;
}

interface CpdRequirement {
  category: string;
  required: number;
  earned: number;
  percentage: number;
  status: 'completed' | 'on_track' | 'behind' | 'critical';
}

interface CpdPartner {
  id: string;
  name: string;
  type: 'university' | 'hospital' | 'association' | 'online_platform' | 'conference';
  logo?: string;
  description: string;
  autoSync: boolean;
  lastSync?: Date;
  availableCourses: number;
  website: string;
}

@Component({
  selector: 'app-cpd-tracker',
  templateUrl: './cpd-tracker.component.html',
  styleUrls: ['./cpd-tracker.component.css']
})
export class CpdTrackerComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedCategory = 'all';
  selectedStatus = 'all';
  
  // CPD Requirements breakdown
  cpdRequirements: CpdRequirement[] = [
    {
      category: 'Clinical Skills',
      required: 25,
      earned: 22,
      percentage: 88,
      status: 'on_track'
    },
    {
      category: 'Research & Publications',
      required: 10,
      earned: 12,
      percentage: 120,
      status: 'completed'
    },
    {
      category: 'Teaching & Training',
      required: 15,
      earned: 14,
      percentage: 93,
      status: 'on_track'
    },
    {
      category: 'Professional Development',
      required: 10,
      earned: 4,
      percentage: 40,
      status: 'behind'
    }
  ];

  // CPD Activities
  cpdActivities: CpdActivity[] = [
    {
      id: 'CPD-001',
      title: 'Interventional Cardiology Masterclass',
      provider: 'Uganda Heart Institute',
      category: 'clinical_skills',
      credits: 15,
      completedDate: new Date('2024-12-20'),
      status: 'completed',
      certificateUrl: 'IC-MASTER-2024-458.pdf',
      verifiedBy: 'Uganda Heart Institute',
      verificationDate: new Date('2024-12-21'),
      description: 'Advanced training in interventional cardiology procedures including PCI, stenting, and complex coronary interventions',
      learningOutcomes: [
        'Master complex PCI techniques',
        'Understand latest stent technologies',
        'Manage procedural complications',
        'Apply evidence-based protocols'
      ],
      evidence: [
        {
          type: 'certificate',
          fileName: 'IC_Masterclass_Certificate.pdf',
          uploadDate: new Date('2024-12-20')
        },
        {
          type: 'assessment',
          fileName: 'Practical_Assessment_Results.pdf',
          uploadDate: new Date('2024-12-20')
        }
      ]
    },
    {
      id: 'CPD-002',
      title: 'Advanced Cardiac Life Support (ACLS)',
      provider: 'Uganda Heart Institute',
      category: 'clinical_skills',
      credits: 8,
      completedDate: new Date('2024-12-15'),
      expiryDate: new Date('2026-12-15'),
      status: 'completed',
      certificateUrl: 'ACLS-2024-458.pdf',
      verifiedBy: 'Uganda Heart Institute',
      verificationDate: new Date('2024-12-16'),
      description: 'Certification in advanced cardiac life support protocols and emergency cardiac care',
      learningOutcomes: [
        'Advanced airway management',
        'Cardiac arrest algorithms',
        'Post-cardiac arrest care',
        'Team dynamics in resuscitation'
      ],
      evidence: [
        {
          type: 'certificate',
          fileName: 'ACLS_Certificate_2024.pdf',
          uploadDate: new Date('2024-12-15')
        }
      ]
    },
    {
      id: 'CPD-003',
      title: 'Medical Ethics and Patient Safety',
      provider: 'Uganda Medical Association',
      category: 'ethics',
      credits: 6,
      completedDate: new Date('2024-10-10'),
      status: 'completed',
      certificateUrl: 'ETHICS-2024-458.pdf',
      verifiedBy: 'Uganda Medical Association',
      verificationDate: new Date('2024-10-12'),
      description: 'Comprehensive training on medical ethics, patient safety, and professional conduct',
      learningOutcomes: [
        'Ethical decision-making frameworks',
        'Patient safety protocols',
        'Professional boundaries',
        'Informed consent procedures'
      ],
      evidence: [
        {
          type: 'certificate',
          fileName: 'Ethics_Training_Certificate.pdf',
          uploadDate: new Date('2024-10-10')
        },
        {
          type: 'reflection',
          fileName: 'Ethics_Reflection_Essay.pdf',
          uploadDate: new Date('2024-10-12')
        }
      ]
    },
    {
      id: 'CPD-004',
      title: 'Research Methodology Workshop',
      provider: 'Makerere University',
      category: 'research',
      credits: 8,
      completedDate: new Date('2024-09-25'),
      status: 'pending_verification',
      description: 'Workshop on clinical research methodology, data analysis, and publication ethics',
      learningOutcomes: [
        'Research design principles',
        'Statistical analysis methods',
        'Publication ethics',
        'Grant writing skills'
      ],
      evidence: [
        {
          type: 'attendance',
          fileName: 'Workshop_Attendance_Certificate.pdf',
          uploadDate: new Date('2024-09-25')
        }
      ]
    }
  ];

  // CPD Partners with auto-sync capability
  cpdPartners: CpdPartner[] = [
    {
      id: 'PART-001',
      name: 'Uganda Heart Institute',
      type: 'hospital',
      description: 'Leading cardiac care institution offering specialized cardiology training',
      autoSync: true,
      lastSync: new Date('2024-12-22'),
      availableCourses: 12,
      website: 'https://uhi.go.ug'
    },
    {
      id: 'PART-002',
      name: 'Makerere University College of Health Sciences',
      type: 'university',
      description: 'Premier medical education institution with comprehensive CPD programs',
      autoSync: true,
      lastSync: new Date('2024-12-20'),
      availableCourses: 45,
      website: 'https://chs.mak.ac.ug'
    },
    {
      id: 'PART-003',
      name: 'Uganda Medical Association',
      type: 'association',
      description: 'Professional medical association offering ethics and professional development courses',
      autoSync: false,
      availableCourses: 23,
      website: 'https://uma.ug'
    },
    {
      id: 'PART-004',
      name: 'East African College of Physicians',
      type: 'association',
      description: 'Regional medical college providing specialty training and certification',
      autoSync: false,
      availableCourses: 18,
      website: 'https://eacp.org'
    }
  ];

  filteredActivities: CpdActivity[] = [];
  totalCredits = 52;
  requiredCredits = 60;
  
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
    this.titleService.setTitle('CPD Tracker - Uganda Medical Registry');
    this.applyFilters();
  }

  getRequirementTextColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'critical': return 'text-red-600';
      case 'behind': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getCategoryDisplayName(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  applyFilters(): void {
    this.filteredActivities = this.cpdActivities.filter(activity => {
      const matchesCategory = this.selectedCategory === 'all' || activity.category === this.selectedCategory;
      const matchesStatus = this.selectedStatus === 'all' || activity.status === this.selectedStatus;
      
      return matchesCategory && matchesStatus;
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  uploadEvidence(activityId: string): void {
    alert(`Opening evidence upload for activity: ${activityId}`);
  }

  syncWithPartner(partnerId: string): void {
    const partner = this.cpdPartners.find(p => p.id === partnerId);
    if (partner) {
      partner.lastSync = new Date();
      alert(`Syncing CPD data with ${partner.name}...`);
    }
  }

  browseCourses(partnerId: string): void {
    const partner = this.cpdPartners.find(p => p.id === partnerId);
    if (partner) {
      alert(`Opening course catalog for ${partner.name}`);
    }
  }

  downloadCertificate(activityId: string): void {
    const activity = this.cpdActivities.find(a => a.id === activityId);
    if (activity && activity.certificateUrl) {
      alert(`Downloading certificate: ${activity.certificateUrl}`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRequirementStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500';
      case 'behind': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'clinical_skills': return 'ri-stethoscope-line';
      case 'research': return 'ri-microscope-line';
      case 'teaching': return 'ri-presentation-line';
      case 'professional_development': return 'ri-user-star-line';
      case 'ethics': return 'ri-scales-line';
      default: return 'ri-book-line';
    }
  }

  getPartnerIcon(type: string): string {
    switch (type) {
      case 'university': return 'ri-school-line';
      case 'hospital': return 'ri-hospital-line';
      case 'association': return 'ri-team-line';
      case 'online_platform': return 'ri-computer-line';
      case 'conference': return 'ri-presentation-line';
      default: return 'ri-building-line';
    }
  }

  getProgressPercentage(): number {
    return (this.totalCredits / this.requiredCredits) * 100;
  }

  getActivityStatusBgColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100';
      case 'pending_verification': return 'bg-yellow-100';
      case 'rejected': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  getActivityStatusTextColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending_verification': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  Math = Math;

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}