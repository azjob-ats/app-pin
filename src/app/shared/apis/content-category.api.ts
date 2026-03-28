import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { ContentCategoryListResponse } from '@shared/interfaces/dto/response/content-category';
import { ContentCategory } from '@shared/interfaces/entity/content-category';
import { ContentCategoryMap } from '@shared/maps/content-category.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContentCategoryApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(): Observable<ApiResponse<List<ContentCategory[]>>> {
    const url = `${this.baseUrl}${environment.API.CONTENT_CATEGORY.LIST}`;

    return this.http
      .get<ApiResponse<ContentCategoryListResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ContentCategoryMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('content-category/list')),
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
