import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SplitFareService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api';

  createSplit(rideId: string, participants: string[]): Observable<any> {
    return this.http.post(`${this.base}/rides/${rideId}/split`, { participants });
  }

  respondToSplit(splitId: string, accept: boolean): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/splits/${splitId}/respond`, { accept });
  }

  getSplitStatus(rideId: string): Observable<any> {
    return this.http.get(`${this.base}/rides/${rideId}/split`);
  }
}
