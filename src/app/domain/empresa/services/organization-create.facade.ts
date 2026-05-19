import { inject, Injectable } from '@angular/core';
import { EmpresaOrganizationApi } from '@shared/apis/empresa-organization.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { CreateOrganizationRequest } from '@shared/interfaces/dto/request/empresa-organization';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { OrganizationListStore } from './organization-list.store';
import { OrganizationCreateStore } from './organization-create.store';

@Injectable({ providedIn: 'root' })
export class OrganizationCreateFacade {
  private readonly api = inject(EmpresaOrganizationApi);
  private readonly store = inject(OrganizationCreateStore);
  private readonly listStore = inject(OrganizationListStore);

  readonly isSubmitting = this.store.isSubmitting;
  readonly error = this.store.error;
  readonly created = this.store.created;

  submit(payload: CreateOrganizationRequest): void {
    this.store.setSubmitting(true);
    this.store.setError(null);
    this.api
      .create(payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setCreated(response.data);
            this.listStore.upsert(response.data);
          } else {
            this.store.setError(response.message || 'Não foi possível criar a organização.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível criar a organização.');
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
