import { inject, Injectable } from '@angular/core';
import { EmpresaOrganizationApi } from '@shared/apis/empresa-organization.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { OrganizationListStore } from './organization-list.store';

@Injectable({ providedIn: 'root' })
export class OrganizationListFacade {
  private readonly api = inject(EmpresaOrganizationApi);
  private readonly store = inject(OrganizationListStore);

  readonly items = this.store.items;
  readonly favorites = this.store.favorites;
  readonly hasItems = this.store.hasItems;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  load(): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api
      .list({ page: 1, pageSize: 50 })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setItems(response.data.data ?? [], response.data.totalRecords);
          } else {
            this.store.setError(response.message || 'Erro ao carregar organizações.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar organizações.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  toggleFavorite(slug: string): void {
    this.api
      .toggleFavorite(slug)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsert(response.data);
          }
        }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }
}
