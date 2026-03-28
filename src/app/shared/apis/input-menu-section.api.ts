import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { ApiResponse, ErrorType } from "@shared/interfaces/base/api-response";
import { List } from "@shared/interfaces/base/pages-total-records";
import { InputMenuStepSectionResponse } from '@shared/interfaces/dto/response/input-menu-step-section';
import { InputMenuStepSectionStep } from "@shared/interfaces/entity/input-menu-step-section";
import { InputMenuStepSectionMap } from '@shared/maps/input-menu-step-section';
import { catchError, map, Observable, throwError } from "rxjs";


@Injectable({ providedIn: 'root' })
export class InputMenuSectionApi {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.API_BASE_URL}`;

    public getInputMenuSection(menuSection: string): Observable<ApiResponse<List<InputMenuStepSectionStep[]>>> {
        const url = `${this.baseUrl}${environment.API.INPUT_MENU_STEP_SECTION.SECTION}/${menuSection}`;
        const body = {
            region: 'br',
            language: 'pt',
            timestamp: '2025-03-07 21:29:25.187'
        }

        const meusParametros = new HttpParams()
            .set('region', body.region)
            .set('language', body.language)
            .set('timestamp', body.timestamp)


        return this.http
            .get<ApiResponse<InputMenuStepSectionResponse>>(url, { params: meusParametros })
            .pipe(
                map(response => ({
                    ...response,
                    data: response.data
                        ? InputMenuStepSectionMap.toEntity(response.data)
                        : undefined
                }))
            )
            .pipe(
                catchError((err: any) => {
                    let response: ApiResponse = {
                        success: false,
                        message: 'Generic Error',
                        statusCode: 500,
                        errors:
                        {
                            code: 'search/input-menu-step-section',
                            message: 'Unknown error',
                            type: ErrorType.genericError
                        },
                        data: err,
                        timestamp: new Date().toISOString(),
                    };

                    if (err instanceof HttpErrorResponse) {
                        response = {
                            success: false,
                            message: err.message,
                            statusCode: err.status,
                            errors:
                            {
                                code: 'search/input-menu-step-section',
                                message: err.statusText,
                                type: ErrorType.HttpErrorResponse
                            },
                            data: err,
                            timestamp: new Date().toISOString(),
                        };
                    }
                    return throwError(() => response)
                })
            )
    }
}


