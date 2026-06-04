import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type BadgeColor = 'accent' | 'primary' | 'positive' | 'negative' | 'warning';
export type BadgeShape = 'pill' | 'rectangle';
export type BadgeHierarchy = 'primary' | 'secondary';

/** Badge — fiel ao baseui/badge (altura 20px; cores accent/positive/negative/warning; pill/rectangle). */
@Component({
  selector: 'bui-badge',
  exportAs: 'buiBadge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `
    bui-badge {
      display:inline-flex; align-items:center; height:var(--bw-sizing-scale700);
      padding:0 var(--bw-sizing-scale300); border-radius:999px;
      font:var(--bw-font-LabelXSmall); white-space:nowrap;
    }
    bui-badge[data-shape="rectangle"] { border-radius:var(--bw-radius-200); padding:0 var(--bw-sizing-scale100); }
    /* primary (sólido) */
    bui-badge[data-color="accent"] { background:var(--bw-background-accent); color:var(--bw-content-on-color); }
    bui-badge[data-color="primary"] { background:var(--bw-background-inverse-primary); color:var(--bw-content-inverse-primary); }
    bui-badge[data-color="positive"] { background:var(--bw-background-positive); color:var(--bw-content-on-color); }
    bui-badge[data-color="negative"] { background:var(--bw-background-negative); color:var(--bw-content-on-color); }
    bui-badge[data-color="warning"] { background:var(--bw-background-warning); color:var(--bw-content-primary); }
    /* secondary (light) */
    bui-badge[data-hier="secondary"][data-color="accent"] { background:var(--bw-background-accent-light); color:var(--bw-content-accent); }
    bui-badge[data-hier="secondary"][data-color="positive"] { background:var(--bw-background-positive-light); color:var(--bw-content-positive); }
    bui-badge[data-hier="secondary"][data-color="negative"] { background:var(--bw-background-negative-light); color:var(--bw-content-negative); }
    bui-badge[data-hier="secondary"][data-color="warning"] { background:var(--bw-background-warning-light); color:var(--bw-content-warning); }
  `,
  host: { '[attr.data-color]': 'color()', '[attr.data-shape]': 'shape()', '[attr.data-hier]': 'hierarchy()' },
})
export class Badge {
  readonly color = input<BadgeColor>('accent');
  readonly shape = input<BadgeShape>('pill');
  readonly hierarchy = input<BadgeHierarchy>('primary');
}

@Component({
  selector: 'bui-s-badge', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Badge],
  template: `<div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
    <div style="display:flex; gap:8px;">
      <bui-badge color="accent">Accent</bui-badge>
      <bui-badge color="positive">Positive</bui-badge>
      <bui-badge color="negative">Negative</bui-badge>
      <bui-badge color="warning">Warning</bui-badge>
      <bui-badge color="primary">Primary</bui-badge>
    </div>
    <div style="display:flex; gap:8px;">
      <bui-badge color="accent" hierarchy="secondary">Accent</bui-badge>
      <bui-badge color="positive" hierarchy="secondary">Positive</bui-badge>
      <bui-badge color="negative" hierarchy="secondary">Negative</bui-badge>
      <bui-badge color="warning" hierarchy="secondary">Warning</bui-badge>
    </div>
    <bui-badge color="accent" shape="rectangle">Rectangle</bui-badge>
  </div>`,
})
export class BadgeScenario {}
