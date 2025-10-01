import { Injectable } from '@angular/core';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  success: boolean;
  reason?: string;
  metadata: {
    [key: string]: any;
  };
  hash: string;
  blockchainTxId?: string;
  immutable: boolean;
}

export interface AccessPattern {
  userId: string;
  resourceType: string;
  accessCount: number;
  lastAccess: Date;
  suspiciousActivity: boolean;
  riskScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly AUDIT_ENDPOINT = 'https://audit.ugandamedicalregistry.com/api/v1';
  private readonly MAX_BATCH_SIZE = 100;
  private auditQueue: AuditLogEntry[] = [];

  constructor() {
    this.initializeAuditLogging();
  }

  /**
   * Logs an admin action with immutable audit trail
   */
  async logAdminAction(
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    success: boolean,
    reason?: string,
    metadata: any = {}
  ): Promise<void> {
    const entry: AuditLogEntry = {
      id: this.generateAuditId(),
      timestamp: new Date(),
      userId,
      userRole,
      action,
      resource,
      resourceId,
      ipAddress: await this.getCurrentIpAddress(),
      userAgent: navigator.userAgent,
      sessionId: this.getCurrentSessionId(),
      success,
      reason,
      metadata: {
        ...metadata,
        browserFingerprint: await this.getBrowserFingerprint(),
        geolocation: await this.getGeolocation()
      },
      hash: '',
      immutable: true
    };

    // Generate hash for integrity
    entry.hash = await this.generateEntryHash(entry);
    
    // Add to queue for batch processing
    this.auditQueue.push(entry);
    
    // Process queue if it reaches batch size
    if (this.auditQueue.length >= this.MAX_BATCH_SIZE) {
      await this.processBatch();
    }

    // For critical actions, process immediately
    if (this.isCriticalAction(action)) {
      await this.processImmediately(entry);
    }
  }

  /**
   * Logs data access with DLP controls
   */
  async logDataAccess(
    userId: string,
    resourceType: string,
    resourceId: string,
    accessType: 'view' | 'export' | 'print' | 'download',
    reason: string
  ): Promise<void> {
    await this.logAdminAction(
      userId,
      'data_accessor',
      `DATA_${accessType.toUpperCase()}`,
      resourceType,
      resourceId,
      true,
      reason,
      {
        accessType,
        dataClassification: this.getDataClassification(resourceType),
        dlpPolicyApplied: true
      }
    );

    // Check for suspicious access patterns
    await this.analyzeAccessPattern(userId, resourceType);
  }

  /**
   * Gets audit logs for a specific resource
   */
  async getResourceAuditLog(resourceType: string, resourceId: string): Promise<AuditLogEntry[]> {
    // In production, query audit database
    return this.auditQueue.filter(entry => 
      entry.resource === resourceType && entry.resourceId === resourceId
    );
  }

  /**
   * Analyzes access patterns for anomaly detection
   */
  async analyzeAccessPattern(userId: string, resourceType: string): Promise<AccessPattern> {
    // Mock analysis - in production, use ML for anomaly detection
    const pattern: AccessPattern = {
      userId,
      resourceType,
      accessCount: Math.floor(Math.random() * 50) + 1,
      lastAccess: new Date(),
      suspiciousActivity: false,
      riskScore: Math.floor(Math.random() * 10) + 1
    };

    // Flag suspicious patterns
    if (pattern.accessCount > 100 || pattern.riskScore > 7) {
      pattern.suspiciousActivity = true;
      await this.flagSuspiciousActivity(userId, pattern);
    }

    return pattern;
  }

  /**
   * Exports audit logs for compliance reporting
   */
  async exportAuditLogs(
    startDate: Date,
    endDate: Date,
    userId?: string,
    action?: string
  ): Promise<Blob> {
    const logs = this.auditQueue.filter(entry => {
      const dateMatch = entry.timestamp >= startDate && entry.timestamp <= endDate;
      const userMatch = !userId || entry.userId === userId;
      const actionMatch = !action || entry.action === action;
      
      return dateMatch && userMatch && actionMatch;
    });

    // Convert to CSV format
    const csvContent = this.convertToCsv(logs);
    return new Blob([csvContent], { type: 'text/csv' });
  }

  private async initializeAuditLogging(): Promise<void> {
    // Set up periodic batch processing
    setInterval(() => {
      if (this.auditQueue.length > 0) {
        this.processBatch();
      }
    }, 30000); // Process every 30 seconds
  }

  private async processBatch(): Promise<void> {
    if (this.auditQueue.length === 0) return;

    const batch = this.auditQueue.splice(0, this.MAX_BATCH_SIZE);
    
    // In production, send to secure audit storage
    console.log(`Processing audit batch: ${batch.length} entries`);
    
    // Store in immutable audit database
    await this.storeAuditBatch(batch);
  }

  private async processImmediately(entry: AuditLogEntry): Promise<void> {
    // For critical actions, store immediately
    await this.storeAuditEntry(entry);
    
    // Also record on blockchain for extra immutability
    if (entry.blockchainTxId) {
      // Link to blockchain transaction
    }
  }

  private isCriticalAction(action: string): boolean {
    const criticalActions = [
      'LICENSE_REVOKED',
      'LICENSE_SUSPENDED',
      'ADMIN_LOGIN',
      'DATA_EXPORT',
      'SYSTEM_CONFIG_CHANGE',
      'USER_ROLE_CHANGE'
    ];
    
    return criticalActions.includes(action);
  }

  private async flagSuspiciousActivity(userId: string, pattern: AccessPattern): Promise<void> {
    await this.logAdminAction(
      'SYSTEM',
      'security_monitor',
      'SUSPICIOUS_ACTIVITY_DETECTED',
      'user_behavior',
      userId,
      true,
      'Anomalous access pattern detected',
      {
        pattern,
        alertLevel: 'high',
        requiresInvestigation: true
      }
    );
  }

  private getDataClassification(resourceType: string): string {
    const classifications: { [key: string]: string } = {
      'practitioner': 'CONFIDENTIAL',
      'patient_data': 'RESTRICTED',
      'investigation': 'SECRET',
      'financial': 'CONFIDENTIAL',
      'public_registry': 'PUBLIC'
    };
    
    return classifications[resourceType] || 'INTERNAL';
  }

  private async generateEntryHash(entry: Omit<AuditLogEntry, 'hash'>): Promise<string> {
    const dataToHash = {
      timestamp: entry.timestamp.toISOString(),
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      success: entry.success
    };

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(dataToHash));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateAuditId(): string {
    return 'AUDIT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async getCurrentIpAddress(): Promise<string> {
    // In production, get from request headers or IP detection service
    return '192.168.1.100';
  }

  private getCurrentSessionId(): string {
    // In production, get from session management
    return 'SESSION_' + Math.random().toString(36).substr(2, 9);
  }

  private async getBrowserFingerprint(): Promise<string> {
    // Generate browser fingerprint for device tracking
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(fingerprint));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getGeolocation(): Promise<string> {
    // In production, get approximate location for security monitoring
    return 'Kampala, Uganda';
  }

  private async storeAuditBatch(batch: AuditLogEntry[]): Promise<void> {
    // In production, store in immutable audit database
    console.log(`Storing audit batch: ${batch.length} entries`);
  }

  private async storeAuditEntry(entry: AuditLogEntry): Promise<void> {
    // In production, store single entry immediately
    console.log(`Storing critical audit entry: ${entry.id}`);
  }

  private convertToCsv(logs: AuditLogEntry[]): string {
    const headers = [
      'ID', 'Timestamp', 'User ID', 'User Role', 'Action', 'Resource', 
      'Resource ID', 'IP Address', 'Success', 'Reason'
    ];
    
    const rows = logs.map(log => [
      log.id,
      log.timestamp.toISOString(),
      log.userId,
      log.userRole,
      log.action,
      log.resource,
      log.resourceId,
      log.ipAddress,
      log.success.toString(),
      log.reason || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}