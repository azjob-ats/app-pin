export const enum ErrorType {
    HttpErrorResponse = 'HttpErrorResponse',
    ApiResponse = 'ApiResponse',
    genericError = 'genericError',
}

export interface Error {
    code: string;
    message: string;
    type: ErrorType
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
    errors?: Error;
    timestamp: string;
}