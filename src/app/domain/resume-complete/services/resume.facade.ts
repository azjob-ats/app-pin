import { Injectable, inject } from '@angular/core';
import { ResumeApi } from '@shared/apis/resume.api';
import { ResumeTrack } from '@shared/enums/resume-track.enum';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { ResumePayloadResponse } from '@shared/interfaces/dto/response/resume';
import { CreatorPortfolio } from '@shared/interfaces/entity/creator-portfolio';
import { Observable, catchError, EMPTY, finalize, map, of, tap } from 'rxjs';

import { ResumeDraftStore } from './resume-draft.store';

@Injectable({ providedIn: 'root' })
export class ResumeFacade {
  private readonly api = inject(ResumeApi);
  private readonly store = inject(ResumeDraftStore);

  readonly draft = this.store.draft;
  readonly tracks = this.store.tracks;
  readonly progress = this.store.progress;
  readonly completedCount = this.store.completedCount;
  readonly totalTracks = this.store.totalTracks;
  readonly canPublish = this.store.canPublish;
  readonly payload = this.store.payload;
  readonly activeTrack = this.store.activeTrack;
  readonly isLoading = this.store.isLoading;
  readonly loadError = this.store.loadError;
  readonly savingState = this.store.savingState;
  readonly savingError = this.store.savingError;
  readonly publishError = this.store.publishError;

  load(): void {
    if (this.store.draft()) return;
    this.store.setLoading(true);
    this.store.setLoadError(null);

    this.api
      .getDraft()
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setDraft(response.data);
          } else {
            this.store.setLoadError(response.message || 'Erro ao carregar currículo.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setLoadError(err?.message || 'Erro ao carregar currículo.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  openTrack(track: ResumeTrack | null): void {
    this.store.setActiveTrack(track);
  }

  saveTrack(track: ResumeTrack, patch: Partial<ResumePayloadResponse>): Observable<unknown> {
    this.store.setSaving('saving');
    return this.api.saveTrack({ trackId: track, payload: patch }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.store.setDraft(response.data);
          this.store.setSaving('saved');
        } else {
          this.store.setSaving('error', response.message || 'Erro ao salvar.');
        }
      }),
      catchError((err: ApiResponse) => {
        this.store.setSaving('error', err?.message || 'Erro ao salvar.');
        return of(null);
      }),
    );
  }

  publish(): Observable<CreatorPortfolio | null> {
    this.store.setPublishError(null);
    return this.api.publish().pipe(
      tap((response) => {
        if (!response.success) {
          this.store.setPublishError(response.message || 'Erro ao publicar.');
        }
      }),
      map((response) => (response.success && response.data ? response.data : null)),
      catchError((err: ApiResponse) => {
        this.store.setPublishError(err?.message || 'Erro ao publicar.');
        return of<CreatorPortfolio | null>(null);
      }),
    );
  }

  reset(): void {
    this.store.reset();
  }
}
