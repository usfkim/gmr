import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../shared/environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PractitionerSearchParams {
  name?: string;
  licenseNumber?: string;
  profession?: string;
  specialty?: string;
  region?: string;
  district?: string;
  facility?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface VerificationRequest {
  licenseNumber: string;
  country?: string;
  purpose?: string;
  requestedBy?: string;
}

export interface BulkVerificationRequest {
  employerId: string;
  staffList: Array<{
    name: string;
    licenseNumber: string;
    position: string;
    department: string;
  }>;
  jobType: 'csv_upload' | 'api_sync' | 'manual_entry';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-API-Version': '1.0',
      'X-Client': 'Uganda-Medical-Registry-Web'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // Practitioner APIs
  searchPractitioners(params: PractitionerSearchParams): Observable<ApiResponse<any[]>> {
    const httpParams = new HttpParams({ fromObject: params as any });
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/practitioners/search`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  getPractitionerDetails(licenseNumber: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/practitioners/${licenseNumber}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePractitionerProfile(licenseNumber: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/practitioners/${licenseNumber}`, data, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Verification APIs
  verifyLicense(request: VerificationRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/verification/verify`, request, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  verifyQrCode(qrCode: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/verification/qr`, { qrCode }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Bulk Verification APIs
  submitBulkVerification(request: BulkVerificationRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/verification/bulk`, request, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getBulkVerificationStatus(jobId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/verification/bulk/${jobId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Embassy APIs
  generateOfficialLetter(verificationId: string, embassyId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/embassy/letters`, {
      verificationId,
      embassyId
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getEmbassyVerificationHistory(embassyId: string, params?: any): Observable<ApiResponse<any[]>> {
    const httpParams = new HttpParams({ fromObject: params || {} });
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/embassy/${embassyId}/verifications`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  // Facility APIs
  getFacilityProfile(facilityId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/facilities/${facilityId}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateFacilityProfile(facilityId: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/facilities/${facilityId}`, data, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getFacilityStaff(facilityId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/facilities/${facilityId}/staff`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Analytics APIs
  getWorkforceDensity(region?: string, profession?: string): Observable<ApiResponse<any>> {
    const params: any = {};
    if (region) params.region = region;
    if (profession) params.profession = profession;
    
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/workforce-density`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  getTrainingPipeline(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/training-pipeline`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAttritionMigration(timeframe?: string): Observable<ApiResponse<any>> {
    const params = timeframe ? { timeframe } : {};
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/attrition-migration`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  getFraudHeatmap(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/fraud-heatmap`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getComplianceCurves(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/compliance-curves`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAccessGaps(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/access-gaps`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getRevenueDashboard(timeframe?: string): Observable<ApiResponse<any>> {
    const params = timeframe ? { timeframe } : {};
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/analytics/revenue`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  // CPD APIs
  getCpdActivities(practitionerId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/practitioners/${practitionerId}/cpd`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  uploadCpdEvidence(practitionerId: string, activityId: string, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('activityId', activityId);

    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/practitioners/${practitionerId}/cpd/evidence`, formData, {
      headers: new HttpHeaders({
        'Authorization': this.getHeaders().get('Authorization') || ''
      })
    }).pipe(catchError(this.handleError));
  }

  // Document APIs
  uploadDocument(practitionerId: string, documentType: string, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);

    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/practitioners/${practitionerId}/documents`, formData, {
      headers: new HttpHeaders({
        'Authorization': this.getHeaders().get('Authorization') || ''
      })
    }).pipe(catchError(this.handleError));
  }

  getDocuments(practitionerId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/practitioners/${practitionerId}/documents`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Payment APIs
  getPaymentHistory(practitionerId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/practitioners/${practitionerId}/payments`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  initiatePayment(practitionerId: string, paymentData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/payments/initiate`, {
      practitionerId,
      ...paymentData
    }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // License APIs
  getLicenseDetails(licenseNumber: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/licenses/${licenseNumber}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  initiateLicenseRenewal(licenseNumber: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/licenses/${licenseNumber}/renew`, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Compliance APIs
  getComplianceReport(organizationId: string, timeframe: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/compliance/${organizationId}/report`, {
      headers: this.getHeaders(),
      params: new HttpParams({ fromObject: { timeframe } })
    }).pipe(catchError(this.handleError));
  }

  // Content APIs
  getCountryDeploymentStatus(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/content/countries`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getCaseStudies(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/content/case-studies`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getStakeholders(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/content/stakeholders`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Report APIs
  submitConcernReport(reportData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/reports/concern`, reportData, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // News APIs
  getNews(category?: string, page?: number): Observable<ApiResponse<any[]>> {
    const params: any = {};
    if (category) params.category = category;
    if (page) params.page = page;
    
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/news`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  // Utility method for file downloads
  downloadFile(url: string, filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${url}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).pipe(
      map(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        return blob;
      }),
      catchError(this.handleError)
    );
  }
}