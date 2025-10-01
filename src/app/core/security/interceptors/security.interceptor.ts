import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from '../services/audit-log.service';
import { EncryptionService } from '../services/encryption.service';
import { DlpService } from '../services/dlp.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  private auditService = inject(AuditLogService);
  private encryptionService = inject(EncryptionService);
  private dlpService = inject(DlpService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add security headers
    const secureReq = req.clone({
      setHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        'X-Request-ID': this.generateRequestId(),
        'X-User-Agent-Fingerprint': this.getUserAgentFingerprint()
      }
    });

    const startTime = Date.now();

    return next.handle(secureReq).pipe(
      tap({
        next: async (event) => {
          if (event instanceof HttpResponse) {
            await this.handleResponse(secureReq, event, startTime);
          }
        },
        error: async (error) => {
          await this.handleError(secureReq, error, startTime);
        }
      })
    );
  }

  private async handleResponse(
    request: HttpRequest<any>,
    response: HttpResponse<any>,
    startTime: number
  ): Promise<void> {
    const duration = Date.now() - startTime;
    const currentUser = this.getCurrentUser();

    if (!currentUser) return;

    // Log data access for audit
    if (this.isDataAccessRequest(request)) {
      await this.auditService.logDataAccess(
        currentUser.id,
        this.extractResourceType(request.url),
        this.extractResourceId(request.url),
        this.mapHttpMethodToAccessType(request.method),
        request.headers.get('X-Access-Reason') || 'No reason provided'
      );
    }

    // Apply DLP controls for sensitive data
    if (this.containsSensitiveData(response.body)) {
      await this.applyDlpControls(request, response, currentUser);
    }

    // Log performance metrics
    if (duration > 5000) { // Log slow requests
      console.warn(`Slow request detected: ${request.url} took ${duration}ms`);
    }
  }

  private async handleError(
    request: HttpRequest<any>,
    error: any,
    startTime: number
  ): Promise<void> {
    const currentUser = this.getCurrentUser();
    const duration = Date.now() - startTime;

    if (currentUser) {
      await this.auditService.logAdminAction(
        currentUser.id,
        currentUser.role,
        'API_ERROR',
        'http_request',
        request.url,
        false,
        `HTTP ${error.status}: ${error.message}`,
        {
          method: request.method,
          duration,
          errorCode: error.status,
          errorMessage: error.message
        }
      );
    }

    // Log security-relevant errors
    if (error.status === 401 || error.status === 403) {
      console.warn(`Security-relevant error: ${error.status} for ${request.url}`);
    }
  }

  private async applyDlpControls(
    request: HttpRequest<any>,
    response: HttpResponse<any>,
    user: any
  ): Promise<void> {
    // Check if response needs watermarking
    if (this.isExportRequest(request)) {
      const watermarkedData = await this.dlpService.applyWatermark(
        new Blob([JSON.stringify(response.body)]),
        user.id,
        new Date(),
        this.getDataClassification(response.body)
      );
      
      // In production, replace response body with watermarked version
      console.log('DLP watermark applied to exported data');
    }

    // Log data access for DLP monitoring
    await this.auditService.logDataAccess(
      user.id,
      this.extractResourceType(request.url),
      this.extractResourceId(request.url),
      this.mapHttpMethodToAccessType(request.method),
      request.headers.get('X-Access-Reason') || 'API access'
    );
  }

  private isDataAccessRequest(request: HttpRequest<any>): boolean {
    const dataEndpoints = ['/practitioners', '/facilities', '/investigations', '/audit-logs'];
    return dataEndpoints.some(endpoint => request.url.includes(endpoint));
  }

  private isExportRequest(request: HttpRequest<any>): boolean {
    const acceptHeader = request.headers.get('Accept');
    return request.url.includes('/export') || 
           (acceptHeader?.includes('text/csv') || false) ||
           (acceptHeader?.includes('application/pdf') || false);
  }

  private containsSensitiveData(body: any): boolean {
    if (!body) return false;
    
    const sensitiveFields = ['nationalId', 'dateOfBirth', 'medicalHistory', 'investigationNotes'];
    const bodyStr = JSON.stringify(body).toLowerCase();
    
    return sensitiveFields.some(field => bodyStr.includes(field.toLowerCase()));
  }

  private extractResourceType(url: string): string {
    if (url.includes('/practitioners')) return 'practitioner';
    if (url.includes('/facilities')) return 'facility';
    if (url.includes('/investigations')) return 'investigation';
    if (url.includes('/audit-logs')) return 'audit_log';
    return 'unknown';
  }

  private extractResourceId(url: string): string {
    const matches = url.match(/\/([^\/]+)$/);
    return matches ? matches[1] : 'unknown';
  }

  private mapHttpMethodToAccessType(method: string): 'view' | 'export' | 'print' | 'download' {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'view';
      case 'POST':
        return 'export';
      default:
        return 'view';
    }
  }

  private getDataClassification(data: any): string {
    // Determine data classification based on content
    if (this.containsRestrictedData(data)) return 'RESTRICTED';
    if (this.containsConfidentialData(data)) return 'CONFIDENTIAL';
    return 'INTERNAL';
  }

  private containsRestrictedData(data: any): boolean {
    const restrictedFields = ['investigationNotes', 'disciplinaryRecords', 'financialData'];
    const dataStr = JSON.stringify(data).toLowerCase();
    return restrictedFields.some(field => dataStr.includes(field.toLowerCase()));
  }

  private containsConfidentialData(data: any): boolean {
    const confidentialFields = ['nationalId', 'dateOfBirth', 'medicalHistory', 'personalAddress'];
    const dataStr = JSON.stringify(data).toLowerCase();
    return confidentialFields.some(field => dataStr.includes(field.toLowerCase()));
  }

  private getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private generateRequestId(): string {
    return 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getUserAgentFingerprint(): string {
    // Generate a hash of user agent for tracking
    const ua = navigator.userAgent;
    let hash = 0;
    for (let i = 0; i < ua.length; i++) {
      const char = ua.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}