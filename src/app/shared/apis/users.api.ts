import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { FollowToggleResponse, UserListResponse, UserResponse } from '@shared/interfaces/dto/response/user';
import { BoardListResponse } from '@shared/interfaces/dto/response/board';
import { PinListResponse } from '@shared/interfaces/dto/response/pin';
import { User } from '@shared/interfaces/entity/user';
import { Board } from '@shared/interfaces/entity/board';
import { Pin } from '@shared/interfaces/entity/pin';
import { UserMap } from '@shared/maps/user.map';
import { BoardMap } from '@shared/maps/board.map';
import { PinMap } from '@shared/maps/pin.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public getCurrentUser(): Observable<ApiResponse<User>> {
    const url = `${this.baseUrl}${environment.API.USERS.ME}`;

    return this.http
      .get<ApiResponse<UserResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? UserMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('users/me')),
      );
  }

  public list(page = 1, pageSize = 20, search?: string): Observable<ApiResponse<List<User[]>>> {
    const url = `${this.baseUrl}${environment.API.USERS.LIST}`;
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);

    return this.http
      .get<ApiResponse<UserListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? UserMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('users/list')),
      );
  }

  public getById(id: string): Observable<ApiResponse<User>> {
    const url = `${this.baseUrl}${environment.API.USERS.DETAIL.replace(':id', id)}`;

    return this.http
      .get<ApiResponse<UserResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? UserMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('users/detail')),
      );
  }

  public getPins(id: string, page = 1, pageSize = 20): Observable<ApiResponse<List<Pin[]>>> {
    const url = `${this.baseUrl}${environment.API.USERS.PINS.replace(':id', id)}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<PinListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? PinMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('users/pins')),
      );
  }

  public getBoards(id: string, page = 1, pageSize = 20): Observable<ApiResponse<List<Board[]>>> {
    const url = `${this.baseUrl}${environment.API.USERS.BOARDS.replace(':id', id)}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<BoardListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? BoardMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('users/boards')),
      );
  }

  public toggleFollow(id: string): Observable<ApiResponse<FollowToggleResponse>> {
    const url = `${this.baseUrl}${environment.API.USERS.FOLLOW.replace(':id', id)}`;

    return this.http
      .post<ApiResponse<FollowToggleResponse>>(url, {})
      .pipe(catchError(this.handleError('users/follow')));
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
