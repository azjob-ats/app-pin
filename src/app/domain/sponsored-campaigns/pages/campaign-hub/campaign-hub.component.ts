import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { CampaignSummaryCardComponent } from '@domain/sponsored-campaigns/components/campaign-summary-card/campaign-summary-card.component';
import {
  CampaignListFacade,
} from '@domain/sponsored-campaigns/services/campaign-list.facade';
import { CampaignTab } from '@domain/sponsored-campaigns/services/campaign-list.store';

@Component({
  selector: 'app-campaign-hub',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, EmptyStateComponent, CampaignSummaryCardComponent],
  templateUrl: './campaign-hub.component.html',
  styleUrl: './campaign-hub.component.scss',
})
export class CampaignHubComponent implements OnInit {
  private readonly facade = inject(CampaignListFacade);

  readonly tab = this.facade.tab;
  readonly visibleCampaigns = this.facade.visibleCampaigns;
  readonly activeCount = this.facade.activeCount;
  readonly historyCount = this.facade.historyCount;
  readonly hasItems = this.facade.hasItems;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;

  readonly skeletonRows = [0, 1, 2];
  readonly newCampaignLink = `/${environment.ROUTES.SPONSORED_CAMPAIGNS.NEW}`;
  readonly metricsLink = `/${environment.ROUTES.METRICS.ROOT}`;

  readonly emptyMessage = computed(() =>
    this.tab() === 'active'
      ? 'Nenhuma campanha em andamento'
      : 'Sem histórico de campanhas ainda',
  );

  readonly emptySubtitle = computed(() =>
    this.tab() === 'active'
      ? 'Crie sua primeira campanha patrocinada qualificada — slot único, vendido por hora.'
      : 'Campanhas concluídas e canceladas aparecem aqui.',
  );

  ngOnInit(): void {
    this.facade.load();
  }

  onTabChange(tab: CampaignTab): void {
    this.facade.setTab(tab);
  }
}
