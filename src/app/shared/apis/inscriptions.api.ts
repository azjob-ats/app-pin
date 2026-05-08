import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { InscriptionListQueryRequest } from '@shared/interfaces/dto/request/inscriptions';
import {
  InscriptionListResponse,
  InscriptionResponse,
} from '@shared/interfaces/dto/response/inscriptions';
import { Inscription } from '@shared/interfaces/entity/inscription';
import { InscriptionMap } from '@shared/maps/inscription.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InscriptionsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(query: InscriptionListQueryRequest = {}): Observable<ApiResponse<List<Inscription[]>>> {
    const url = `${this.baseUrl}${environment.API.INSCRIPTIONS.LIST}`;
    let params = new HttpParams();
    if (query.type) params = params.set('type', query.type);
    if (query.status) params = params.set('status', query.status);
    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);

    return this.http
      .get<ApiResponse<InscriptionListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? InscriptionMap.toList(response.data) : undefined,
        })),
        catchError(this.handleError('inscriptions/list')),
      );
  }

  public cancel(id: string): Observable<ApiResponse<Inscription>> {
    const url = `${this.baseUrl}${environment.API.INSCRIPTIONS.CANCEL.replace(':id', id)}`;

    return this.http
      .patch<ApiResponse<InscriptionResponse>>(url, {})
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? InscriptionMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('inscriptions/cancel')),
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
