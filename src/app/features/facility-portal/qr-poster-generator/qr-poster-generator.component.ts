import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface PosterTemplate {
  id: string;
  name: string;
  description: string;
  size: 'A4' | 'A3' | 'A2' | 'A1' | 'Letter' | 'Tabloid';
  orientation: 'portrait' | 'landscape';
  layout: 'grid' | 'list' | 'department_grouped' | 'specialty_grouped';
  includeQr: boolean;
  includePhotos: boolean;
  includeFacilityInfo: boolean;
  lastGenerated?: Date;
  downloadCount: number;
}

interface VerifiedStaff {
  name: string;
  licenseNumber: string;
  profession: string;
  specialty?: string;
  position: string;
  department: string;
  photo?: string;
  qrCode: string;
  verificationDate: Date;
  licenseExpiry: Date;
}

@Component({
  selector: 'app-qr-poster-generator',
  templateUrl: './qr-poster-generator.component.html',
  styleUrls: ['./qr-poster-generator.component.css']
})
export class QrPosterGeneratorComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedTemplate = 'TEMP-001';
  selectedDepartments: string[] = [];
  includeExpiringSoon = false;
  autoUpdate = true;
  
  // Mock poster templates
  posterTemplates: PosterTemplate[] = [
    {
      id: 'TEMP-001',
      name: 'Standard Lobby Poster',
      description: 'Professional layout with photos and QR codes for lobby display',
      size: 'A2',
      orientation: 'portrait',
      layout: 'department_grouped',
      includeQr: true,
      includePhotos: true,
      includeFacilityInfo: true,
      lastGenerated: new Date('2025-01-12'),
      downloadCount: 15
    },
    {
      id: 'TEMP-002',
      name: 'Department Specific',
      description: 'Compact layout for individual department displays',
      size: 'A3',
      orientation: 'landscape',
      layout: 'grid',
      includeQr: true,
      includePhotos: false,
      includeFacilityInfo: false,
      lastGenerated: new Date('2025-01-10'),
      downloadCount: 8
    },
    {
      id: 'TEMP-003',
      name: 'Emergency Contact List',
      description: 'Emergency staff roster with contact information',
      size: 'A4',
      orientation: 'portrait',
      layout: 'list',
      includeQr: false,
      includePhotos: false,
      includeFacilityInfo: true,
      lastGenerated: new Date('2025-01-08'),
      downloadCount: 23
    },
    {
      id: 'TEMP-004',
      name: 'Specialty Showcase',
      description: 'Highlight specialists by medical specialty',
      size: 'A1',
      orientation: 'landscape',
      layout: 'specialty_grouped',
      includeQr: true,
      includePhotos: true,
      includeFacilityInfo: true,
      downloadCount: 5
    }
  ];

  // Mock verified staff data
  verifiedStaff: VerifiedStaff[] = [
    {
      name: 'Dr. Yusuf AbdulHakim Addo',
      licenseNumber: 'UMC-UG-2458',
      profession: 'Medical Doctor',
      specialty: 'Cardiology',
      position: 'Senior Consultant',
      department: 'Cardiology',
      photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish',
      qrCode: 'UMR-QR-2458-VERIFY',
      verificationDate: new Date('2024-12-22'),
      licenseExpiry: new Date('2025-12-31')
    },
    {
      name: 'Dr. Sarah Nakato',
      licenseNumber: 'UMC-UG-3456',
      profession: 'Medical Doctor',
      specialty: 'Pediatrics',
      position: 'Senior Consultant',
      department: 'Pediatrics',
      qrCode: 'UMR-QR-3456-VERIFY',
      verificationDate: new Date('2024-12-20'),
      licenseExpiry: new Date('2025-02-15')
    },
    {
      name: 'Nurse Richard Akandwanaho',
      licenseNumber: 'NMC-UG-5721',
      profession: 'Nurse',
      position: 'Registered Nurse',
      department: 'ICU',
      qrCode: 'UMR-QR-5721-VERIFY',
      verificationDate: new Date('2024-12-18'),
      licenseExpiry: new Date('2025-08-10')
    }
  ];

  // Available departments
  departments = ['Cardiology', 'Pediatrics', 'ICU', 'Emergency', 'Surgery', 'Nursing', 'Laboratory', 'Radiology'];
  
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
    this.titleService.setTitle('QR Poster Generator - Facility Portal');
  }

  onTemplateChange(templateId: string): void {
    this.selectedTemplate = templateId;
  }

  onDepartmentToggle(department: string): void {
    const index = this.selectedDepartments.indexOf(department);
    if (index > -1) {
      this.selectedDepartments.splice(index, 1);
    } else {
      this.selectedDepartments.push(department);
    }
  }

  generatePoster(): void {
    const template = this.posterTemplates.find(t => t.id === this.selectedTemplate);
    if (template) {
      template.lastGenerated = new Date();
      template.downloadCount++;
      
      // Filter staff based on selected departments
      let filteredStaff = this.verifiedStaff;
      if (this.selectedDepartments.length > 0) {
        filteredStaff = this.verifiedStaff.filter(staff => 
          this.selectedDepartments.includes(staff.department)
        );
      }
      
      // Filter expiring soon if selected
      if (this.includeExpiringSoon) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        filteredStaff = filteredStaff.filter(staff => 
          staff.licenseExpiry <= thirtyDaysFromNow
        );
      }
      
      alert(`Generating ${template.name} with ${filteredStaff.length} staff members...`);
    }
  }

  previewPoster(): void {
    alert('Opening poster preview...');
  }

  downloadPoster(): void {
    const template = this.posterTemplates.find(t => t.id === this.selectedTemplate);
    if (template) {
      alert(`Downloading ${template.name} poster...`);
    }
  }

  scheduleAutoUpdate(): void {
    if (this.autoUpdate) {
      alert('Auto-update enabled. Poster will be regenerated daily at 6:00 AM.');
    } else {
      alert('Auto-update disabled. Manual regeneration required.');
    }
  }

  getSelectedTemplate(): PosterTemplate | undefined {
    return this.posterTemplates.find(t => t.id === this.selectedTemplate);
  }

  getFilteredStaffCount(): number {
    let count = this.verifiedStaff.length;
    
    if (this.selectedDepartments.length > 0) {
      count = this.verifiedStaff.filter(staff => 
        this.selectedDepartments.includes(staff.department)
      ).length;
    }
    
    if (this.includeExpiringSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      count = this.verifiedStaff.filter(staff => 
        staff.licenseExpiry <= thirtyDaysFromNow &&
        (this.selectedDepartments.length === 0 || this.selectedDepartments.includes(staff.department))
      ).length;
    }
    
    return count;
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UG').format(num);
  }

  getRecentTemplates() {
    return this.posterTemplates.filter(t => t.lastGenerated);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}