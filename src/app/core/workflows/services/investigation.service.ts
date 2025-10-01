import { Injectable, inject } from '@angular/core';
import { BlockchainService } from '../../security/services/blockchain.service';
import { AuditLogService } from '../../security/services/audit-log.service';

export interface InvestigationCase {
  id: string;
  type: 'tip_off' | 'complaint' | 'routine_audit' | 'automated_flag';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'assigned' | 'investigating' | 'evidence_review' | 'decision_pending' | 'closed';
  title: string;
  description: string;
  practitioner?: {
    name: string;
    licenseNumber: string;
    facility: string;
  };
  facility?: {
    name: string;
    licenseNumber: string;
    region: string;
  };
  reportedBy: string;
  reportedDate: Date;
  assignedTo?: string;
  assignedDate?: Date;
  investigationNotes: InvestigationNote[];
  evidence: Evidence[];
  qrChecks: QrCheck[];
  decision?: InvestigationDecision;
  publicStatusUpdate?: PublicStatusUpdate;
  notifications: CaseNotification[];
}

export interface InvestigationNote {
  id: string;
  content: string;
  createdBy: string;
  createdDate: Date;
  confidential: boolean;
  attachments: string[];
}

export interface Evidence {
  id: string;
  type: 'document' | 'photo' | 'video' | 'audio' | 'witness_statement' | 'qr_verification';
  name: string;
  description: string;
  uploadedBy: string;
  uploadDate: Date;
  integrityHash: string;
  chainOfCustody: ChainOfCustodyEntry[];
}

export interface ChainOfCustodyEntry {
  timestamp: Date;
  action: 'collected' | 'transferred' | 'analyzed' | 'stored';
  performedBy: string;
  location: string;
  notes?: string;
}

export interface QrCheck {
  id: string;
  location: string;
  timestamp: Date;
  qrCode: string;
  verificationResult: {
    valid: boolean;
    licenseNumber?: string;
    practitionerName?: string;
    status?: string;
    discrepancies: string[];
  };
  performedBy: string;
  gpsCoordinates?: string;
  photos: string[];
}

export interface InvestigationDecision {
  decision: 'cleared' | 'warning_issued' | 'license_suspended' | 'license_revoked' | 'criminal_referral';
  reason: string;
  effectiveDate: Date;
  duration?: number; // For suspensions
  conditions?: string[];
  appealDeadline: Date;
  decidedBy: string;
  decisionDate: Date;
  blockchainTxId?: string;
}

export interface PublicStatusUpdate {
  id: string;
  licenseNumber: string;
  newStatus: string;
  effectiveDate: Date;
  publicReason: string;
  publishedDate: Date;
  publishedBy: string;
}

export interface CaseNotification {
  id: string;
  type: 'embassy' | 'employer' | 'facility' | 'public' | 'media';
  recipient: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  sentDate?: Date;
  priority: 'normal' | 'urgent';
}

@Injectable({
  providedIn: 'root'
})
export class InvestigationService {
  private blockchainService = inject(BlockchainService);
  private auditService = inject(AuditLogService);

  /**
   * Step 1: Create investigation case from tip-off
   */
  async createInvestigationCase(
    reportData: {
      type: string;
      title: string;
      description: string;
      practitionerLicense?: string;
      facilityLicense?: string;
      reportedBy: string;
      priority: string;
    }
  ): Promise<InvestigationCase> {
    const caseId = this.generateCaseId();
    
    const investigationCase: InvestigationCase = {
      id: caseId,
      type: reportData.type as any,
      priority: reportData.priority as any,
      status: 'new',
      title: reportData.title,
      description: reportData.description,
      reportedBy: reportData.reportedBy,
      reportedDate: new Date(),
      investigationNotes: [],
      evidence: [],
      qrChecks: [],
      notifications: []
    };

    // Add practitioner info if provided
    if (reportData.practitionerLicense) {
      investigationCase.practitioner = await this.getPractitionerInfo(reportData.practitionerLicense);
    }

    // Add facility info if provided
    if (reportData.facilityLicense) {
      investigationCase.facility = await this.getFacilityInfo(reportData.facilityLicense);
    }

    // Log case creation
    await this.auditService.logAdminAction(
      'SYSTEM',
      'investigation_service',
      'CASE_CREATED',
      'investigation',
      caseId,
      true,
      `New ${reportData.type} case created`,
      { priority: reportData.priority, reportedBy: reportData.reportedBy }
    );

    return investigationCase;
  }

  /**
   * Step 2: Assign inspector to case
   */
  async assignInspector(caseId: string, inspectorId: string, assignedBy: string): Promise<void> {
    const case_ = await this.getCase(caseId);
    
    case_.assignedTo = inspectorId;
    case_.assignedDate = new Date();
    case_.status = 'assigned';

    // Log assignment
    await this.auditService.logAdminAction(
      assignedBy,
      'admin',
      'CASE_ASSIGNED',
      'investigation',
      caseId,
      true,
      `Case assigned to inspector ${inspectorId}`,
      { inspectorId, assignedBy }
    );

    // Notify inspector
    await this.sendInspectorNotification(case_, inspectorId);
  }

  /**
   * Step 3: Perform on-site QR verification
   */
  async performQrCheck(
    caseId: string,
    location: string,
    qrCode: string,
    inspectorId: string,
    gpsCoordinates?: string
  ): Promise<QrCheck> {
    const qrCheck: QrCheck = {
      id: this.generateQrCheckId(),
      location,
      timestamp: new Date(),
      qrCode,
      verificationResult: await this.verifyQrCode(qrCode),
      performedBy: inspectorId,
      gpsCoordinates,
      photos: []
    };

    // Log QR check
    await this.auditService.logAdminAction(
      inspectorId,
      'inspector',
      'QR_VERIFICATION_PERFORMED',
      'investigation',
      caseId,
      true,
      `On-site QR verification at ${location}`,
      {
        qrCheckId: qrCheck.id,
        verificationResult: qrCheck.verificationResult,
        location,
        gpsCoordinates
      }
    );

    return qrCheck;
  }

  /**
   * Step 4: Upload investigation evidence
   */
  async uploadEvidence(
    caseId: string,
    evidenceType: string,
    file: File,
    description: string,
    uploadedBy: string
  ): Promise<Evidence> {
    // Generate integrity hash
    const integrityHash = await this.generateFileHash(file);
    
    const evidence: Evidence = {
      id: this.generateEvidenceId(),
      type: evidenceType as any,
      name: file.name,
      description,
      uploadedBy,
      uploadDate: new Date(),
      integrityHash,
      chainOfCustody: [
        {
          timestamp: new Date(),
          action: 'collected',
          performedBy: uploadedBy,
          location: 'Field Investigation',
          notes: description
        }
      ]
    };

    // Log evidence upload
    await this.auditService.logAdminAction(
      uploadedBy,
      'inspector',
      'EVIDENCE_UPLOADED',
      'investigation',
      caseId,
      true,
      `Evidence uploaded: ${evidenceType}`,
      {
        evidenceId: evidence.id,
        fileName: file.name,
        fileSize: file.size,
        integrityHash
      }
    );

    return evidence;
  }

  /**
   * Step 5: Make investigation decision
   */
  async makeInvestigationDecision(
    caseId: string,
    decision: string,
    reason: string,
    decidedBy: string,
    duration?: number,
    conditions?: string[]
  ): Promise<InvestigationDecision> {
    const case_ = await this.getCase(caseId);
    
    const investigationDecision: InvestigationDecision = {
      decision: decision as any,
      reason,
      effectiveDate: new Date(),
      duration,
      conditions,
      appealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      decidedBy,
      decisionDate: new Date()
    };

    // Record decision on blockchain if it affects license status
    if (['license_suspended', 'license_revoked'].includes(decision)) {
      const blockchainTx = await this.blockchainService.recordLicenseAction(
        case_.practitioner!.licenseNumber,
        decision === 'license_suspended' ? 'LICENSE_SUSPENDED' : 'LICENSE_REVOKED',
        decidedBy,
        reason
      );
      investigationDecision.blockchainTxId = blockchainTx.id;
    }

    case_.decision = investigationDecision;
    case_.status = 'closed';

    // Create public status update
    if (case_.practitioner) {
      await this.createPublicStatusUpdate(case_, investigationDecision);
    }

    // Send notifications to stakeholders
    await this.sendDecisionNotifications(case_, investigationDecision);

    // Log decision
    await this.auditService.logAdminAction(
      decidedBy,
      'admin',
      'INVESTIGATION_DECISION_MADE',
      'investigation',
      caseId,
      true,
      `Decision: ${decision} - ${reason}`,
      {
        decision,
        effectiveDate: investigationDecision.effectiveDate,
        blockchainTxId: investigationDecision.blockchainTxId
      }
    );

    return investigationDecision;
  }

  /**
   * Step 6: Create public status update
   */
  async createPublicStatusUpdate(
    case_: InvestigationCase,
    decision: InvestigationDecision
  ): Promise<PublicStatusUpdate> {
    const statusUpdate: PublicStatusUpdate = {
      id: this.generateStatusUpdateId(),
      licenseNumber: case_.practitioner!.licenseNumber,
      newStatus: this.mapDecisionToStatus(decision.decision),
      effectiveDate: decision.effectiveDate,
      publicReason: this.sanitizeReasonForPublic(decision.reason),
      publishedDate: new Date(),
      publishedBy: decision.decidedBy
    };

    case_.publicStatusUpdate = statusUpdate;

    // Log public update
    await this.auditService.logAdminAction(
      decision.decidedBy,
      'admin',
      'PUBLIC_STATUS_UPDATED',
      'practitioner',
      case_.practitioner!.licenseNumber,
      true,
      `Public status updated: ${statusUpdate.newStatus}`,
      { statusUpdateId: statusUpdate.id, effectiveDate: statusUpdate.effectiveDate }
    );

    return statusUpdate;
  }

  /**
   * Step 7: Send notifications to embassies and employers
   */
  async sendDecisionNotifications(
    case_: InvestigationCase,
    decision: InvestigationDecision
  ): Promise<void> {
    const notifications: CaseNotification[] = [];

    // Notify embassies for international practitioners
    if (this.isInternationalPractitioner(case_.practitioner?.licenseNumber)) {
      notifications.push({
        id: this.generateNotificationId(),
        type: 'embassy',
        recipient: 'embassies@ugandamedicalregistry.com',
        subject: `License Status Change - ${case_.practitioner?.licenseNumber}`,
        content: `The license status for ${case_.practitioner?.name} has been updated to ${decision.decision}. Effective date: ${decision.effectiveDate.toISOString()}`,
        status: 'pending',
        priority: decision.decision.includes('revoked') ? 'urgent' : 'normal'
      });
    }

    // Notify current employer
    if (case_.practitioner?.facility) {
      notifications.push({
        id: this.generateNotificationId(),
        type: 'employer',
        recipient: case_.practitioner.facility,
        subject: `Staff License Status Update - ${case_.practitioner.licenseNumber}`,
        content: `License status updated for ${case_.practitioner.name}. New status: ${decision.decision}. Please review employment status accordingly.`,
        status: 'pending',
        priority: 'urgent'
      });
    }

    // Send notifications
    for (const notification of notifications) {
      try {
        await this.sendNotification(notification);
        notification.status = 'sent';
        notification.sentDate = new Date();
      } catch (error) {
        notification.status = 'failed';
      }
    }

    case_.notifications = notifications;

    // Log notifications
    await this.auditService.logAdminAction(
      'SYSTEM',
      'notification_service',
      'DECISION_NOTIFICATIONS_SENT',
      'investigation',
      case_.id,
      true,
      `Sent ${notifications.length} decision notifications`,
      { notifications: notifications.map(n => ({ type: n.type, status: n.status })) }
    );
  }

  private async verifyQrCode(qrCode: string): Promise<{
    valid: boolean;
    licenseNumber?: string;
    practitionerName?: string;
    status?: string;
    discrepancies: string[];
  }> {
    // Mock QR verification - in production, verify against blockchain and database
    const mockResults = [
      {
        valid: true,
        licenseNumber: 'UMC-UG-2458',
        practitionerName: 'Dr. Yusuf AbdulHakim Addo',
        status: 'active',
        discrepancies: []
      },
      {
        valid: false,
        discrepancies: ['QR code expired', 'License suspended']
      }
    ];

    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }

  private mapDecisionToStatus(decision: string): string {
    const statusMap: { [key: string]: string } = {
      'cleared': 'active',
      'warning_issued': 'active_with_warning',
      'license_suspended': 'suspended',
      'license_revoked': 'revoked',
      'criminal_referral': 'under_investigation'
    };
    
    return statusMap[decision] || 'under_review';
  }

  private sanitizeReasonForPublic(reason: string): string {
    // Remove sensitive details for public consumption
    return reason.replace(/\b\d{10,}\b/g, '[REDACTED]') // Remove phone numbers
                 .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]'); // Remove emails
  }

  private isInternationalPractitioner(licenseNumber?: string): boolean {
    // Check if practitioner has international connections
    return Math.random() > 0.7; // 30% chance for demo
  }

  private async getPractitionerInfo(licenseNumber: string): Promise<any> {
    // Mock - in production, fetch from database
    return {
      name: 'Dr. John Doe',
      licenseNumber,
      facility: 'General Hospital'
    };
  }

  private async getFacilityInfo(licenseNumber: string): Promise<any> {
    // Mock - in production, fetch from database
    return {
      name: 'General Hospital',
      licenseNumber,
      region: 'Central'
    };
  }

  private async getCase(caseId: string): Promise<InvestigationCase> {
    // Mock - in production, fetch from database
    return {} as InvestigationCase;
  }

  private async sendNotification(notification: CaseNotification): Promise<void> {
    // Mock notification sending - in production, use email/SMS service
    console.log(`Sending notification to ${notification.recipient}:`, notification.subject);
  }

  private async sendInspectorNotification(case_: InvestigationCase, inspectorId: string): Promise<void> {
    const notification: CaseNotification = {
      id: this.generateNotificationId(),
      type: 'public',
      recipient: inspectorId,
      subject: `New Case Assignment: ${case_.title}`,
      content: `You have been assigned to investigate case ${case_.id}. Priority: ${case_.priority}`,
      status: 'pending',
      priority: case_.priority === 'critical' ? 'urgent' : 'normal'
    };
    
    await this.sendNotification(notification);
  }

  private async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateCaseId(): string {
    return 'INV_' + new Date().getFullYear() + '_' + String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  }

  private generateQrCheckId(): string {
    return 'QR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateEvidenceId(): string {
    return 'EVD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateStatusUpdateId(): string {
    return 'PSU_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateNotificationId(): string {
    return 'NOT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}