import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MfaService } from '../services/mfa.service';
import { AuditLogService } from '../services/audit-log.service';
import { DlpService } from '../services/dlp.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanActivate {
  private mfaService = inject(MfaService);
  private auditService = inject(AuditLogService);
  private dlpService = inject(DlpService);
  private router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if route requires enhanced security
    const requiresEnhancedSecurity = route.data?.['requiresEnhancedSecurity'] || false;
    const requiredRole = route.data?.['requiredRole'];
    const resourceType = route.data?.['resourceType'];

    // Role-based access control
    if (requiredRole && !this.hasRequiredRole(currentUser, requiredRole)) {
      await this.auditService.logAdminAction(
        currentUser.id,
        currentUser.role,
        'UNAUTHORIZED_ACCESS_ATTEMPT',
        'route',
        state.url,
        false,
        `Insufficient role: required ${requiredRole}, has ${currentUser.role}`
      );
      
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Device fingerprinting and MFA check
    if (requiresEnhancedSecurity) {
      const deviceCheck = await this.mfaService.validateDeviceFingerprint(
        currentUser.id,
        await this.getCurrentDeviceFingerprint()
      );

      if (deviceCheck.requiresMfa) {
        // Store intended destination and redirect to MFA
        sessionStorage.setItem('mfa_redirect_url', state.url);
        this.router.navigate(['/mfa-challenge']);
        return false;
      }
    }

    // IP allow-list check for sensitive roles
    if (['admin', 'inspector', 'embassy_user'].includes(currentUser.role)) {
      const ipCheck = await this.mfaService.checkIpAllowList(
        currentUser.id,
        await this.getCurrentIpAddress(),
        currentUser.role
      );

      if (!ipCheck.allowed) {
        await this.auditService.logAdminAction(
          currentUser.id,
          currentUser.role,
          'IP_ALLOWLIST_VIOLATION',
          'access_control',
          state.url,
          false,
          ipCheck.reason
        );
        
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    // DLP compliance check for data access routes
    if (resourceType) {
      const accessRequest = {
        userId: currentUser.id,
        resourceType,
        resourceId: route.params['id'] || 'unknown',
        action: 'view' as const,
        justification: route.queryParams['reason'] || '',
        ipAddress: await this.getCurrentIpAddress(),
        timestamp: new Date()
      };

      const dlpCheck = await this.dlpService.checkAccessCompliance(accessRequest);
      
      if (!dlpCheck.allowed) {
        await this.auditService.logAdminAction(
          currentUser.id,
          currentUser.role,
          'DLP_POLICY_VIOLATION',
          resourceType,
          accessRequest.resourceId,
          false,
          dlpCheck.reason
        );
        
        alert(`Access denied: ${dlpCheck.reason}`);
        return false;
      }

      // Apply throttling if needed
      const throttleDelay = await this.dlpService.throttleAccess(currentUser.id, resourceType);
      if (throttleDelay > 0) {
        await this.delay(throttleDelay);
      }
    }

    // Log successful access
    await this.auditService.logAdminAction(
      currentUser.id,
      currentUser.role,
      'ROUTE_ACCESS',
      'navigation',
      state.url,
      true,
      'Authorized access granted'
    );

    return true;
  }

  private getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasRequiredRole(user: any, requiredRole: string | string[]): boolean {
    const userRole = user.role;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  }

  private async getCurrentDeviceFingerprint(): Promise<string> {
    // Generate current device fingerprint
    const components = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(components));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getCurrentIpAddress(): Promise<string> {
    // In production, get from server or IP detection service
    return '192.168.1.100';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}