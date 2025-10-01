import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface BatchVerificationJob {
  id: string;
  fileName: string;
  totalRecords: number;
  processedRecords: number;
  successfulVerifications: number;
  failedVerifications: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedBy: string;
  uploadDate: Date;
  completedDate?: Date;
  results?: Array<{
    licenseNumber: string;
    practitionerName: string;
    status: string;
    verificationStatus: 'verified' | 'not_found' | 'suspended' | 'revoked';
    letterGenerated: boolean;
  }>;
}

@Component({
  selector: 'app-batch-verification',
  templateUrl: './batch-verification.component.html',
  styleUrls: ['./batch-verification.component.css']
})
export class BatchVerificationComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  
  // Mock batch verification jobs
  batchJobs: BatchVerificationJob[] = [
    {
      id: 'BV-2025-001',
      fileName: 'visa_applicants_january_2025.csv',
      totalRecords: 45,
      processedRecords: 45,
      successfulVerifications: 38,
      failedVerifications: 7,
      status: 'completed',
      uploadedBy: 'Sarah Johnson - Visa Section',
      uploadDate: new Date('2025-01-15T10:00:00'),
      completedDate: new Date('2025-01-15T10:15:00'),
      results: [
        {
          licenseNumber: 'UMC-UG-2458',
          practitionerName: 'Dr. Yusuf AbdulHakim Addo',
          status: 'Active',
          verificationStatus: 'verified',
          letterGenerated: true
        },
        {
          licenseNumber: 'UMC-UG-4521',
          practitionerName: 'Dr. John Mukasa',
          status: 'Suspended',
          verificationStatus: 'suspended',
          letterGenerated: true
        }
      ]
    },
    {
      id: 'BV-2025-002',
      fileName: 'work_permit_applications.csv',
      totalRecords: 23,
      processedRecords: 15,
      successfulVerifications: 12,
      failedVerifications: 3,
      status: 'processing',
      uploadedBy: 'Michael Brown - Immigration',
      uploadDate: new Date('2025-01-16T14:30:00')
    }
  ];

  // CSV template for embassies
  csvTemplate = [
    'License Number,Applicant Name,Purpose,Requesting Officer,Department',
    'UMC-UG-2458,Dr. Yusuf AbdulHakim,work_permit,Sarah Johnson,Visa Section',
    'NMC-UG-5721,Nurse Patricia Nakato,visa_application,Michael Brown,Immigration',
    'UMC-UG-4521,Dr. John Mukasa,credential_recognition,Patricia Wilson,Consular'
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
    this.titleService.setTitle('Batch Verification - Embassy Portal');
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
        this.processBatchVerification();
      }
    }, 200);
  }

  processBatchVerification(): void {
    // Create new batch job
    const newJob: BatchVerificationJob = {
      id: 'BV-' + new Date().getFullYear() + '-' + String(this.batchJobs.length + 1).padStart(3, '0'),
      fileName: this.selectedFile?.name || 'unknown.csv',
      totalRecords: Math.floor(Math.random() * 50) + 10,
      processedRecords: 0,
      successfulVerifications: 0,
      failedVerifications: 0,
      status: 'processing',
      uploadedBy: this.currentUser.name || 'Current User',
      uploadDate: new Date()
    };

    this.batchJobs.unshift(newJob);

    // Simulate processing
    setTimeout(() => {
      newJob.status = 'completed';
      newJob.processedRecords = newJob.totalRecords;
      newJob.successfulVerifications = Math.floor(newJob.totalRecords * 0.85);
      newJob.failedVerifications = newJob.totalRecords - newJob.successfulVerifications;
      newJob.completedDate = new Date();
    }, 5000);

    this.selectedFile = null;
    alert('Batch verification job started successfully!');
  }

  downloadTemplate(): void {
    const csvContent = this.csvTemplate.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'embassy_verification_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadResults(jobId: string): void {
    const job = this.batchJobs.find(j => j.id === jobId);
    if (job && job.results) {
      alert(`Downloading results for batch job: ${jobId}`);
    }
  }

  generateBulkLetters(jobId: string): void {
    const job = this.batchJobs.find(j => j.id === jobId);
    if (job) {
      alert(`Generating official letters for all verified practitioners in job: ${jobId}`);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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