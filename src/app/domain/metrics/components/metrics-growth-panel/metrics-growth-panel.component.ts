import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { ChannelGrowthPoint } from '@shared/interfaces/entity/metrics';

const SVG_HEIGHT = 32;

interface BarView {
  date: Date;
  subscribers: number;
  views: number;
  subBarHeight: number;
  viewBarHeight: number;
}

@Component({
  selector: 'app-metrics-growth-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, DecimalPipe],
  template: `
    <section class="metrics-growth" aria-labelledby="metrics-growth-title">
      <header class="metrics-growth__head">
        <h2 class="metrics-growth__title" id="metrics-growth-title">Crescimento do canal</h2>
        <p class="metrics-growth__subtitle">
          Como os vídeos publicados afetaram inscritos e views ao longo do período.
        </p>
      </header>

      <div class="metrics-growth__totals" aria-label="Totais do período">
        <div class="metrics-growth__total">
          <span class="metrics-growth__total-label">Novos inscritos</span>
          <strong class="metrics-growth__total-value">+{{ subscribersTotal() | number: '1.0-0' }}</strong>
        </div>
        <div class="metrics-growth__total">
          <span class="metrics-growth__total-label">Views no período</span>
          <strong class="metrics-growth__total-value">{{ viewsTotal() | number: '1.0-0' }}</strong>
        </div>
      </div>

      <figure class="metrics-growth__figure">
        <svg
          class="metrics-growth__svg"
          viewBox="0 0 100 36"
          preserveAspectRatio="none"
          role="img"
          aria-label="Crescimento por dia"
        >
          @for (bar of bars(); track bar.date; let i = $index) {
            @let column = (i * 100) / bars().length;
            @let columnWidth = 100 / bars().length;
            <rect
              [attr.x]="column + columnWidth * 0.15"
              [attr.y]="32 - bar.viewBarHeight"
              [attr.width]="columnWidth * 0.35"
              [attr.height]="bar.viewBarHeight"
              class="metrics-growth__bar metrics-growth__bar--views"
            />
            <rect
              [attr.x]="column + columnWidth * 0.55"
              [attr.y]="32 - bar.subBarHeight"
              [attr.width]="columnWidth * 0.35"
              [attr.height]="bar.subBarHeight"
              class="metrics-growth__bar metrics-growth__bar--subs"
            />
          }
          <line x1="0" x2="100" y1="32" y2="32" class="metrics-growth__axis" />
        </svg>

        <figcaption class="metrics-growth__legend">
          <span class="metrics-growth__legend-item">
            <span class="metrics-growth__legend-dot metrics-growth__legend-dot--views"></span>
            Views
          </span>
          <span class="metrics-growth__legend-item">
            <span class="metrics-growth__legend-dot metrics-growth__legend-dot--subs"></span>
            Inscritos
          </span>
        </figcaption>
      </figure>

      <ul class="metrics-growth__table" aria-label="Detalhes por dia">
        @for (bar of bars(); track bar.date) {
          <li class="metrics-growth__row">
            <time
              class="metrics-growth__row-date"
              [attr.datetime]="bar.date.toISOString()"
            >
              {{ bar.date | date: 'dd MMM' }}
            </time>
            <span class="metrics-growth__row-value">{{ bar.views | number: '1.0-0' }} views</span>
            <span class="metrics-growth__row-value metrics-growth__row-value--accent">
              +{{ bar.subscribers | number: '1.0-0' }} inscritos
            </span>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './metrics-growth-panel.component.scss',
})
export class MetricsGrowthPanelComponent {
  readonly points = input.required<ChannelGrowthPoint[]>();

  readonly subscribersTotal = computed(() =>
    this.points().reduce((sum, point) => sum + point.subscribers, 0),
  );

  readonly viewsTotal = computed(() =>
    this.points().reduce((sum, point) => sum + point.views, 0),
  );

  readonly bars = computed<BarView[]>(() => {
    const list = this.points();
    if (list.length === 0) return [];
    const maxSubs = Math.max(...list.map((p) => p.subscribers), 1);
    const maxViews = Math.max(...list.map((p) => p.views), 1);

    return list.map((point) => ({
      date: point.date,
      subscribers: point.subscribers,
      views: point.views,
      subBarHeight: (point.subscribers / maxSubs) * SVG_HEIGHT,
      viewBarHeight: (point.views / maxViews) * SVG_HEIGHT,
    }));
  });
}
