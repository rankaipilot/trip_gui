import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupportService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api/support';

  createTicket(data: any): Observable<any> {
    return this.http.post(`${this.base}/tickets`, data);
  }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/tickets`);
  }

  getTicket(id: string): Observable<any> {
    return this.http.get(`${this.base}/tickets/${id}`);
  }

  sendMessage(ticketId: string, content: string): Observable<any> {
    return this.http.post(`${this.base}/tickets/${ticketId}/messages`, { content });
  }
}
