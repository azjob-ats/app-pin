import { Injectable, signal } from '@angular/core';
import { CreatorGroup, OrganizationCreator } from '@shared/interfaces/entity/empresa-creator';

@Injectable({ providedIn: 'root' })
export class CreatorStore {
  readonly creators = signal<OrganizationCreator[]>([]);
  readonly groups = signal<CreatorGroup[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly isMutating = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  setCreators(items: readonly OrganizationCreator[]): void {
    this.creators.set([...items]);
  }

  setGroups(items: readonly CreatorGroup[]): void {
    this.groups.set([...items]);
  }

  upsertGroup(group: CreatorGroup): void {
    this.groups.update((items) => {
      const idx = items.findIndex((g) => g.id === group.id);
      if (idx === -1) return [...items, group];
      const copy = [...items];
      copy[idx] = group;
      return copy;
    });
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setMutating(mutating: boolean): void {
    this.isMutating.set(mutating);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  reset(): void {
    this.creators.set([]);
    this.groups.set([]);
    this.isLoading.set(false);
    this.isMutating.set(false);
    this.error.set(null);
  }
}
