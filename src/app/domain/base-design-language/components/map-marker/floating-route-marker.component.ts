import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { MarkerKind } from './fixed-marker.component';

const KIND_BG: Record<MarkerKind, string> = {
  default: 'var(--bw-background-inverse-primary, var(--bw-content-primary))',
  accent: 'var(--bw-background-accent)',
  negative: 'var(--bw-background-negative)',
};

/** FloatingRouteMarker — fiel ao baseui/map-marker/floating-route-marker (pílula 8px com label + secundário). */
@Component({
  selector: 'bui-floating-route-marker',
  exportAs: 'buiFloatingRouteMarker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-frm" [style.background]="bg()">
      @if (startIcon()) { <span class="material-symbols-rounded bui-frm__icon">{{ startIcon() }}</span> }
      <span class="bui-frm__label">{{ label() }}</span>
      @if (secondaryLabel()) { <span class="bui-frm__sec">{{ secondaryLabel() }}</span> }
    </div>
  `,
  styles: `
    .bui-frm { display:inline-flex; align-items:center; gap:6px; height:36px; padding:0 12px; border-radius:8px; color:var(--bw-content-inverse-primary); box-shadow:var(--bw-lighting-shadow600, 0 4px 12px rgba(0,0,0,.2)); }
    .bui-frm__icon { font-size:18px; line-height:1; }
    .bui-frm__label { font:var(--bw-font-LabelMedium); white-space:nowrap; }
    .bui-frm__sec { font:var(--bw-font-LabelSmall); opacity:.7; white-space:nowrap; }
  `,
})
export class FloatingRouteMarker {
  readonly kind = input<MarkerKind>('accent');
  readonly label = input<string>('12 min');
  readonly secondaryLabel = input<string>('');
  readonly startIcon = input<string>('');
  protected readonly bg = computed(() => KIND_BG[this.kind()]);
}

@Component({
  selector: 'bui-s-floating-route-marker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FloatingRouteMarker],
  template: `<div style="display:flex; gap:32px; align-items:center; padding:24px; background:var(--bw-background-secondary);">
    <bui-floating-route-marker label="12 min" secondaryLabel="3.4 mi" startIcon="directions_car" />
    <bui-floating-route-marker kind="default" label="Fastest route" startIcon="route" />
  </div>`,
})
export class FloatingRouteMarkerScenario {}
