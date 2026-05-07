import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  ChannelCollectionListResponse,
  ChannelGalleryListResponse,
  ChannelResponse,
} from '@shared/interfaces/dto/response/channel';
import { Channel } from '@shared/interfaces/entity/channel';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';
import { ChannelMap } from '@shared/maps/channel.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChannelApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public detail(profileName: string): Observable<ApiResponse<Channel>> {
    const url = `${this.baseUrl}${environment.API.CHANNEL.DETAIL.replace(':profileName', profileName)}`;

    return this.http
      .get<ApiResponse<ChannelResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ChannelMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('channel/detail')),
      );
  }

  public gallery(
    profileName: string,
    page = 1,
    pageSize = 20,
  ): Observable<ApiResponse<List<Post[]>>> {
    const url = `${this.baseUrl}${environment.API.CHANNEL.GALLERY.replace(':profileName', profileName)}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<ChannelGalleryListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ChannelMap.toGalleryList(response.data) : undefined,
        })),
        catchError(this.handleError('channel/gallery')),
      );
  }

  public collection(
    profileName: string,
    page = 1,
    pageSize = 20,
  ): Observable<ApiResponse<List<CollectionBundle[]>>> {
    const url = `${this.baseUrl}${environment.API.CHANNEL.COLLECTION.replace(':profileName', profileName)}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<ChannelCollectionListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ChannelMap.toCollectionList(response.data) : undefined,
        })),
        catchError(this.handleError('channel/collection')),
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
