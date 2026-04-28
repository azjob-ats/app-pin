import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { WinningSlotListResponse } from '@shared/interfaces/dto/response/winning-slot';
import {
  WinningSlot,
  WinningSlotAspectRatio,
  WinningSlotContentType,
  WinningSlotKind,
} from '@shared/interfaces/entity/winning-slot';
import { WinningSlotMap } from '@shared/maps/winning-slot.map';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface WinningSlotsListParams {
  page?: number;
  pageSize?: number;
  aspectRatio?: WinningSlotAspectRatio;
  contentType?: WinningSlotContentType;
  slotKind?: WinningSlotKind;
}

@Injectable({ providedIn: 'root' })
export class WinningSlotsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(opts: WinningSlotsListParams = {}): Observable<ApiResponse<List<WinningSlot[]>>> {
    const url = `${this.baseUrl}${environment.API.WINNING_SLOTS.LIST}`;
    let params = new HttpParams()
      .set('page', opts.page ?? 1)
      .set('pageSize', opts.pageSize ?? 40);

    if (opts.aspectRatio) params = params.set('aspectRatio', opts.aspectRatio);
    if (opts.contentType) params = params.set('contentType', opts.contentType);
    if (opts.slotKind) params = params.set('slotKind', opts.slotKind);

    return this.http
      .get<ApiResponse<WinningSlotListResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? WinningSlotMap.toEntityList(response.data) : undefined,
        })),
        catchError(this.handleError('winning-slots/list')),
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
