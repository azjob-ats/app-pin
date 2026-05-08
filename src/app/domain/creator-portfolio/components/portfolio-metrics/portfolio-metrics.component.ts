import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { PortfolioMetrics } from '@shared/interfaces/entity/creator-portfolio';

interface MetricCard {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR');
const PERCENT_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 1,
});

@Component({
  selector: 'app-portfolio-metrics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="portfolio-metrics" aria-label="Métricas auditáveis">
      <h2 class="portfolio-metrics__title">Métricas auditáveis</h2>
      <div class="portfolio-metrics__grid">
        @for (card of cards(); track card.label) {
          <article class="portfolio-metrics__card">
            <span class="material-symbols-rounded portfolio-metrics__icon" aria-hidden="true">
              {{ card.icon }}
            </span>
            <span class="portfolio-metrics__value">{{ card.value }}</span>
            <span class="portfolio-metrics__label">{{ card.label }}</span>
            @if (card.hint) {
              <span class="portfolio-metrics__hint">{{ card.hint }}</span>
            }
          </article>
        }
      </div>
    </section>
  `,
  styleUrl: './portfolio-metrics.component.scss',
})
export class PortfolioMetricsComponent {
  readonly metrics = input.required<PortfolioMetrics>();

  readonly cards = computed<MetricCard[]>(() => {
    const m = this.metrics();
    return [
      {
        icon: 'play_arrow',
        label: 'Conteúdos publicados',
        value: NUMBER_FORMATTER.format(m.totalContents),
      },
      {
        icon: 'visibility',
        label: 'Visualizações totais',
        value: NUMBER_FORMATTER.format(m.totalViews),
      },
      {
        icon: 'timeline',
        label: 'Retenção média',
        value: PERCENT_FORMATTER.format(m.averageRetention),
        hint: 'Quanto do conteúdo as pessoas assistem',
      },
      {
        icon: 'trending_up',
        label: 'Conversão',
        value: PERCENT_FORMATTER.format(m.conversionRate),
        hint: m.rankingVertical ? `#${m.rankingVertical} na vertical` : 'Cliques em "Saiba Mais"',
      },
    ];
  });
}
