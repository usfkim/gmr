# Core Workflows (End-to-End)

This module implements the complete end-to-end workflows for the Uganda Medical Registry platform, integrating with the security infrastructure for comprehensive audit trails and compliance.

## Implemented Workflows

### 1. 🎓 New Practitioner Onboarding

**Complete 6-step process:**
1. **Account Creation** → Personal and professional information collection
2. **KYC Verification** → Automated identity verification with sanctions checking
3. **Document Upload** → Integrity checks, duplicate detection, and qualification verification
4. **Payment Processing** → Secure fee collection with receipt generation
5. **Human Review** → Manual verification of complex cases
6. **License Issuance** → Digital certificate generation, blockchain recording, QR code creation

**Key Features:**
- Automated document integrity verification
- Duplicate detection across all submissions
- Real-time KYC scoring with risk assessment
- Blockchain recording of license issuance
- Digital certificate with tamper-proof QR codes

### 2. 🔄 License Renewal

**Streamlined 4-step process:**
1. **CPD Compliance Check** → Verify continuing education requirements
2. **Fee Calculation** → Dynamic pricing with late fees and penalties
3. **Digital Certificate Reissuance** → Updated blockchain hash and QR codes
4. **Stakeholder Notifications** → Automated webhooks to employers and facilities

**Key Features:**
- Automated CPD credit verification
- Dynamic fee calculation based on compliance status
- Blockchain state updates for renewed licenses
- Real-time notifications to all stakeholders

### 3. 🔍 Complaint/Investigation

**Comprehensive 5-step investigation process:**
1. **Case Creation** → Tip-off processing and case assignment
2. **Inspector Assignment** → Automated workload distribution
3. **Evidence Collection** → On-site QR verification, photo evidence, witness statements
4. **Decision Making** → Clear/suspend/revoke with blockchain recording
5. **Public Updates** → Status updates and stakeholder notifications

**Key Features:**
- GPS-tracked on-site QR verifications
- Chain of custody for all evidence
- Immutable decision recording on blockchain
- Automated notifications to embassies and employers
- Public status updates with privacy protection

### 4. 🏢 Employer Bulk Verification

**Efficient 4-step bulk processing:**
1. **Data Processing** → CSV upload or API sync with validation
2. **Bulk Verification** → Parallel processing of staff credentials
3. **Results Compilation** → Comprehensive status reports with risk flags
4. **Auto-monitoring Setup** → Continuous compliance monitoring

**Key Features:**
- Support for CSV upload and API integration
- Real-time verification status tracking
- Automated compliance monitoring
- Monthly compliance reports with risk assessment
- Proactive expiry and status change alerts

### 5. 🏛️ Embassy Verification

**Secure 4-step diplomatic process:**
1. **License Verification** → Comprehensive credential validation
2. **Official Letter Generation** → Diplomatic-grade verification documents
3. **Digital Signing** → Tamper-proof signatures with QR verification
4. **Audit Logging** → Complete diplomatic access audit trail

**Key Features:**
- Diplomatic-grade official letters
- QR-coded verification documents
- Complete audit trail for diplomatic access
- Multi-language support for international use
- Blockchain-verified authenticity

## Workflow Orchestration

The `WorkflowOrchestratorService` manages all workflows with:

- **Progress Tracking** - Real-time status updates
- **Error Handling** - Comprehensive error recovery
- **Metrics Collection** - Performance and compliance analytics
- **Audit Integration** - Complete audit trails for all actions
- **Security Integration** - MFA, encryption, and DLP controls

## Security Integration

All workflows integrate with the security infrastructure:

- **Blockchain Recording** - Immutable state changes
- **Field-level Encryption** - PII protection with HSM keys
- **Audit Logging** - Complete action trails
- **DLP Controls** - Data access monitoring and watermarking
- **MFA Requirements** - Enhanced security for sensitive operations

## Usage Examples

### Practitioner Onboarding
```typescript
const workflow = await this.orchestrator.orchestratePractitionerOnboarding(
  applicantData,
  documents,
  'mobile_money'
);

// Track progress
const status = this.orchestrator.getWorkflowStatus(workflow.workflowId);
```

### License Renewal
```typescript
const renewal = await this.renewalService.initiateRenewal(
  'UMC-UG-2458',
  'practitioner_123'
);

// Process payment and complete renewal
await this.renewalService.processRenewalPayment(renewal.id, 'bank_transfer');
```

### Investigation Case
```typescript
const case = await this.investigationService.createInvestigationCase({
  type: 'tip_off',
  title: 'Suspected unlicensed practice',
  description: 'Report of practitioner operating without valid license',
  practitionerLicense: 'UMC-UG-4521',
  reportedBy: 'Anonymous',
  priority: 'high'
});

// Assign inspector and perform QR checks
await this.investigationService.assignInspector(case.id, 'inspector_001', 'admin_001');
```

### Employer Bulk Verification
```typescript
const job = await this.employerService.processBulkVerification(
  'employer_123',
  'Mulago Hospital',
  staffList,
  'csv_upload'
);

// Generate compliance report
const report = await this.employerService.generateComplianceReport(
  'employer_123',
  { start: new Date('2025-01-01'), end: new Date('2025-01-31') }
);
```

### Embassy Verification
```typescript
const request = await this.embassyService.processVerificationRequest(
  'embassy_uk',
  'Uganda High Commission - London',
  'United Kingdom',
  'UMC-UG-2458',
  'work_permit',
  'Sarah Johnson',
  'Visa Section'
);

// Generate official letter
const letter = await this.embassyService.generateOfficialLetter(
  request.id,
  'embassy_officer_001'
);
```

## Monitoring and Analytics

The workflow system provides comprehensive monitoring:

- **Real-time Progress Tracking** - Live status updates
- **Performance Metrics** - Processing times and success rates
- **Compliance Reporting** - Automated regulatory reports
- **Risk Assessment** - Continuous risk monitoring
- **Audit Trails** - Complete action histories

## Integration Points

- **Security Services** - MFA, encryption, audit logging
- **Blockchain Network** - Immutable state recording
- **Payment Gateways** - Secure fee processing
- **Notification Systems** - Email, SMS, and webhook delivery
- **Document Storage** - Encrypted document management
- **External APIs** - KYC providers, sanctions lists, institution verification

All workflows are designed to be scalable, secure, and compliant with international healthcare data protection standards.