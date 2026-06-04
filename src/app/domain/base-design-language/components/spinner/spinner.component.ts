import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type SpinnerSize = 'small' | 'medium' | 'large';

/** Spinner — fiel ao baseui/spinner (anel girando, cor contentAccent, timing1000). */
@Component({
  selector: 'bui-spinner',
  exportAs: 'buiSpinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  styles: `
    bui-spinner {
      display:inline-block; box-sizing:border-box; border-radius:50%;
      border-style:solid; border-color: color-mix(in srgb, var(--bw-content-accent) 22%, transparent);
      border-top-color: var(--bw-content-accent);
      animation: bui-spin var(--bw-timing-1000) var(--bw-ease-linear) infinite;
    }
    bui-spinner[data-size="small"] { width:24px; height:24px; border-width:2px; }
    bui-spinner[data-size="medium"] { width:32px; height:32px; border-width:4px; }
    bui-spinner[data-size="large"] { width:40px; height:40px; border-width:8px; }
    @keyframes bui-spin { to { transform: rotate(360deg); } }
  `,
  host: { role: 'progressbar', 'aria-label': 'loading', '[attr.data-size]': 'size()' },
})
export class Spinner {
  readonly size = input<SpinnerSize>('medium');
}

@Component({
  selector: 'bui-s-spinner', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Spinner],
  template: `<div style="display:flex; gap:24px; align-items:center;">
    <bui-spinner size="small" /><bui-spinner size="medium" /><bui-spinner size="large" />
  </div>`,
})
export class SpinnerScenario {}
