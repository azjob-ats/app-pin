import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export interface MetricsHeroStat {
  label: string;
  value: string;
  delta?: number | null;
  hint?: string;
}

@Component({
  selector: 'app-metrics-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="metrics-hero">
      <div class="metrics-hero__inner">
        <div class="metrics-hero__intro">
          <span class="metrics-hero__eyebrow">Painel do criador</span>
          <h1 class="metrics-hero__title" id="metrics-title">Métricas</h1>
          <p class="metrics-hero__subtitle">
            Veja o que prendeu, o que converteu e onde a audiência caiu — aprenda com o seu
            próprio conteúdo.
          </p>
        </div>

        <dl class="metrics-hero__stats" aria-label="Resumo das métricas">
          @for (stat of stats(); track stat.label) {
            <div class="metrics-hero__stat">
              <dt class="metrics-hero__stat-label">{{ stat.label }}</dt>
              <dd class="metrics-hero__stat-value">{{ stat.value }}</dd>
              @if (stat.delta != null) {
                <span
                  class="metrics-hero__stat-delta"
                  [class.is-up]="stat.delta > 0"
                  [class.is-down]="stat.delta < 0"
                  [class.is-flat]="stat.delta === 0"
                  [attr.aria-label]="
                    stat.delta > 0
                      ? 'aumento de ' + stat.delta + '%'
                      : stat.delta < 0
                        ? 'queda de ' + (-stat.delta) + '%'
                        : 'sem variação'
                  "
                >
                  <span class="metrics-hero__stat-delta-icon" aria-hidden="true">
                    @if (stat.delta > 0) {
                      ↑
                    } @else if (stat.delta < 0) {
                      ↓
                    } @else {
                      —
                    }
                  </span>
                  {{ stat.delta > 0 ? '+' : '' }}{{ stat.delta }}%
                </span>
              }
              @if (stat.hint) {
                <span class="metrics-hero__stat-hint">{{ stat.hint }}</span>
              }
            </div>
          }
        </dl>

        <div class="metrics-hero__slot">
          <ng-content></ng-content>
        </div>
      </div>
    </header>
  `,
  styleUrl: './metrics-hero.component.scss',
})
export class MetricsHeroComponent {
  readonly stats = input.required<MetricsHeroStat[]>();
}
