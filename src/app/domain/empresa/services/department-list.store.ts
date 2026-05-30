import { computed, Injectable, signal } from '@angular/core';
import { Department } from '@shared/interfaces/entity/empresa-department';

@Injectable({ providedIn: 'root' })
export class DepartmentListStore {
  readonly items = signal<Department[]>([]);
  readonly total = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly orgSlug = signal<string | null>(null);

  readonly favorites = computed(() => this.items().filter((d) => d.isFavorite));
  readonly hasItems = computed(() => this.items().length > 0);

  setOrgSlug(slug: string | null): void {
    this.orgSlug.set(slug);
  }

  setItems(items: Department[], total: number): void {
    this.items.set(items);
    this.total.set(total);
  }

  upsert(department: Department): void {
    this.items.update((current) => {
      const idx = current.findIndex((d) => d.id === department.id);
      if (idx === -1) return [department, ...current];
      const copy = [...current];
      copy[idx] = department;
      return copy;
    });
    this.total.update((n) =>
      this.items().some((d) => d.id === department.id) ? Math.max(n, this.items().length) : n + 1,
    );
  }

  remove(id: string): void {
    this.items.update((current) => current.filter((d) => d.id !== id));
    this.total.update((n) => Math.max(0, n - 1));
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }
}
