import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

export type MarkerKind = 'default' | 'accent' | 'negative';
export type PinheadSize = 'small' | 'medium' | 'large';
export type NeedleSize = 'none' | 'short' | 'medium' | 'tall';

const KIND_BG: Record<MarkerKind, string> = {
  default: 'var(--bw-background-inverse-primary, var(--bw-content-primary))',
  accent: 'var(--bw-background-accent)',
  negative: 'var(--bw-background-negative)',
};
const HEAD_H: Record<PinheadSize, number> = { small: 24, medium: 36, large: 48 };
const ICON: Record<PinheadSize, number> = { small: 16, medium: 16, large: 24 };
const NEEDLE_H: Record<NeedleSize, number> = { none: 0, short: 4, medium: 12, tall: 20 };

/** FixedMarker — fiel ao baseui/map-marker/fixed-marker (pinhead pílula/círculo + agulha). */
@Component({
  selector: 'bui-fixed-marker',
  exportAs: 'buiFixedMarker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-fm">
      <div
        class="bui-fm__head"
        [class.bui-fm__head--circle]="!label()"
        [style.background]="bg()"
        [style.height.px]="headH()"
        [style.min-width.px]="label() ? null : headH()"
        [style.border-radius.px]="headH()"
      >
        @if (startIcon()) { <span class="material-symbols-rounded bui-fm__icon" [style.font-size.px]="iconSize()">{{ startIcon() }}</span> }
        @if (label()) { <span class="bui-fm__label">{{ label() }}</span> }
      </div>
      @if (needle() !== 'none') {
        <span class="bui-fm__needle" [style.background]="bg()" [style.height.px]="needleH()"></span>
        <span class="bui-fm__dot" [style.background]="bg()"></span>
      }
    </div>
  `,
  styles: `
    .bui-fm { display:inline-flex; flex-direction:column; align-items:center; }
    .bui-fm__head { display:flex; align-items:center; justify-content:center; gap:8px; padding:0 12px; box-sizing:border-box; color:var(--bw-content-inverse-primary); box-shadow:var(--bw-lighting-shadow600, 0 4px 12px rgba(0,0,0,.2)); }
    .bui-fm__head--circle { padding:0; }
    .bui-fm__label { font:var(--bw-font-LabelMedium); white-space:nowrap; }
    .bui-fm__icon { line-height:1; }
    .bui-fm__needle { width:2px; }
    .bui-fm__dot { width:6px; height:6px; border-radius:50%; margin-top:-1px; }
  `,
})
export class FixedMarker {
  readonly kind = input<MarkerKind>('default');
  readonly size = input<PinheadSize>('medium');
  readonly needle = input<NeedleSize>('medium');
  readonly label = input<string>('');
  readonly startIcon = input<string>('');

  protected readonly bg = computed(() => KIND_BG[this.kind()]);
  protected readonly headH = computed(() => HEAD_H[this.size()]);
  protected readonly iconSize = computed(() => ICON[this.size()]);
  protected readonly needleH = computed(() => NEEDLE_H[this.needle()]);
}

@Component({
  selector: 'bui-s-fixed-marker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FixedMarker],
  template: `<div style="display:flex; gap:32px; align-items:flex-start; padding:24px; background:var(--bw-background-secondary);">
    <bui-fixed-marker label="Pickup" startIcon="location_on" />
    <bui-fixed-marker kind="accent" label="Uber HQ" />
    <bui-fixed-marker kind="negative" startIcon="close" />
    <bui-fixed-marker kind="accent" size="large" label="Airport" startIcon="flight" />
  </div>`,
})
export class FixedMarkerScenario {}
