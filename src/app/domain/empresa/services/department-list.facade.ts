import { inject, Injectable } from '@angular/core';
import { EmpresaDepartmentApi } from '@shared/apis/empresa-department.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { DepartmentListStore } from './department-list.store';

@Injectable({ providedIn: 'root' })
export class DepartmentListFacade {
  private readonly api = inject(EmpresaDepartmentApi);
  private readonly store = inject(DepartmentListStore);

  readonly items = this.store.items;
  readonly favorites = this.store.favorites;
  readonly hasItems = this.store.hasItems;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  load(orgSlug: string): void {
    this.store.setOrgSlug(orgSlug);
    this.store.setLoading(true);
    this.store.setError(null);
    this.api
      .list(orgSlug, { page: 1, pageSize: 50 })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setItems(response.data.data ?? [], response.data.totalRecords);
          } else {
            this.store.setError(response.message || 'Erro ao carregar departamentos.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar departamentos.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  toggleFavorite(orgSlug: string, deptSlug: string): void {
    this.api
      .toggleFavorite(orgSlug, deptSlug)
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
