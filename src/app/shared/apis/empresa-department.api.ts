import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  CreateDepartmentRequest,
  DepartmentListQueryRequest,
  UpdateDepartmentRequest,
} from '@shared/interfaces/dto/request/empresa-department';
import {
  DepartmentListResponse,
  DepartmentResponse,
} from '@shared/interfaces/dto/response/empresa-department';
import { Department } from '@shared/interfaces/entity/empresa-department';
import { DepartmentMap } from '@shared/maps/empresa-department.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaDepartmentApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(
    orgSlug: string,
    query: DepartmentListQueryRequest = {},
  ): Observable<ApiResponse<List<Department[]>>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.DEPARTMENTS_LIST.replace(':slug', orgSlug)}`;
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);

    return this.http.get<ApiResponse<DepartmentListResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? DepartmentMap.toList(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/departments/list')),
    );
  }

  public detail(orgSlug: string, deptSlug: string): Observable<ApiResponse<Department>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.DEPARTMENT_DETAIL.replace(
      ':slug',
      orgSlug,
    ).replace(':deptSlug', deptSlug)}`;
    return this.http.get<ApiResponse<DepartmentResponse>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? DepartmentMap.toDepartment(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/departments/detail')),
    );
  }

  public create(
    orgSlug: string,
    request: CreateDepartmentRequest,
  ): Observable<ApiResponse<Department>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.DEPARTMENT_CREATE.replace(':slug', orgSlug)}`;
    return this.http.post<ApiResponse<DepartmentResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? DepartmentMap.toDepartment(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/departments/create')),
    );
  }

  public update(
    orgSlug: string,
    deptSlug: string,
    request: UpdateDepartmentRequest,
  ): Observable<ApiResponse<Department>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.DEPARTMENT_UPDATE.replace(
      ':slug',
      orgSlug,
    ).replace(':deptSlug', deptSlug)}`;
    return this.http.patch<ApiResponse<DepartmentResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? DepartmentMap.toDepartment(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/departments/update')),
    );
  }

  public toggleFavorite(orgSlug: string, deptSlug: string): Observable<ApiResponse<Department>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.DEPARTMENT_FAVORITE.replace(
      ':slug',
      orgSlug,
    ).replace(':deptSlug', deptSlug)}`;
    return this.http.patch<ApiResponse<DepartmentResponse>>(url, {}).pipe(
      map((response) => ({
        ...response,
        data: response.data ? DepartmentMap.toDepartment(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/departments/favorite')),
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
