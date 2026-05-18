import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { Campaign } from '@shared/interfaces/entity/campaign';
import { CampaignStatusBadgeComponent } from '@domain/sponsored-campaigns/components/campaign-status-badge/campaign-status-badge.component';

@Component({
  selector: 'app-campaign-summary-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, DecimalPipe, CurrencyPipe, RouterLink, CampaignStatusBadgeComponent],
  template: `
    <a class="campaign-summary" [routerLink]="detailLink()">
      <div class="campaign-summary__media">
        <img
          class="campaign-summary__image"
          [src]="campaign().video.thumbnailUrl"
          alt=""
          loading="lazy"
        />
      </div>

      <div class="campaign-summary__body">
        <header class="campaign-summary__head">
          <app-campaign-status-badge [status]="campaign().status" />
          <p class="campaign-summary__keyword">
            <span class="material-symbols-rounded" aria-hidden="true">search</span>
            {{ campaign().keyword }}
          </p>
        </header>

        <h3 class="campaign-summary__title">{{ campaign().video.title }}</h3>

        <p class="campaign-summary__credit">
          <span>{{ campaign().video.channelName }}</span>
          <span class="campaign-summary__by">by</span>
          <span>{{ campaign().video.creatorName }}</span>
        </p>

        <dl class="campaign-summary__stats">
          <div class="campaign-summary__stat">
            <dt>Janela</dt>
            <dd>
              {{ campaign().windowFrom | date: 'dd MMM' }}
              <span aria-hidden="true">→</span>
              {{ campaign().windowTo | date: 'dd MMM' }}
            </dd>
          </div>
          <div class="campaign-summary__stat">
            <dt>Horas</dt>
            <dd>{{ campaign().hours.length | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-summary__stat">
            <dt>Investimento</dt>
            <dd class="campaign-summary__stat-amount">
              {{ campaign().totalCost | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
            </dd>
          </div>
          @if (campaign().performance; as perf) {
            <div class="campaign-summary__stat">
              <dt>Conversões</dt>
              <dd>{{ perf.conversions | number: '1.0-0' }}</dd>
            </div>
          }
        </dl>
      </div>

      <span class="campaign-summary__arrow material-symbols-rounded" aria-hidden="true">
        chevron_right
      </span>
    </a>
  `,
  styleUrl: './campaign-summary-card.component.scss',
})
export class CampaignSummaryCardComponent {
  readonly campaign = input.required<Campaign>();
  readonly detailLink = computed(
    () => `/${environment.ROUTES.SPONSORED_CAMPAIGNS.DETAIL_PATH}/${this.campaign().id}`,
  );
}
