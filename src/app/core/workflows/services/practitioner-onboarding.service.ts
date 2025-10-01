import { Injectable, inject } from '@angular/core';
import { BlockchainService } from '../../security/services/blockchain.service';
import { EncryptionService } from '../../security/services/encryption.service';
import { AuditLogService } from '../../security/services/audit-log.service';

export interface OnboardingApplication {
  id: string;
  applicantId: string;
  status: 'draft' | 'submitted' | 'kyc_pending' | 'documents_pending' | 'payment_pending' | 'review_pending' | 'approved' | 'rejected';
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    nationalId: string;
    gender: string;
    nationality: string;
    address: string;
  };
  professionalInfo: {
    profession: string;
    specialty: string;
    regulatoryBody: string;
    primaryFacility: string;
    region: string;
    district: string;
  };
  documents: OnboardingDocument[];
  kycStatus: 'pending' | 'verified' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'failed';
  reviewNotes: string[];
  submittedDate: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
  licenseNumber?: string;
  digitalCertHash?: string;
  qrCode?: string;
}

export interface OnboardingDocument {
  id: string;
  type: 'degree' | 'transcript' | 'housemanship' | 'clearance' | 'passport' | 'photo';
  name: string;
  uploadDate: Date;
  status: 'uploaded' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationDate?: Date;
  rejectionReason?: string;
  integrityHash: string;
  duplicateCheck: boolean;
}

export interface AutomatedCheck {
  type: 'document_integrity' | 'duplicate_detection' | 'blacklist_check' | 'qualification_verification';
  status: 'pending' | 'passed' | 'failed' | 'manual_review';
  result: any;
  timestamp: Date;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class PractitionerOnboardingService {
  private blockchainService = inject(BlockchainService);
  private encryptionService = inject(EncryptionService);
  private auditService = inject(AuditLogService);

  /**
   * Step 1: Create account and initiate onboarding
   */
  async createOnboardingApplication(applicantData: any): Promise<OnboardingApplication> {
    const applicationId = this.generateApplicationId();
    
    // Encrypt sensitive personal information
    const encryptedPersonalInfo = await this.encryptionService.encryptObject(applicantData.personalInfo);
    
    const application: OnboardingApplication = {
      id: applicationId,
      applicantId: applicantData.userId,
      status: 'draft',
      personalInfo: encryptedPersonalInfo,
      professionalInfo: applicantData.professionalInfo,
      documents: [],
      kycStatus: 'pending',
      paymentStatus: 'pending',
      reviewNotes: [],
      submittedDate: new Date()
    };

    // Log application creation
    await this.auditService.logAdminAction(
      applicantData.userId,
      'applicant',
      'APPLICATION_CREATED',
      'onboarding',
      applicationId,
      true,
      'New practitioner onboarding application created'
    );

    return application;
  }

  /**
   * Step 2: KYC verification process
   */
  async performKycVerification(applicationId: string): Promise<{
    success: boolean;
    kycScore: number;
    issues: string[];
    requiresManualReview: boolean;
  }> {
    const application = await this.getApplication(applicationId);
    
    // Decrypt personal info for KYC checks
    const personalInfo = await this.encryptionService.decryptObject(application.personalInfo);
    
    // Automated KYC checks
    const kycChecks = await Promise.all([
      this.verifyNationalId(personalInfo.nationalId),
      this.checkSanctionsList(personalInfo.firstName, personalInfo.lastName),
      this.verifyAge(personalInfo.dateOfBirth),
      this.checkDuplicateRegistration(personalInfo.nationalId, personalInfo.email)
    ]);

    const kycScore = this.calculateKycScore(kycChecks);
    const issues = kycChecks.filter(check => !check.passed).map(check => check.reason || 'Unknown issue');
    const requiresManualReview = kycScore < 80 || issues.length > 0;

    // Update application status
    application.kycStatus = requiresManualReview ? 'pending' : 'verified';
    
    // Log KYC completion
    await this.auditService.logAdminAction(
      'SYSTEM',
      'kyc_service',
      'KYC_VERIFICATION_COMPLETED',
      'onboarding',
      applicationId,
      true,
      `KYC Score: ${kycScore}, Manual Review: ${requiresManualReview}`,
      { kycScore, issues, requiresManualReview }
    );

    return {
      success: kycScore >= 60, // Minimum threshold
      kycScore,
      issues,
      requiresManualReview
    };
  }

  /**
   * Step 3: Document upload and verification
   */
  async uploadDocument(
    applicationId: string,
    documentType: string,
    file: File
  ): Promise<OnboardingDocument> {
    // Generate integrity hash
    const integrityHash = await this.generateFileHash(file);
    
    // Check for duplicates
    const duplicateCheck = await this.checkDocumentDuplicates(integrityHash);
    
    const document: OnboardingDocument = {
      id: this.generateDocumentId(),
      type: documentType as any,
      name: file.name,
      uploadDate: new Date(),
      status: 'uploaded',
      integrityHash,
      duplicateCheck: !duplicateCheck.found
    };

    // Perform automated document checks
    const automatedChecks = await this.performAutomatedDocumentChecks(document, file);
    
    if (automatedChecks.every(check => check.status === 'passed')) {
      document.status = 'verified';
      document.verifiedBy = 'Automated System';
      document.verificationDate = new Date();
    }

    // Log document upload
    await this.auditService.logAdminAction(
      'SYSTEM',
      'document_service',
      'DOCUMENT_UPLOADED',
      'onboarding',
      applicationId,
      true,
      `Document uploaded: ${documentType}`,
      { documentId: document.id, integrityHash, duplicateCheck }
    );

    return document;
  }

  /**
   * Step 4: Payment processing
   */
  async processPayment(
    applicationId: string,
    paymentMethod: string,
    amount: number
  ): Promise<{ success: boolean; transactionId: string; receiptUrl: string }> {
    // Simulate payment processing
    const transactionId = this.generateTransactionId();
    
    // Log payment attempt
    await this.auditService.logAdminAction(
      'SYSTEM',
      'payment_service',
      'PAYMENT_PROCESSED',
      'onboarding',
      applicationId,
      true,
      `Payment processed: ${amount} UGX via ${paymentMethod}`,
      { transactionId, amount, paymentMethod }
    );

    return {
      success: true,
      transactionId,
      receiptUrl: `https://payments.ugandamedicalregistry.com/receipts/${transactionId}.pdf`
    };
  }

  /**
   * Step 5: Final approval and license issuance
   */
  async approveLicenseApplication(
    applicationId: string,
    reviewerId: string,
    reviewNotes: string
  ): Promise<{
    licenseNumber: string;
    digitalCertHash: string;
    qrCode: string;
    blockchainTxId: string;
  }> {
    const application = await this.getApplication(applicationId);
    
    // Generate license number
    const licenseNumber = await this.generateLicenseNumber(application.professionalInfo.profession);
    
    // Generate digital certificate hash
    const digitalCertHash = await this.generateDigitalCertificate(application, licenseNumber);
    
    // Generate QR code
    const qrCode = await this.generateQrCode(licenseNumber);
    
    // Record on blockchain
    const blockchainTxId = await this.blockchainService.recordLicenseAction(
      licenseNumber,
      'LICENSE_ISSUED',
      reviewerId,
      'Initial license issuance after successful onboarding'
    );

    // Update application
    application.status = 'approved';
    application.licenseNumber = licenseNumber;
    application.digitalCertHash = digitalCertHash;
    application.qrCode = qrCode;
    application.reviewedBy = reviewerId;
    application.reviewedDate = new Date();
    application.reviewNotes.push(reviewNotes);

    // Log license issuance
    await this.auditService.logAdminAction(
      reviewerId,
      'admin',
      'LICENSE_ISSUED',
      'practitioner',
      licenseNumber,
      true,
      reviewNotes,
      { applicationId, digitalCertHash, qrCode, blockchainTxId }
    );

    return {
      licenseNumber,
      digitalCertHash,
      qrCode,
      blockchainTxId: blockchainTxId.id
    };
  }

  /**
   * Automated document integrity checks
   */
  private async performAutomatedDocumentChecks(
    document: OnboardingDocument,
    file: File
  ): Promise<AutomatedCheck[]> {
    const checks: AutomatedCheck[] = [];

    // Document integrity check
    checks.push({
      type: 'document_integrity',
      status: await this.verifyDocumentIntegrity(file) ? 'passed' : 'failed',
      result: { fileSize: file.size, mimeType: file.type },
      timestamp: new Date(),
      confidence: 0.95
    });

    // Duplicate detection
    checks.push({
      type: 'duplicate_detection',
      status: document.duplicateCheck ? 'passed' : 'failed',
      result: { duplicateFound: !document.duplicateCheck },
      timestamp: new Date(),
      confidence: 0.98
    });

    // Qualification verification (for degree certificates)
    if (document.type === 'degree') {
      checks.push({
        type: 'qualification_verification',
        status: await this.verifyQualification(file) ? 'passed' : 'manual_review',
        result: { institutionRecognized: true },
        timestamp: new Date(),
        confidence: 0.85
      });
    }

    return checks;
  }

  private async verifyNationalId(nationalId: string): Promise<{ passed: boolean; reason?: string }> {
    // Mock verification - in production, integrate with national ID system
    const isValid = nationalId.length >= 10 && /^[A-Z]{2}\d+$/.test(nationalId);
    return {
      passed: isValid,
      reason: isValid ? undefined : 'Invalid national ID format'
    };
  }

  private async checkSanctionsList(firstName: string, lastName: string): Promise<{ passed: boolean; reason?: string }> {
    // Mock sanctions check - in production, check against international sanctions lists
    return { passed: true };
  }

  private async verifyAge(dateOfBirth: Date): Promise<{ passed: boolean; reason?: string }> {
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    const isValid = age >= 21 && age <= 70; // Reasonable age range for medical practitioners
    return {
      passed: isValid,
      reason: isValid ? undefined : 'Age outside acceptable range for medical practice'
    };
  }

  private async checkDuplicateRegistration(nationalId: string, email: string): Promise<{ passed: boolean; reason?: string }> {
    // Mock duplicate check - in production, query existing registrations
    return { passed: true };
  }

  private calculateKycScore(checks: Array<{ passed: boolean; reason?: string }>): number {
    const passedChecks = checks.filter(check => check.passed).length;
    return (passedChecks / checks.length) * 100;
  }

  private async verifyDocumentIntegrity(file: File): Promise<boolean> {
    // Basic file validation
    return file.size > 0 && file.size < 10 * 1024 * 1024; // Max 10MB
  }

  private async checkDocumentDuplicates(hash: string): Promise<{ found: boolean; existingDocuments: string[] }> {
    // Mock duplicate check - in production, check against document hash database
    return { found: false, existingDocuments: [] };
  }

  private async verifyQualification(file: File): Promise<boolean> {
    // Mock qualification verification - in production, use OCR and institution verification
    return true;
  }

  private async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async generateLicenseNumber(profession: string): Promise<string> {
    const prefixes: { [key: string]: string } = {
      'Medical Doctor': 'UMC-UG',
      'Nurse': 'NMC-UG',
      'Pharmacist': 'PPC-UG',
      'Dentist': 'UMC-UG',
      'Traditional Medicine': 'TMPC-UG'
    };
    
    const prefix = prefixes[profession] || 'UMR-UG';
    const sequence = Math.floor(Math.random() * 9999) + 1000;
    return `${prefix}-${sequence}`;
  }

  private async generateDigitalCertificate(application: OnboardingApplication, licenseNumber: string): Promise<string> {
    const certData = {
      licenseNumber,
      profession: application.professionalInfo.profession,
      specialty: application.professionalInfo.specialty,
      issuedDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    };
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(certData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async generateQrCode(licenseNumber: string): Promise<string> {
    const qrData = {
      licenseNumber,
      verificationUrl: `https://ugandamedicalregistry.com/verify/${licenseNumber}`,
      timestamp: new Date().toISOString()
    };
    
    return `UMR_QR_${licenseNumber}_${Date.now()}`;
  }

  private async getApplication(applicationId: string): Promise<OnboardingApplication> {
    // Mock - in production, fetch from database
    return {} as OnboardingApplication;
  }

  private generateApplicationId(): string {
    return 'APP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateDocumentId(): string {
    return 'DOC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateTransactionId(): string {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}