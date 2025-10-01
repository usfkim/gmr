import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface PaymentRecord {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: 'mobile_money' | 'bank_transfer' | 'credit_card' | 'cash';
  reference: string;
  receiptUrl?: string;
}

interface PaymentDue {
  type: 'license_renewal' | 'cpd_fee' | 'late_penalty' | 'specialty_fee' | 'examination_fee';
  description: string;
  amount: number;
  dueDate: Date;
  priority: 'urgent' | 'high' | 'normal';
  canPayOnline: boolean;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedYear = '2024';
  
  // Mock payment history
  paymentHistory: PaymentRecord[] = [
    {
      id: 'PAY-001',
      description: 'Annual License Renewal 2024',
      amount: 450000,
      currency: 'UGX',
      date: new Date('2024-12-08'),
      status: 'completed',
      method: 'mobile_money',
      reference: 'UMR-2024-458-001',
      receiptUrl: 'receipt_001.pdf'
    },
    {
      id: 'PAY-002',
      description: 'Medical Indemnity Insurance 2024',
      amount: 850000,
      currency: 'UGX',
      date: new Date('2024-11-28'),
      status: 'completed',
      method: 'bank_transfer',
      reference: 'UMR-2024-458-004',
      receiptUrl: 'receipt_002.pdf'
    },
    {
      id: 'PAY-003',
      description: 'CPD Course Fee - ACLS Training',
      amount: 180000,
      currency: 'UGX',
      date: new Date('2024-11-22'),
      status: 'completed',
      method: 'bank_transfer',
      reference: 'UMR-2024-458-002',
      receiptUrl: 'receipt_003.pdf'
    }
  ];

  // Mock outstanding payments
  paymentsDue: PaymentDue[] = [
    {
      type: 'cpd_fee',
      description: 'Remaining CPD Credits - 8 credits needed',
      amount: 240000,
      dueDate: new Date('2025-03-31'),
      priority: 'normal',
      canPayOnline: true
    }
  ];

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    this.titleService.setTitle('Payments - Uganda Medical Registry');
  }

  onYearChange(event: any): void {
    this.selectedYear = event.target.value;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
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

  downloadReceipt(paymentId: string): void {
    const payment = this.paymentHistory.find(p => p.id === paymentId);
    if (payment && payment.receiptUrl) {
      alert(`Downloading receipt: ${payment.receiptUrl}`);
    }
  }

  makePayment(paymentType: string): void {
    alert(`Redirecting to payment gateway for: ${paymentType}`);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}