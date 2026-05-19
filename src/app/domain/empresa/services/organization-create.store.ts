import { Injectable, signal } from '@angular/core';
import { Organization } from '@shared/interfaces/entity/empresa-organization';

@Injectable({ providedIn: 'root' })
export class OrganizationCreateStore {
  readonly isSubmitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly created = signal<Organization | null>(null);

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setCreated(org: Organization | null): void {
    this.created.set(org);
  }

  reset(): void {
    this.isSubmitting.set(false);
    this.error.set(null);
    this.created.set(null);
  }
}
