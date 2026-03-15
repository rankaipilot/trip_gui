import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api';

  triggerSOS(rideId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/rides/${rideId}/emergency`, {});
  }

  getEmergency(rideId: string): Observable<any> {
    return this.http.get(`${this.base}/rides/${rideId}/emergency`);
  }

  shareLocation(rideId: string, contacts: string[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/rides/${rideId}/share-location`, { contacts });
  }
}
