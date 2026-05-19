import { computed, Injectable, signal } from '@angular/core';
import { ProductType } from '@shared/enums/product-type.enum';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';
import { Submission } from '@shared/interfaces/entity/empresa-submission';

export type SubmissionTypeFilter = ProductType | 'all';

@Injectable({ providedIn: 'root' })
export class SubmissionListStore {
  readonly items = signal<Submission[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly typeFilter = signal<SubmissionTypeFilter>('all');
  readonly productIdFilter = signal<string | null>(null);
  readonly searchTerm = signal<string>('');

  readonly movingIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly filteredItems = computed<readonly Submission[]>(() => {
    const type = this.typeFilter();
    const productId = this.productIdFilter();
    const term = this.searchTerm().trim().toLowerCase();
    return this.items().filter((s) => {
      if (type !== 'all' && s.productType !== type) return false;
      if (productId && s.productId !== productId) return false;
      if (term) {
        const haystack = `${s.candidate.name} ${s.candidate.email} ${s.productTitle}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  });

  readonly countByType = computed<Readonly<Record<ProductType | 'all', number>>>(() => {
    const result = { all: 0 } as Record<ProductType | 'all', number>;
    for (const t of Object.values(ProductType)) result[t] = 0;
    for (const s of this.items()) {
      result.all += 1;
      result[s.productType] = (result[s.productType] ?? 0) + 1;
    }
    return result;
  });

  readonly productOptions = computed<ReadonlyArray<{ id: string; title: string; type: ProductType }>>(
    () => {
      const seen = new Map<string, { id: string; title: string; type: ProductType }>();
      for (const s of this.items()) {
        if (!seen.has(s.productId)) {
          seen.set(s.productId, { id: s.productId, title: s.productTitle, type: s.productType });
        }
      }
      return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    },
  );

  setItems(items: readonly Submission[]): void {
    this.items.set([...items]);
  }

  upsert(submission: Submission): void {
    this.items.update((items) => {
      const idx = items.findIndex((s) => s.id === submission.id);
      if (idx === -1) return [submission, ...items];
      const copy = [...items];
      copy[idx] = submission;
      return copy;
    });
  }

  patchPhase(id: string, phase: SubmissionPhase): void {
    this.items.update((items) =>
      items.map((s) => (s.id === id ? ({ ...s, phase } as Submission) : s)),
    );
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setTypeFilter(filter: SubmissionTypeFilter): void {
    this.typeFilter.set(filter);
  }

  setProductIdFilter(productId: string | null): void {
    this.productIdFilter.set(productId);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
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

  reset(): void {
    this.items.set([]);
    this.isLoading.set(false);
    this.error.set(null);
    this.typeFilter.set('all');
    this.productIdFilter.set(null);
    this.searchTerm.set('');
    this.movingIds.set(new Set<string>());
  }
}
