import { computed, Injectable, signal } from '@angular/core';
import { CampaignStatus } from '@shared/enums/campaign-status.enum';
import { Campaign } from '@shared/interfaces/entity/campaign';

export type CampaignTab = 'active' | 'history';

const ACTIVE_STATUSES: ReadonlySet<CampaignStatus> = new Set([
  CampaignStatus.Pending,
  CampaignStatus.Scheduled,
  CampaignStatus.Running,
]);

@Injectable({ providedIn: 'root' })
export class CampaignListStore {
  readonly items = signal<Campaign[]>([]);
  readonly total = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly tab = signal<CampaignTab>('active');

  readonly activeCampaigns = computed(() =>
    this.items().filter((c) => ACTIVE_STATUSES.has(c.status)),
  );
  readonly historyCampaigns = computed(() =>
    this.items().filter((c) => !ACTIVE_STATUSES.has(c.status)),
  );
  readonly visibleCampaigns = computed(() =>
    this.tab() === 'active' ? this.activeCampaigns() : this.historyCampaigns(),
  );
  readonly activeCount = computed(() => this.activeCampaigns().length);
  readonly historyCount = computed(() => this.historyCampaigns().length);
  readonly hasItems = computed(() => this.visibleCampaigns().length > 0);

  setItems(items: Campaign[], total: number): void {
    this.items.set(items);
    this.total.set(total);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  setTab(tab: CampaignTab): void {
    this.tab.set(tab);
  }

  replaceCampaign(updated: Campaign): void {
    this.items.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
  }

  prependCampaign(campaign: Campaign): void {
    this.items.update((list) => [campaign, ...list]);
    this.total.update((n) => n + 1);
  }
}
