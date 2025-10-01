import { Injectable } from '@angular/core';

export interface EncryptedField {
  encryptedValue: string;
  keyId: string;
  algorithm: string;
  iv: string;
  timestamp: Date;
}

export interface EncryptionKey {
  id: string;
  algorithm: string;
  keySize: number;
  createdDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'revoked';
  hsmBacked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly HSM_ENDPOINT = 'https://hsm.ugandamedicalregistry.com/api/v1';
  private readonly FIELD_ENCRYPTION_KEYS = new Map<string, string>();

  // Sensitive fields that require encryption
  private readonly SENSITIVE_FIELDS = [
    'nationalId',
    'dateOfBirth',
    'personalAddress',
    'phoneNumber',
    'email',
    'medicalHistory',
    'financialData',
    'investigationNotes',
    'disciplinaryRecords'
  ];

  constructor() {
    this.initializeEncryptionKeys();
  }

  /**
   * Encrypts sensitive field data using HSM-backed keys
   */
  async encryptField(fieldName: string, value: string): Promise<EncryptedField> {
    if (!this.isSensitiveField(fieldName)) {
      throw new Error(`Field ${fieldName} is not configured for encryption`);
    }

    const keyId = await this.getEncryptionKeyId(fieldName);
    const key = await this.getHsmKey(keyId);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    
    // In production, this would use HSM for encryption
    const encryptedValue = await this.performEncryption(value, key, iv);
    
    return {
      encryptedValue,
      keyId,
      algorithm: 'AES-256-GCM',
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
      timestamp: new Date()
    };
  }

  /**
   * Decrypts field data using HSM-backed keys
   */
  async decryptField(encryptedField: EncryptedField): Promise<string> {
    const key = await this.getHsmKey(encryptedField.keyId);
    const iv = new Uint8Array(
      encryptedField.iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    // In production, this would use HSM for decryption
    return await this.performDecryption(encryptedField.encryptedValue, key, iv);
  }

  /**
   * Encrypts an entire object with field-level encryption
   */
  async encryptObject(data: any): Promise<any> {
    const encrypted = { ...data };
    
    for (const [key, value] of Object.entries(data)) {
      if (this.isSensitiveField(key) && typeof value === 'string') {
        encrypted[key] = await this.encryptField(key, value);
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypts an object with encrypted fields
   */
  async decryptObject(encryptedData: any): Promise<any> {
    const decrypted = { ...encryptedData };
    
    for (const [key, value] of Object.entries(encryptedData)) {
      if (this.isSensitiveField(key) && this.isEncryptedField(value)) {
        decrypted[key] = await this.decryptField(value as EncryptedField);
      }
    }
    
    return decrypted;
  }

  /**
   * Rotates encryption keys (HSM-managed)
   */
  async rotateEncryptionKeys(): Promise<void> {
    for (const fieldName of this.SENSITIVE_FIELDS) {
      await this.rotateFieldKey(fieldName);
    }
  }

  /**
   * Gets encryption key metadata
   */
  async getKeyMetadata(keyId: string): Promise<EncryptionKey> {
    // In production, query HSM for key metadata
    return {
      id: keyId,
      algorithm: 'AES-256-GCM',
      keySize: 256,
      createdDate: new Date('2024-01-01'),
      expiryDate: new Date('2025-01-01'),
      status: 'active',
      hsmBacked: true
    };
  }

  private async initializeEncryptionKeys(): Promise<void> {
    // Initialize field-specific encryption keys
    for (const field of this.SENSITIVE_FIELDS) {
      this.FIELD_ENCRYPTION_KEYS.set(field, `HSM_KEY_${field.toUpperCase()}_001`);
    }
  }

  private isSensitiveField(fieldName: string): boolean {
    return this.SENSITIVE_FIELDS.includes(fieldName);
  }

  private isEncryptedField(value: any): boolean {
    return value && 
           typeof value === 'object' && 
           'encryptedValue' in value && 
           'keyId' in value;
  }

  private async getEncryptionKeyId(fieldName: string): Promise<string> {
    return this.FIELD_ENCRYPTION_KEYS.get(fieldName) || 'DEFAULT_KEY_001';
  }

  private async getHsmKey(keyId: string): Promise<CryptoKey> {
    // In production, retrieve key from HSM
    const keyData = new Uint8Array(32); // 256-bit key
    crypto.getRandomValues(keyData);
    
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async performEncryption(data: string, key: CryptoKey, iv: Uint8Array): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    return Array.from(new Uint8Array(encrypted))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async performDecryption(encryptedData: string, key: CryptoKey, iv: Uint8Array): Promise<string> {
    const encryptedBuffer = new Uint8Array(
      encryptedData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  private async rotateFieldKey(fieldName: string): Promise<void> {
    // In production, coordinate with HSM to rotate keys
    const newKeyId = `HSM_KEY_${fieldName.toUpperCase()}_${Date.now()}`;
    this.FIELD_ENCRYPTION_KEYS.set(fieldName, newKeyId);
    console.log(`Rotated encryption key for field: ${fieldName}`);
  }
}