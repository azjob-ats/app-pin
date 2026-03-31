import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { MenuSection, MenuSectionDetail } from '@shared/interfaces/entity/menu';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  getSections(): Observable<ApiResponse<MenuSection[]>> {
    const url = `${this.baseUrl}${environment.API.MENU.SECTIONS}`;
    return this.http
      .get<ApiResponse<MenuSection[]>>(url)
      .pipe(catchError(this.handleError('menu/sections')));
  }

  getSectionItems(id: string): Observable<ApiResponse<MenuSectionDetail>> {
    const url = `${this.baseUrl}${environment.API.MENU.SECTION_ITEMS.replace(':id', id)}`;
    return this.http
      .get<ApiResponse<MenuSectionDetail>>(url)
      .pipe(catchError(this.handleError('menu/section-items')));
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
