import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { MetricsOverviewQueryRequest } from '@shared/interfaces/dto/request/metrics';
import { MetricsOverviewResponse } from '@shared/interfaces/dto/response/metrics';
import { MetricsOverview } from '@shared/interfaces/entity/metrics';
import { MetricsMap } from '@shared/maps/metrics.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public overview(
    query: MetricsOverviewQueryRequest = {},
  ): Observable<ApiResponse<MetricsOverview>> {
    const url = `${this.baseUrl}${environment.API.METRICS.OVERVIEW}`;
    let params = new HttpParams();
    if (query.period) params = params.set('period', query.period);

    return this.http.get<ApiResponse<MetricsOverviewResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MetricsMap.toOverview(response.data) : undefined,
      })),
      catchError(this.handleError('metrics/overview')),
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
