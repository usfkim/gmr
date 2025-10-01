import { Injectable } from '@angular/core';

export interface MfaConfig {
  userId: string;
  methods: {
    totp: boolean;
    sms: boolean;
    email: boolean;
    hardware_token: boolean;
    biometric: boolean;
  };
  backupCodes: string[];
  lastUsed: Date;
  deviceFingerprints: DeviceFingerprint[];
}

export interface DeviceFingerprint {
  id: string;
  userId: string;
  fingerprint: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  trusted: boolean;
  firstSeen: Date;
  lastSeen: Date;
  riskScore: number;
}

export interface MfaChallenge {
  challengeId: string;
  userId: string;
  method: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  private readonly MFA_ENDPOINT = 'https://mfa.ugandamedicalregistry.com/api/v1';
  private activeChallenges = new Map<string, MfaChallenge>();

  constructor() { }

  /**
   * Initiates MFA challenge for user
   */
  async initiateMfaChallenge(
    userId: string,
    preferredMethod?: string
  ): Promise<MfaChallenge> {
    const config = await this.getUserMfaConfig(userId);
    const method = preferredMethod || this.selectBestMethod(config);
    
    const challenge: MfaChallenge = {
      challengeId: this.generateChallengeId(),
      userId,
      method,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      maxAttempts: 3,
      verified: false
    };

    this.activeChallenges.set(challenge.challengeId, challenge);
    
    // Send challenge based on method
    await this.sendChallenge(challenge);
    
    return challenge;
  }

  /**
   * Verifies MFA response
   */
  async verifyMfaResponse(
    challengeId: string,
    response: string
  ): Promise<{ success: boolean; reason?: string }> {
    const challenge = this.activeChallenges.get(challengeId);
    
    if (!challenge) {
      return { success: false, reason: 'Invalid or expired challenge' };
    }

    if (new Date() > challenge.expiresAt) {
      this.activeChallenges.delete(challengeId);
      return { success: false, reason: 'Challenge expired' };
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      this.activeChallenges.delete(challengeId);
      return { success: false, reason: 'Maximum attempts exceeded' };
    }

    challenge.attempts++;

    // Verify response based on method
    const isValid = await this.validateResponse(challenge, response);
    
    if (isValid) {
      challenge.verified = true;
      this.activeChallenges.delete(challengeId);
      await this.recordSuccessfulAuth(challenge.userId);
      return { success: true };
    } else {
      if (challenge.attempts >= challenge.maxAttempts) {
        this.activeChallenges.delete(challengeId);
        await this.recordFailedAuth(challenge.userId, 'Max attempts exceeded');
      }
      return { success: false, reason: 'Invalid verification code' };
    }
  }

  /**
   * Generates and stores device fingerprint
   */
  async generateDeviceFingerprint(userId: string): Promise<DeviceFingerprint> {
    const fingerprint = await this.calculateFingerprint();
    
    const deviceFingerprint: DeviceFingerprint = {
      id: this.generateFingerprintId(),
      userId,
      fingerprint,
      deviceName: this.getDeviceName(),
      browser: this.getBrowserInfo(),
      os: this.getOsInfo(),
      ipAddress: await this.getCurrentIpAddress(),
      location: await this.getApproximateLocation(),
      trusted: false,
      firstSeen: new Date(),
      lastSeen: new Date(),
      riskScore: await this.calculateDeviceRisk(fingerprint)
    };

    // Store fingerprint
    await this.storeDeviceFingerprint(deviceFingerprint);
    
    return deviceFingerprint;
  }

  /**
   * Validates device fingerprint for trusted device detection
   */
  async validateDeviceFingerprint(
    userId: string,
    currentFingerprint: string
  ): Promise<{ trusted: boolean; riskScore: number; requiresMfa: boolean }> {
    const userFingerprints = await this.getUserDeviceFingerprints(userId);
    const matchingDevice = userFingerprints.find(d => d.fingerprint === currentFingerprint);
    
    if (matchingDevice) {
      // Update last seen
      matchingDevice.lastSeen = new Date();
      await this.updateDeviceFingerprint(matchingDevice);
      
      return {
        trusted: matchingDevice.trusted,
        riskScore: matchingDevice.riskScore,
        requiresMfa: !matchingDevice.trusted || matchingDevice.riskScore > 5
      };
    }

    // New device detected
    const newDevice = await this.generateDeviceFingerprint(userId);
    
    return {
      trusted: false,
      riskScore: newDevice.riskScore,
      requiresMfa: true
    };
  }

  /**
   * Manages IP allow-listing for regulators and embassies
   */
  async checkIpAllowList(
    userId: string,
    ipAddress: string,
    userRole: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Special handling for regulators and embassies
    if (['admin', 'inspector', 'embassy_user'].includes(userRole)) {
      const allowedIps = await this.getAllowedIpsForRole(userRole);
      
      if (!this.isIpInRanges(ipAddress, allowedIps)) {
        await this.recordUnauthorizedIpAccess(userId, ipAddress, userRole);
        return {
          allowed: false,
          reason: 'IP address not in allow-list for this role'
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Sets up MFA for a user
   */
  async setupMfa(userId: string, methods: string[]): Promise<MfaConfig> {
    const config: MfaConfig = {
      userId,
      methods: {
        totp: methods.includes('totp'),
        sms: methods.includes('sms'),
        email: methods.includes('email'),
        hardware_token: methods.includes('hardware_token'),
        biometric: methods.includes('biometric')
      },
      backupCodes: this.generateBackupCodes(),
      lastUsed: new Date(),
      deviceFingerprints: []
    };

    await this.storeMfaConfig(config);
    return config;
  }

  private async calculateFingerprint(): Promise<string> {
    const components = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      plugins: Array.from(navigator.plugins).map(p => p.name).sort(),
      canvas: await this.getCanvasFingerprint()
    };

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(components));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getCanvasFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint test', 2, 2);
    
    return canvas.toDataURL();
  }

  private async calculateDeviceRisk(fingerprint: string): Promise<number> {
    // Mock risk calculation - in production, use ML models
    const riskFactors = {
      newDevice: 3,
      unknownLocation: 2,
      suspiciousUserAgent: 4,
      vpnDetected: 5,
      anomalousTimezone: 2
    };

    // Calculate based on various factors
    let riskScore = 1; // Base risk
    
    // Add risk factors based on device characteristics
    if (Math.random() > 0.8) riskScore += riskFactors.newDevice;
    if (Math.random() > 0.9) riskScore += riskFactors.vpnDetected;
    
    return Math.min(riskScore, 10);
  }

  private selectBestMethod(config: MfaConfig): string {
    if (config.methods.hardware_token) return 'hardware_token';
    if (config.methods.totp) return 'totp';
    if (config.methods.sms) return 'sms';
    if (config.methods.email) return 'email';
    return 'totp'; // Default fallback
  }

  private async sendChallenge(challenge: MfaChallenge): Promise<void> {
    // In production, send actual MFA challenge
    console.log(`MFA challenge sent via ${challenge.method} for user ${challenge.userId}`);
  }

  private async validateResponse(challenge: MfaChallenge, response: string): Promise<boolean> {
    // Mock validation - in production, validate against TOTP/SMS/etc.
    return response === '123456' || response === 'backup123';
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  }

  private generateChallengeId(): string {
    return 'MFA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateFingerprintId(): string {
    return 'FP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getDeviceName(): string {
    // Extract device name from user agent
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Mac')) return 'Mac';
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('Android')) return 'Android Device';
    return 'Unknown Device';
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  }

  private getOsInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows NT 10')) return 'Windows 10';
    if (ua.includes('Windows NT 11')) return 'Windows 11';
    if (ua.includes('Mac OS X')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown OS';
  }

  private async getCurrentIpAddress(): Promise<string> {
    // In production, get from server or IP detection service
    return '192.168.1.100';
  }

  private async getApproximateLocation(): Promise<string> {
    // In production, use IP geolocation service
    return 'Kampala, Uganda';
  }

  private async getUserMfaConfig(userId: string): Promise<MfaConfig> {
    // Mock config - in production, fetch from database
    return {
      userId,
      methods: {
        totp: true,
        sms: true,
        email: true,
        hardware_token: false,
        biometric: false
      },
      backupCodes: this.generateBackupCodes(),
      lastUsed: new Date(),
      deviceFingerprints: []
    };
  }

  private async getUserDeviceFingerprints(userId: string): Promise<DeviceFingerprint[]> {
    // In production, fetch from database
    return [];
  }

  private async storeDeviceFingerprint(fingerprint: DeviceFingerprint): Promise<void> {
    // In production, store in secure database
    console.log(`Device fingerprint stored: ${fingerprint.id}`);
  }

  private async updateDeviceFingerprint(fingerprint: DeviceFingerprint): Promise<void> {
    // In production, update in database
    console.log(`Device fingerprint updated: ${fingerprint.id}`);
  }

  private async storeMfaConfig(config: MfaConfig): Promise<void> {
    // In production, store in secure database
    console.log(`MFA config stored for user: ${config.userId}`);
  }

  private async getAllowedIpsForRole(role: string): Promise<string[]> {
    // In production, fetch from configuration
    const allowedIps: { [key: string]: string[] } = {
      'admin': ['192.168.1.0/24', '10.0.0.0/8'],
      'inspector': ['192.168.1.0/24', '172.16.0.0/12'],
      'embassy_user': ['203.0.113.0/24', '198.51.100.0/24']
    };
    
    return allowedIps[role] || [];
  }

  private isIpInRanges(ip: string, ranges: string[]): boolean {
    // In production, implement proper CIDR matching
    return ranges.some(range => ip.startsWith(range.split('/')[0].substring(0, 10)));
  }

  private async recordSuccessfulAuth(userId: string): Promise<void> {
    console.log(`Successful MFA authentication for user: ${userId}`);
  }

  private async recordFailedAuth(userId: string, reason: string): Promise<void> {
    console.log(`Failed MFA authentication for user: ${userId}, reason: ${reason}`);
  }

  private async recordUnauthorizedIpAccess(
    userId: string,
    ipAddress: string,
    userRole: string
  ): Promise<void> {
    console.log(`Unauthorized IP access attempt: ${userId} from ${ipAddress} (${userRole})`);
  }
}