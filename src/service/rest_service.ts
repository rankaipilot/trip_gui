import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { RestURL } from './rest_url';

@Injectable({providedIn: 'root'})
export class BackendService {
    private readonly prefix = environment.httphost + RestURL.api_prefix;
    private readonly http = inject(HttpClient);

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('an error occurred', error.error);
        } else {
            console.error(`backend return error code: ${error.status} error body: ${error.error}`);
        }
        return throwError(() => 'error occurred, see console log and try again');
    }

    list<T>(apiName: string, filter?: {[key: string]: string}): Observable<T[]> {
        let params = new HttpParams();
        if (filter) {
            for (const key in filter) {
                if (Object.prototype.hasOwnProperty.call(filter, key)) {
                    params = params.set(key, filter[key]);
                }
            }
        }
        return this.http.get<T[]>(this.prefix + apiName + '/list', {params}).pipe(catchError(this.handleError));
    }

    get<T>(apiName: string, filter?: {[key: string]: string}): Observable<T> {
        let params = new HttpParams();
        if (filter) {
            for (const key in filter) {
                if (Object.prototype.hasOwnProperty.call(filter, key)) {
                    params = params.set(key, filter[key]);
                }
            }
        }
        return this.http.get<T>(this.prefix + apiName + '/get', {params}).pipe(catchError(this.handleError));
    }

    post<T>(apiName: string, items: T | T[]): Observable<{message: string}> {
        return this.http.post<{message: string}>(this.prefix + apiName + '/post', items).pipe(catchError(this.handleError));
    }

    delete(apiName: string, filter?: {[key: string]: string}): Observable<{message: string}> {
        let params = new HttpParams();
        if (filter) {
            for (const key in filter) {
                if (Object.prototype.hasOwnProperty.call(filter, key)) {
                    params = params.set(key, filter[key]);
                }
            }
        }
        return this.http.delete<{message: string}>(this.prefix + apiName + '/delete', {params}).pipe(catchError(this.handleError));
    }
}
