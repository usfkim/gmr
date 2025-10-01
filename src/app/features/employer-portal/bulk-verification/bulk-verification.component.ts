import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface VerificationJob {
  id: string;
  name: string;
  type: 'csv_upload' | 'api_sync' | 'manual_entry';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  totalRecords: number;
  processedRecords: number;
  successfulVerifications: number;
  failedVerifications: number;
  createdBy: string;
  createdDate: Date;
  completedDate?: Date;
  results?: {
    verified: Array<{
      name: string;
      licenseNumber: string;
      status: string;
      expiryDate: Date;
    }>;
    failed: Array<{
      name: string;
      licenseNumber: string;
      reason: string;
    }>;
  };
}

@Component({
  selector: 'app-bulk-verification',
  templateUrl: './bulk-verification.component.html',
  styleUrls: ['./bulk-verification.component.css']
})
export class BulkVerificationComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  
  // Mock verification jobs
  verificationJobs: VerificationJob[] = [
    {
      id: 'VJ-2025-001',
      name: 'January 2025 Staff Verification',
      type: 'csv_upload',
      status: 'completed',
      totalRecords: 247,
      processedRecords: 247,
      successfulVerifications: 234,
      failedVerifications: 13,
      createdBy: 'HR Manager - Grace Atim',
      createdDate: new Date('2025-01-15T10:00:00'),
      completedDate: new Date('2025-01-15T10:45:00'),
      results: {
        verified: [
          {
            name: 'Dr. Yusuf AbdulHakim',
            licenseNumber: 'UMC-UG-2458',
            status: 'Active',
            expiryDate: new Date('2025-12-31')
          },
          {
            name: 'Nurse Sarah Nakato',
            licenseNumber: 'NMC-UG-5721',
            status: 'Active',
            expiryDate: new Date('2025-08-15')
          }
        ],
        failed: [
          {
            name: 'Dr. John Mukasa',
            licenseNumber: 'UMC-UG-4521',
            reason: 'License suspended due to CPD non-compliance'
          },
          {
            name: 'Nurse Patricia Nambi',
            licenseNumber: 'NMC-UG-7891',
            reason: 'License expired - renewal required'
          }
        ]
      }
    },
    {
      id: 'VJ-2025-002',
      name: 'New Hires Verification - December',
      type: 'manual_entry',
      status: 'processing',
      totalRecords: 12,
      processedRecords: 8,
      successfulVerifications: 7,
      failedVerifications: 1,
      createdBy: 'HR Officer - John Mukasa',
      createdDate: new Date('2025-01-14T14:30:00')
    },
    {
      id: 'VJ-2025-003',
      name: 'API Sync - Weekly Update',
      type: 'api_sync',
      status: 'pending',
      totalRecords: 2847,
      processedRecords: 0,
      successfulVerifications: 0,
      failedVerifications: 0,
      createdBy: 'System Automation',
      createdDate: new Date('2025-01-16T08:00:00')
    }
  ];

  // Sample CSV template data
  csvTemplate = [
    'Name,License Number,Position,Department,Email',
    'Dr. John Doe,UMC-UG-1234,Senior Consultant,Cardiology,john.doe@hospital.ug',
    'Nurse Jane Smith,NMC-UG-5678,Registered Nurse,ICU,jane.smith@hospital.ug',
    'Dr. Michael Johnson,UMC-UG-9012,Medical Officer,Emergency,michael.johnson@hospital.ug'
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
    this.titleService.setTitle('Bulk Verification - Employer Portal');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
    } else {
      alert('Please select a valid CSV file');
    }
  }

  uploadCSV(): void {
    if (!this.selectedFile) {
      alert('Please select a CSV file first');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.isUploading = false;
        this.processVerification();
      }
    }, 200);
  }

  processVerification(): void {
    // Create new verification job
    const newJob: VerificationJob = {
      id: 'VJ-' + new Date().getFullYear() + '-' + String(this.verificationJobs.length + 1).padStart(3, '0'),
      name: `Bulk Verification - ${this.selectedFile?.name}`,
      type: 'csv_upload',
      status: 'processing',
      totalRecords: Math.floor(Math.random() * 100) + 50,
      processedRecords: 0,
      successfulVerifications: 0,
      failedVerifications: 0,
      createdBy: this.currentUser.name || 'Current User',
      createdDate: new Date()
    };

    this.verificationJobs.unshift(newJob);

    // Simulate processing
    setTimeout(() => {
      newJob.status = 'completed';
      newJob.processedRecords = newJob.totalRecords;
      newJob.successfulVerifications = Math.floor(newJob.totalRecords * 0.92);
      newJob.failedVerifications = newJob.totalRecords - newJob.successfulVerifications;
      newJob.completedDate = new Date();
    }, 3000);

    this.selectedFile = null;
    alert('Verification job started successfully!');
  }

  downloadTemplate(): void {
    const csvContent = this.csvTemplate.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'staff_verification_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadResults(jobId: string): void {
    const job = this.verificationJobs.find(j => j.id === jobId);
    if (job && job.results) {
      alert(`Downloading results for job: ${jobId}`);
    }
  }

  retryJob(jobId: string): void {
    const job = this.verificationJobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'processing';
      alert(`Retrying verification job: ${jobId}`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'csv_upload': return 'ri-file-excel-line';
      case 'api_sync': return 'ri-code-line';
      case 'manual_entry': return 'ri-edit-line';
      default: return 'ri-file-line';
    }
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