import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api/notifications';

  getNotifications(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.base, { params: filters });
  }

  markRead(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/${id}/read`, {});
  }

  markAllRead(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/read-all`, {});
  }

  getPreferences(): Observable<any> {
    return this.http.get(`${this.base}/preferences`);
  }

  updatePreferences(data: any): Observable<any> {
    return this.http.patch(`${this.base}/preferences`, data);
  }

  registerDevice(platform: string, token: string): Observable<any> {
    return this.http.post(`${this.base}/devices`, { platform, token });
  }
}
