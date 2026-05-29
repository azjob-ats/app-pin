import { inject, Injectable } from '@angular/core';
import { EmpresaDepartmentApi } from '@shared/apis/empresa-department.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { CreateDepartmentRequest } from '@shared/interfaces/dto/request/empresa-department';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { DepartmentListStore } from './department-list.store';
import { DepartmentCreateStore } from './department-create.store';

@Injectable({ providedIn: 'root' })
export class DepartmentCreateFacade {
  private readonly api = inject(EmpresaDepartmentApi);
  private readonly store = inject(DepartmentCreateStore);
  private readonly listStore = inject(DepartmentListStore);

  readonly isSubmitting = this.store.isSubmitting;
  readonly error = this.store.error;
  readonly created = this.store.created;

  submit(orgSlug: string, payload: CreateDepartmentRequest): void {
    this.store.setSubmitting(true);
    this.store.setError(null);
    this.api
      .create(orgSlug, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setCreated(response.data);
            this.listStore.upsert(response.data);
          } else {
            this.store.setError(response.message || 'Não foi possível criar o departamento.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível criar o departamento.');
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
