// Security and Privacy Models

export interface SecurityEvent {
  id: string;
  type: 'authentication' | 'authorization' | 'data_access' | 'system_change' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId: string;
  ipAddress: string;
  userAgent: string;
  description: string;
  metadata: any;
  resolved: boolean;
  investigationId?: string;
}

export interface PrivacySettings {
  userId: string;
  dataMinimization: boolean;
  consentGiven: {
    dataProcessing: boolean;
    dataSharing: boolean;
    marketing: boolean;
    analytics: boolean;
  };
  retentionPeriod: number; // days
  rightToErasure: boolean;
  dataPortability: boolean;
  lastUpdated: Date;
}

export interface ComplianceReport {
  id: string;
  type: 'gdpr' | 'hipaa' | 'iso27001' | 'soc2' | 'local_regulation';
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    dataBreaches: number;
    accessViolations: number;
    privacyRequests: number;
    complianceScore: number;
  };
  findings: ComplianceFinding[];
  recommendations: string[];
  generatedBy: string;
  generatedDate: Date;
  approved: boolean;
  approvedBy?: string;
}

export interface ComplianceFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  remediation: string;
  deadline: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted' | 'top_secret';
  categories: string[];
  handlingRequirements: {
    encryption: boolean;
    accessLogging: boolean;
    approvalRequired: boolean;
    retentionPeriod: number;
    geographicRestrictions: string[];
  };
  markingRequired: boolean;
}

export interface SecurityMetrics {
  authenticationEvents: {
    successful: number;
    failed: number;
    mfaBypass: number;
    suspiciousAttempts: number;
  };
  dataAccess: {
    totalAccesses: number;
    unauthorizedAttempts: number;
    dataExports: number;
    policyViolations: number;
  };
  systemSecurity: {
    vulnerabilities: number;
    patchLevel: number;
    securityScore: number;
    lastSecurityScan: Date;
  };
  compliance: {
    overallScore: number;
    auditFindings: number;
    remediationItems: number;
    certificationStatus: string[];
  };
}

export interface ThreatIntelligence {
  id: string;
  type: 'ip_reputation' | 'malware_signature' | 'attack_pattern' | 'vulnerability';
  source: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  description: string;
  mitigation: string[];
  lastUpdated: Date;
  active: boolean;
}

export interface IncidentResponse {
  id: string;
  type: 'data_breach' | 'unauthorized_access' | 'system_compromise' | 'ddos_attack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'closed';
  detectedAt: Date;
  reportedBy: string;
  assignedTo: string;
  description: string;
  timeline: IncidentTimelineEntry[];
  affectedSystems: string[];
  affectedUsers: number;
  dataImpact: {
    recordsAffected: number;
    dataTypes: string[];
    confidentialityImpact: boolean;
    integrityImpact: boolean;
    availabilityImpact: boolean;
  };
  containmentActions: string[];
  recoveryActions: string[];
  lessonsLearned: string[];
  regulatoryNotification: {
    required: boolean;
    notified: boolean;
    notificationDate?: Date;
    regulators: string[];
  };
}

export interface IncidentTimelineEntry {
  timestamp: Date;
  action: string;
  performedBy: string;
  description: string;
  evidence?: string[];
}