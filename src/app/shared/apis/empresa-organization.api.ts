import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  CreateOrganizationRequest,
  OrganizationListQueryRequest,
  UpdateOrganizationRequest,
} from '@shared/interfaces/dto/request/empresa-organization';
import {
  OrganizationListResponse,
  OrganizationResponse,
} from '@shared/interfaces/dto/response/empresa-organization';
import { Organization } from '@shared/interfaces/entity/empresa-organization';
import { OrganizationMap } from '@shared/maps/empresa-organization.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaOrganizationApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(
    query: OrganizationListQueryRequest = {},
  ): Observable<ApiResponse<List<Organization[]>>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ORGANIZATIONS_LIST}`;
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);

    return this.http.get<ApiResponse<OrganizationListResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? OrganizationMap.toList(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/organizations/list')),
    );
  }

  public detail(slug: string): Observable<ApiResponse<Organization>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ORGANIZATION_DETAIL.replace(':slug', slug)}`;
    return this.http.get<ApiResponse<OrganizationResponse>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? OrganizationMap.toOrganization(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/organizations/detail')),
    );
  }

  public create(request: CreateOrganizationRequest): Observable<ApiResponse<Organization>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ORGANIZATION_CREATE}`;
    return this.http.post<ApiResponse<OrganizationResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? OrganizationMap.toOrganization(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/organizations/create')),
    );
  }

  public update(
    slug: string,
    request: UpdateOrganizationRequest,
  ): Observable<ApiResponse<Organization>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ORGANIZATION_UPDATE.replace(':slug', slug)}`;
    return this.http.patch<ApiResponse<OrganizationResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? OrganizationMap.toOrganization(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/organizations/update')),
    );
  }

  public toggleFavorite(slug: string): Observable<ApiResponse<Organization>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ORGANIZATION_FAVORITE.replace(':slug', slug)}`;
    return this.http.patch<ApiResponse<OrganizationResponse>>(url, {}).pipe(
      map((response) => ({
        ...response,
        data: response.data ? OrganizationMap.toOrganization(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/organizations/favorite')),
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
