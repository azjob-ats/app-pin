import { inject, Injectable } from '@angular/core';
import { CampaignsApi } from '@shared/apis/campaigns.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Campaign } from '@shared/interfaces/entity/campaign';
import { catchError, EMPTY, finalize, map, Observable, tap } from 'rxjs';

import { CampaignBuilderStore, WizardStep } from './campaign-builder.store';

@Injectable({ providedIn: 'root' })
export class CampaignBuilderFacade {
  private readonly api = inject(CampaignsApi);
  private readonly store = inject(CampaignBuilderStore);

  readonly step = this.store.step;
  readonly keyword = this.store.keyword;
  readonly windowFrom = this.store.windowFrom;
  readonly selectedHours = this.store.selectedHours;
  readonly hoursIndex = this.store.hoursIndex;
  readonly totalCost = this.store.totalCost;
  readonly selectedHoursWithPrice = this.store.selectedHoursWithPrice;
  readonly videoId = this.store.videoId;
  readonly selectedVideo = this.store.selectedVideo;
  readonly pricingCalendar = this.store.pricingCalendar;
  readonly eligibleVideos = this.store.eligibleVideos;
  readonly projection = this.store.projection;

  readonly pricingLoading = this.store.pricingLoading;
  readonly videosLoading = this.store.videosLoading;
  readonly projectionLoading = this.store.projectionLoading;
  readonly isSubmitting = this.store.isSubmitting;
  readonly error = this.store.error;
  readonly createdCampaign = this.store.createdCampaign;

  readonly keywordReady = this.store.keywordReady;
  readonly windowReady = this.store.windowReady;
  readonly videoReady = this.store.videoReady;

  setStep(step: WizardStep): void {
    this.store.setStep(step);
  }

  goNext(): void {
    const current = this.store.step();
    if (current === 1 && this.store.keywordReady()) this.store.setStep(2);
    else if (current === 2 && this.store.windowReady()) this.store.setStep(3);
    else if (current === 3 && this.store.videoReady()) {
      this.store.setStep(4);
      this.loadProjection();
    }
  }

  goBack(): void {
    const current = this.store.step();
    if (current > 1) this.store.setStep((current - 1) as WizardStep);
  }

  setKeyword(keyword: string): void {
    this.store.setKeyword(keyword);
  }

  setWindowFrom(date: string | null): void {
    this.store.setWindowFrom(date);
    if (date && this.store.keyword().trim()) {
      this.loadPricingCalendar(this.store.keyword().trim(), date);
    } else {
      this.store.setPricingCalendar(null);
    }
  }

  toggleHour(date: string, hour: number): void {
    this.store.toggleHour(date, hour);
  }

  selectAllHoursForDay(date: string, hours: number[]): void {
    this.store.selectAllHoursForDay(date, hours);
  }

  clearDay(date: string): void {
    this.store.clearDay(date);
  }

  setVideoId(id: string | null): void {
    this.store.setVideoId(id);
  }

  loadPricingCalendar(keyword: string, from: string): void {
    this.store.setPricingLoading(true);
    this.store.setError(null);
    this.api
      .pricingCalendar({ keyword, from })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setPricingCalendar(response.data);
          } else {
            this.store.setError(response.message || 'Erro ao carregar calendário.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar calendário.');
          return EMPTY;
        }),
        finalize(() => this.store.setPricingLoading(false)),
      )
      .subscribe();
  }

  loadEligibleVideos(): void {
    this.store.setVideosLoading(true);
    this.api
      .eligibleVideos()
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setEligibleVideos(response.data);
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar vídeos.');
          return EMPTY;
        }),
        finalize(() => this.store.setVideosLoading(false)),
      )
      .subscribe();
  }

  loadProjection(): void {
    const videoId = this.store.videoId();
    const hours = this.store.selectedHours();
    if (!videoId || hours.length === 0) return;

    this.store.setProjectionLoading(true);
    this.api
      .projection({
        keyword: this.store.keyword().trim(),
        videoId,
        hours,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setProjection(response.data);
          }
        }),
        catchError(() => EMPTY),
        finalize(() => this.store.setProjectionLoading(false)),
      )
      .subscribe();
  }

  submit(): Observable<Campaign | null> {
    const videoId = this.store.videoId();
    const hours = this.store.selectedHours();
    const keyword = this.store.keyword().trim();
    if (!videoId || hours.length === 0 || !keyword) return EMPTY;

    this.store.setSubmitting(true);
    this.store.setError(null);

    return this.api.create({ keyword, videoId, hours }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.store.setCreatedCampaign(response.data);
        } else {
          this.store.setError(response.message || 'Não foi possível criar a campanha.');
        }
      }),
      map((response): Campaign | null => response.data ?? null),
      catchError((err: ApiResponse) => {
        this.store.setError(err?.message || 'Não foi possível criar a campanha.');
        return EMPTY;
      }),
      finalize(() => this.store.setSubmitting(false)),
    );
  }

  reset(): void {
    this.store.reset();
  }
}
