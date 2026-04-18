import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { ShopWindowListResponse } from '@shared/interfaces/dto/response/shop-window';
import { ShopWindow } from '@shared/interfaces/entity/shop-window';
import { ShopWindowMap } from '@shared/maps/shop-window.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopWindowApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(page = 1, pageSize = 20): Observable<ApiResponse<List<ShopWindow[]>>> {
    const url = `${this.baseUrl}${environment.API.SHOP_WINDOW.LIST}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<ShopWindowListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ShopWindowMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('shop-window/list')),
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
