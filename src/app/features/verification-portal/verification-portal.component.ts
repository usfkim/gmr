import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-verification-portal',
  templateUrl: './verification-portal.component.html',
  styleUrl: './verification-portal.component.css'
})
export class VerificationPortalComponent implements OnInit {
  titleService = inject(Title);
  
  quickVerificationResult: any = null;
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  this.titleService.setTitle('Verification Portal - Uganda Medical Registry');
  }
  
  performQuickVerification() {
    const licenseInput = document.getElementById('licenseNumber') as HTMLInputElement;
    const licenseNumber = licenseInput?.value?.trim();
    
    if (!licenseNumber) {
      alert('Please enter a license number');
      return;
    }
    
    // Simulate API call for quick verification
    setTimeout(() => {
      // Mock verification logic - in production, this would be an API call
      const isValid = this.mockVerifyLicense(licenseNumber);
      
      this.quickVerificationResult = {
        verified: isValid,
        licenseNumber: licenseNumber,
        message: isValid 
          ? 'This license is valid and active in our registry.' 
          : 'This license number was not found in our registry.'
      };
    }, 1000);
  }
  
  private mockVerifyLicense(licenseNumber: string): boolean {
    // Mock verification - in production, this would call your API
    const validLicenses = ['UMC-UG-2458', 'NMC-UG-5721', 'UMC-UG-3126'];
    return validLicenses.includes(licenseNumber.toUpperCase());
  }
  
  signInWithGoogle() {
    // Implement Google OAuth - placeholder for now
    console.log('Google sign-in initiated');
    alert('Google sign-in would be implemented here');
  }
  
  signInWithLinkedIn() {
    // Implement LinkedIn OAuth - placeholder for now
    console.log('LinkedIn sign-in initiated');
    alert('LinkedIn sign-in would be implemented here');
  }

}
