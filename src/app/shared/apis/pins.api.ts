import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { PinListResponse, PinResponse, SaveToggleResponse } from '@shared/interfaces/dto/response/pin';
import { CommentListResponse, CommentResponse } from '@shared/interfaces/dto/response/comment';
import { Pin } from '@shared/interfaces/entity/pin';
import { Comment } from '@shared/interfaces/entity/comment';
import { PinMap } from '@shared/maps/pin.map';
import { CommentMap } from '@shared/maps/comment.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PinsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(page = 1, pageSize = 20, search?: string): Observable<ApiResponse<List<Pin[]>>> {
    const url = `${this.baseUrl}${environment.API.PINS.LIST}`;
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);

    return this.http
      .get<ApiResponse<PinListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? PinMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('pins/list')),
      );
  }

  public feed(page = 1, pageSize = 20): Observable<ApiResponse<List<Pin[]>>> {
    const url = `${this.baseUrl}${environment.API.PINS.FEED}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<PinListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? PinMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('pins/feed')),
      );
  }

  public getById(id: string): Observable<ApiResponse<Pin>> {
    const url = `${this.baseUrl}${environment.API.PINS.DETAIL.replace(':id', id)}`;

    return this.http
      .get<ApiResponse<PinResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? PinMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('pins/detail')),
      );
  }

  public getRelated(id: string, pageSize = 8): Observable<ApiResponse<List<Pin[]>>> {
    const url = `${this.baseUrl}${environment.API.PINS.RELATED.replace(':id', id)}`;
    const params = new HttpParams().set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<PinListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? PinMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('pins/related')),
      );
  }

  public getComments(id: string, page = 1, pageSize = 10): Observable<ApiResponse<List<Comment[]>>> {
    const url = `${this.baseUrl}${environment.API.PINS.COMMENTS.replace(':id', id)}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<CommentListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? CommentMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('pins/comments')),
      );
  }

  public addComment(id: string, text: string): Observable<ApiResponse<Comment>> {
    const url = `${this.baseUrl}${environment.API.PINS.COMMENTS.replace(':id', id)}`;

    return this.http
      .post<ApiResponse<CommentResponse>>(url, { text })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? CommentMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('pins/add-comment')),
      );
  }

  public toggleSave(id: string): Observable<ApiResponse<SaveToggleResponse>> {
    const url = `${this.baseUrl}${environment.API.PINS.SAVE.replace(':id', id)}`;

    return this.http
      .post<ApiResponse<SaveToggleResponse>>(url, {})
      .pipe(catchError(this.handleError('pins/save')));
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
