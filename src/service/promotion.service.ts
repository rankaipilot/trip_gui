import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api';

  applyPromo(code: string, rideId?: string): Observable<any> {
    return this.http.post(`${this.base}/promotions/apply`, { code, ride_id: rideId });
  }

  getAvailable(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/promotions/available`);
  }

  getReferralCode(): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(`${this.base}/referrals/code`);
  }

  getReferrals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/referrals`);
  }
}
