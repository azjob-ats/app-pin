import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import { Button } from '../button/button.component';

export type BannerHierarchy = 'low' | 'high';
export type BannerKind = 'info' | 'negative' | 'positive' | 'warning';
export type BannerActionPosition = 'trailing' | 'below';
export type BannerArtworkType = 'icon' | 'badge';

export interface BannerAction {
  label?: string;
  icon?: boolean;
  position?: BannerActionPosition;
  onClick: () => void;
}

export interface BannerArtwork {
  type?: BannerArtworkType;
}

interface BannerColorSet {
  bg: string;
  color: string;
  actionBg: string;
}

const LOW_COLORS: Record<BannerKind, BannerColorSet> = {
  info:     { bg: 'var(--bw-background-accent-light)',   color: 'var(--bw-content-primary)', actionBg: '#dee9fe' },
  negative: { bg: 'var(--bw-background-negative-light)', color: 'var(--bw-content-primary)', actionBg: '#ffe1de' },
  positive: { bg: 'var(--bw-background-positive-light)', color: 'var(--bw-content-primary)', actionBg: '#d3efda' },
  warning:  { bg: 'var(--bw-background-warning-light)',  color: 'var(--bw-content-primary)', actionBg: '#fbe5b6' },
};

const HIGH_COLORS: Record<BannerKind, BannerColorSet> = {
  info:     { bg: 'var(--bw-background-accent)',    color: 'var(--bw-content-on-color)',  actionBg: '#175bcc' },
  negative: { bg: 'var(--bw-background-negative)',  color: 'var(--bw-content-on-color)',  actionBg: '#bb032a' },
  positive: { bg: 'var(--bw-background-positive)',  color: 'var(--bw-content-on-color)',  actionBg: '#166c3b' },
  warning:  { bg: 'var(--bw-background-warning)',   color: 'var(--bw-content-primary)',   actionBg: '#ffd688' },
};

@Component({
  selector: 'bui-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  styleUrl: './banner.component.scss',
  template: `
    <div
      class="bui-banner"
      [class.bui-banner--nested]="nested()"
      data-baseweb="banner"
      role="complementary"
      [attr.aria-label]="ariaLabel()"
      [style.background-color]="colors().bg"
      [style.color]="colors().color"
    >
      <!-- Leading: artwork icon -->
      <div class="bui-banner__leading" [class.bui-banner__leading--artwork]="artwork()">
        <ng-content select="[buiBannerArtwork]" />
      </div>

      <!-- Message content (title + body) -->
      <div
        class="bui-banner__message-content"
        [class.bui-banner__message-content--trailing]="isTrailing()"
      >
        @if (title()) {
          <div class="bui-banner__title">{{ title() }}</div>
        }
        <div class="bui-banner__message"><ng-content /></div>
      </div>

      <!-- Trailing content: icon-button or text-button -->
      <div class="bui-banner__trailing">
        @if (action() && isTrailing()) {
          @if (action()!.icon) {
            <button
              class="bui-banner__trailing-icon-btn"
              [class.bui-banner__trailing-icon-btn--nested]="nested()"
              [attr.aria-label]="action()!.label"
              (click)="action()!.onClick()"
            >
              <ng-content select="[buiBannerActionIcon]" />
            </button>
          } @else if (action()!.label) {
            <div class="bui-banner__trailing-btn-wrap">
              <bui-button
                size="compact"
                shape="pill"
                [colors]="{ backgroundColor: colors().actionBg, color: colors().color }"
                (buttonClick)="action()!.onClick()"
              >{{ action()!.label }}</bui-button>
            </div>
          }
        }
      </div>

      <!-- Below content: text-button rendered below message -->
      <div class="bui-banner__below" [class.bui-banner__below--active]="isBelow()">
        @if (action() && isBelow() && action()!.label) {
          <bui-button
            size="compact"
            shape="pill"
            [colors]="{ backgroundColor: colors().actionBg, color: colors().color }"
            (buttonClick)="action()!.onClick()"
          >{{ action()!.label }}</bui-button>
        }
      </div>
    </div>
  `,
})
export class BuiBanner {
  readonly hierarchy = input<BannerHierarchy>('low');
  readonly kind = input<BannerKind>('info');
  readonly nested = input(false, { transform: booleanAttribute });
  readonly title = input<string>('');
  readonly artwork = input<BannerArtwork | null>(null);
  readonly action = input<BannerAction | null>(null);
  readonly ariaLabel = input('this is an announcement banner');

  readonly actionDismiss = output<void>();

  readonly colors = computed<BannerColorSet>(() => {
    const map = this.hierarchy() === 'high' ? HIGH_COLORS : LOW_COLORS;
    return map[this.kind()] ?? map['info'];
  });

  readonly isBelow = computed(() => this.action()?.position === 'below');
  readonly isTrailing = computed(() => !this.isBelow());

  readonly artworkSize = computed(() =>
    this.artwork()?.type === 'badge' ? '40' : '32',
  );
}
