import { inject, Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReportService {
    private readonly prefix = environment.httphost + '/api/';
    private readonly http = inject(HttpClient);

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('an error occurred', error.error);
        } else {
            console.error(`backend return error code: ${error.status} error body: ${error.error}`);
        }
        return throwError(() => 'error occurred, see console log and try again');
    }

    fetch<T>(version: string, queryName: string, params: {[key: string]: string}): Observable<T[]> {
        let httpParams = new HttpParams();
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                httpParams = httpParams.set(key, params[key]);
            }
        }
        const url = this.prefix + version + '/report/' + queryName;
        return this.http.get<T[]>(url, {params: httpParams}).pipe(catchError(this.handleError));
    }
}
