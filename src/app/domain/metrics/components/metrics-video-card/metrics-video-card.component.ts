import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { RetentionPoint, VideoMetric } from '@shared/interfaces/entity/metrics';

const SVG_WIDTH = 100;
const SVG_HEIGHT = 36;

interface RetentionMarker {
  x: number;
  y: number;
  label: string;
  className: string;
}

interface RetentionView {
  path: string;
  area: string;
  markers: RetentionMarker[];
}

function formatSeconds(total: number): string {
  if (!Number.isFinite(total) || total < 0) return '0:00';
  const minutes = Math.floor(total / 60);
  const seconds = Math.floor(total % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function compactNumber(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

@Component({
  selector: 'app-metrics-video-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, DecimalPipe],
  template: `
    <article
      class="metrics-video"
      [class.is-selected]="selected()"
      role="button"
      tabindex="0"
      [attr.aria-pressed]="selected()"
      (click)="select.emit(video().id)"
      (keydown.enter)="select.emit(video().id)"
      (keydown.space)="select.emit(video().id); $event.preventDefault()"
    >
      <div class="metrics-video__media">
        <img
          class="metrics-video__image"
          [src]="video().thumbnailUrl"
          alt=""
          loading="lazy"
        />
        <span class="metrics-video__duration">{{ durationLabel() }}</span>
      </div>

      <div class="metrics-video__body">
        <header class="metrics-video__head">
          <h3 class="metrics-video__title">{{ video().title }}</h3>
          <time
            class="metrics-video__date"
            [attr.datetime]="video().publishedAt.toISOString()"
          >
            {{ video().publishedAt | date: 'dd MMM yyyy' }}
          </time>
        </header>

        <dl class="metrics-video__stats">
          <div class="metrics-video__stat">
            <dt>Views</dt>
            <dd>{{ viewsLabel() }}</dd>
          </div>
          <div class="metrics-video__stat">
            <dt>Retenção</dt>
            <dd>{{ video().avgRetentionPercent | number: '1.0-0' }}%</dd>
          </div>
          <div class="metrics-video__stat">
            <dt>Gancho (3s)</dt>
            <dd>{{ video().hookRetentionPercent | number: '1.0-0' }}%</dd>
          </div>
          <div class="metrics-video__stat">
            <dt>Inscritos</dt>
            <dd>+{{ video().subscribersGained | number: '1.0-0' }}</dd>
          </div>
          <div class="metrics-video__stat">
            <dt>Convertidos</dt>
            <dd>{{ video().conversions | number: '1.0-0' }}</dd>
          </div>
        </dl>

        <figure class="metrics-video__chart" aria-label="Curva de retenção">
          <svg
            class="metrics-video__svg"
            viewBox="0 0 100 36"
            preserveAspectRatio="none"
            role="img"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                [attr.id]="'gradient-' + video().id"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path
              [attr.d]="retention().area"
              [attr.fill]="'url(#gradient-' + video().id + ')'"
            />
            <path
              [attr.d]="retention().path"
              fill="none"
              stroke="#ffffff"
              stroke-width="1.1"
              stroke-linejoin="round"
              stroke-linecap="round"
              vector-effect="non-scaling-stroke"
            />
            @for (marker of retention().markers; track marker.label) {
              <circle
                [attr.cx]="marker.x"
                [attr.cy]="marker.y"
                r="1.6"
                [attr.class]="'metrics-video__marker ' + marker.className"
              />
            }
          </svg>
          <figcaption class="metrics-video__chart-legend">
            <span class="metrics-video__chip metrics-video__chip--hook">
              Gancho {{ hookSecondLabel() }}
            </span>
            <span class="metrics-video__chip metrics-video__chip--climax">
              Clímax {{ climaxLabel() }}
            </span>
            <span class="metrics-video__chip metrics-video__chip--drop">
              Queda {{ dropLabel() }}
            </span>
          </figcaption>
        </figure>
      </div>
    </article>
  `,
  styleUrl: './metrics-video-card.component.scss',
})
export class MetricsVideoCardComponent {
  readonly video = input.required<VideoMetric>();
  readonly selected = input<boolean>(false);
  readonly select = output<string>();

  readonly durationLabel = computed(() => formatSeconds(this.video().durationSeconds));
  readonly viewsLabel = computed(() => compactNumber(this.video().views));
  readonly hookSecondLabel = computed(() => `${this.video().hookRetentionPercent}%`);
  readonly climaxLabel = computed(() => formatSeconds(this.video().climaxAtSecond));
  readonly dropLabel = computed(() => formatSeconds(this.video().dropOffAtSecond));

  readonly retention = computed<RetentionView>(() => {
    const v = this.video();
    const curve = v.retentionCurve.length > 0 ? v.retentionCurve : this.fallback(v.durationSeconds);
    const duration = Math.max(v.durationSeconds, curve[curve.length - 1]?.second ?? 1);

    const points = curve.map((point) => this.toPoint(point, duration));
    const path = points
      .map((p, i) => (i === 0 ? `M${p.x.toFixed(2)},${p.y.toFixed(2)}` : `L${p.x.toFixed(2)},${p.y.toFixed(2)}`))
      .join(' ');
    const last = points[points.length - 1];
    const first = points[0];
    const area = `${path} L${last.x.toFixed(2)},${SVG_HEIGHT} L${first.x.toFixed(2)},${SVG_HEIGHT} Z`;

    const markers: RetentionMarker[] = [
      {
        ...this.toPoint({ second: 3, retention: v.hookRetentionPercent }, duration),
        label: 'hook',
        className: 'is-hook',
      },
      {
        ...this.toPoint({ second: v.climaxAtSecond, retention: v.climaxRetentionPercent }, duration),
        label: 'climax',
        className: 'is-climax',
      },
      {
        ...this.toPoint(
          { second: v.dropOffAtSecond, retention: this.retentionAt(curve, v.dropOffAtSecond) },
          duration,
        ),
        label: 'drop',
        className: 'is-drop',
      },
    ];

    return { path, area, markers };
  });

  private toPoint(point: RetentionPoint, duration: number) {
    const safeDuration = duration > 0 ? duration : 1;
    const x = Math.min(SVG_WIDTH, (point.second / safeDuration) * SVG_WIDTH);
    const y = SVG_HEIGHT - (Math.max(0, Math.min(100, point.retention)) / 100) * SVG_HEIGHT;
    return { x, y };
  }

  private fallback(duration: number): RetentionPoint[] {
    const steps = 6;
    const safe = duration > 0 ? duration : 60;
    return Array.from({ length: steps + 1 }, (_, i) => ({
      second: Math.round((safe / steps) * i),
      retention: Math.max(20, 100 - i * 12),
    }));
  }

  private retentionAt(curve: RetentionPoint[], second: number): number {
    if (curve.length === 0) return 0;
    const exact = curve.find((point) => point.second === second);
    if (exact) return exact.retention;
    const sorted = [...curve].sort((a, b) => Math.abs(a.second - second) - Math.abs(b.second - second));
    return sorted[0].retention;
  }
}
