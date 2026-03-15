import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api';

  sendMessage(rideId: string, content: string): Observable<any> {
    return this.http.post(`${this.base}/rides/${rideId}/messages`, { content });
  }

  getMessages(rideId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/rides/${rideId}/messages`);
  }

  markRead(rideId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/rides/${rideId}/messages/read`, {});
  }
}
