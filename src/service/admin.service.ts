import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api/admin';

  getUsers(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`, { params: filters });
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.base}/users/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/users/${id}`, data);
  }

  getDrivers(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/drivers`, { params: filters });
  }

  verifyDriver(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/drivers/${id}/verify`, data);
  }

  getRides(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/rides`, { params: filters });
  }

  getRide(id: string): Observable<any> {
    return this.http.get(`${this.base}/rides/${id}`);
  }

  issueRefund(rideId: string, amount: number, reason: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/rides/${rideId}/refund`, { amount, reason });
  }

  getAnalytics(endpoint: string, params?: any): Observable<any> {
    return this.http.get(`${this.base}/analytics/${endpoint}`, { params });
  }
}
