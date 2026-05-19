import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  CreateProductRequest,
  MoveProductRequest,
  ProductListQueryRequest,
  UpdateProductRequest,
} from '@shared/interfaces/dto/request/empresa-product';
import {
  ProductListResponse,
  ProductResponse,
} from '@shared/interfaces/dto/response/empresa-product';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { ProductMap } from '@shared/maps/empresa-product.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaProductApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(
    slug: string,
    query: ProductListQueryRequest = {},
  ): Observable<ApiResponse<List<Product[]>>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.PRODUCTS_LIST.replace(':slug', slug)}`;
    let params = new HttpParams();
    if (query.type) params = params.set('type', query.type);
    if (query.phase) params = params.set('phase', query.phase);
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);

    return this.http.get<ApiResponse<ProductListResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? ProductMap.toList(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/products/list')),
    );
  }

  public detail(slug: string, id: string): Observable<ApiResponse<Product>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.PRODUCT_DETAIL.replace(':slug', slug).replace(':id', id)}`;
    return this.http.get<ApiResponse<ProductResponse>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? ProductMap.toProduct(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/products/detail')),
    );
  }

  public create(slug: string, request: CreateProductRequest): Observable<ApiResponse<Product>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.PRODUCT_CREATE.replace(':slug', slug)}`;
    return this.http.post<ApiResponse<ProductResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? ProductMap.toProduct(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/products/create')),
    );
  }

  public update(
    slug: string,
    id: string,
    request: UpdateProductRequest,
  ): Observable<ApiResponse<Product>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.PRODUCT_UPDATE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<ProductResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? ProductMap.toProduct(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/products/update')),
    );
  }

  public move(
    slug: string,
    id: string,
    request: MoveProductRequest,
  ): Observable<ApiResponse<Product>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.PRODUCT_MOVE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<ProductResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? ProductMap.toProduct(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/products/move')),
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
