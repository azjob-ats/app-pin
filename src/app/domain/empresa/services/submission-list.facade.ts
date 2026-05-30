import { inject, Injectable } from '@angular/core';
import { EmpresaSubmissionApi } from '@shared/apis/empresa-submission.api';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { SubmissionListStore, SubmissionTypeFilter } from './submission-list.store';

@Injectable({ providedIn: 'root' })
export class SubmissionListFacade {
  private readonly api = inject(EmpresaSubmissionApi);
  private readonly store = inject(SubmissionListStore);

  readonly items = this.store.items;
  readonly filteredItems = this.store.filteredItems;
  readonly countByType = this.store.countByType;
  readonly productOptions = this.store.productOptions;
  readonly typeFilter = this.store.typeFilter;
  readonly productIdFilter = this.store.productIdFilter;
  readonly searchTerm = this.store.searchTerm;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly movingIds = this.store.movingIds;

  load(slug: string, departmentSlug?: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api
      .list(slug, { page: 1, pageSize: 200, department: departmentSlug || undefined })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setItems(response.data.data ?? []);
          } else {
            this.store.setError(response.message || 'Erro ao carregar triagens.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar triagens.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setTypeFilter(filter: SubmissionTypeFilter): void {
    this.store.setTypeFilter(filter);
  }

  setProductIdFilter(productId: string | null): void {
    this.store.setProductIdFilter(productId);
  }

  setSearchTerm(term: string): void {
    this.store.setSearchTerm(term);
  }

  move(slug: string, submission: Submission, toPhase: SubmissionPhase): void {
    const id = submission.id;
    const previousPhase = submission.phase;
    if (previousPhase === toPhase) return;

    this.store.beginMoving(id);
    this.store.patchPhase(id, toPhase);

    this.api
      .move(slug, id, { phase: toPhase })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.upsert(response.data);
          } else {
            this.store.patchPhase(id, previousPhase);
            this.store.setError(response.message || 'Não foi possível mover a submissão.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.patchPhase(id, previousPhase);
          this.store.setError(err?.message || 'Não foi possível mover a submissão.');
          return EMPTY;
        }),
        finalize(() => this.store.endMoving(id)),
      )
      .subscribe();
  }

  reset(): void {
    this.store.reset();
  }
}
