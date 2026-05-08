import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { CreatorPortfolioResponse } from '@shared/interfaces/dto/response/creator-portfolio';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';
import { CreatorPortfolioMap } from '@shared/maps/creator-portfolio.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreatorPortfolioApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public getByHandle(handle: string): Observable<ApiResponse<CreatorPortfolio>> {
    const url = `${this.baseUrl}${environment.API.CREATOR_PORTFOLIO.DETAIL.replace(':handle', handle)}`;

    return this.http
      .get<ApiResponse<CreatorPortfolioResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? CreatorPortfolioMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('creator-portfolio/get-by-handle')),
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
