import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { MetricsInsight } from '@shared/interfaces/entity/metrics';

const TONE_ICONS: Record<string, string> = {
  positive: 'trending_up',
  warning: 'priority_high',
  neutral: 'insights',
};

@Component({
  selector: 'app-metrics-insights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="metrics-insights" aria-labelledby="metrics-insights-title">
      <header class="metrics-insights__head">
        <h2 class="metrics-insights__title" id="metrics-insights-title">O que aprender</h2>
        <p class="metrics-insights__subtitle">
          Sinais práticos do que funcionou — e do que precisa ajustar — neste período.
        </p>
      </header>

      <ul class="metrics-insights__list" role="list">
        @for (insight of insights(); track insight.id) {
          <li class="metrics-insights__item" [class]="'tone-' + insight.tone">
            <span class="material-symbols-rounded metrics-insights__icon" aria-hidden="true">
              {{ iconFor(insight.tone) }}
            </span>
            <div class="metrics-insights__body">
              <h3 class="metrics-insights__item-title">{{ insight.title }}</h3>
              <p class="metrics-insights__message">{{ insight.message }}</p>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './metrics-insights.component.scss',
})
export class MetricsInsightsComponent {
  readonly insights = input.required<MetricsInsight[]>();

  iconFor(tone: string): string {
    return TONE_ICONS[tone] ?? TONE_ICONS['neutral'];
  }
}
