import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { SaveResumeTrackRequest } from '@shared/interfaces/dto/request/resume';
import { CreatorPortfolioResponse } from '@shared/interfaces/dto/response/creator-portfolio';
import { ResumeDraftResponse } from '@shared/interfaces/dto/response/resume';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';
import { ResumeDraft } from '@shared/interfaces/entity/resume';
import { CreatorPortfolioMap } from '@shared/maps/creator-portfolio.map';
import { ResumeMap } from '@shared/maps/resume.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public getDraft(): Observable<ApiResponse<ResumeDraft>> {
    const url = `${this.baseUrl}${environment.API.RESUME.DRAFT}`;

    return this.http
      .get<ApiResponse<ResumeDraftResponse>>(url)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ResumeMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('resume/get-draft')),
      );
  }

  public saveTrack(request: SaveResumeTrackRequest): Observable<ApiResponse<ResumeDraft>> {
    const url = `${this.baseUrl}${environment.API.RESUME.SAVE_TRACK.replace(':trackId', request.trackId)}`;

    return this.http
      .patch<ApiResponse<ResumeDraftResponse>>(url, request.payload)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? ResumeMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('resume/save-track')),
      );
  }

  public publish(): Observable<ApiResponse<CreatorPortfolio>> {
    const url = `${this.baseUrl}${environment.API.RESUME.PUBLISH}`;

    return this.http
      .post<ApiResponse<CreatorPortfolioResponse>>(url, {})
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? CreatorPortfolioMap.toEntity(response.data) : undefined,
        })),
        catchError(this.handleError('resume/publish')),
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
