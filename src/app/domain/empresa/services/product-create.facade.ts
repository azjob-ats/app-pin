import { inject, Injectable } from '@angular/core';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { CreateProductRequest } from '@shared/interfaces/dto/request/empresa-product';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { ProductListStore } from './product-list.store';
import { ProductCreateStore } from './product-create.store';

@Injectable({ providedIn: 'root' })
export class ProductCreateFacade {
  private readonly api = inject(EmpresaProductApi);
  private readonly store = inject(ProductCreateStore);
  private readonly listStore = inject(ProductListStore);

  readonly isSubmitting = this.store.isSubmitting;
  readonly error = this.store.error;
  readonly created = this.store.created;

  submit(slug: string, payload: CreateProductRequest): void {
    this.store.setSubmitting(true);
    this.store.setError(null);
    this.api
      .create(slug, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setCreated(response.data);
            this.listStore.upsert(response.data);
          } else {
            this.store.setError(response.message || 'Não foi possível publicar o produto.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível publicar o produto.');
          return EMPTY;
        }),
        finalize(() => this.store.setSubmitting(false)),
      )
      .subscribe();
  }

  reset(): void {
    this.store.reset();
  }
}
