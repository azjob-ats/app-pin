import { inject, Injectable } from '@angular/core';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { CustomPhase, ProductListStore, ProductTypeFilter } from './product-list.store';

@Injectable({ providedIn: 'root' })
export class ProductListFacade {
  private readonly api = inject(EmpresaProductApi);
  private readonly store = inject(ProductListStore);

  readonly items = this.store.items;
  readonly filteredItems = this.store.filteredItems;
  readonly countByType = this.store.countByType;
  readonly typeFilter = this.store.typeFilter;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly movingIds = this.store.movingIds;
  readonly customPhases = this.store.customPhases;
  readonly phasesOrder = this.store.phasesOrder;

  load(slug: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api
      .list(slug, { page: 1, pageSize: 100 })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setItems(response.data.data ?? []);
          } else {
            this.store.setError(response.message || 'Erro ao carregar produtos.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar produtos.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setTypeFilter(filter: ProductTypeFilter): void {
    this.store.setTypeFilter(filter);
  }

  move(slug: string, product: Product, toPhase: ProductPhase | string): void {
    const id = product.id;
    const previousPhase = product.phase;
    if (previousPhase === toPhase) return;

    // optimistic update
    this.store.beginMoving(id);
    this.store.patchPhase(id, toPhase);

    this.api
      .move(slug, id, { phase: toPhase })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsert(response.data);
          } else {
            // rollback
            this.store.patchPhase(id, previousPhase);
            this.store.setError(response.message || 'Não foi possível mover o produto.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.patchPhase(id, previousPhase);
          this.store.setError(err?.message || 'Não foi possível mover o produto.');
          return EMPTY;
        }),
        finalize(() => this.store.endMoving(id)),
      )
      .subscribe();
  }

  addCustomPhase(phase: CustomPhase): void {
    this.store.addCustomPhase(phase);
  }

  reset(): void {
    this.store.reset();
  }
}
