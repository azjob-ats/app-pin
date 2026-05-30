import { Injectable, signal } from '@angular/core';
import { Department } from '@shared/interfaces/entity/empresa-department';

@Injectable({ providedIn: 'root' })
export class DepartmentCreateStore {
  readonly isSubmitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly created = signal<Department | null>(null);

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setCreated(department: Department | null): void {
    this.created.set(department);
  }

  reset(): void {
    this.isSubmitting.set(false);
    this.error.set(null);
    this.created.set(null);
  }
}
