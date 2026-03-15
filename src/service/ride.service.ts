import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';
import { Ride } from 'model/tripdb';
import { FareEstimate, LatLng } from 'model/ride_state';

@Injectable({ providedIn: 'root' })
export class RideService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost;

  estimateFare(pickup: LatLng, dropoff: LatLng, rideType: string, waypoints?: LatLng[]): Observable<FareEstimate[]> {
    return this.http.post<FareEstimate[]>(`${this.base}/api/rides/estimate`, { pickup, dropoff, ride_type: rideType, waypoints });
  }

  createRide(request: {
    pickup: LatLng; dropoff: LatLng; rideType: string; paymentMethodId: string;
    waypoints?: LatLng[]; scheduledAt?: string; promoCode?: string;
  }): Observable<Ride> {
    return this.http.post<Ride>(`${this.base}/api/rides`, request);
  }

  getMyRides(filters?: { status?: string; from?: string; to?: string; cursor?: string }): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.base}/api/rides`, { params: filters as any });
  }

  getRide(id: string): Observable<Ride> {
    return this.http.get<Ride>(`${this.base}/api/rides/${id}`);
  }

  getReceipt(id: string): Observable<any> {
    return this.http.get(`${this.base}/api/rides/${id}/receipt`);
  }

  cancelRide(id: string, reason?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/api/rides/${id}/cancel`, { reason });
  }

  updateDropoff(id: string, location: LatLng): Observable<Ride> {
    return this.http.patch<Ride>(`${this.base}/api/rides/${id}/dropoff`, location);
  }
}
