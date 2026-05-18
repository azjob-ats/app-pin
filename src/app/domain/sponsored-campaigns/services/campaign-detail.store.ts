import { computed, Injectable, signal } from '@angular/core';
import { Campaign } from '@shared/interfaces/entity/campaign';

@Injectable({ providedIn: 'root' })
export class CampaignDetailStore {
  readonly campaign = signal<Campaign | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly hasData = computed(() => this.campaign() !== null);

  setCampaign(campaign: Campaign | null): void {
    this.campaign.set(campaign);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }
}
