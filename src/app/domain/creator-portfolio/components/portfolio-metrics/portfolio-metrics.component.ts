import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { PortfolioMetrics } from '@shared/interfaces/entity/creator-portfolio';

interface MetricItem {
  label: string;
  value: string;
  hint?: string;
}

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
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
      <div class="portfolio-metrics__grid">
        @for (item of items(); track item.label) {
          <article class="portfolio-metrics__item">
            <span class="portfolio-metrics__value">{{ item.value }}</span>
            <span class="portfolio-metrics__label">{{ item.label }}</span>
            @if (item.hint) {
              <span class="portfolio-metrics__hint">{{ item.hint }}</span>
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
  readonly followers = input<number>(0);

  readonly items = computed<MetricItem[]>(() => {
    const m = this.metrics();
    return [
      {
        label: 'Seguidores',
        value: NUMBER_FORMATTER.format(this.followers()),
      },
      {
        label: 'Visualizações',
        value: NUMBER_FORMATTER.format(m.totalViews),
      },
      {
        label: 'Conteúdos',
        value: NUMBER_FORMATTER.format(m.totalContents),
      },
      {
        label: 'Retenção',
        value: PERCENT_FORMATTER.format(m.averageRetention),
        hint: 'média',
      },
      {
        label: 'Conversão',
        value: PERCENT_FORMATTER.format(m.conversionRate),
        hint: m.rankingVertical ? `#${m.rankingVertical} na vertical` : undefined,
      },
    ];
  });
}
