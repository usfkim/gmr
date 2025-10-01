import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-verification',
  templateUrl: './public-verification.component.html',
  styleUrls: ['./public-verification.component.css']
})
export class PublicVerificationComponent implements OnInit {
  titleService = inject(Title);
  
  verificationResult: any = null;
  isVerifying = false;
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.titleService.setTitle('Public Verification - Uganda Medical Registry');
  }

  verifyLicense(): void {
    const licenseInput = document.getElementById('licenseNumber') as HTMLInputElement;
    const countryInput = document.getElementById('country') as HTMLSelectElement;
    
    const licenseNumber = licenseInput?.value?.trim();
    const country = countryInput?.value;
    
    if (!licenseNumber) {
      alert('Please enter a license number');
      return;
    }
    
    this.isVerifying = true;
    
    // Simulate API call
    setTimeout(() => {
      const isValid = this.mockVerifyLicense(licenseNumber);
      
      this.verificationResult = {
        licenseNumber: licenseNumber,
        country: country,
        verified: isValid,
        status: isValid ? 'verified' : 'not_found',
        practitioner: isValid ? {
          name: 'Dr. Yusuf AbdulHakim Addo',
          profession: 'Medical Doctor',
          specialty: 'Cardiology',
          facility: 'Mulago National Referral Hospital',
          region: 'Central Region (Kampala)',
          registrationDate: new Date('2023-01-15'),
          expiryDate: new Date('2025-12-31')
        } : null
      };
      
      this.isVerifying = false;
    }, 1500);
  }

  private mockVerifyLicense(licenseNumber: string): boolean {
    const validLicenses = ['UMC-UG-2458', 'NMC-UG-5721', 'UMC-UG-3126'];
    return validLicenses.includes(licenseNumber.toUpperCase());
  }

  clearResults(): void {
    this.verificationResult = null;
    const licenseInput = document.getElementById('licenseNumber') as HTMLInputElement;
    if (licenseInput) licenseInput.value = '';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'verified': return 'ri-check-line text-green-600';
      case 'suspended': return 'ri-pause-line text-orange-600';
      case 'revoked': return 'ri-close-line text-red-600';
      case 'expired': return 'ri-time-line text-gray-600';
      default: return 'ri-close-line text-red-600';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  }
}