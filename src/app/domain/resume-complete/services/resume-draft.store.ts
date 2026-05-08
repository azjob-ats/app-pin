import { Injectable, computed, signal } from '@angular/core';
import { ResumeTrack, TrackProgressStatus } from '@shared/enums/resume-track.enum';
import { ResumeDraft, ResumePayload, TrackProgress } from '@shared/interfaces/entity/resume';
import { RESUME_TRACKS } from '@domain/resume-complete/tokens/resume-tracks.config';

export type SavingState = 'idle' | 'saving' | 'saved' | 'error';

@Injectable({ providedIn: 'root' })
export class ResumeDraftStore {
  readonly draft = signal<ResumeDraft | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly loadError = signal<string | null>(null);
  readonly savingState = signal<SavingState>('idle');
  readonly savingError = signal<string | null>(null);
  readonly activeTrack = signal<ResumeTrack | null>(null);
  readonly publishError = signal<string | null>(null);

  readonly tracks = computed<TrackProgress[]>(() => {
    const draft = this.draft();
    if (!draft) {
      return RESUME_TRACKS.map(() => ({
        status: TrackProgressStatus.Empty,
        completion: 0,
        lastSavedAt: null,
      }));
    }
    return RESUME_TRACKS.map((def) => draft.tracks[def.id]);
  });

  readonly completedCount = computed(() =>
    this.tracks().filter((t) => t.status === TrackProgressStatus.Completed).length,
  );

  readonly totalTracks = RESUME_TRACKS.length;

  readonly progress = computed(() => this.completedCount() / this.totalTracks);

  readonly canPublish = computed(() => this.completedCount() >= 5);

  readonly payload = computed<ResumePayload | null>(() => this.draft()?.payload ?? null);

  setDraft(draft: ResumeDraft): void {
    this.draft.set(draft);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setLoadError(error: string | null): void {
    this.loadError.set(error);
  }

  setActiveTrack(track: ResumeTrack | null): void {
    this.activeTrack.set(track);
  }

  setSaving(state: SavingState, error: string | null = null): void {
    this.savingState.set(state);
    this.savingError.set(error);
  }

  setPublishError(error: string | null): void {
    this.publishError.set(error);
  }

  reset(): void {
    this.draft.set(null);
    this.isLoading.set(false);
    this.loadError.set(null);
    this.activeTrack.set(null);
    this.savingState.set('idle');
    this.savingError.set(null);
    this.publishError.set(null);
  }
}
