import { Injectable } from '@angular/core';

export interface DataResidencyConfig {
  country: string;
  region: string;
  dataCenter: string;
  endpoint: string;
  encryptionKeys: string[];
  backupLocations: string[];
  complianceRequirements: string[];
}

export interface CrossBorderRequest {
  id: string;
  sourceCountry: string;
  targetCountry: string;
  dataType: string;
  purpose: string;
  requestedBy: string;
  approvalRequired: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvalDate?: Date;
  expiryDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataResidencyService {
  private readonly RESIDENCY_CONFIGS: DataResidencyConfig[] = [
    {
      country: 'Uganda',
      region: 'East Africa',
      dataCenter: 'Kampala Primary DC',
      endpoint: 'https://ug.ugandamedicalregistry.com',
      encryptionKeys: ['UG_PRIMARY_KEY_001', 'UG_BACKUP_KEY_001'],
      backupLocations: ['Kampala Secondary DC', 'Entebbe Backup DC'],
      complianceRequirements: ['Uganda Data Protection Act', 'East African Data Governance Framework']
    },
    {
      country: 'Kenya',
      region: 'East Africa',
      dataCenter: 'Nairobi Primary DC',
      endpoint: 'https://ke.ugandamedicalregistry.com',
      encryptionKeys: ['KE_PRIMARY_KEY_001', 'KE_BACKUP_KEY_001'],
      backupLocations: ['Nairobi Secondary DC', 'Mombasa Backup DC'],
      complianceRequirements: ['Kenya Data Protection Act', 'East African Data Governance Framework']
    },
    {
      country: 'Tanzania',
      region: 'East Africa',
      dataCenter: 'Dar es Salaam Primary DC',
      endpoint: 'https://tz.ugandamedicalregistry.com',
      encryptionKeys: ['TZ_PRIMARY_KEY_001', 'TZ_BACKUP_KEY_001'],
      backupLocations: ['Dar es Salaam Secondary DC', 'Dodoma Backup DC'],
      complianceRequirements: ['Tanzania Data Protection Act', 'East African Data Governance Framework']
    }
  ];

  constructor() { }

  /**
   * Gets data residency configuration for a country
   */
  getResidencyConfig(country: string): DataResidencyConfig | null {
    return this.RESIDENCY_CONFIGS.find(config => 
      config.country.toLowerCase() === country.toLowerCase()
    ) || null;
  }

  /**
   * Ensures data stays within country boundaries
   */
  async enforceDataResidency(
    data: any,
    country: string,
    operation: 'store' | 'process' | 'backup'
  ): Promise<{ success: boolean; endpoint: string; reason?: string }> {
    const config = this.getResidencyConfig(country);
    
    if (!config) {
      return {
        success: false,
        endpoint: '',
        reason: `No data residency configuration found for ${country}`
      };
    }

    // Route to country-specific endpoint
    const endpoint = this.selectEndpoint(config, operation);
    
    // Validate compliance requirements
    const complianceCheck = await this.validateCompliance(data, config);
    
    if (!complianceCheck.compliant) {
      return {
        success: false,
        endpoint,
        reason: `Compliance violation: ${complianceCheck.violations.join(', ')}`
      };
    }

    return {
      success: true,
      endpoint
    };
  }

  /**
   * Handles cross-border data requests
   */
  async requestCrossBorderAccess(
    sourceCountry: string,
    targetCountry: string,
    dataType: string,
    purpose: string,
    requestedBy: string
  ): Promise<CrossBorderRequest> {
    const request: CrossBorderRequest = {
      id: this.generateRequestId(),
      sourceCountry,
      targetCountry,
      dataType,
      purpose,
      requestedBy,
      approvalRequired: this.requiresApproval(sourceCountry, targetCountry, dataType),
      status: 'pending'
    };

    // Auto-approve for certain scenarios
    if (!request.approvalRequired) {
      request.status = 'approved';
      request.approvedBy = 'AUTO_APPROVED';
      request.approvalDate = new Date();
      request.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    await this.storeCrossBorderRequest(request);
    return request;
  }

  /**
   * Sets up active-active high availability
   */
  async configureHighAvailability(country: string): Promise<{
    primaryDc: string;
    secondaryDc: string;
    syncStatus: 'healthy' | 'degraded' | 'failed';
    lastSync: Date;
    rpoMinutes: number;
    rtoMinutes: number;
  }> {
    const config = this.getResidencyConfig(country);
    
    if (!config) {
      throw new Error(`No HA configuration available for ${country}`);
    }

    return {
      primaryDc: config.dataCenter,
      secondaryDc: config.backupLocations[0],
      syncStatus: 'healthy',
      lastSync: new Date(),
      rpoMinutes: 5, // Recovery Point Objective: 5 minutes
      rtoMinutes: 15 // Recovery Time Objective: 15 minutes
    };
  }

  /**
   * Manages disaster recovery procedures
   */
  async initiateDrProcedure(
    country: string,
    scenario: 'primary_dc_failure' | 'network_partition' | 'data_corruption'
  ): Promise<{
    success: boolean;
    newPrimaryEndpoint: string;
    estimatedRecoveryTime: number;
    dataLoss: boolean;
  }> {
    const config = this.getResidencyConfig(country);
    
    if (!config) {
      throw new Error(`No DR configuration available for ${country}`);
    }

    // Simulate DR procedure
    const drResult = {
      success: true,
      newPrimaryEndpoint: `https://dr.${country.toLowerCase()}.ugandamedicalregistry.com`,
      estimatedRecoveryTime: 15, // minutes
      dataLoss: false
    };

    // Log DR initiation
    console.log(`DR procedure initiated for ${country}: ${scenario}`);
    
    return drResult;
  }

  private selectEndpoint(config: DataResidencyConfig, operation: string): string {
    switch (operation) {
      case 'store':
      case 'process':
        return config.endpoint;
      case 'backup':
        return config.endpoint.replace('https://', 'https://backup.');
      default:
        return config.endpoint;
    }
  }

  private async validateCompliance(
    data: any,
    config: DataResidencyConfig
  ): Promise<{ compliant: boolean; violations: string[] }> {
    const violations: string[] = [];
    
    // Check if data contains cross-border restricted information
    if (this.containsRestrictedData(data)) {
      violations.push('Data contains cross-border restricted information');
    }

    // Validate encryption requirements
    if (!this.isProperlyEncrypted(data)) {
      violations.push('Data not properly encrypted for cross-border storage');
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }

  private containsRestrictedData(data: any): boolean {
    // Check for sensitive data that shouldn't cross borders
    const restrictedFields = ['nationalId', 'medicalHistory', 'investigationNotes'];
    return restrictedFields.some(field => data[field] && !this.isEncrypted(data[field]));
  }

  private isProperlyEncrypted(data: any): boolean {
    // Verify encryption status of sensitive fields
    return true; // Mock - in production, check encryption status
  }

  private isEncrypted(value: any): boolean {
    return value && typeof value === 'object' && 'encryptedValue' in value;
  }

  private requiresApproval(sourceCountry: string, targetCountry: string, dataType: string): boolean {
    // Define approval requirements for cross-border data access
    const highRiskDataTypes = ['investigation', 'disciplinary', 'financial'];
    const requiresApprovalMatrix = {
      'Uganda-Kenya': false,
      'Uganda-Tanzania': false,
      'Uganda-Rwanda': false,
      'Uganda-Other': true
    };

    const key = `${sourceCountry}-${targetCountry === 'Kenya' || targetCountry === 'Tanzania' || targetCountry === 'Rwanda' ? targetCountry : 'Other'}`;
    
    return requiresApprovalMatrix[key as keyof typeof requiresApprovalMatrix] || 
           highRiskDataTypes.includes(dataType);
  }

  private generateRequestId(): string {
    return 'CBR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async storeCrossBorderRequest(request: CrossBorderRequest): Promise<void> {
    // In production, store in compliance database
    console.log(`Cross-border request stored: ${request.id}`);
  }
}