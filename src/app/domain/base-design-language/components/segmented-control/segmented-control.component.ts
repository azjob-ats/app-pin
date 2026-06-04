import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  contentChildren,
  effect,
  input,
  model,
  signal,
} from '@angular/core';

/** Segment — uma opção do SegmentedControl. */
@Component({
  selector: 'bui-segment',
  exportAs: 'buiSegment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  host: {
    role: 'tab',
    class: 'bui-segment',
    '[class.bui-segment--active]': 'active()',
    '[attr.aria-selected]': 'active()',
    '(click)': 'pick()',
  },
})
export class Segment {
  readonly key = input.required<string>();
  readonly active = signal(false);
  /** Setado pelo pai. */
  onSelect: (key: string) => void = () => {};
  protected pick(): void { this.onSelect(this.key()); }
}

/** SegmentedControl — fiel ao baseui/segmented-control (FILL fixed/intrinsic, indicador ativo). */
@Component({
  selector: 'bui-segmented-control',
  exportAs: 'buiSegmentedControl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content select="bui-segment" />',
  styles: `
    bui-segmented-control { display:inline-flex; gap:var(--bw-sizing-scale200); padding:var(--bw-sizing-scale100); border-radius:var(--bw-radius-300); background:var(--bw-background-secondary); }
    bui-segmented-control[data-fill="fixed"] { display:flex; }
    bui-segmented-control[data-fill="fixed"] .bui-segment { flex:1; }
    .bui-segment { display:inline-flex; align-items:center; justify-content:center; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); border-radius:var(--bw-radius-200); font:var(--bw-font-LabelMedium); color:var(--bw-content-secondary); cursor:pointer; transition:background-color var(--bw-timing-200) var(--bw-ease-out), color var(--bw-timing-200) var(--bw-ease-out); }
    .bui-segment:hover { color:var(--bw-content-primary); }
    .bui-segment--active { background:var(--bw-background-primary); color:var(--bw-content-primary); box-shadow:var(--bw-shadow-400); }
  `,
  host: { role: 'tablist', '[attr.data-fill]': 'fill()' },
})
export class SegmentedControl {
  readonly activeKey = model<string>('');
  readonly fill = input<'fixed' | 'intrinsic'>('intrinsic');
  private readonly segments = contentChildren(Segment);

  constructor() {
    effect(() => {
      const active = this.activeKey();
      for (const s of this.segments()) {
        s.active.set(s.key() === active);
        s.onSelect = (k) => this.activeKey.set(k);
      }
    });
  }
}

@Component({
  selector: 'bui-s-segmented-control', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [SegmentedControl, Segment],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
    <bui-segmented-control [activeKey]="'all'">
      <bui-segment key="all">All</bui-segment>
      <bui-segment key="active">Active</bui-segment>
      <bui-segment key="archived">Archived</bui-segment>
    </bui-segmented-control>
  </div>`,
})
export class SegmentedControlScenario {}
