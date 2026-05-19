import { inject, Injectable, signal } from '@angular/core';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { ProductListStore } from './product-list.store';

@Injectable({ providedIn: 'root' })
export class ProductDetailFacade {
  private readonly api = inject(EmpresaProductApi);
  private readonly listStore = inject(ProductListStore);

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isMoving = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  load(slug: string, id: string): void {
    this.product.set(null);
    this.isLoading.set(true);
    this.error.set(null);
    this.api
      .detail(slug, id)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.product.set(response.data);
          } else {
            this.error.set(response.message || 'Produto não encontrado.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível carregar o produto.');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }

  move(slug: string, toPhase: ProductPhase): void {
    const current = this.product();
    if (!current || current.phase === toPhase) return;
    this.isMoving.set(true);
    this.error.set(null);
    this.api
      .move(slug, current.id, { phase: toPhase })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.product.set(response.data);
            this.listStore.upsert(response.data);
          } else {
            this.error.set(response.message || 'Não foi possível mover o produto.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível mover o produto.');
          return EMPTY;
        }),
        finalize(() => this.isMoving.set(false)),
      )
      .subscribe();
  }

  reset(): void {
    this.product.set(null);
    this.isLoading.set(false);
    this.isMoving.set(false);
    this.error.set(null);
  }
}
