import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { RelevantResearchListResponse } from '@shared/interfaces/dto/response/relevant-research';
import { RelevantResearch } from '@shared/interfaces/entity/relevant-research';
import { RelevantResearchMap } from '@shared/maps/relevant-research.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RelevantResearchApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(): Observable<ApiResponse<List<RelevantResearch[]>>> {
    const url = `${this.baseUrl}${environment.API.RELEVANT_RESEARCH.LIST}`;

    return this.http
      .get<ApiResponse<RelevantResearchListResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? RelevantResearchMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('relevant-research/list')),
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
