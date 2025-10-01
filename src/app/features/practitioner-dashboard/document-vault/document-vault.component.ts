import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface Document {
  id: string;
  name: string;
  type: 'degree' | 'certificate' | 'clearance' | 'cpd' | 'license' | 'identification' | 'other';
  category: 'education' | 'professional' | 'legal' | 'continuing_education' | 'personal';
  uploadDate: Date;
  expiryDate?: Date;
  status: 'verified' | 'pending' | 'rejected' | 'expired';
  verifiedBy?: string;
  verificationDate?: Date;
  fileSize: number;
  fileType: string;
  isPublic: boolean;
  tags: string[];
  notes?: string;
  downloadCount: number;
  lastAccessed: Date;
}

interface DocumentCategory {
  name: string;
  description: string;
  icon: string;
  count: number;
  requiredDocuments: string[];
}

@Component({
  selector: 'app-document-vault',
  templateUrl: './document-vault.component.html',
  styleUrls: ['./document-vault.component.css']
})
export class DocumentVaultComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedCategory = 'all';
  selectedStatus = 'all';
  searchTerm = '';
  uploadProgress = 0;
  isUploading = false;
  
  // Mock documents data
  documents: Document[] = [
    {
      id: 'DOC-001',
      name: 'Medical Degree Certificate - MBChB',
      type: 'degree',
      category: 'education',
      uploadDate: new Date('2023-01-10'),
      status: 'verified',
      verifiedBy: 'MDC Document Verification Team',
      verificationDate: new Date('2023-01-12'),
      fileSize: 2.4, // MB
      fileType: 'PDF',
      isPublic: true,
      tags: ['primary_qualification', 'makerere_university', 'required'],
      downloadCount: 15,
      lastAccessed: new Date('2024-12-20')
    },
    {
      id: 'DOC-002',
      name: 'Fellowship Certificate - Interventional Cardiology',
      type: 'certificate',
      category: 'professional',
      uploadDate: new Date('2019-06-10'),
      status: 'verified',
      verifiedBy: 'MDC Specialty Board',
      verificationDate: new Date('2019-06-15'),
      fileSize: 1.8,
      fileType: 'PDF',
      isPublic: true,
      tags: ['specialty', 'fellowship', 'uct', 'cardiology'],
      downloadCount: 8,
      lastAccessed: new Date('2024-11-15')
    },
    {
      id: 'DOC-003',
      name: 'Police Clearance Certificate',
      type: 'clearance',
      category: 'legal',
      uploadDate: new Date('2023-01-12'),
      expiryDate: new Date('2025-01-12'),
      status: 'verified',
      verifiedBy: 'MDC Background Check Unit',
      verificationDate: new Date('2023-01-15'),
      fileSize: 0.8,
      fileType: 'PDF',
      isPublic: false,
      tags: ['background_check', 'required', 'renewable'],
      downloadCount: 3,
      lastAccessed: new Date('2024-10-05')
    },
    {
      id: 'DOC-004',
      name: 'ACLS Certification 2024',
      type: 'cpd',
      category: 'continuing_education',
      uploadDate: new Date('2024-12-15'),
      expiryDate: new Date('2026-12-15'),
      status: 'verified',
      verifiedBy: 'Uganda Heart Institute',
      verificationDate: new Date('2024-12-16'),
      fileSize: 1.2,
      fileType: 'PDF',
      isPublic: true,
      tags: ['cpd', 'acls', 'emergency_medicine', '8_credits'],
      downloadCount: 2,
      lastAccessed: new Date('2024-12-22')
    },
    {
      id: 'DOC-005',
      name: 'National ID Card',
      type: 'identification',
      category: 'personal',
      uploadDate: new Date('2023-01-08'),
      status: 'verified',
      verifiedBy: 'MDC Identity Verification',
      verificationDate: new Date('2023-01-10'),
      fileSize: 0.5,
      fileType: 'PDF',
      isPublic: false,
      tags: ['identity', 'required', 'government_issued'],
      downloadCount: 1,
      lastAccessed: new Date('2023-01-15')
    },
    {
      id: 'DOC-006',
      name: 'Research Ethics Training Certificate',
      type: 'cpd',
      category: 'continuing_education',
      uploadDate: new Date('2024-09-05'),
      expiryDate: new Date('2027-09-05'),
      status: 'pending',
      fileSize: 0.9,
      fileType: 'PDF',
      isPublic: true,
      tags: ['cpd', 'research', 'ethics', '6_credits'],
      notes: 'Awaiting verification from issuing institution',
      downloadCount: 0,
      lastAccessed: new Date('2024-09-05')
    }
  ];

  documentCategories: DocumentCategory[] = [
    {
      name: 'Education',
      description: 'Degrees, diplomas, and academic transcripts',
      icon: 'ri-graduation-cap-line',
      count: this.documents.filter(d => d.category === 'education').length,
      requiredDocuments: ['Medical Degree', 'Academic Transcripts', 'Housemanship Certificate']
    },
    {
      name: 'Professional',
      description: 'Board certifications and specialty qualifications',
      icon: 'ri-award-line',
      count: this.documents.filter(d => d.category === 'professional').length,
      requiredDocuments: ['Board Certification', 'Specialty Training', 'Fellowship Certificates']
    },
    {
      name: 'Legal',
      description: 'Background checks and legal clearances',
      icon: 'ri-shield-check-line',
      count: this.documents.filter(d => d.category === 'legal').length,
      requiredDocuments: ['Police Clearance', 'Good Standing Certificate', 'Court Records']
    },
    {
      name: 'Continuing Education',
      description: 'CPD certificates and training records',
      icon: 'ri-book-read-line',
      count: this.documents.filter(d => d.category === 'continuing_education').length,
      requiredDocuments: ['CPD Certificates', 'Conference Attendance', 'Training Records']
    },
    {
      name: 'Personal',
      description: 'Identity documents and personal records',
      icon: 'ri-user-line',
      count: this.documents.filter(d => d.category === 'personal').length,
      requiredDocuments: ['National ID', 'Passport', 'Birth Certificate']
    }
  ];

  filteredDocuments: Document[] = [];
  
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
    this.titleService.setTitle('Document Vault - Uganda Medical Registry');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = !this.searchTerm || 
        doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = this.selectedCategory === 'all' || doc.category === this.selectedCategory;
      const matchesStatus = this.selectedStatus === 'all' || doc.status === this.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadDocument(file);
    }
  }

  uploadDocument(file: File): void {
    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.isUploading = false;
        this.addNewDocument(file);
      }
    }, 200);
  }

  addNewDocument(file: File): void {
    const newDoc: Document = {
      id: 'DOC-' + String(this.documents.length + 1).padStart(3, '0'),
      name: file.name,
      type: 'other',
      category: 'other' as any,
      uploadDate: new Date(),
      status: 'pending',
      fileSize: file.size / (1024 * 1024), // Convert to MB
      fileType: file.type.split('/')[1].toUpperCase(),
      isPublic: false,
      tags: ['user_uploaded'],
      downloadCount: 0,
      lastAccessed: new Date()
    };

    this.documents.unshift(newDoc);
    this.applyFilters();
    alert(`Document "${file.name}" uploaded successfully and is pending verification.`);
  }

  downloadDocument(docId: string): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      doc.downloadCount++;
      doc.lastAccessed = new Date();
      alert(`Downloading: ${doc.name}`);
    }
  }

  shareDocument(docId: string): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      const shareUrl = `https://ugandamedicalregistry.com/verify/document/${docId}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied to clipboard: ${shareUrl}`);
    }
  }

  deleteDocument(docId: string): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      const confirmation = confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`);
      if (confirmation) {
        const index = this.documents.findIndex(d => d.id === docId);
        this.documents.splice(index, 1);
        this.applyFilters();
        alert(`Document "${doc.name}" deleted successfully.`);
      }
    }
  }

  togglePublicVisibility(docId: string): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      doc.isPublic = !doc.isPublic;
      alert(`Document visibility changed to ${doc.isPublic ? 'public' : 'private'}`);
    }
  }

  requestVerification(docId: string): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      doc.status = 'pending';
      alert(`Verification requested for "${doc.name}"`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'degree': return 'ri-graduation-cap-line';
      case 'certificate': return 'ri-award-line';
      case 'clearance': return 'ri-shield-check-line';
      case 'cpd': return 'ri-book-read-line';
      case 'license': return 'ri-file-list-3-line';
      case 'identification': return 'ri-user-line';
      default: return 'ri-file-line';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'education': return 'ri-graduation-cap-line';
      case 'professional': return 'ri-award-line';
      case 'legal': return 'ri-shield-check-line';
      case 'continuing_education': return 'ri-book-read-line';
      case 'personal': return 'ri-user-line';
      default: return 'ri-folder-line';
    }
  }

  formatFileSize(sizeInMB: number): string {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  }

  isExpiringSoon(expiryDate?: Date): boolean {
    if (!expiryDate) return false;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }

  getCategoryIconClass(icon: string): string {
    return icon + ' text-purple-600 text-xl';
  }

  getDocumentTypeIconClass(type: string): string {
    return this.getTypeIcon(type) + ' text-gray-600 text-xl';
  }

  getDocumentStatusClass(status: string): string {
    return this.getStatusColor(status);
  }

  getDocumentCategoryText(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  }

  getDocumentStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getDocumentVisibilityClass(isPublic: boolean): string {
    return isPublic ? 'text-green-600' : 'text-gray-600';
  }

  getDocumentVisibilityText(isPublic: boolean): string {
    return isPublic ? 'Public' : 'Private';
  }

  getDocumentExpiryClass(expiryDate?: Date): string {
    return this.isExpiringSoon(expiryDate) ? 'text-red-600' : 'text-gray-800';
  }

  getDocumentToggleIcon(isPublic: boolean): string {
    return isPublic ? 'ri-eye-off-line' : 'ri-eye-line';
  }

  getDocumentToggleText(isPublic: boolean): string {
    return isPublic ? 'Hide' : 'Show';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}