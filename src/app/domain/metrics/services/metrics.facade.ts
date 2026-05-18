import { inject, Injectable } from '@angular/core';
import { MetricsApi } from '@shared/apis/metrics.api';
import { MetricsPeriod } from '@shared/enums/metrics-period.enum';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { MetricsOverviewQueryRequest } from '@shared/interfaces/dto/request/metrics';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { MetricsStore } from './metrics.store';

@Injectable({ providedIn: 'root' })
export class MetricsFacade {
  private readonly api = inject(MetricsApi);
  private readonly store = inject(MetricsStore);

  readonly overview = this.store.overview;
  readonly period = this.store.period;
  readonly kpis = this.store.kpis;
  readonly topVideos = this.store.topVideos;
  readonly growth = this.store.growth;
  readonly insights = this.store.insights;
  readonly selectedVideo = this.store.selectedVideo;
  readonly selectedVideoId = this.store.selectedVideoId;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly hasData = this.store.hasData;

  load(): void {
    const query: MetricsOverviewQueryRequest = { period: this.store.period() };
    this.store.setLoading(true);
    this.store.setError(null);

    this.api
      .overview(query)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setOverview(response.data);
          } else {
            this.store.setError(response.message || 'Erro ao carregar métricas.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar métricas.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setPeriod(period: MetricsPeriod): void {
    if (this.store.period() === period) return;
    this.store.setPeriod(period);
    this.load();
  }

  selectVideo(id: string | null): void {
    this.store.selectVideo(id);
  }
}
