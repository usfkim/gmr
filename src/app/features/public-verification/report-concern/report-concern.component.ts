import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-concern',
  templateUrl: './report-concern.component.html',
  styleUrls: ['./report-concern.component.css']
})
export class ReportConcernComponent implements OnInit {
  titleService = inject(Title);
  
  isSubmitting = false;
  submitted = false;
  
  reportForm = new FormGroup({
    concernType: new FormControl('', [Validators.required]),
    practitionerName: new FormControl(''),
    licenseNumber: new FormControl(''),
    facilityName: new FormControl(''),
    description: new FormControl('', [Validators.required]),
    reporterName: new FormControl(''),
    reporterEmail: new FormControl('', [Validators.email]),
    reporterPhone: new FormControl(''),
    anonymous: new FormControl(false)
  });
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('Report a Concern - Public Verification');
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.isSubmitting = true;
      
      // Simulate submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitted = true;
        
        // Generate reference number
        const refNumber = 'REP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0');
        alert(`Report submitted successfully. Reference: ${refNumber}`);
      }, 2000);
    }
  }

  resetForm(): void {
    this.reportForm.reset();
    this.submitted = false;
  }
}