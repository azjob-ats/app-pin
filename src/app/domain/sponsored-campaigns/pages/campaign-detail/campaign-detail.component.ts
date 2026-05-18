import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { environment } from '@env/environment';
import { CampaignStatus } from '@shared/enums/campaign-status.enum';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { CampaignPerformancePanelComponent } from '@domain/sponsored-campaigns/components/campaign-performance-panel/campaign-performance-panel.component';
import { CampaignStatusBadgeComponent } from '@domain/sponsored-campaigns/components/campaign-status-badge/campaign-status-badge.component';
import { CampaignDetailFacade } from '@domain/sponsored-campaigns/services/campaign-detail.facade';
import { CampaignListFacade } from '@domain/sponsored-campaigns/services/campaign-list.facade';
import { take } from 'rxjs';

@Component({
  selector: 'app-campaign-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    RouterLink,
    EmptyStateComponent,
    CampaignStatusBadgeComponent,
    CampaignPerformancePanelComponent,
  ],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.scss',
})
export class CampaignDetailComponent implements OnInit {
  private readonly facade = inject(CampaignDetailFacade);
  private readonly listFacade = inject(CampaignListFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly campaign = this.facade.campaign;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly hasData = this.facade.hasData;

  readonly hubLink = `/${environment.ROUTES.SPONSORED_CAMPAIGNS.ROOT}`;
  readonly newCampaignLink = `/${environment.ROUTES.SPONSORED_CAMPAIGNS.NEW}`;

  readonly canCancel = computed(() => {
    const c = this.campaign();
    if (!c) return false;
    return (
      c.status === CampaignStatus.Pending ||
      c.status === CampaignStatus.Scheduled ||
      c.status === CampaignStatus.Running
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.facade.load(id);
  }

  onCancel(): void {
    const c = this.campaign();
    if (!c) return;
    this.listFacade
      .cancel(c.id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.facade.load(c.id));
  }
}
