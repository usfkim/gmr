import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditLogService } from '../../services/audit-log.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auditService = inject(AuditLogService);

  reason = '';
  requestId = '';
  supportEmail = 'security@ugandamedicalregistry.com';
  
  ngOnInit(): void {
    this.reason = this.route.snapshot.queryParams['reason'] || 'Access denied due to security policy';
    this.requestId = this.generateRequestId();
    
    // Log access denial
    this.logAccessDenial();
  }

  private async logAccessDenial(): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    if (currentUser) {
      await this.auditService.logAdminAction(
        currentUser.id,
        currentUser.role,
        'ACCESS_DENIED_PAGE_VIEW',
        'security',
        this.requestId,
        false,
        this.reason,
        {
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          referrer: document.referrer
        }
      );
    }
  }

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  contactSupport(): void {
    const subject = encodeURIComponent(`Access Denied - Request ID: ${this.requestId}`);
    const body = encodeURIComponent(`
      I was denied access to a resource in the Uganda Medical Registry system.
      
      Request ID: ${this.requestId}
      Reason: ${this.reason}
      Timestamp: ${new Date().toISOString()}
      
      Please review my access permissions.
    `);
    
    window.location.href = `mailto:${this.supportEmail}?subject=${subject}&body=${body}`;
  }

  private getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private generateRequestId(): string {
    return 'AD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}