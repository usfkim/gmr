import { Injectable, inject } from '@angular/core';
import { BlockchainService } from '../../security/services/blockchain.service';
import { AuditLogService } from '../../security/services/audit-log.service';

export interface EmbassyVerificationRequest {
  id: string;
  embassyId: string;
  embassyName: string;
  country: string;
  licenseNumber: string;
  practitionerName?: string;
  verificationPurpose: 'visa_application' | 'work_permit' | 'credential_recognition' | 'immigration_assessment';
  requestedBy: string;
  department: string;
  requestDate: Date;
  status: 'pending' | 'verified' | 'not_found' | 'rejected';
  verificationResult?: PractitionerVerificationResult;
  officialLetter?: OfficialVerificationLetter;
  auditTrail: VerificationAuditEntry[];
}

export interface PractitionerVerificationResult {
  licenseNumber: string;
  practitionerName: string;
  profession: string;
  specialty?: string;
  licenseStatus: 'active' | 'suspended' | 'revoked' | 'expired';
  registrationDate: Date;
  expiryDate: Date;
  primaryFacility: string;
  region: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    country: string;
    verified: boolean;
  }>;
  disciplinaryHistory: Array<{
    type: string;
    date: Date;
    reason: string;
    status: string;
  }>;
  scopeOfPractice: string[];
  verificationTimestamp: Date;
  blockchainHash: string;
}

export interface OfficialVerificationLetter {
  id: string;
  letterReference: string;
  embassyLetterhead: string;
  practitionerDetails: PractitionerVerificationResult;
  verificationStatement: string;
  issuedDate: Date;
  validityPeriod: number; // days
  expiryDate: Date;
  issuedBy: string;
  digitalSignature: string;
  qrCode: string;
  securityFeatures: {
    watermark: boolean;
    tamperProof: boolean;
    blockchainVerified: boolean;
  };
  downloadCount: number;
  lastAccessed?: Date;
}

export interface VerificationAuditEntry {
  timestamp: Date;
  action: string;
  performedBy: string;
  details: string;
  ipAddress: string;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmbassyVerificationService {
  private blockchainService = inject(BlockchainService);
  private auditService = inject(AuditLogService);

  /**
   * Step 1: Process embassy verification request
   */
  async processVerificationRequest(
    embassyId: string,
    embassyName: string,
    country: string,
    licenseNumber: string,
    purpose: string,
    requestedBy: string,
    department: string
  ): Promise<EmbassyVerificationRequest> {
    const requestId = this.generateRequestId();
    
    const request: EmbassyVerificationRequest = {
      id: requestId,
      embassyId,
      embassyName,
      country,
      licenseNumber,
      verificationPurpose: purpose as any,
      requestedBy,
      department,
      requestDate: new Date(),
      status: 'pending',
      auditTrail: []
    };

    // Add initial audit entry
    request.auditTrail.push({
      timestamp: new Date(),
      action: 'VERIFICATION_REQUEST_CREATED',
      performedBy: requestedBy,
      details: `Verification request for ${licenseNumber} - Purpose: ${purpose}`,
      ipAddress: await this.getCurrentIpAddress(),
      sessionId: this.getCurrentSessionId()
    });

    // Perform verification
    const verificationResult = await this.verifyPractitioner(licenseNumber);
    
    if (verificationResult) {
      request.status = 'verified';
      request.verificationResult = verificationResult;
      request.practitionerName = verificationResult.practitionerName;
    } else {
      request.status = 'not_found';
    }

    // Log verification request
    await this.auditService.logAdminAction(
      requestedBy,
      'embassy_user',
      'EMBASSY_VERIFICATION_REQUEST',
      'practitioner',
      licenseNumber,
      request.status === 'verified',
      `Embassy verification: ${embassyName} (${country})`,
      {
        requestId,
        purpose,
        department,
        verificationResult: request.status
      }
    );

    return request;
  }

  /**
   * Step 2: Generate official verification letter with QR code
   */
  async generateOfficialLetter(
    requestId: string,
    issuedBy: string
  ): Promise<OfficialVerificationLetter> {
    const request = await this.getVerificationRequest(requestId);
    
    if (!request.verificationResult) {
      throw new Error('Cannot generate letter for unverified practitioner');
    }

    const letterId = this.generateLetterId();
    const letterReference = this.generateLetterReference(request.embassyName, request.country);
    
    // Generate QR code for letter verification
    const qrCode = await this.generateLetterQrCode(letterId, request.verificationResult);
    
    // Create digital signature
    const digitalSignature = await this.generateDigitalSignature(request.verificationResult, letterId);
    
    const officialLetter: OfficialVerificationLetter = {
      id: letterId,
      letterReference,
      embassyLetterhead: await this.getEmbassyLetterhead(request.embassyName),
      practitionerDetails: request.verificationResult,
      verificationStatement: this.generateVerificationStatement(request),
      issuedDate: new Date(),
      validityPeriod: 90, // 90 days validity
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      issuedBy,
      digitalSignature,
      qrCode,
      securityFeatures: {
        watermark: true,
        tamperProof: true,
        blockchainVerified: true
      },
      downloadCount: 0
    };

    request.officialLetter = officialLetter;

    // Add audit entry
    request.auditTrail.push({
      timestamp: new Date(),
      action: 'OFFICIAL_LETTER_GENERATED',
      performedBy: issuedBy,
      details: `Official verification letter generated: ${letterReference}`,
      ipAddress: await this.getCurrentIpAddress(),
      sessionId: this.getCurrentSessionId()
    });

    // Log letter generation
    await this.auditService.logAdminAction(
      issuedBy,
      'embassy_user',
      'OFFICIAL_LETTER_GENERATED',
      'verification_letter',
      letterId,
      true,
      `Official letter generated: ${letterReference}`,
      {
        requestId,
        letterReference,
        practitionerLicense: request.licenseNumber,
        validityPeriod: officialLetter.validityPeriod
      }
    );

    return officialLetter;
  }

  /**
   * Step 3: Log verification event for audit
   */
  async logVerificationEvent(
    requestId: string,
    action: string,
    performedBy: string,
    details: string
  ): Promise<void> {
    const request = await this.getVerificationRequest(requestId);
    
    // Add to audit trail
    request.auditTrail.push({
      timestamp: new Date(),
      action,
      performedBy,
      details,
      ipAddress: await this.getCurrentIpAddress(),
      sessionId: this.getCurrentSessionId()
    });

    // Log in main audit system
    await this.auditService.logAdminAction(
      performedBy,
      'embassy_user',
      action,
      'embassy_verification',
      requestId,
      true,
      details,
      {
        embassyName: request.embassyName,
        country: request.country,
        licenseNumber: request.licenseNumber
      }
    );
  }

  /**
   * Track letter downloads and access
   */
  async trackLetterAccess(
    letterId: string,
    accessType: 'download' | 'view' | 'print',
    accessedBy: string
  ): Promise<void> {
    // Update access counters
    const letter = await this.getOfficialLetter(letterId);
    
    if (accessType === 'download') {
      letter.downloadCount++;
    }
    letter.lastAccessed = new Date();

    // Log access
    await this.auditService.logAdminAction(
      accessedBy,
      'embassy_user',
      `LETTER_${accessType.toUpperCase()}`,
      'verification_letter',
      letterId,
      true,
      `Official letter ${accessType}: ${letter.letterReference}`,
      {
        letterReference: letter.letterReference,
        downloadCount: letter.downloadCount,
        accessType
      }
    );
  }

  private async verifyPractitioner(licenseNumber: string): Promise<PractitionerVerificationResult | null> {
    // Mock verification - in production, query license database and blockchain
    const mockPractitioners = [
      {
        licenseNumber: 'UMC-UG-2458',
        practitionerName: 'Dr. Yusuf AbdulHakim Addo',
        profession: 'Medical Doctor',
        specialty: 'Cardiology',
        licenseStatus: 'active' as const,
        registrationDate: new Date('2023-01-15'),
        expiryDate: new Date('2025-12-31'),
        primaryFacility: 'Mulago National Referral Hospital',
        region: 'Central Region (Kampala)',
        qualifications: [
          {
            degree: 'Doctor of Medicine (MBChB)',
            institution: 'Makerere University',
            year: 2012,
            country: 'Uganda',
            verified: true
          }
        ],
        disciplinaryHistory: [],
        scopeOfPractice: ['General Medicine', 'Cardiology', 'Interventional Cardiology'],
        verificationTimestamp: new Date(),
        blockchainHash: 'blockchain_hash_123'
      }
    ];

    return mockPractitioners.find(p => p.licenseNumber === licenseNumber) || null;
  }

  private generateVerificationStatement(request: EmbassyVerificationRequest): string {
    const result = request.verificationResult!;
    
    return `This is to certify that ${result.practitionerName} (License: ${result.licenseNumber}) is a duly registered ${result.profession} with the Uganda Medical Registry. The license is currently ${result.licenseStatus} and valid until ${result.expiryDate.toDateString()}. This verification is issued for ${request.verificationPurpose.replace('_', ' ')} purposes and is valid for 90 days from the date of issuance.`;
  }

  private async generateLetterQrCode(letterId: string, practitioner: PractitionerVerificationResult): Promise<string> {
    const qrData = {
      letterId,
      licenseNumber: practitioner.licenseNumber,
      verificationUrl: `https://ugandamedicalregistry.com/verify/letter/${letterId}`,
      timestamp: new Date().toISOString()
    };
    
    return `LETTER_QR_${letterId}_${Date.now()}`;
  }

  private async generateDigitalSignature(practitioner: PractitionerVerificationResult, letterId: string): Promise<string> {
    const signatureData = {
      letterId,
      licenseNumber: practitioner.licenseNumber,
      practitionerName: practitioner.practitionerName,
      timestamp: new Date().toISOString()
    };
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(signatureData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getEmbassyLetterhead(embassyName: string): Promise<string> {
    // In production, fetch embassy-specific letterhead template
    return `Official letterhead for ${embassyName}`;
  }

  private generateLetterReference(embassyName: string, country: string): string {
    const countryCode = country.substring(0, 2).toUpperCase();
    const sequence = Math.floor(Math.random() * 9999) + 1000;
    return `${countryCode}E-VL-${new Date().getFullYear()}-${sequence}`;
  }

  private async getCurrentIpAddress(): Promise<string> {
    // In production, get from request headers
    return '192.168.1.100';
  }

  private getCurrentSessionId(): string {
    // In production, get from session management
    return 'SESSION_' + Math.random().toString(36).substr(2, 9);
  }

  private async getVerificationRequest(requestId: string): Promise<EmbassyVerificationRequest> {
    // Mock - in production, fetch from database
    return {} as EmbassyVerificationRequest;
  }

  private async getOfficialLetter(letterId: string): Promise<OfficialVerificationLetter> {
    // Mock - in production, fetch from database
    return {} as OfficialVerificationLetter;
  }

  private generateRequestId(): string {
    return 'EVR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateLetterId(): string {
    return 'OVL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}