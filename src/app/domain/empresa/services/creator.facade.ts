import { inject, Injectable } from '@angular/core';
import { EmpresaCreatorApi } from '@shared/apis/empresa-creator.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import {
  AddCreatorsToGroupRequest,
  CreateCreatorGroupRequest,
} from '@shared/interfaces/dto/request/empresa-creator';
import { catchError, EMPTY, finalize, forkJoin, tap } from 'rxjs';

import { CreatorStore } from './creator.store';

@Injectable({ providedIn: 'root' })
export class CreatorFacade {
  private readonly api = inject(EmpresaCreatorApi);
  private readonly store = inject(CreatorStore);

  readonly creators = this.store.creators;
  readonly groups = this.store.groups;
  readonly isLoading = this.store.isLoading;
  readonly isMutating = this.store.isMutating;
  readonly error = this.store.error;

  load(slug: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    forkJoin({
      creators: this.api.listCreators(slug),
      groups: this.api.listGroups(slug),
    })
      .pipe(
        tap(({ creators, groups }) => {
          if (creators.success && creators.data) this.store.setCreators(creators.data);
          if (groups.success && groups.data) this.store.setGroups(groups.data);
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar creators.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  createGroup(slug: string, payload: CreateCreatorGroupRequest): void {
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

  addCreatorsToGroup(slug: string, groupId: string, payload: AddCreatorsToGroupRequest): void {
    this.store.setMutating(true);
    this.store.setError(null);
    this.api
      .addCreatorsToGroup(slug, groupId, payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsertGroup(response.data);
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
}
