import { inject, Injectable, signal } from '@angular/core';
import { EmpresaOrganizationApi } from '@shared/apis/empresa-organization.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { UpdateOrganizationRequest } from '@shared/interfaces/dto/request/empresa-organization';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { OrganizationContextService } from './organization-context.service';

@Injectable({ providedIn: 'root' })
export class OrganizationUpdateFacade {
  private readonly api = inject(EmpresaOrganizationApi);
  private readonly context = inject(OrganizationContextService);

  readonly isSaving = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly justSaved = signal<boolean>(false);

  update(slug: string, payload: UpdateOrganizationRequest): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.justSaved.set(false);
    this.api
      .update(slug, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.context.organization.set(response.data);
            this.justSaved.set(true);
          } else {
            this.error.set(response.message || 'Não foi possível salvar.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível salvar.');
          return EMPTY;
        }),
        finalize(() => this.isSaving.set(false)),
      )
      .subscribe();
  }

  clearJustSaved(): void {
    this.justSaved.set(false);
  }

  reset(): void {
    this.isSaving.set(false);
    this.error.set(null);
    this.justSaved.set(false);
  }
}
