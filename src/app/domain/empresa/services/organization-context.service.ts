import { computed, inject, Injectable, signal } from '@angular/core';
import { EmpresaOrganizationApi } from '@shared/apis/empresa-organization.api';
import { Organization } from '@shared/interfaces/entity/empresa-organization';
import { catchError, EMPTY, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrganizationContextService {
  private readonly api = inject(EmpresaOrganizationApi);

  readonly organization = signal<Organization | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly slug = computed(() => this.organization()?.slug ?? '');
  readonly id = computed(() => this.organization()?.id ?? '');
  readonly hasOrganization = computed(() => this.organization() !== null);

  load(slug: string): void {
    const current = this.organization();
    if (current?.slug === slug && !this.error()) return;
    this.organization.set(null);
    this.isLoading.set(true);
    this.error.set(null);
    this.api
      .detail(slug)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.organization.set(response.data);
          } else {
            this.error.set(response.message || 'Organização não encontrada.');
          }
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.error.set('Não foi possível carregar a organização.');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  clear(): void {
    this.organization.set(null);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
