import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MfaService, MfaChallenge } from '../../services/mfa.service';
import { AuditLogService } from '../../services/audit-log.service';

@Component({
  selector: 'app-mfa-challenge',
  templateUrl: './mfa-challenge.component.html',
  styleUrls: ['./mfa-challenge.component.css']
})
export class MfaChallengeComponent implements OnInit {
  private mfaService = inject(MfaService);
  private auditService = inject(AuditLogService);
  private router = inject(Router);

  challenge: MfaChallenge | null = null;
  verificationCode = '';
  isVerifying = false;
  errorMessage = '';
  timeRemaining = 0;
  supportEmail = 'security@ugandamedicalregistry.com';
  
  ngOnInit(): void {
    this.initiateMfaChallenge();
    this.startCountdown();
  }

  async initiateMfaChallenge(): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.challenge = await this.mfaService.initiateMfaChallenge(currentUser.id);
      this.timeRemaining = Math.floor((this.challenge.expiresAt.getTime() - Date.now()) / 1000);
    } catch (error) {
      this.errorMessage = 'Failed to initiate MFA challenge. Please try again.';
      console.error('MFA challenge initiation failed:', error);
    }
  }

  async verifyCode(): Promise<void> {
    if (!this.challenge || !this.verificationCode.trim()) {
      this.errorMessage = 'Please enter the verification code';
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    try {
      const result = await this.mfaService.verifyMfaResponse(
        this.challenge.challengeId,
        this.verificationCode
      );

      if (result.success) {
        // MFA successful - redirect to intended destination
        const redirectUrl = sessionStorage.getItem('mfa_redirect_url') || '/dashboard';
        sessionStorage.removeItem('mfa_redirect_url');
        
        await this.auditService.logAdminAction(
          this.getCurrentUser().id,
          this.getCurrentUser().role,
          'MFA_SUCCESS',
          'authentication',
          this.challenge.challengeId,
          true,
          'Multi-factor authentication successful'
        );
        
        this.router.navigate([redirectUrl]);
      } else {
        this.errorMessage = result.reason || 'Invalid verification code';
        this.verificationCode = '';
        
        await this.auditService.logAdminAction(
          this.getCurrentUser().id,
          this.getCurrentUser().role,
          'MFA_FAILURE',
          'authentication',
          this.challenge.challengeId,
          false,
          result.reason
        );
      }
    } catch (error) {
      this.errorMessage = 'Verification failed. Please try again.';
      console.error('MFA verification failed:', error);
    } finally {
      this.isVerifying = false;
    }
  }

  async resendCode(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      await this.initiateMfaChallenge();
      this.verificationCode = '';
      this.errorMessage = '';
    }
  }

  private startCountdown(): void {
    const interval = setInterval(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        clearInterval(interval);
        this.errorMessage = 'Verification code expired. Please request a new one.';
      }
    }, 1000);
  }

  private getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}