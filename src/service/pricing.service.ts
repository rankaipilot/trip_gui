import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api/pricing';

  getRates(lat: number, lng: number): Observable<any> {
    return this.http.get(`${this.base}/rates`, { params: { lat: lat.toString(), lng: lng.toString() } });
  }

  getSurge(lat: number, lng: number): Observable<any> {
    return this.http.get(`${this.base}/surge`, { params: { lat: lat.toString(), lng: lng.toString() } });
  }
}
