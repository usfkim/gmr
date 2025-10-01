import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface DigitalIdCard {
  cardNumber: string;
  qrCode: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  revocable: boolean;
  lastVerified: Date;
  verificationCount: number;
  securityFeatures: {
    digitalSignature: boolean;
    blockchain: boolean;
    biometric: boolean;
    nfc: boolean;
  };
}

interface PhysicalCardRequest {
  id: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'printing' | 'shipped' | 'delivered' | 'rejected';
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

@Component({
  selector: 'app-digital-id-card',
  templateUrl: './digital-id-card.component.html',
  styleUrls: ['./digital-id-card.component.css']
})
export class DigitalIdCardComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  showQrCode = false;
  
  // Mock digital ID card data
  digitalCard: DigitalIdCard = {
    cardNumber: 'UMR-DIG-2458-2024',
    qrCode: 'UMR-QR-2458-SECURE-HASH-2024',
    issueDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-12-31'),
    status: 'active',
    revocable: true,
    lastVerified: new Date('2024-12-22'),
    verificationCount: 247,
    securityFeatures: {
      digitalSignature: true,
      blockchain: true,
      biometric: false,
      nfc: false
    }
  };

  // Mock physical card request
  physicalCardRequest: PhysicalCardRequest = {
    id: 'PCR-2024-001',
    requestDate: new Date('2024-11-15'),
    status: 'delivered',
    deliveryAddress: 'Mulago National Referral Hospital, Cardiology Department, Kampala',
    trackingNumber: 'UG-POST-2024-789456',
    estimatedDelivery: new Date('2024-12-01'),
    fee: 75000, // UGX
    paymentStatus: 'paid'
  };

  // Practitioner data for ID card display
  practitionerData = {
    name: 'Dr. Yusuf AbdulHakim Addo',
    licenseNumber: 'UMC-UG-2458',
    profession: 'Medical Doctor',
    specialty: 'Cardiology',
    facility: 'Mulago National Referral Hospital',
    photo: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20African%20male%20doctor%20in%20formal%20attire%20with%20stethoscope%2C%20confident%20pose%2C%20neutral%20background%2C%20well-groomed%2C%20professional%20lighting%2C%20high%20quality%20professional%20headshot%20of%20Ugandan%20medical%20doctor%2C%20serious%20expression&width=200&height=200&seq=doc1&orientation=squarish',
    nationalId: 'CM94050123456789',
    bloodType: 'O+',
    emergencyContact: '+256 700 123 457'
  };
  
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
    this.titleService.setTitle('Digital ID Card - Uganda Medical Registry');
  }

  toggleQrCode(): void {
    this.showQrCode = !this.showQrCode;
  }

  downloadDigitalCard(): void {
    alert('Downloading digital ID card as PDF...');
  }

  shareQrCode(): void {
    const qrUrl = `https://ugandamedicalregistry.com/verify/qr/${this.digitalCard.qrCode}`;
    navigator.clipboard.writeText(qrUrl);
    alert('QR verification link copied to clipboard');
  }

  revokeCard(): void {
    const confirmation = confirm('Are you sure you want to revoke this digital ID card? This will invalidate all QR codes and require a new card to be issued.');
    if (confirmation) {
      this.digitalCard.status = 'revoked';
      alert('Digital ID card revoked. Please contact support to request a new card.');
    }
  }

  requestPhysicalCard(): void {
    alert('Opening physical ID card request form...');
  }

  trackPhysicalCard(): void {
    if (this.physicalCardRequest.trackingNumber) {
      alert(`Tracking physical card delivery: ${this.physicalCardRequest.trackingNumber}`);
    }
  }

  reportLostCard(): void {
    const confirmation = confirm('Report this ID card as lost or stolen? This will immediately revoke the current card and initiate replacement procedures.');
    if (confirmation) {
      alert('Card reported as lost. Replacement procedures initiated.');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getRequestStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'printing': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatExpiryDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: '2-digit'
    }).format(date);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}