import { inject, Injectable } from '@angular/core';
import { CampaignsApi } from '@shared/apis/campaigns.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { CampaignDetailStore } from './campaign-detail.store';

@Injectable({ providedIn: 'root' })
export class CampaignDetailFacade {
  private readonly api = inject(CampaignsApi);
  private readonly store = inject(CampaignDetailStore);

  readonly campaign = this.store.campaign;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly hasData = this.store.hasData;

  load(id: string): void {
    this.store.setLoading(true);
    this.store.setError(null);
    this.api
      .detail(id)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.store.setCampaign(response.data);
          } else {
            this.store.setError(response.message || 'Erro ao carregar campanha.');
          }
        }),
        catchError((err: ApiResponse) => {
          this.store.setError(err?.message || 'Erro ao carregar campanha.');
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  clear(): void {
    this.store.setCampaign(null);
  }
}
