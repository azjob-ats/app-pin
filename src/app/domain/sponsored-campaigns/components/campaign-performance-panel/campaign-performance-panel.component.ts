import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { Campaign } from '@shared/interfaces/entity/campaign';

@Component({
  selector: 'app-campaign-performance-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DecimalPipe, CurrencyPipe],
  template: `
    <section class="campaign-performance" aria-labelledby="performance-title">
      <header class="campaign-performance__head">
        <h2 class="campaign-performance__title" id="performance-title">Performance</h2>
        @if (campaign().performance) {
          <span class="campaign-performance__live">
            <span class="campaign-performance__live-dot" aria-hidden="true"></span>
            Atualizado agora
          </span>
        }
      </header>

      @if (campaign().performance; as perf) {
        <dl class="campaign-performance__grid">
          <div class="campaign-performance__cell">
            <dt>Impressões</dt>
            <dd>{{ perf.impressions | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Cliques</dt>
            <dd>{{ perf.clicks | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>CTR</dt>
            <dd>{{ perf.ctr | number: '1.1-2' }}%</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Conversões</dt>
            <dd class="is-accent">{{ perf.conversions | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Custo / conversão</dt>
            <dd>{{ perf.costPerConversion | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Gasto / restante</dt>
            <dd>
              {{ perf.spent | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
              <span class="campaign-performance__remaining">
                / {{ perf.remaining | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
              </span>
            </dd>
          </div>
        </dl>

        @if (campaign().totalCost > 0) {
          <div class="campaign-performance__progress">
            <div class="campaign-performance__progress-head">
              <span class="campaign-performance__progress-label">Orçamento consumido</span>
              <span class="campaign-performance__progress-value">{{ spentPercent() }}%</span>
            </div>
            <div class="campaign-performance__progress-track">
              <span
                class="campaign-performance__progress-bar"
                [style.width.%]="spentPercent()"
              ></span>
            </div>
          </div>
        }
      } @else if (campaign().projection; as proj) {
        <p class="campaign-performance__pending">
          Ainda sem dados reais. Projeção feita no momento da criação:
        </p>
        <dl class="campaign-performance__grid">
          <div class="campaign-performance__cell">
            <dt>Impressões (est.)</dt>
            <dd>{{ proj.estimatedImpressions | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Cliques (est.)</dt>
            <dd>{{ proj.estimatedClicks | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Conversões (est.)</dt>
            <dd class="is-accent">{{ proj.estimatedConversions | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Score</dt>
            <dd>{{ proj.relevanceScore | number: '1.0-0' }}</dd>
          </div>
          <div class="campaign-performance__cell">
            <dt>Prob. de vencer</dt>
            <dd>{{ winLabel(proj.winProbability) }}</dd>
          </div>
        </dl>
      } @else {
        <p class="campaign-performance__pending">
          Performance e projeção indisponíveis para esta campanha.
        </p>
      }
    </section>
  `,
  styleUrl: './campaign-performance-panel.component.scss',
})
export class CampaignPerformancePanelComponent {
  readonly campaign = input.required<Campaign>();

  readonly spentPercent = computed(() => {
    const c = this.campaign();
    const perf = c.performance;
    if (!perf || c.totalCost <= 0) return 0;
    return Math.min(100, Math.round((perf.spent / c.totalCost) * 100));
  });

  winLabel(probability: number): string {
    return `${Math.round(probability * 100)}%`;
  }
}
