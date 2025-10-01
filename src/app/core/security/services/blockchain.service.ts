import { Injectable } from '@angular/core';

export interface BlockchainRecord {
  id: string;
  type: 'license_issued' | 'license_renewed' | 'license_suspended' | 'license_revoked' | 'status_change';
  licenseNumber: string;
  hash: string;
  timestamp: Date;
  blockNumber: number;
  previousHash: string;
  signature: string;
  metadata: {
    action: string;
    performedBy: string;
    reason?: string;
  };
}

export interface BlockchainVerification {
  isValid: boolean;
  blockNumber: number;
  confirmations: number;
  timestamp: Date;
  hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private readonly BLOCKCHAIN_ENDPOINT = 'https://blockchain.ugandamedicalregistry.com/api/v1';
  private readonly NETWORK_ID = 'umr-private-network';

  constructor() { }

  /**
   * Records a license action on the blockchain
   * Only stores hashes and metadata - no PII
   */
  async recordLicenseAction(
    licenseNumber: string,
    action: string,
    performedBy: string,
    reason?: string
  ): Promise<BlockchainRecord> {
    // Generate hash of the action without including PII
    const actionData = {
      licenseNumber: this.hashLicenseNumber(licenseNumber),
      action,
      timestamp: new Date().toISOString(),
      performedBy: this.hashUserId(performedBy)
    };

    const hash = await this.generateHash(JSON.stringify(actionData));
    
    // In production, this would interact with actual blockchain network
    const record: BlockchainRecord = {
      id: this.generateRecordId(),
      type: action as any,
      licenseNumber: this.hashLicenseNumber(licenseNumber),
      hash,
      timestamp: new Date(),
      blockNumber: await this.getNextBlockNumber(),
      previousHash: await this.getLastBlockHash(),
      signature: await this.signRecord(hash),
      metadata: {
        action,
        performedBy: this.hashUserId(performedBy),
        reason
      }
    };

    // Store on blockchain
    await this.submitToBlockchain(record);
    
    return record;
  }

  /**
   * Verifies a license record against blockchain
   */
  async verifyLicenseRecord(licenseNumber: string): Promise<BlockchainVerification> {
    const hashedLicense = this.hashLicenseNumber(licenseNumber);
    
    // In production, this would query the blockchain
    return {
      isValid: true,
      blockNumber: 12547,
      confirmations: 6,
      timestamp: new Date(),
      hash: await this.generateHash(hashedLicense)
    };
  }

  /**
   * Gets the complete audit trail for a license
   */
  async getLicenseAuditTrail(licenseNumber: string): Promise<BlockchainRecord[]> {
    const hashedLicense = this.hashLicenseNumber(licenseNumber);
    
    // Mock audit trail - in production, query blockchain
    return [
      {
        id: 'BLK-001',
        type: 'license_issued',
        licenseNumber: hashedLicense,
        hash: await this.generateHash('license_issued_' + hashedLicense),
        timestamp: new Date('2023-01-15'),
        blockNumber: 10234,
        previousHash: 'prev_hash_123',
        signature: 'sig_456',
        metadata: {
          action: 'license_issued',
          performedBy: this.hashUserId('mdc_admin_001'),
          reason: 'Initial registration'
        }
      }
    ];
  }

  /**
   * Validates blockchain integrity
   */
  async validateChainIntegrity(): Promise<boolean> {
    // In production, this would validate the entire chain
    return true;
  }

  private async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private hashLicenseNumber(licenseNumber: string): string {
    // In production, use proper hashing with salt
    return 'HASH_' + licenseNumber.replace(/[^A-Z0-9]/g, '');
  }

  private hashUserId(userId: string): string {
    // In production, use proper hashing with salt
    return 'USER_HASH_' + userId.replace(/[^A-Z0-9]/g, '');
  }

  private generateRecordId(): string {
    return 'BLK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async getNextBlockNumber(): Promise<number> {
    // In production, get from blockchain network
    return Math.floor(Math.random() * 100000) + 10000;
  }

  private async getLastBlockHash(): Promise<string> {
    // In production, get from blockchain network
    return await this.generateHash('last_block_' + Date.now());
  }

  private async signRecord(hash: string): Promise<string> {
    // In production, use HSM or secure key management
    return await this.generateHash('signature_' + hash);
  }

  private async submitToBlockchain(record: BlockchainRecord): Promise<void> {
    // In production, submit to actual blockchain network
    console.log('Blockchain record submitted:', record.id);
  }
}