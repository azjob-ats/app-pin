import { computed, Injectable, signal } from '@angular/core';
import { MetricsPeriod } from '@shared/enums/metrics-period.enum';
import { MetricsOverview } from '@shared/interfaces/entity/metrics';

@Injectable({ providedIn: 'root' })
export class MetricsStore {
  readonly overview = signal<MetricsOverview | null>(null);
  readonly period = signal<MetricsPeriod>(MetricsPeriod.Last30Days);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly selectedVideoId = signal<string | null>(null);

  readonly hasData = computed(() => this.overview() !== null);
  readonly topVideos = computed(() => this.overview()?.topVideos ?? []);
  readonly growth = computed(() => this.overview()?.growth ?? []);
  readonly insights = computed(() => this.overview()?.insights ?? []);
  readonly kpis = computed(() => this.overview()?.kpis ?? null);

  readonly selectedVideo = computed(() => {
    const id = this.selectedVideoId();
    if (!id) return null;
    return this.topVideos().find((video) => video.id === id) ?? null;
  });

  setOverview(overview: MetricsOverview): void {
    this.overview.set(overview);
    const current = this.selectedVideoId();
    const stillExists = current && overview.topVideos.some((v) => v.id === current);
    if (!stillExists) {
      this.selectedVideoId.set(overview.topVideos[0]?.id ?? null);
    }
  }

  setPeriod(period: MetricsPeriod): void {
    this.period.set(period);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  selectVideo(id: string | null): void {
    this.selectedVideoId.set(id);
  }
}
