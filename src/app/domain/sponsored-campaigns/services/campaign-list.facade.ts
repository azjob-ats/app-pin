import { inject, Injectable } from '@angular/core';
import { CampaignsApi } from '@shared/apis/campaigns.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';

import { CampaignListStore, CampaignTab } from './campaign-list.store';

@Injectable({ providedIn: 'root' })
export class CampaignListFacade {
  private readonly api = inject(CampaignsApi);
  private readonly store = inject(CampaignListStore);

  readonly items = this.store.items;
  readonly visibleCampaigns = this.store.visibleCampaigns;
  readonly activeCount = this.store.activeCount;
  readonly historyCount = this.store.historyCount;
  readonly tab = this.store.tab;
  readonly hasItems = this.store.hasItems;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  load(): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api
      .list({ page: 1, pageSize: 50 })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setItems(response.data.data ?? [], response.data.totalRecords);
          } else {
            this.store.setError(response.message || 'Erro ao carregar campanhas.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar campanhas.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setTab(tab: CampaignTab): void {
    this.store.setTab(tab);
  }

  cancel(id: string): Observable<unknown> {
    return this.api.cancel(id).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.store.replaceCampaign(response.data);
        } else {
          this.store.setError(response.message || 'Não foi possível cancelar.');
        }
      }),
      catchError((err: ApiResponse) => {
        this.store.setError(err?.message || 'Não foi possível cancelar.');
        return EMPTY;
      }),
    );
  }
}
