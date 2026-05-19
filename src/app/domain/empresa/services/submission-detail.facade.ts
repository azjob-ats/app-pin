import { inject, Injectable, signal } from '@angular/core';
import { EmpresaSubmissionApi } from '@shared/apis/empresa-submission.api';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { SubmissionListStore } from './submission-list.store';

@Injectable({ providedIn: 'root' })
export class SubmissionDetailFacade {
  private readonly api = inject(EmpresaSubmissionApi);
  private readonly listStore = inject(SubmissionListStore);

  readonly submission = signal<Submission | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isMoving = signal<boolean>(false);
  readonly isSavingNote = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  load(slug: string, id: string): void {
    this.submission.set(null);
    this.isLoading.set(true);
    this.error.set(null);
    this.api
      .detail(slug, id)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.submission.set(response.data);
          } else {
            this.error.set(response.message || 'Submissão não encontrada.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível carregar a submissão.');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }

  move(slug: string, toPhase: SubmissionPhase): void {
    const current = this.submission();
    if (!current || current.phase === toPhase) return;
    this.isMoving.set(true);
    this.error.set(null);
    this.api
      .move(slug, current.id, { phase: toPhase })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.submission.set(response.data);
            this.listStore.upsert(response.data);
          } else {
            this.error.set(response.message || 'Não foi possível mover a submissão.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível mover a submissão.');
          return EMPTY;
        }),
        finalize(() => this.isMoving.set(false)),
      )
      .subscribe();
  }

  saveNote(slug: string, note: string): void {
    const current = this.submission();
    if (!current) return;
    this.isSavingNote.set(true);
    this.error.set(null);
    this.api
      .addNote(slug, current.id, { note })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.submission.set(response.data);
            this.listStore.upsert(response.data);
          } else {
            this.error.set(response.message || 'Não foi possível salvar a nota.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível salvar a nota.');
          return EMPTY;
        }),
        finalize(() => this.isSavingNote.set(false)),
      )
      .subscribe();
  }

  reset(): void {
    this.submission.set(null);
    this.isLoading.set(false);
    this.isMoving.set(false);
    this.isSavingNote.set(false);
    this.error.set(null);
  }
}
