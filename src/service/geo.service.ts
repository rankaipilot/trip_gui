import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';
import { LatLng } from 'model/ride_state';

@Injectable({ providedIn: 'root' })
export class GeoService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api/geo';

  geocode(address: string): Observable<any> {
    return this.http.get(`${this.base}/geocode`, { params: { address } });
  }

  reverseGeocode(lat: number, lng: number): Observable<any> {
    return this.http.get(`${this.base}/reverse-geocode`, { params: { lat: lat.toString(), lng: lng.toString() } });
  }

  getDirections(origin: LatLng, destination: LatLng, waypoints?: LatLng[]): Observable<any> {
    return this.http.get(`${this.base}/directions`, { params: { origin: `${origin.lat},${origin.lng}`, destination: `${destination.lat},${destination.lng}` } });
  }

  getNearbyDrivers(lat: number, lng: number, rideType?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/nearby-drivers`, { params: { lat: lat.toString(), lng: lng.toString(), ...(rideType && { ride_type: rideType }) } });
  }
}
