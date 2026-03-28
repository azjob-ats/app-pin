import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { NotificationListResponse, NotificationResponse } from '@shared/interfaces/dto/response/notification';
import { Notification } from '@shared/interfaces/entity/notification';
import { NotificationMap } from '@shared/maps/notification.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(page = 1, pageSize = 20, unreadOnly = false): Observable<ApiResponse<List<Notification[]>>> {
    const url = `${this.baseUrl}${environment.API.NOTIFICATIONS.LIST}`;
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (unreadOnly) params = params.set('unread', 'true');

    return this.http
      .get<ApiResponse<NotificationListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? NotificationMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('notifications/list')),
      );
  }

  public markAsRead(id: string): Observable<ApiResponse<Notification>> {
    const url = `${this.baseUrl}${environment.API.NOTIFICATIONS.READ.replace(':id', id)}`;

    return this.http
      .patch<ApiResponse<NotificationResponse>>(url, {})
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? NotificationMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('notifications/read')),
      );
  }

  public markAllAsRead(): Observable<ApiResponse<unknown>> {
    const url = `${this.baseUrl}${environment.API.NOTIFICATIONS.READ_ALL}`;

    return this.http
      .post<ApiResponse<unknown>>(url, {})
      .pipe(catchError(this.handleError('notifications/read-all')));
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
