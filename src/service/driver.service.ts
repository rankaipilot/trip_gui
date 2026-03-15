import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';
import { DriverProfile, Ride, Vehicle } from 'model/tripdb';
import { LatLng } from 'model/ride_state';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api';

  getProfile(): Observable<DriverProfile> {
    return this.http.get<DriverProfile>(`${this.base}/drivers/profile`);
  }

  updateProfile(data: Partial<DriverProfile>): Observable<DriverProfile> {
    return this.http.patch<DriverProfile>(`${this.base}/drivers/profile`, data);
  }

  uploadDocument(type: string, file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);
    return this.http.post<{ message: string }>(`${this.base}/drivers/documents`, formData);
  }

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/drivers/documents`);
  }

  setOnlineStatus(isOnline: boolean, location: LatLng): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.base}/drivers/status`, { is_online: isOnline, ...location });
  }

  getEarnings(period: string, from?: string, to?: string): Observable<any> {
    return this.http.get(`${this.base}/drivers/earnings`, { params: { period, ...(from && { from }), ...(to && { to }) } });
  }

  getPayouts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/drivers/payouts`);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/drivers/vehicles`);
  }

  addVehicle(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.base}/drivers/vehicles`, data);
  }

  updateVehicle(id: string, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.base}/drivers/vehicles/${id}`, data);
  }

  deleteVehicle(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/drivers/vehicles/${id}`);
  }

  // Ride matching
  acceptRide(rideId: string): Observable<Ride> {
    return this.http.post<Ride>(`${this.base}/drivers/rides/${rideId}/accept`, {});
  }

  declineRide(rideId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/drivers/rides/${rideId}/decline`, {});
  }

  startNavigation(rideId: string): Observable<Ride> {
    return this.http.post<Ride>(`${this.base}/drivers/rides/${rideId}/start-navigation`, {});
  }

  arriveAtPickup(rideId: string): Observable<Ride> {
    return this.http.post<Ride>(`${this.base}/drivers/rides/${rideId}/arrive`, {});
  }

  startTrip(rideId: string): Observable<Ride> {
    return this.http.post<Ride>(`${this.base}/drivers/rides/${rideId}/start-trip`, {});
  }

  completeTrip(rideId: string): Observable<Ride> {
    return this.http.post<Ride>(`${this.base}/drivers/rides/${rideId}/complete`, {});
  }

  driverCancelRide(rideId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/drivers/rides/${rideId}/cancel`, {});
  }
}
