import { inject, Injectable } from '@angular/core';
import { EmpresaMemberApi } from '@shared/apis/empresa-member.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import {
  AddMembersToGroupRequest,
  CreateGroupRequest,
  CreateRoleRequest,
  InviteMemberRequest,
  UpdateRoleRequest,
} from '@shared/interfaces/dto/request/empresa-member';
import { catchError, EMPTY, finalize, forkJoin, tap } from 'rxjs';

import { PeopleStore } from './people.store';

@Injectable({ providedIn: 'root' })
export class PeopleFacade {
  private readonly api = inject(EmpresaMemberApi);
  private readonly store = inject(PeopleStore);

  readonly members = this.store.members;
  readonly roles = this.store.roles;
  readonly groups = this.store.groups;
  readonly isLoading = this.store.isLoading;
  readonly isMutating = this.store.isMutating;
  readonly error = this.store.error;

  load(slug: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    forkJoin({
      members: this.api.listMembers(slug),
      roles: this.api.listRoles(slug),
      groups: this.api.listGroups(slug),
    })
      .pipe(
        tap(({ members, roles, groups }) => {
          if (members.success && members.data) this.store.setMembers(members.data.data ?? []);
          if (roles.success && roles.data) this.store.setRoles(roles.data);
          if (groups.success && groups.data) this.store.setGroups(groups.data);
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar pessoas.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  invite(slug: string, payload: InviteMemberRequest): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .invite(slug, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertMember(response.data);
            this.refreshRoles(slug);
          } else {
            this.store.setError(response.message || 'Não foi possível convidar.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível convidar.');
          return EMPTY;
        }),
        finalize(() => this.store.setMutating(false)),
      )
      .subscribe();
  }

  updateMemberRole(slug: string, memberId: string, roleId: string): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .updateMember(slug, memberId, { roleId })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertMember(response.data);
            this.refreshRoles(slug);
          } else {
            this.store.setError(response.message || 'Não foi possível atualizar a função.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível atualizar a função.');
          return EMPTY;
        }),
        finalize(() => this.store.setMutating(false)),
      )
      .subscribe();
  }

  createRole(slug: string, payload: CreateRoleRequest): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .createRole(slug, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertRole(response.data);
          } else {
            this.store.setError(response.message || 'Não foi possível criar a função.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível criar a função.');
          return EMPTY;
        }),
        finalize(() => this.store.setMutating(false)),
      )
      .subscribe();
  }

  updateRole(slug: string, roleId: string, payload: UpdateRoleRequest): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .updateRole(slug, roleId, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertRole(response.data);
          } else {
            this.store.setError(response.message || 'Não foi possível salvar a função.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível salvar a função.');
          return EMPTY;
        }),
        finalize(() => this.store.setMutating(false)),
      )
      .subscribe();
  }

  createGroup(slug: string, payload: CreateGroupRequest): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .createGroup(slug, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertGroup(response.data);
          } else {
            this.store.setError(response.message || 'Não foi possível criar o grupo.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível criar o grupo.');
          return EMPTY;
        }),
        finalize(() => this.store.setMutating(false)),
      )
      .subscribe();
  }

  addMembersToGroup(slug: string, groupId: string, payload: AddMembersToGroupRequest): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .addMembersToGroup(slug, groupId, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertGroup(response.data);
            // Refresh members and roles since role propagation may have happened.
            this.refreshMembers(slug);
            this.refreshRoles(slug);
          } else {
            this.store.setError(response.message || 'Não foi possível adicionar ao grupo.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Não foi possível adicionar ao grupo.');
          return EMPTY;
        }),
        finalize(() => this.store.setMutating(false)),
      )
      .subscribe();
  }

  reset(): void {
    this.store.reset();
  }

  private refreshRoles(slug: string): void {
    this.api
      .listRoles(slug)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setRoles(response.data);
          }
        }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }

  private refreshMembers(slug: string): void {
    this.api
      .listMembers(slug)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setMembers(response.data.data ?? []);
          }
        }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }
}
