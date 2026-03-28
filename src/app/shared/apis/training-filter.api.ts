import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { IAttribute, ICatalog } from '@shared/interfaces/entity/search-filter';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchFilterApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  /** GET /api/search/catalogs */
  getCatalogs(): Observable<ApiResponse<ICatalog[]>> {
    const url = `${this.baseUrl}${environment.API.SEARCH.CATALOGS}`;
    return this.http
      .get<ApiResponse<ICatalog[]>>(url)
      .pipe(catchError(this.handleError('search/catalogs')));
  }

  /** GET /api/search/filter-attributes/:catalogKey */
  getFilterAttributes(catalogKey: string): Observable<ApiResponse<IAttribute[]>> {
    const url = `${this.baseUrl}${environment.API.SEARCH.FILTER_ATTRIBUTES}/${catalogKey}`;
    return this.http
      .get<ApiResponse<IAttribute[]>>(url)
      .pipe(catchError(this.handleError(`search/filter-attributes/${catalogKey}`)));
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
          message: isHttp ? err.message : 'Unknown error',
          type: isHttp ? ErrorType.HttpErrorResponse : ErrorType.genericError,
        },
        data: err,
        timestamp: new Date().toISOString(),
      };
      return throwError(() => response);
    };
  }
}
