import { Injectable } from '@angular/core';

export interface DlpPolicy {
  id: string;
  name: string;
  resourceType: string;
  rules: {
    maxViewsPerHour: number;
    maxExportsPerDay: number;
    requiresJustification: boolean;
    watermarkRequired: boolean;
    allowedIpRanges?: string[];
    allowedUserRoles: string[];
    timeRestrictions?: {
      startHour: number;
      endHour: number;
      allowedDays: number[];
    };
  };
  violations: {
    action: 'log' | 'block' | 'alert';
    notifyAdmins: boolean;
    escalationThreshold: number;
  };
  active: boolean;
}

export interface AccessRequest {
  userId: string;
  resourceType: string;
  resourceId: string;
  action: 'view' | 'export' | 'print' | 'download';
  justification: string;
  ipAddress: string;
  timestamp: Date;
}

export interface DlpViolation {
  id: string;
  userId: string;
  policyId: string;
  violationType: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  investigated: boolean;
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
export class DlpService {
  private readonly DLP_ENDPOINT = 'https://dlp.ugandamedicalregistry.com/api/v1';
  private userAccessCounts = new Map<string, { views: number, exports: number, lastReset: Date }>();

  // DLP Policies for different resource types
  private dlpPolicies: DlpPolicy[] = [
    {
      id: 'DLP-001',
      name: 'Practitioner Data Access Policy',
      resourceType: 'practitioner',
      rules: {
        maxViewsPerHour: 50,
        maxExportsPerDay: 10,
        requiresJustification: true,
        watermarkRequired: true,
        allowedUserRoles: ['admin', 'inspector', 'council_admin'],
        timeRestrictions: {
          startHour: 6,
          endHour: 22,
          allowedDays: [1, 2, 3, 4, 5] // Monday to Friday
        }
      },
      violations: {
        action: 'block',
        notifyAdmins: true,
        escalationThreshold: 3
      },
      active: true
    },
    {
      id: 'DLP-002',
      name: 'Investigation Data Policy',
      resourceType: 'investigation',
      rules: {
        maxViewsPerHour: 20,
        maxExportsPerDay: 5,
        requiresJustification: true,
        watermarkRequired: true,
        allowedUserRoles: ['admin', 'inspector'],
        allowedIpRanges: ['192.168.1.0/24', '10.0.0.0/8']
      },
      violations: {
        action: 'block',
        notifyAdmins: true,
        escalationThreshold: 1
      },
      active: true
    },
    {
      id: 'DLP-003',
      name: 'Financial Data Policy',
      resourceType: 'financial',
      rules: {
        maxViewsPerHour: 30,
        maxExportsPerDay: 3,
        requiresJustification: true,
        watermarkRequired: true,
        allowedUserRoles: ['admin', 'finance_admin']
      },
      violations: {
        action: 'block',
        notifyAdmins: true,
        escalationThreshold: 2
      },
      active: true
    }
  ];

  constructor() { }

  /**
   * Checks if access request complies with DLP policies
   */
  async checkAccessCompliance(request: AccessRequest): Promise<{
    allowed: boolean;
    reason?: string;
    requiresWatermark: boolean;
    policyViolations: string[];
  }> {
    const policy = this.dlpPolicies.find(p => p.resourceType === request.resourceType);
    
    if (!policy || !policy.active) {
      return {
        allowed: true,
        requiresWatermark: false,
        policyViolations: []
      };
    }

    const violations: string[] = [];
    
    // Check rate limits
    const userAccess = this.getUserAccessCounts(request.userId);
    
    if (request.action === 'view' && userAccess.views >= policy.rules.maxViewsPerHour) {
      violations.push('Exceeded hourly view limit');
    }
    
    if (request.action === 'export' && userAccess.exports >= policy.rules.maxExportsPerDay) {
      violations.push('Exceeded daily export limit');
    }

    // Check justification requirement
    if (policy.rules.requiresJustification && !request.justification.trim()) {
      violations.push('Access justification required');
    }

    // Check time restrictions
    if (policy.rules.timeRestrictions) {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      if (hour < policy.rules.timeRestrictions.startHour || 
          hour > policy.rules.timeRestrictions.endHour) {
        violations.push('Access outside allowed hours');
      }
      
      if (!policy.rules.timeRestrictions.allowedDays.includes(day)) {
        violations.push('Access not allowed on this day');
      }
    }

    // Check IP restrictions
    if (policy.rules.allowedIpRanges && 
        !this.isIpInAllowedRanges(request.ipAddress, policy.rules.allowedIpRanges)) {
      violations.push('IP address not in allowed ranges');
    }

    const allowed = violations.length === 0;
    
    if (!allowed && policy.violations.action === 'block') {
      await this.recordViolation(request, policy, violations);
    }

    // Update access counts
    if (allowed) {
      this.updateAccessCounts(request.userId, request.action);
    }

    return {
      allowed,
      reason: violations.join('; '),
      requiresWatermark: policy.rules.watermarkRequired,
      policyViolations: violations
    };
  }

  /**
   * Applies watermark to exported documents
   */
  async applyWatermark(
    document: Blob,
    userId: string,
    timestamp: Date,
    classification: string
  ): Promise<Blob> {
    // In production, apply digital watermark to document
    const watermarkText = `CONFIDENTIAL - Accessed by ${userId} on ${timestamp.toISOString()} - ${classification}`;
    
    // Mock watermarking - in production, use proper document watermarking library
    console.log(`Applying watermark: ${watermarkText}`);
    
    return document;
  }

  /**
   * Throttles access based on user behavior
   */
  async throttleAccess(userId: string, resourceType: string): Promise<number> {
    const pattern = await this.analyzeUserBehavior(userId, resourceType);
    
    if (pattern.suspiciousActivity) {
      // Implement progressive throttling
      return Math.min(pattern.riskScore * 1000, 10000); // Max 10 second delay
    }
    
    return 0; // No throttling needed
  }

  /**
   * Gets DLP violations for monitoring
   */
  async getDlpViolations(
    startDate: Date,
    endDate: Date,
    severity?: string
  ): Promise<DlpViolation[]> {
    // In production, query DLP violation database
    return [];
  }

  private getUserAccessCounts(userId: string): { views: number, exports: number, lastReset: Date } {
    const now = new Date();
    let counts = this.userAccessCounts.get(userId);
    
    if (!counts || this.shouldResetCounts(counts.lastReset, now)) {
      counts = { views: 0, exports: 0, lastReset: now };
      this.userAccessCounts.set(userId, counts);
    }
    
    return counts;
  }

  private updateAccessCounts(userId: string, action: string): void {
    const counts = this.getUserAccessCounts(userId);
    
    if (action === 'view') {
      counts.views++;
    } else if (action === 'export') {
      counts.exports++;
    }
    
    this.userAccessCounts.set(userId, counts);
  }

  private shouldResetCounts(lastReset: Date, now: Date): boolean {
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
    return hoursSinceReset >= 1; // Reset hourly for views, daily for exports
  }

  private isIpInAllowedRanges(ip: string, allowedRanges: string[]): boolean {
    // In production, implement proper IP range checking
    return allowedRanges.some(range => ip.startsWith(range.split('/')[0].substring(0, 10)));
  }

  private async recordViolation(
    request: AccessRequest,
    policy: DlpPolicy,
    violations: string[]
  ): Promise<void> {
    const violation: DlpViolation = {
      id: this.generateViolationId(),
      userId: request.userId,
      policyId: policy.id,
      violationType: violations.join(', '),
      description: `DLP policy violation: ${violations.join('; ')}`,
      timestamp: new Date(),
      severity: this.calculateSeverity(violations),
      blocked: policy.violations.action === 'block',
      investigated: false
    };

    // Store violation record
    console.log('DLP Violation recorded:', violation);
    
    // Notify admins if required
    if (policy.violations.notifyAdmins) {
      await this.notifyAdmins(violation);
    }
  }

  private async analyzeUserBehavior(userId: string, resourceType: string): Promise<AccessPattern> {
    // Mock behavior analysis - in production, use ML models
    return {
      userId,
      resourceType,
      accessCount: Math.floor(Math.random() * 100),
      lastAccess: new Date(),
      suspiciousActivity: Math.random() > 0.9,
      riskScore: Math.floor(Math.random() * 10) + 1
    };
  }

  private calculateSeverity(violations: string[]): 'low' | 'medium' | 'high' | 'critical' {
    if (violations.some(v => v.includes('IP address') || v.includes('unauthorized'))) {
      return 'critical';
    }
    if (violations.some(v => v.includes('limit') || v.includes('time'))) {
      return 'high';
    }
    if (violations.some(v => v.includes('justification'))) {
      return 'medium';
    }
    return 'low';
  }

  private async notifyAdmins(violation: DlpViolation): Promise<void> {
    // In production, send notifications to security team
    console.log(`Admin notification sent for DLP violation: ${violation.id}`);
  }

  private generateViolationId(): string {
    return 'DLP_VIO_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }
}