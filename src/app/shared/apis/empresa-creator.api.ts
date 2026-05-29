import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import {
  AddCreatorsToGroupRequest,
  CreateCreatorGroupRequest,
  UpdateCreatorGroupRequest,
} from '@shared/interfaces/dto/request/empresa-creator';
import {
  CreatorGroupResponse,
  OrganizationCreatorResponse,
} from '@shared/interfaces/dto/response/empresa-creator';
import { ProductResponse } from '@shared/interfaces/dto/response/empresa-product';
import { CreatorGroup, OrganizationCreator } from '@shared/interfaces/entity/empresa-creator';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { CreatorMap } from '@shared/maps/empresa-creator.map';
import { ProductMap } from '@shared/maps/empresa-product.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaCreatorApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public listCreators(slug: string): Observable<ApiResponse<OrganizationCreator[]>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.CREATORS_LIST.replace(':slug', slug)}`;
    return this.http.get<ApiResponse<OrganizationCreatorResponse[]>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? response.data.map((c) => CreatorMap.toCreator(c)) : undefined,
      })),
      catchError(this.handleError('empresa/creators/list')),
    );
  }

  public listCreatorProducts(
    slug: string,
    creatorId: string,
  ): Observable<ApiResponse<Product[]>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.CREATOR_PRODUCTS.replace(':slug', slug).replace(':creatorId', creatorId)}`;
    return this.http.get<ApiResponse<ProductResponse[]>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? response.data.map((p) => ProductMap.toProduct(p)) : undefined,
      })),
      catchError(this.handleError('empresa/creators/products')),
    );
  }

  public listGroups(slug: string): Observable<ApiResponse<CreatorGroup[]>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.CREATOR_GROUPS_LIST.replace(':slug', slug)}`;
    return this.http.get<ApiResponse<CreatorGroupResponse[]>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? response.data.map((g) => CreatorMap.toGroup(g)) : undefined,
      })),
      catchError(this.handleError('empresa/creator-groups/list')),
    );
  }

  public createGroup(
    slug: string,
    request: CreateCreatorGroupRequest,
  ): Observable<ApiResponse<CreatorGroup>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.CREATOR_GROUP_CREATE.replace(':slug', slug)}`;
    return this.http.post<ApiResponse<CreatorGroupResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CreatorMap.toGroup(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/creator-groups/create')),
    );
  }

  public updateGroup(
    slug: string,
    id: string,
    request: UpdateCreatorGroupRequest,
  ): Observable<ApiResponse<CreatorGroup>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.CREATOR_GROUP_UPDATE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<CreatorGroupResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CreatorMap.toGroup(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/creator-groups/update')),
    );
  }

  public addCreatorsToGroup(
    slug: string,
    id: string,
    request: AddCreatorsToGroupRequest,
  ): Observable<ApiResponse<CreatorGroup>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.CREATOR_GROUP_ADD_CREATORS.replace(':slug', slug).replace(':id', id)}`;
    return this.http.post<ApiResponse<CreatorGroupResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? CreatorMap.toGroup(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/creator-groups/add-creators')),
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
