import { Injectable, inject } from '@angular/core';
import { BlockchainService } from '../../security/services/blockchain.service';
import { AuditLogService } from '../../security/services/audit-log.service';

export interface RenewalApplication {
  id: string;
  licenseNumber: string;
  practitionerId: string;
  status: 'initiated' | 'cpd_check' | 'payment_pending' | 'approved' | 'rejected';
  cpdStatus: {
    required: number;
    completed: number;
    verified: number;
    deficient: boolean;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  renewalFee: number;
  lateFee: number;
  totalAmount: number;
  submittedDate: Date;
  approvedDate?: Date;
  newExpiryDate?: Date;
  digitalCertHash?: string;
  blockchainTxId?: string;
  webhookNotifications: WebhookNotification[];
}

export interface WebhookNotification {
  id: string;
  type: 'employer' | 'facility' | 'embassy' | 'insurance';
  endpoint: string;
  status: 'pending' | 'sent' | 'failed' | 'acknowledged';
  payload: any;
  sentDate?: Date;
  responseCode?: number;
  retryCount: number;
}

export interface CpdVerification {
  activityId: string;
  title: string;
  provider: string;
  credits: number;
  category: string;
  completedDate: Date;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  certificate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RenewalService {
  private blockchainService = inject(BlockchainService);
  private auditService = inject(AuditLogService);

  /**
   * Step 1: Initiate renewal process
   */
  async initiateRenewal(licenseNumber: string, practitionerId: string): Promise<RenewalApplication> {
    const renewalId = this.generateRenewalId();
    
    // Check CPD status
    const cpdStatus = await this.checkCpdCompliance(licenseNumber);
    
    // Calculate fees
    const fees = await this.calculateRenewalFees(licenseNumber, cpdStatus.deficient);
    
    const renewal: RenewalApplication = {
      id: renewalId,
      licenseNumber,
      practitionerId,
      status: cpdStatus.deficient ? 'cpd_check' : 'payment_pending',
      cpdStatus,
      paymentStatus: 'pending',
      renewalFee: fees.base,
      lateFee: fees.late,
      totalAmount: fees.total,
      submittedDate: new Date(),
      webhookNotifications: []
    };

    // Log renewal initiation
    await this.auditService.logAdminAction(
      practitionerId,
      'practitioner',
      'RENEWAL_INITIATED',
      'license',
      licenseNumber,
      true,
      'License renewal process started',
      { renewalId, cpdStatus, fees }
    );

    return renewal;
  }

  /**
   * Step 2: CPD compliance check
   */
  async checkCpdCompliance(licenseNumber: string): Promise<{
    required: number;
    completed: number;
    verified: number;
    deficient: boolean;
  }> {
    // Mock CPD check - in production, query CPD database
    const cpdData = {
      required: 60,
      completed: 52,
      verified: 48,
      deficient: false
    };

    cpdData.deficient = cpdData.verified < cpdData.required;

    // Log CPD check
    await this.auditService.logAdminAction(
      'SYSTEM',
      'cpd_service',
      'CPD_COMPLIANCE_CHECK',
      'license',
      licenseNumber,
      true,
      `CPD Status: ${cpdData.verified}/${cpdData.required} credits`,
      cpdData
    );

    return cpdData;
  }

  /**
   * Step 3: Process renewal payment
   */
  async processRenewalPayment(
    renewalId: string,
    paymentMethod: string
  ): Promise<{ success: boolean; transactionId: string }> {
    const renewal = await this.getRenewal(renewalId);
    const transactionId = this.generateTransactionId();

    // Process payment
    const paymentResult = await this.processPayment(renewal.totalAmount, paymentMethod);
    
    if (paymentResult.success) {
      renewal.paymentStatus = 'paid';
      renewal.status = 'approved';
      
      // Issue new digital certificate
      const newCertHash = await this.issueRenewalCertificate(renewal);
      renewal.digitalCertHash = newCertHash;
      renewal.newExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      
      // Record on blockchain
      const blockchainTx = await this.blockchainService.recordLicenseAction(
        renewal.licenseNumber,
        'LICENSE_RENEWED',
        renewal.practitionerId,
        'Annual license renewal completed'
      );
      renewal.blockchainTxId = blockchainTx.id;

      // Send webhook notifications
      await this.sendRenewalNotifications(renewal);
    }

    // Log payment processing
    await this.auditService.logAdminAction(
      renewal.practitionerId,
      'practitioner',
      'RENEWAL_PAYMENT_PROCESSED',
      'license',
      renewal.licenseNumber,
      paymentResult.success,
      paymentResult.success ? 'Payment successful' : 'Payment failed',
      { renewalId, transactionId, amount: renewal.totalAmount }
    );

    return {
      success: paymentResult.success,
      transactionId
    };
  }

  /**
   * Step 4: Send webhook notifications to stakeholders
   */
  async sendRenewalNotifications(renewal: RenewalApplication): Promise<void> {
    const notifications: WebhookNotification[] = [
      {
        id: this.generateNotificationId(),
        type: 'employer',
        endpoint: 'https://mulago.go.ug/api/webhooks/license-renewal',
        status: 'pending',
        payload: {
          licenseNumber: renewal.licenseNumber,
          status: 'renewed',
          expiryDate: renewal.newExpiryDate,
          digitalCertHash: renewal.digitalCertHash
        },
        retryCount: 0
      },
      {
        id: this.generateNotificationId(),
        type: 'facility',
        endpoint: 'https://facilities.ugandamedicalregistry.com/api/webhooks/staff-update',
        status: 'pending',
        payload: {
          licenseNumber: renewal.licenseNumber,
          status: 'renewed',
          expiryDate: renewal.newExpiryDate
        },
        retryCount: 0
      }
    ];

    // Send notifications
    for (const notification of notifications) {
      try {
        await this.sendWebhook(notification);
        notification.status = 'sent';
        notification.sentDate = new Date();
        notification.responseCode = 200;
      } catch (error) {
        notification.status = 'failed';
        notification.retryCount++;
      }
    }

    renewal.webhookNotifications = notifications;

    // Log notification sending
    await this.auditService.logAdminAction(
      'SYSTEM',
      'webhook_service',
      'RENEWAL_NOTIFICATIONS_SENT',
      'license',
      renewal.licenseNumber,
      true,
      `Sent ${notifications.length} webhook notifications`,
      { notifications: notifications.map(n => ({ type: n.type, status: n.status })) }
    );
  }

  private async calculateRenewalFees(licenseNumber: string, isCpdDeficient: boolean): Promise<{
    base: number;
    late: number;
    cpdPenalty: number;
    total: number;
  }> {
    const baseFee = 450000; // UGX
    const lateFee = this.isLateRenewal(licenseNumber) ? 112500 : 0; // 25% penalty
    const cpdPenalty = isCpdDeficient ? 200000 : 0; // CPD deficiency penalty
    
    return {
      base: baseFee,
      late: lateFee,
      cpdPenalty,
      total: baseFee + lateFee + cpdPenalty
    };
  }

  private isLateRenewal(licenseNumber: string): boolean {
    // Mock late check - in production, check against expiry date
    return Math.random() > 0.8; // 20% chance of late renewal
  }

  private async issueRenewalCertificate(renewal: RenewalApplication): Promise<string> {
    const certData = {
      licenseNumber: renewal.licenseNumber,
      renewalDate: new Date().toISOString(),
      expiryDate: renewal.newExpiryDate?.toISOString(),
      renewalId: renewal.id
    };
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(certData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async processPayment(amount: number, method: string): Promise<{ success: boolean }> {
    // Mock payment processing - in production, integrate with payment gateway
    return { success: Math.random() > 0.05 }; // 95% success rate
  }

  private async sendWebhook(notification: WebhookNotification): Promise<void> {
    // Mock webhook sending - in production, make HTTP request
    console.log(`Sending webhook to ${notification.endpoint}:`, notification.payload);
  }

  private async getRenewal(renewalId: string): Promise<RenewalApplication> {
    // Mock - in production, fetch from database
    return {} as RenewalApplication;
  }

  private generateRenewalId(): string {
    return 'REN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateTransactionId(): string {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateNotificationId(): string {
    return 'WHK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}