import { computed, inject, Injectable, signal } from '@angular/core';
import { EmpresaDepartmentApi } from '@shared/apis/empresa-department.api';
import { Department } from '@shared/interfaces/entity/empresa-department';
import { catchError, EMPTY, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentContextService {
  private readonly api = inject(EmpresaDepartmentApi);

  readonly department = signal<Department | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly slug = computed(() => this.department()?.slug ?? '');
  readonly id = computed(() => this.department()?.id ?? '');
  readonly hasDepartment = computed(() => this.department() !== null);

  load(orgSlug: string, deptSlug: string): void {
    const current = this.department();
    if (current?.slug === deptSlug && !this.error()) return;
    this.department.set(null);
    this.isLoading.set(true);
    this.error.set(null);
    this.api
      .detail(orgSlug, deptSlug)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.department.set(response.data);
          } else {
            this.error.set(response.message || 'Departamento não encontrado.');
          }
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.error.set('Não foi possível carregar o departamento.');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  clear(): void {
    this.department.set(null);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
