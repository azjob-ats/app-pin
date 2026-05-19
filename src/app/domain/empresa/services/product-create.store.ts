import { Injectable, signal } from '@angular/core';
import { Product } from '@shared/interfaces/entity/empresa-product';

@Injectable({ providedIn: 'root' })
export class ProductCreateStore {
  readonly isSubmitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly created = signal<Product | null>(null);

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setCreated(product: Product | null): void {
    this.created.set(product);
  }

  reset(): void {
    this.isSubmitting.set(false);
    this.error.set(null);
    this.created.set(null);
  }
}
