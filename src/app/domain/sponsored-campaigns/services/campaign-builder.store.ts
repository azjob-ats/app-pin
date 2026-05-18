import { computed, Injectable, signal } from '@angular/core';
import {
  Campaign,
  CampaignProjection,
  PricingCalendar,
} from '@shared/interfaces/entity/campaign';
import { EligibleVideo } from '@shared/interfaces/entity/sponsored-campaigns';

export type WizardStep = 1 | 2 | 3 | 4;

export interface SelectedHour {
  date: string; // ISO date (yyyy-mm-dd, derived from PricingDay.date)
  hour: number;
}

@Injectable({ providedIn: 'root' })
export class CampaignBuilderStore {
  readonly step = signal<WizardStep>(1);
  readonly keyword = signal<string>('');
  readonly windowFrom = signal<string | null>(null);
  readonly selectedHours = signal<SelectedHour[]>([]);
  readonly videoId = signal<string | null>(null);

  readonly pricingCalendar = signal<PricingCalendar | null>(null);
  readonly pricingLoading = signal<boolean>(false);
  readonly eligibleVideos = signal<EligibleVideo[]>([]);
  readonly videosLoading = signal<boolean>(false);
  readonly projection = signal<CampaignProjection | null>(null);
  readonly projectionLoading = signal<boolean>(false);

  readonly isSubmitting = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly createdCampaign = signal<Campaign | null>(null);

  readonly keywordReady = computed(() => this.keyword().trim().length >= 3);
  readonly windowReady = computed(
    () => this.windowFrom() !== null && this.selectedHours().length > 0,
  );
  readonly videoReady = computed(() => {
    const id = this.videoId();
    if (!id) return false;
    const list = this.eligibleVideos();
    return list.some((v) => v.id === id && v.eligible);
  });

  readonly hoursIndex = computed(() => {
    const index = new Set<string>();
    for (const h of this.selectedHours()) {
      index.add(`${h.date}|${h.hour}`);
    }
    return index;
  });

  readonly totalCost = computed(() => {
    const calendar = this.pricingCalendar();
    if (!calendar) return 0;
    const index = this.hoursIndex();
    let sum = 0;
    for (const day of calendar.days) {
      const key = day.date.toISOString().slice(0, 10);
      for (const cell of day.hours) {
        if (index.has(`${key}|${cell.hour}`)) sum += cell.price;
      }
    }
    return sum;
  });

  readonly selectedHoursWithPrice = computed(() => {
    const calendar = this.pricingCalendar();
    if (!calendar) return [];
    const index = this.hoursIndex();
    const result: { date: string; hour: number; price: number }[] = [];
    for (const day of calendar.days) {
      const key = day.date.toISOString().slice(0, 10);
      for (const cell of day.hours) {
        if (index.has(`${key}|${cell.hour}`)) {
          result.push({ date: day.date.toISOString(), hour: cell.hour, price: cell.price });
        }
      }
    }
    return result;
  });

  readonly selectedVideo = computed(() => {
    const id = this.videoId();
    if (!id) return null;
    return this.eligibleVideos().find((v) => v.id === id) ?? null;
  });

  setStep(step: WizardStep): void {
    this.step.set(step);
  }

  setKeyword(keyword: string): void {
    this.keyword.set(keyword);
  }

  setWindowFrom(date: string | null): void {
    if (this.windowFrom() === date) return;
    this.windowFrom.set(date);
    this.selectedHours.set([]);
  }

  toggleHour(date: string, hour: number): void {
    this.selectedHours.update((list) => {
      const idx = list.findIndex((h) => h.date === date && h.hour === hour);
      if (idx >= 0) {
        const next = list.slice();
        next.splice(idx, 1);
        return next;
      }
      return [...list, { date, hour }];
    });
  }

  selectAllHoursForDay(date: string, hours: number[]): void {
    this.selectedHours.update((list) => {
      const filtered = list.filter((h) => h.date !== date);
      const additions = hours.map((hour) => ({ date, hour }));
      return [...filtered, ...additions];
    });
  }

  clearDay(date: string): void {
    this.selectedHours.update((list) => list.filter((h) => h.date !== date));
  }

  setVideoId(id: string | null): void {
    this.videoId.set(id);
  }

  setPricingCalendar(calendar: PricingCalendar | null): void {
    this.pricingCalendar.set(calendar);
  }

  setEligibleVideos(videos: EligibleVideo[]): void {
    this.eligibleVideos.set(videos);
  }

  setProjection(projection: CampaignProjection | null): void {
    this.projection.set(projection);
  }

  setPricingLoading(loading: boolean): void {
    this.pricingLoading.set(loading);
  }

  setVideosLoading(loading: boolean): void {
    this.videosLoading.set(loading);
  }

  setProjectionLoading(loading: boolean): void {
    this.projectionLoading.set(loading);
  }

  setSubmitting(submitting: boolean): void {
    this.isSubmitting.set(submitting);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setCreatedCampaign(campaign: Campaign | null): void {
    this.createdCampaign.set(campaign);
  }

  reset(): void {
    this.step.set(1);
    this.keyword.set('');
    this.windowFrom.set(null);
    this.selectedHours.set([]);
    this.videoId.set(null);
    this.pricingCalendar.set(null);
    this.projection.set(null);
    this.error.set(null);
    this.createdCampaign.set(null);
  }
}
