import { inject, Injectable } from '@angular/core';
import { InscriptionsApi } from '@shared/apis/inscriptions.api';
import { InscriptionListQueryRequest } from '@shared/interfaces/dto/request/inscriptions';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';

import { InscriptionFilters, InscriptionsStore } from './inscriptions.store';

@Injectable({ providedIn: 'root' })
export class InscriptionsFacade {
  private readonly api = inject(InscriptionsApi);
  private readonly store = inject(InscriptionsStore);

  readonly items = this.store.items;
  readonly total = this.store.total;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly filters = this.store.filters;
  readonly cancellingIds = this.store.cancellingIds;
  readonly hasItems = this.store.hasItems;
  readonly hasActiveFilters = this.store.hasActiveFilters;

  load(): void {
    const filters = this.store.filters();
    const query: InscriptionListQueryRequest = {
      type: filters.type ?? undefined,
      status: filters.status ?? undefined,
      page: 1,
      pageSize: 50,
    };

    this.store.setLoading(true);
    this.store.setError(null);

    this.api
      .list(query)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setItems(response.data.data ?? [], response.data.totalRecords);
          } else {
            this.store.setError(response.message || 'Erro ao carregar inscrições.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar inscrições.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setFilters(filters: InscriptionFilters): void {
    this.store.setFilters(filters);
    this.load();
  }

  clearFilters(): void {
    this.store.clearFilters();
    this.load();
  }

  cancel(id: string): Observable<unknown> {
    const snapshot = this.store.applyOptimisticCancel(id);
    if (!snapshot) return EMPTY;

    this.store.markCancelling(id);

    return this.api.cancel(id).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.store.replaceItem(response.data);
        } else {
          this.store.rollbackItem(snapshot);
          this.store.setError(response.message || 'Não foi possível cancelar.');
        }
      }),
      catchError((err: ApiResponse) => {
        this.store.rollbackItem(snapshot);
        this.store.setError(err?.message || 'Não foi possível cancelar.');
        return EMPTY;
      }),
      finalize(() => this.store.unmarkCancelling(id)),
    );
  }
}
