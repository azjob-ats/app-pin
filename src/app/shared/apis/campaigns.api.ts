import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  CampaignListQueryRequest,
  CreateCampaignRequest,
  PricingCalendarQueryRequest,
  ProjectionRequest,
} from '@shared/interfaces/dto/request/campaigns';
import {
  CampaignListResponse,
  CampaignProjectionResponse,
  CampaignResponse,
  PricingCalendarResponse,
} from '@shared/interfaces/dto/response/campaigns';
import { EligibleVideoResponse } from '@shared/interfaces/dto/response/sponsored-campaigns';
import {
  Campaign,
  CampaignProjection,
  PricingCalendar,
} from '@shared/interfaces/entity/campaign';
import { EligibleVideo } from '@shared/interfaces/entity/sponsored-campaigns';
import { CampaignMap } from '@shared/maps/campaign.map';
import { SponsoredCampaignsMap } from '@shared/maps/sponsored-campaigns.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CampaignsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(
    query: CampaignListQueryRequest = {},
  ): Observable<ApiResponse<List<Campaign[]>>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.LIST}`;
    let params = new HttpParams();
    if (query.status) params = params.set('status', query.status);
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);

    return this.http.get<ApiResponse<CampaignListResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CampaignMap.toList(response.data) : undefined,
      })),
      catchError(this.handleError('campaigns/list')),
    );
  }

  public detail(id: string): Observable<ApiResponse<Campaign>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.DETAIL.replace(':id', id)}`;
    return this.http.get<ApiResponse<CampaignResponse>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CampaignMap.toCampaign(response.data) : undefined,
      })),
      catchError(this.handleError('campaigns/detail')),
    );
  }

  public pricingCalendar(
    query: PricingCalendarQueryRequest,
  ): Observable<ApiResponse<PricingCalendar>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.PRICING_CALENDAR}`;
    const params = new HttpParams().set('keyword', query.keyword).set('from', query.from);

    return this.http.get<ApiResponse<PricingCalendarResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CampaignMap.toPricingCalendar(response.data) : undefined,
      })),
      catchError(this.handleError('campaigns/pricing-calendar')),
    );
  }

  public eligibleVideos(): Observable<ApiResponse<EligibleVideo[]>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.ELIGIBLE_VIDEOS}`;
    return this.http.get<ApiResponse<EligibleVideoResponse[]>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data
          ? response.data.map((video) => SponsoredCampaignsMap.toVideo(video))
          : undefined,
      })),
      catchError(this.handleError('campaigns/eligible-videos')),
    );
  }

  public projection(request: ProjectionRequest): Observable<ApiResponse<CampaignProjection>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.PROJECTION}`;
    return this.http.post<ApiResponse<CampaignProjectionResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CampaignMap.toProjection(response.data) : undefined,
      })),
      catchError(this.handleError('campaigns/projection')),
    );
  }

  public create(request: CreateCampaignRequest): Observable<ApiResponse<Campaign>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.CREATE}`;
    return this.http.post<ApiResponse<CampaignResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CampaignMap.toCampaign(response.data) : undefined,
      })),
      catchError(this.handleError('campaigns/create')),
    );
  }

  public cancel(id: string): Observable<ApiResponse<Campaign>> {
    const url = `${this.baseUrl}${environment.API.SPONSORED_CAMPAIGNS.CANCEL.replace(':id', id)}`;
    return this.http.patch<ApiResponse<CampaignResponse>>(url, {}).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CampaignMap.toCampaign(response.data) : undefined,
      })),
      catchError(this.handleError('campaigns/cancel')),
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
