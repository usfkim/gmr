import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface BroadcastMessage {
  id: string;
  type: 'email' | 'sms' | 'in_app' | 'multi_channel';
  title: string;
  content: string;
  targetAudience: {
    practitioners: boolean;
    facilities: boolean;
    public: boolean;
    embassies: boolean;
  };
  filters: {
    profession?: string[];
    region?: string[];
    status?: string[];
    specialty?: string[];
  };
  priority: 'urgent' | 'high' | 'normal' | 'low';
  scheduledDate?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdBy: string;
  createdDate: Date;
  sentDate?: Date;
  deliveryStats?: {
    totalRecipients: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
  };
}

@Component({
  selector: 'app-broadcast-center',
  templateUrl: './broadcast-center.component.html',
  styleUrls: ['./broadcast-center.component.css']
})
export class BroadcastCenterComponent implements OnInit {
  titleService = inject(Title);
  router = inject(Router);
  
  currentUser: any = null;
  selectedType = 'all';
  selectedStatus = 'all';
  
  // Mock broadcast messages
  broadcasts: BroadcastMessage[] = [
    {
      id: 'BC-2025-001',
      type: 'multi_channel',
      title: 'Urgent: License Renewal Deadline Reminder',
      content: 'This is a reminder that your medical license expires on March 31, 2025. Please complete your renewal application and CPD requirements before the deadline to avoid late fees and potential suspension.',
      targetAudience: {
        practitioners: true,
        facilities: false,
        public: false,
        embassies: false
      },
      filters: {
        profession: ['Medical Doctor'],
        status: ['active'],
        specialty: ['Cardiology', 'Surgery', 'Internal Medicine']
      },
      priority: 'urgent',
      scheduledDate: new Date('2025-01-20T09:00:00'),
      status: 'scheduled',
      createdBy: 'Communications Officer - Sarah Nambi',
      createdDate: new Date('2025-01-15T14:30:00')
    },
    {
      id: 'BC-2025-002',
      type: 'email',
      title: 'New CPD Requirements for 2025',
      content: 'The Medical Council has updated the Continuing Professional Development requirements for 2025. All medical practitioners must complete a minimum of 60 CPD credits, including mandatory courses in medical ethics and patient safety.',
      targetAudience: {
        practitioners: true,
        facilities: true,
        public: false,
        embassies: false
      },
      filters: {
        profession: ['Medical Doctor', 'Nurse', 'Pharmacist']
      },
      priority: 'high',
      status: 'sent',
      createdBy: 'Policy Department - Dr. James Mukasa',
      createdDate: new Date('2025-01-10T10:00:00'),
      sentDate: new Date('2025-01-12T08:00:00'),
      deliveryStats: {
        totalRecipients: 15678,
        delivered: 15234,
        failed: 444,
        opened: 12456,
        clicked: 8765
      }
    },
    {
      id: 'BC-2025-003',
      type: 'sms',
      title: 'Emergency: Suspected Unlicensed Practitioner Alert',
      content: 'ALERT: Dr. Michael Okello (License: UMC-UG-4789) is under investigation for suspected fraudulent credentials. Do not accept services until investigation is complete. Report any encounters to +256 414 000 000.',
      targetAudience: {
        practitioners: false,
        facilities: true,
        public: true,
        embassies: false
      },
      filters: {
        region: ['Northern', 'Eastern']
      },
      priority: 'urgent',
      status: 'sent',
      createdBy: 'Investigation Unit - Inspector David Kiggundu',
      createdDate: new Date('2025-01-12T16:45:00'),
      sentDate: new Date('2025-01-12T17:00:00'),
      deliveryStats: {
        totalRecipients: 25678,
        delivered: 25234,
        failed: 444,
        opened: 18765,
        clicked: 5432
      }
    }
  ];

  filteredBroadcasts: BroadcastMessage[] = [];
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check authentication and admin role
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = JSON.parse(currentUser);
    
    if (this.currentUser.role !== 'admin') {
      alert('Access denied. This portal is restricted to government officials and regulators.');
      this.router.navigate(['/dashboard']);
      return;
    }
    
    this.titleService.setTitle('Broadcast Center - Government Portal');
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBroadcasts = this.broadcasts.filter(broadcast => {
      const matchesType = this.selectedType === 'all' || broadcast.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || broadcast.status === this.selectedStatus;
      
      return matchesType && matchesStatus;
    });
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  createBroadcast(): void {
    alert('Opening broadcast creation wizard...');
  }

  sendBroadcast(id: string): void {
    const broadcast = this.broadcasts.find(b => b.id === id);
    if (broadcast) {
      broadcast.status = 'sending';
      broadcast.sentDate = new Date();
      this.applyFilters();
      
      // Simulate sending process
      setTimeout(() => {
        broadcast.status = 'sent';
        broadcast.deliveryStats = {
          totalRecipients: Math.floor(Math.random() * 20000) + 5000,
          delivered: 0,
          failed: 0,
          opened: 0,
          clicked: 0
        };
        broadcast.deliveryStats.delivered = Math.floor(broadcast.deliveryStats.totalRecipients * 0.97);
        broadcast.deliveryStats.failed = broadcast.deliveryStats.totalRecipients - broadcast.deliveryStats.delivered;
        broadcast.deliveryStats.opened = Math.floor(broadcast.deliveryStats.delivered * 0.75);
        broadcast.deliveryStats.clicked = Math.floor(broadcast.deliveryStats.opened * 0.45);
        this.applyFilters();
      }, 3000);
      
      alert(`Broadcast ${id} is being sent...`);
    }
  }

  viewAnalytics(id: string): void {
    alert(`Viewing analytics for broadcast: ${id}`);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-orange-100 text-orange-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'email': return 'ri-mail-line';
      case 'sms': return 'ri-message-line';
      case 'in_app': return 'ri-notification-line';
      case 'multi_channel': return 'ri-broadcast-line';
      default: return 'ri-send-plane-line';
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