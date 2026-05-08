import { computed, Injectable, signal } from '@angular/core';
import { InscriptionStatus } from '@shared/enums/inscription-status.enum';
import { InscriptionType } from '@shared/enums/inscription-type.enum';
import { Inscription } from '@shared/interfaces/entity/inscription';

export interface InscriptionFilters {
  type: InscriptionType | null;
  status: InscriptionStatus | null;
}

@Injectable({ providedIn: 'root' })
export class InscriptionsStore {
  readonly items = signal<Inscription[]>([]);
  readonly total = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly filters = signal<InscriptionFilters>({ type: null, status: null });
  readonly cancellingIds = signal<ReadonlySet<string>>(new Set());

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return f.type !== null || f.status !== null;
  });

  readonly hasItems = computed(() => this.items().length > 0);

  setItems(items: Inscription[], total: number): void {
    this.items.set(items);
    this.total.set(total);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setFilters(filters: InscriptionFilters): void {
    this.filters.set(filters);
  }

  patchFilters(patch: Partial<InscriptionFilters>): void {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  clearFilters(): void {
    this.filters.set({ type: null, status: null });
  }

  markCancelling(id: string): void {
    this.cancellingIds.update((set) => {
      const next = new Set(set);
      next.add(id);
      return next;
    });
  }

  unmarkCancelling(id: string): void {
    this.cancellingIds.update((set) => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
  }

  replaceItem(updated: Inscription): void {
    this.items.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
  }

  applyOptimisticCancel(id: string): Inscription | null {
    const current = this.items().find((item) => item.id === id);
    if (!current) return null;

    const optimistic: Inscription = {
      ...current,
      status: InscriptionStatus.Cancelled,
      cancellable: false,
      nextStep: null,
      updatedAt: new Date(),
    };
    this.replaceItem(optimistic);
    return current;
  }

  rollbackItem(snapshot: Inscription): void {
    this.replaceItem(snapshot);
  }
}
