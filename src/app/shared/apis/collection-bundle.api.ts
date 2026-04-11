import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { CollectionBundleListResponse } from '@shared/interfaces/dto/response/collection-bundle';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { CollectionBundleMap } from '@shared/maps/collection-bundle.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollectionBundleApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public detail(id: string): Observable<ApiResponse<CollectionBundle>> {
    const url = `${this.baseUrl}${environment.API.COLLECTION_BUNDLE.DETAIL.replace(':id', id)}`;
    return this.http
      .get<ApiResponse<CollectionBundle>>(url)
      .pipe(catchError(this.handleError('collection-bundle/detail')));
  }

  public list(page = 1, pageSize = 20): Observable<ApiResponse<List<CollectionBundle[]>>> {
    const url = `${this.baseUrl}${environment.API.COLLECTION_BUNDLE.LIST}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<CollectionBundleListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? CollectionBundleMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('collection-bundle/list')),
      );
  }

  private handleError(code: string) {
    return (err: unknown): Observable<never> => {
      const isHttp = err instanceof HttpErrorResponse;
      const response: ApiResponse = {
        success: false,
        message: isHttp ? err.message : 'Generic Error',
        statusCode: isHttp ? err.status : 500,
        errors: {
          code,
          message: isHttp ? err.statusText : 'Unknown error',
          type: isHttp ? ErrorType.HttpErrorResponse : ErrorType.genericError,
        },
        data: err,
        timestamp: new Date().toISOString(),
      };
      return throwError(() => response);
    };
  }
}
