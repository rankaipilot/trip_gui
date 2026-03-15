import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.httphost + '/api';

  submitRating(rideId: string, score: number, comment?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/rides/${rideId}/rating`, { score, comment });
  }

  getMyRatings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users/me/ratings`);
  }
}
