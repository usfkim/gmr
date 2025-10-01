# Security & Privacy Infrastructure

This module implements enterprise-grade security and privacy controls for the Uganda Medical Registry platform.

## Features Implemented

### 🔗 Blockchain Security
- **Private, permissioned blockchain** for immutable audit trails
- **Hash-only storage** - no PII on blockchain
- **License state tracking** with tamper-proof records
- **Cryptographic signatures** for all transactions

### 🔐 Advanced Encryption
- **Field-level encryption** for sensitive data
- **HSM-backed keys** for maximum security
- **Key rotation** and lifecycle management
- **End-to-end encryption** for data in transit

### 🛡️ Multi-Factor Authentication
- **Device fingerprinting** for trusted device detection
- **Multiple MFA methods** (TOTP, SMS, Email, Hardware tokens)
- **IP allow-listing** for regulators and embassies
- **Risk-based authentication** with adaptive security

### 📊 Immutable Audit Logs
- **Complete audit trail** of all admin actions
- **Real-time logging** with batch processing
- **Tamper-proof storage** with cryptographic hashing
- **Compliance reporting** for regulatory requirements

### 🚫 Data Loss Prevention (DLP)
- **Document watermarking** for exported files
- **Access rate limiting** and throttling
- **Mandatory access justification** for sensitive data
- **Policy-based access controls** with violation tracking

### 🌍 Regional Data Residency
- **Country-specific data storage** with local compliance
- **Cross-border request management** with approval workflows
- **Active-active HA** setup for high availability
- **Automated failover** with minimal downtime

### 💾 Backup & Disaster Recovery
- **Automated backup scheduling** with multiple destinations
- **RPO/RTO targets** (5 min RPO, 15 min RTO)
- **Disaster recovery testing** with automated procedures
- **Data integrity verification** for all backups

## Security Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Security      │    │   Blockchain    │
│     Layer       │◄──►│   Services      │◄──►│   Network       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Encrypted     │    │   Audit Logs    │    │   HSM Key       │
│   Database      │    │   (Immutable)   │    │   Management    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Usage Examples

### Logging Admin Actions
```typescript
await this.auditService.logAdminAction(
  userId,
  userRole,
  'LICENSE_SUSPENDED',
  'practitioner',
  licenseNumber,
  true,
  'Failed CPD compliance'
);
```

### Encrypting Sensitive Data
```typescript
const encryptedData = await this.encryptionService.encryptObject({
  nationalId: '123456789',
  dateOfBirth: '1985-05-12',
  medicalHistory: 'Confidential data'
});
```

### Recording Blockchain Events
```typescript
await this.blockchainService.recordLicenseAction(
  licenseNumber,
  'LICENSE_RENEWED',
  adminUserId,
  'Annual renewal completed'
);
```

### DLP Access Control
```typescript
const dlpCheck = await this.dlpService.checkAccessCompliance({
  userId,
  resourceType: 'practitioner',
  resourceId: licenseNumber,
  action: 'export',
  justification: 'Regulatory compliance audit',
  ipAddress: '192.168.1.100',
  timestamp: new Date()
});
```

## Compliance Standards

- **ISO 27001** - Information Security Management
- **HIPAA** - Healthcare Privacy Protection
- **SOC 2 Type II** - Security Controls Audit
- **GDPR** - Data Protection Regulation
- **Uganda Data Protection Act** - Local compliance

## Security Monitoring

The system provides real-time monitoring of:
- Authentication events and failures
- Data access patterns and anomalies
- Policy violations and security incidents
- System performance and availability
- Backup and recovery operations

## Emergency Procedures

In case of security incidents:
1. **Immediate containment** - Automated threat response
2. **Incident logging** - Complete forensic trail
3. **Stakeholder notification** - Automated alerts
4. **Recovery procedures** - Tested DR plans
5. **Post-incident analysis** - Lessons learned

## Configuration

All security settings are managed through environment variables and secure configuration files. Key rotation and policy updates are handled through the administrative interface with proper approval workflows.