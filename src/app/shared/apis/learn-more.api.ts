import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { LearnMoreConfigResponse } from '@shared/interfaces/dto/response/learn-more';
import { LearnMoreSubmitRequest } from '@shared/interfaces/dto/request/learn-more';
import { LearnMoreConfig } from '@shared/interfaces/entity/learn-more';
import { LearnMoreMap } from '@shared/maps/learn-more.map';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LearnMoreApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public getConfig(pinId: string): Observable<ApiResponse<LearnMoreConfig>> {
    const url = `${this.baseUrl}${environment.API.LEARN_MORE.CONFIG.replace(':pinId', pinId)}`;

    return this.http
      .get<ApiResponse<LearnMoreConfigResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? LearnMoreMap.toConfig(response.data) : undefined,
        })),
        catchError(this.handleError('learn-more/config')),
      );
  }

  public submit(payload: LearnMoreSubmitRequest): Observable<ApiResponse<void>> {
    const url = `${this.baseUrl}${environment.API.LEARN_MORE.SUBMIT.replace(':pinId', payload.pinId)}`;

    return this.http
      .post<ApiResponse<void>>(url, payload)
      .pipe(catchError(this.handleError('learn-more/submit')));
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
