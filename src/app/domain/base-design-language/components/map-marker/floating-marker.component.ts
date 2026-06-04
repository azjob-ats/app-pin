import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { MarkerKind, PinheadSize } from './fixed-marker.component';

const KIND_BG: Record<MarkerKind, string> = {
  default: 'var(--bw-background-inverse-primary, var(--bw-content-primary))',
  accent: 'var(--bw-background-accent)',
  negative: 'var(--bw-background-negative)',
};
const HEAD_H: Record<PinheadSize, number> = { small: 24, medium: 36, large: 48 };

export type AnchorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** FloatingMarker — fiel ao baseui/map-marker/floating-marker (pinhead + conector + âncora 16px). */
@Component({
  selector: 'bui-floating-marker',
  exportAs: 'buiFloatingMarker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-flm" [attr.data-anchor]="anchor()">
      <div class="bui-flm__head" [style.background]="bg()" [style.height.px]="headH()">
        @if (startIcon()) { <span class="material-symbols-rounded bui-flm__icon">{{ startIcon() }}</span> }
        <span class="bui-flm__label">{{ label() }}</span>
      </div>
      <span class="bui-flm__anchor" [style.background]="bg()"></span>
    </div>
  `,
  styles: `
    .bui-flm { position:relative; display:inline-flex; flex-direction:column; align-items:flex-start; }
    .bui-flm[data-anchor='top-right'], .bui-flm[data-anchor='bottom-right'] { align-items:flex-end; }
    .bui-flm__head { display:inline-flex; align-items:center; gap:8px; padding:0 8px; border-radius:8px; color:var(--bw-content-inverse-primary); box-shadow:var(--bw-lighting-shadow600, 0 4px 12px rgba(0,0,0,.2)); }
    .bui-flm__label { font:var(--bw-font-LabelMedium); white-space:nowrap; }
    .bui-flm__icon { font-size:16px; line-height:1; }
    .bui-flm__anchor { width:16px; height:16px; border-radius:50%; border:3px solid var(--bw-background-primary); box-sizing:border-box; margin-top:6px; }
    .bui-flm[data-anchor='top-left'] .bui-flm__anchor, .bui-flm[data-anchor='top-right'] .bui-flm__anchor { order:-1; margin-top:0; margin-bottom:6px; }
  `,
})
export class FloatingMarker {
  readonly kind = input<MarkerKind>('default');
  readonly size = input<PinheadSize>('medium');
  readonly label = input<string>('Label');
  readonly startIcon = input<string>('');
  readonly anchor = input<AnchorPosition>('bottom-left');

  protected readonly bg = computed(() => KIND_BG[this.kind()]);
  protected readonly headH = computed(() => HEAD_H[this.size()]);
}

@Component({
  selector: 'bui-s-floating-marker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FloatingMarker],
  template: `<div style="display:flex; gap:48px; align-items:flex-start; padding:24px; background:var(--bw-background-secondary);">
    <bui-floating-marker label="Coffee shop" startIcon="local_cafe" />
    <bui-floating-marker kind="accent" label="Your driver" startIcon="local_taxi" anchor="bottom-right" />
  </div>`,
})
export class FloatingMarkerScenario {}
