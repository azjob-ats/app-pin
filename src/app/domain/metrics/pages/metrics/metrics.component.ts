import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { MetricsPeriod } from '@shared/enums/metrics-period.enum';
import { MetricsGrowthPanelComponent } from '@domain/metrics/components/metrics-growth-panel/metrics-growth-panel.component';
import {
  MetricsHeroComponent,
  MetricsHeroStat,
} from '@domain/metrics/components/metrics-hero/metrics-hero.component';
import { MetricsInsightsComponent } from '@domain/metrics/components/metrics-insights/metrics-insights.component';
import { MetricsPeriodFilterComponent } from '@domain/metrics/components/metrics-period-filter/metrics-period-filter.component';
import { MetricsVideoCardComponent } from '@domain/metrics/components/metrics-video-card/metrics-video-card.component';
import { MetricsFacade } from '@domain/metrics/services/metrics.facade';

function compactNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (value < 1000) return value.toString();
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

function formatMinutes(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

@Component({
  selector: 'app-metrics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    EmptyStateComponent,
    MetricsHeroComponent,
    MetricsPeriodFilterComponent,
    MetricsVideoCardComponent,
    MetricsGrowthPanelComponent,
    MetricsInsightsComponent,
  ],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss',
})
export class MetricsComponent implements OnInit {
  private readonly facade = inject(MetricsFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly kpis = this.facade.kpis;
  readonly topVideos = this.facade.topVideos;
  readonly growth = this.facade.growth;
  readonly insights = this.facade.insights;
  readonly selectedVideoId = this.facade.selectedVideoId;
  readonly period = this.facade.period;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;
  readonly hasData = this.facade.hasData;

  readonly skeletonCards = [0, 1, 2, 3];
  readonly homeLink = `/${environment.ROUTES.HOME.ROOT}`;

  readonly heroStats = computed<MetricsHeroStat[]>(() => {
    const k = this.kpis();
    if (!k) {
      return [
        { label: 'Views', value: '—' },
        { label: 'Watch time médio', value: '—' },
        { label: 'Retenção média', value: '—' },
        { label: 'Inscritos novos', value: '—' },
        { label: 'Conversões', value: '—' },
      ];
    }
    return [
      {
        label: 'Views',
        value: compactNumber(k.totalViews),
        delta: k.viewsChangePercent,
      },
      {
        label: 'Watch time médio',
        value: formatMinutes(k.avgWatchTimeSeconds),
        delta: k.watchTimeChangePercent,
        hint: 'por sessão',
      },
      {
        label: 'Retenção média',
        value: `${Math.round(k.avgRetentionPercent)}%`,
        delta: k.retentionChangePercent,
      },
      {
        label: 'Inscritos novos',
        value: `+${compactNumber(k.totalSubscribers)}`,
        delta: k.subscribersChangePercent,
      },
      {
        label: 'Conversões',
        value: compactNumber(k.totalConversions),
        hint: 'cliques em "Saiba mais"',
      },
    ];
  });

  ngOnInit(): void {
    this.hydratePeriodFromUrl();
    this.facade.load();
  }

  onPeriodChange(period: MetricsPeriod): void {
    this.facade.setPeriod(period);
    this.syncUrl();
  }

  onSelectVideo(id: string): void {
    this.facade.selectVideo(id);
  }

  private hydratePeriodFromUrl(): void {
    const raw = this.route.snapshot.queryParamMap.get('period');
    const allowed = Object.values(MetricsPeriod) as string[];
    if (raw && allowed.includes(raw)) {
      this.facade.setPeriod(raw as MetricsPeriod);
    }
  }

  private syncUrl(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { period: this.period() },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
