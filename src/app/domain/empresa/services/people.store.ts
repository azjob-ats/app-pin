import { Injectable, signal } from '@angular/core';
import { Group, Member, Role } from '@shared/interfaces/entity/empresa-member';

@Injectable({ providedIn: 'root' })
export class PeopleStore {
  readonly members = signal<Member[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly groups = signal<Group[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly isMutating = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  setMembers(items: readonly Member[]): void {
    this.members.set([...items]);
  }

  setRoles(items: readonly Role[]): void {
    this.roles.set([...items]);
  }

  setGroups(items: readonly Group[]): void {
    this.groups.set([...items]);
  }

  upsertMember(member: Member): void {
    this.members.update((items) => {
      const idx = items.findIndex((m) => m.id === member.id);
      if (idx === -1) return [...items, member];
      const copy = [...items];
      copy[idx] = member;
      return copy;
    });
  }

  upsertRole(role: Role): void {
    this.roles.update((items) => {
      const idx = items.findIndex((r) => r.id === role.id);
      if (idx === -1) return [...items, role];
      const copy = [...items];
      copy[idx] = role;
      return copy;
    });
  }

  upsertGroup(group: Group): void {
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
    this.members.set([]);
    this.roles.set([]);
    this.groups.set([]);
    this.isLoading.set(false);
    this.isMutating.set(false);
    this.error.set(null);
  }
}
