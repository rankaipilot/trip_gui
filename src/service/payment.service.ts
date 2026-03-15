import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';
import { PaymentMethod } from 'model/tripdb';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api/payments';

  getMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.base}/methods`);
  }

  addMethod(data: any): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.base}/methods`, data);
  }

  updateMethod(id: string, data: Partial<PaymentMethod>): Observable<PaymentMethod> {
    return this.http.patch<PaymentMethod>(`${this.base}/methods/${id}`, data);
  }

  deleteMethod(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/methods/${id}`);
  }

  getTransactions(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/transactions`, { params: filters });
  }

  sendTip(rideId: string, amount: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/tip`, { ride_id: rideId, amount });
  }
}
