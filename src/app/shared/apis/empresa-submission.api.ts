import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  AddSubmissionNoteRequest,
  AssignSubmissionRequest,
  CreateSubmissionRequest,
  MoveSubmissionRequest,
  SubmissionListQueryRequest,
} from '@shared/interfaces/dto/request/empresa-submission';
import {
  SubmissionListResponse,
  SubmissionResponse,
} from '@shared/interfaces/dto/response/empresa-submission';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import { SubmissionMap } from '@shared/maps/empresa-submission.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaSubmissionApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(
    slug: string,
    query: SubmissionListQueryRequest = {},
  ): Observable<ApiResponse<List<Submission[]>>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.SUBMISSIONS_LIST.replace(':slug', slug)}`;
    let params = new HttpParams();
    if (query.productType) params = params.set('productType', query.productType);
    if (query.productId) params = params.set('productId', query.productId);
    if (query.assignedTo) params = params.set('assignedTo', query.assignedTo);
    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);
    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);

    return this.http.get<ApiResponse<SubmissionListResponse>>(url, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data ? SubmissionMap.toList(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/submissions/list')),
    );
  }

  public detail(slug: string, id: string): Observable<ApiResponse<Submission>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.SUBMISSION_DETAIL.replace(':slug', slug).replace(':id', id)}`;
    return this.http.get<ApiResponse<SubmissionResponse>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? SubmissionMap.toSubmission(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/submissions/detail')),
    );
  }

  public create(
    slug: string,
    productId: string,
    request: CreateSubmissionRequest,
  ): Observable<ApiResponse<Submission>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.SUBMISSION_CREATE.replace(':slug', slug).replace(':id', productId)}`;
    return this.http.post<ApiResponse<SubmissionResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? SubmissionMap.toSubmission(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/submissions/create')),
    );
  }

  public move(
    slug: string,
    id: string,
    request: MoveSubmissionRequest,
  ): Observable<ApiResponse<Submission>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.SUBMISSION_MOVE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<SubmissionResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? SubmissionMap.toSubmission(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/submissions/move')),
    );
  }

  public addNote(
    slug: string,
    id: string,
    request: AddSubmissionNoteRequest,
  ): Observable<ApiResponse<Submission>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.SUBMISSION_NOTE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.post<ApiResponse<SubmissionResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? SubmissionMap.toSubmission(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/submissions/note')),
    );
  }

  public assign(
    slug: string,
    id: string,
    request: AssignSubmissionRequest,
  ): Observable<ApiResponse<Submission>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.SUBMISSION_ASSIGN.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<SubmissionResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? SubmissionMap.toSubmission(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/submissions/assign')),
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
