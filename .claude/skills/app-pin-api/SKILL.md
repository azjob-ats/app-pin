---
name: app-pin-api
description: Implement API integrations in the app-pin project following its layered architecture (environment → DTO → Entity → Map → API service → domain component). Use when creating a new API endpoint, adding a new feature that consumes the backend, creating DTO/Entity/Map/API classes, or asking how to integrate with the REST API in this project.
---

# app-pin API Integration

All API integrations in this project follow a strict layered flow:

```
environment.API  →  shared/apis  →  shared/maps  →  domain (components)
  (endpoints)       (HttpClient)    (DTO → Entity)     (consume)
```

## Checklist for every new feature

```
[ ] 1. Declare endpoint in environment.API
[ ] 2. Create DTO in shared/interfaces/dto/response/ (and /request/ if needed)
[ ] 3. Create Entity in shared/interfaces/entity/
[ ] 4. Create Map in shared/maps/  (DTO → Entity)
[ ] 5. Create API service in shared/apis/  (HttpClient + Map)
[ ] 6. Inject and consume in the domain component
```

---

## Layer 1 — Endpoints (`src/environments/environment.ts`)

Never use literal URL strings outside this file. All endpoints live under `environment.API`.

```ts
// environment.ts → API object
MY_FEATURE: {
  LIST:   '/api/v1/my-feature',
  DETAIL: '/api/v1/my-feature/:id',
},
```

---

## Layer 2 — Base interfaces (`src/app/shared/interfaces/base/`)

### `ApiResponse<T>` — standard response envelope
```ts
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  errors?: Error;       // { code, message, type: ErrorType }
  timestamp: string;
}
```

### `List<T>` — paginated response
```ts
interface List<T = unknown> {
  data?: T;
  query: any;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
```

---

## Layer 3 — DTOs (`src/app/shared/interfaces/dto/`)

Represent **exactly** what comes from the backend (snake_case). Never use directly in components.

```
dto/
  response/my-feature.ts   ← what we receive
  request/my-feature.ts    ← what we send (if needed)
```

```ts
// dto/response/my-feature.ts
export interface MyFeatureItemResponse {
  id: string;
  display_name: string;   // snake_case from backend
  created_at: string;
}

export interface MyFeatureResponse extends List {
  data: MyFeatureItemResponse[];
}
```

---

## Layer 4 — Entities (`src/app/shared/interfaces/entity/`)

The model the application actually consumes — camelCase, only UI-needed fields.

```ts
// entity/my-feature.ts
export interface MyFeatureItem {
  id: string;
  displayName: string;
}
```

---

## Layer 5 — Maps (`src/app/shared/maps/`)

Pure static classes. No dependency injection. Transform DTO → Entity.

```ts
// maps/my-feature.map.ts
import { List } from '@shared/interfaces/base/pages-total-records';
import { MyFeatureResponse } from '@shared/interfaces/dto/response/my-feature';
import { MyFeatureItem } from '@shared/interfaces/entity/my-feature';

export class MyFeatureMap {
  public static toEntity(response: MyFeatureResponse): List<MyFeatureItem[]> {
    const data: MyFeatureItem[] = response.data.map(
      (item): MyFeatureItem => ({
        id: item.id,
        displayName: item.display_name,
      }),
    );
    return { ...response, data };
  }
}
```

---

## Layer 6 — API services (`src/app/shared/apis/`)

Use `HttpClient`, reference `environment.API`, apply the Map, return `Observable<ApiResponse<Entity>>`.

```ts
// apis/my-feature.api.ts
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import { MyFeatureResponse } from '@shared/interfaces/dto/response/my-feature';
import { MyFeatureItem } from '@shared/interfaces/entity/my-feature';
import { MyFeatureMap } from '@shared/maps/my-feature.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyFeatureApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public list(page = 1, pageSize = 10): Observable<ApiResponse<List<MyFeatureItem[]>>> {
    const url = `${this.baseUrl}${environment.API.MY_FEATURE.LIST}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<MyFeatureResponse>>(url, { params })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data ? MyFeatureMap.toEntity(response.data) : undefined,
        })),
        catchError((err: unknown) => {
          const isHttp = err instanceof HttpErrorResponse;

          const response: ApiResponse = {
            success: false,
            message: isHttp ? err.message : 'Generic Error',
            statusCode: isHttp ? err.status : 500,
            errors: {
              code: 'my-feature/list',
              message: isHttp ? err.statusText : 'Unknown error',
              type: isHttp ? ErrorType.HttpErrorResponse : ErrorType.genericError,
            },
            data: err,
            timestamp: new Date().toISOString(),
          };

          return throwError(() => response);
        }),
      );
  }
}
```

---

## Layer 7 — Domain components (`src/app/domain/`)

Inject the API service with `inject()` and consume the Observable using signals.

```ts
// domain/my-feature/pages/my-feature/my-feature.component.ts
import { inject, signal } from '@angular/core';
import { MyFeatureApi } from '@shared/apis/my-feature.api';
import { MyFeatureItem } from '@shared/interfaces/entity/my-feature';

export class MyFeatureComponent {
  private readonly myFeatureApi = inject(MyFeatureApi);

  readonly items = signal<MyFeatureItem[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.myFeatureApi.list().subscribe({
      next: (response) => {
        this.items.set(response.data?.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
```

---

## Directory structure

```
src/
├── environments/
│   └── environment.ts              ← endpoints (API.*) and routes (ROUTES.*)
└── app/
    └── shared/
        ├── interfaces/
        │   ├── base/
        │   │   ├── api-response.ts         ← ApiResponse<T> envelope
        │   │   ├── pages-total-records.ts  ← pagination List<T>
        │   │   └── request-base.ts         ← common request params
        │   ├── dto/
        │   │   ├── request/                ← what we send to backend
        │   │   └── response/               ← what we receive from backend
        │   └── entity/                     ← what the application consumes
        ├── maps/                           ← transforms DTO → Entity
        └── apis/                           ← HttpClient (uses Map, returns Observable)
    └── domain/                             ← pages and components (consume apis/)
```
