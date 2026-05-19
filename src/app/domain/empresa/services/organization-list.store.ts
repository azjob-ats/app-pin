import { computed, Injectable, signal } from '@angular/core';
import { Organization } from '@shared/interfaces/entity/empresa-organization';

@Injectable({ providedIn: 'root' })
export class OrganizationListStore {
  readonly items = signal<Organization[]>([]);
  readonly total = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly favorites = computed(() => this.items().filter((o) => o.isFavorite));
  readonly hasItems = computed(() => this.items().length > 0);

  setItems(items: Organization[], total: number): void {
    this.items.set(items);
    this.total.set(total);
  }

  upsert(org: Organization): void {
    this.items.update((current) => {
      const idx = current.findIndex((o) => o.id === org.id);
      if (idx === -1) return [org, ...current];
      const copy = [...current];
      copy[idx] = org;
      return copy;
    });
    this.total.update((n) => (this.items().some((o) => o.id === org.id) ? Math.max(n, this.items().length) : n + 1));
  }

  remove(id: string): void {
    this.items.update((current) => current.filter((o) => o.id !== id));
    this.total.update((n) => Math.max(0, n - 1));
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }
}
