# API Guide

Documentação da arquitetura de integração com a API REST no projeto **app-pin**.

---

## Visão Geral

O fluxo de dados segue sempre a mesma direção:

```
environment.API   →   shared/apis   →   shared/maps   →   domain (components)
  (endpoints)       (HttpClient)      (DTO → Entity)       (consume)
```

---

## Camadas

### 1. Endpoints — `src/environments/environment.ts`

Todos os endpoints da API são declarados no objeto `API` do environment. Nunca use strings literais de URL fora deste arquivo.

```ts
API: {
  AUTH: {
    SIGNIN_WITH_EMAIL_AND_PASSWORD: '/api/v1/auth/sign-in-with-email-and-password',
    SIGNUP_WITH_EMAIL_AND_PASSWORD: '/api/v1/auth/sign-up-with-email-and-password',
  },
  INPUT_MENU_STEP_SECTION: {
    SECTION: '/api/v1/public/input-menu-section',
  },
},
```

**Para adicionar um novo endpoint:**
```ts
// environment.ts → objeto API
MY_FEATURE: {
  LIST:   '/api/v1/my-feature',
  DETAIL: '/api/v1/my-feature/:id',
},
```

---

### 2. Interfaces base — `src/app/shared/interfaces/base/`

Contratos genéricos reutilizados por todas as camadas.

#### `api-response.ts` — envelope padrão de resposta
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

#### `pages-total-records.ts` — resposta paginada
```ts
interface List<T = unknown> {
  data?: T;
  query: any;
  page: number;         // página atual (ex: 2)
  pageSize: number;     // itens por página (ex: 10)
  pages: number;        // total de páginas
  totalRecords: number; // total de registros
}
```

#### `request-base.ts` — parâmetros comuns de requisição
```ts
interface RequestBase {
  region?: string;
  language?: string;
  timestamp?: string;
}
```

---

### 3. DTO — `src/app/shared/interfaces/dto/`

Representam **exatamente** o que vem do backend. Não devem ser usados diretamente nos componentes.

```
shared/interfaces/dto/
  response/
    input-menu-step-section.ts   ← exemplo existente
```

**Convenção de nomenclatura:**
- Responses → `src/app/shared/interfaces/dto/response/my-feature.ts`
- Requests  → `src/app/shared/interfaces/dto/request/my-feature.ts`

Exemplo de DTO de resposta:
```ts
// dto/response/my-feature.ts
export interface MyFeatureItemResponse {
  id: string;
  display_name: string;   // snake_case do backend
  created_at: string;
}

export interface MyFeatureResponse extends List {
  data: MyFeatureItemResponse[];
}
```

---

### 4. Entity — `src/app/shared/interfaces/entity/`

Representam **o modelo que a aplicação consome**. São o resultado da transformação do DTO. Usam camelCase e apenas os campos necessários para a UI.

```
shared/interfaces/entity/
  input-menu-step-section.ts   ← exemplo existente
```

Exemplo de Entity:
```ts
// entity/my-feature.ts
export interface MyFeatureItem {
  id: string;
  displayName: string;   // camelCase, limpo
}
```

---

### 5. Maps — `src/app/shared/maps/`

Responsáveis por **transformar DTO → Entity**. São classes estáticas puras, sem injeção de dependência.

```
shared/maps/
  input-menu-step-section.ts   ← exemplo existente
```

**Estrutura padrão:**
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

### 6. APIs — `src/app/shared/apis/`

Camada de acesso HTTP. Usa `HttpClient`, referencia endpoints do `environment.API`, aplica o Map e retorna `Observable<ApiResponse<Entity>>`.

```
shared/apis/
  input-menu-section.api.ts   ← exemplo existente
```

**Estrutura padrão:**
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

### 7. Consumo nos domínios — `src/app/domain/`

Os componentes e páginas injetam a API diretamente via `inject()` e consomem o Observable.

```ts
// domain/my-feature/pages/my-feature/my-feature.component.ts
import { inject } from '@angular/core';
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

## Checklist para nova feature

```
[ ] 1. Declarar endpoint em environment.API
[ ] 2. Criar DTO em shared/interfaces/dto/response/
[ ] 3. Criar Entity em shared/interfaces/entity/
[ ] 4. Criar Map em shared/maps/ (DTO → Entity)
[ ] 5. Criar API em shared/apis/ (HttpClient + Map)
[ ] 6. Injetar e consumir no componente em domain/
```

---

## Estrutura de diretórios

```
src/
├── environments/
│   └── environment.ts              ← endpoints (API.*) e rotas (ROUTES.*)
└── app/
    └── shared/
        ├── interfaces/
        │   ├── base/
        │   │   ├── api-response.ts         ← envelope ApiResponse<T>
        │   │   ├── pages-total-records.ts  ← paginação List<T>
        │   │   └── request-base.ts         ← params comuns
        │   ├── dto/
        │   │   ├── request/                ← o que enviamos ao backend
        │   │   └── response/               ← o que recebemos do backend
        │   └── entity/                     ← o que a aplicação consome
        ├── maps/                           ← transforma DTO → Entity
        └── apis/                           ← HttpClient (usa Map, retorna Observable)
    └── domain/                             ← páginas e componentes (consomem apis/)
```
