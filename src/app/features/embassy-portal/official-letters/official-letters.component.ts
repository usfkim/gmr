import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface OfficialLetter {
  id: string;
  letterReference: string;
  practitionerName: string;
  licenseNumber: string;
  verificationPurpose: string;
  requestedBy: string;
  department: string;
  generatedDate: Date;
  status: 'draft' | 'generated' | 'sent' | 'downloaded';
  letterType: 'verification' | 'non_verification' | 'conditional';
  validityPeriod: number; // days
  downloadCount: number;
  lastAccessed?: Date;
}

@Component({
  selector: 'app-official-letters',
  templateUrl: './official-letters.component.html',
  styleUrls: ['./official-letters.component.css']
})
export class OfficialLettersComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedStatus = 'all';
  selectedType = 'all';
  
  // Mock official letters
  officialLetters: OfficialLetter[] = [
    {
      id: 'OL-2025-001',
      letterReference: 'UKE-VL-2025-001',
      practitionerName: 'Dr. Yusuf AbdulHakim Addo',
      licenseNumber: 'UMC-UG-2458',
      verificationPurpose: 'Work Permit Application',
      requestedBy: 'Sarah Johnson',
      department: 'Visa Section',
      generatedDate: new Date('2025-01-15T14:30:00'),
      status: 'downloaded',
      letterType: 'verification',
      validityPeriod: 90,
      downloadCount: 3,
      lastAccessed: new Date('2025-01-16T09:15:00')
    },
    {
      id: 'OL-2025-002',
      letterReference: 'UKE-VL-2025-002',
      practitionerName: 'Nurse Patricia Nakato',
      licenseNumber: 'NMC-UG-5721',
      verificationPurpose: 'Visa Application',
      requestedBy: 'Michael Brown',
      department: 'Immigration',
      generatedDate: new Date('2025-01-15T11:20:00'),
      status: 'sent',
      letterType: 'verification',
      validityPeriod: 60,
      downloadCount: 1,
      lastAccessed: new Date('2025-01-15T11:25:00')
    }
  ];

  filteredLetters: OfficialLetter[] = [];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    this.titleService.setTitle('Official Letters - Embassy Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredLetters = this.officialLetters.filter(letter => {
      const matchesStatus = this.selectedStatus === 'all' || letter.status === this.selectedStatus;
      const matchesType = this.selectedType === 'all' || letter.letterType === this.selectedType;
      
      return matchesStatus && matchesType;
    });
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  downloadLetter(id: string): void {
    const letter = this.officialLetters.find(l => l.id === id);
    if (letter) {
      letter.downloadCount++;
      letter.lastAccessed = new Date();
      alert(`Downloading official letter: ${letter.letterReference}`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'downloaded': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
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