import { computed, Injectable, signal } from '@angular/core';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ProductType } from '@shared/enums/product-type.enum';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { DEFAULT_PRODUCT_PHASE_ORDER } from '@domain/empresa/constants/product-presets';

export type ProductTypeFilter = ProductType | 'all';

export interface CustomPhase {
  readonly id: string;
  readonly label: string;
  readonly color: string;
}

@Injectable({ providedIn: 'root' })
export class ProductListStore {
  readonly items = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly typeFilter = signal<ProductTypeFilter>('all');
  readonly movingIds = signal<ReadonlySet<string>>(new Set<string>());
  readonly customPhases = signal<readonly CustomPhase[]>([]);

  readonly filteredItems = computed<readonly Product[]>(() => {
    const filter = this.typeFilter();
    const all = this.items();
    if (filter === 'all') return all;
    return all.filter((p) => p.type === filter);
  });

  readonly countByType = computed<Readonly<Record<ProductType | 'all', number>>>(() => {
    const result = { all: 0 } as Record<ProductType | 'all', number>;
    for (const t of Object.values(ProductType)) result[t] = 0;
    for (const p of this.items()) {
      result.all += 1;
      result[p.type] = (result[p.type] ?? 0) + 1;
    }
    return result;
  });

  readonly phasesOrder = computed<readonly string[]>(() => {
    const customIds = this.customPhases().map((p) => p.id);
    return [...DEFAULT_PRODUCT_PHASE_ORDER, ...customIds];
  });

  setItems(items: readonly Product[]): void {
    this.items.set([...items]);
  }

  upsert(product: Product): void {
    this.items.update((items) => {
      const idx = items.findIndex((p) => p.id === product.id);
      if (idx === -1) return [product, ...items];
      const copy = [...items];
      copy[idx] = product;
      return copy;
    });
  }

  patchPhase(id: string, phase: ProductPhase | string): void {
    this.items.update((items) =>
      items.map((p) => (p.id === id ? ({ ...p, phase: phase as ProductPhase } as Product) : p)),
    );
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setTypeFilter(filter: ProductTypeFilter): void {
    this.typeFilter.set(filter);
  }

  beginMoving(id: string): void {
    this.movingIds.update((set) => {
      const next = new Set(set);
      next.add(id);
      return next;
    });
  }

  endMoving(id: string): void {
    this.movingIds.update((set) => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
  }

  addCustomPhase(phase: CustomPhase): void {
    this.customPhases.update((current) => {
      if (current.some((p) => p.id === phase.id)) return current;
      return [...current, phase];
    });
  }

  reset(): void {
    this.items.set([]);
    this.isLoading.set(false);
    this.error.set(null);
    this.typeFilter.set('all');
    this.movingIds.set(new Set<string>());
    this.customPhases.set([]);
  }
}
