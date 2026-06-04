import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

export type ProgressIntent = 'default' | 'positive' | 'warning' | 'negative';

/** ProgressBar — fiel ao baseui/progress-bar (determinate/infinite, size, intent). */
@Component({
  selector: 'bui-progress-bar',
  exportAs: 'buiProgressBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (label()) { <div class="bui-pb__label">{{ label() }}</div> }
    <div class="bui-pb__track">
      @if (infinite()) {
        <div class="bui-pb__inf"></div>
      } @else {
        <div class="bui-pb__bar" [style.width.%]="value()"></div>
      }
    </div>
  `,
  styles: `
    bui-progress-bar { display:block; }
    .bui-pb__label { font:var(--bw-font-LabelSmall); color:var(--bw-content-secondary); margin-bottom:var(--bw-sizing-scale200); }
    .bui-pb__track { position:relative; overflow:hidden; width:100%; border-radius:999px; background:var(--bw-background-tertiary); height:8px; }
    bui-progress-bar[data-size="small"] .bui-pb__track { height:4px; }
    bui-progress-bar[data-size="large"] .bui-pb__track { height:12px; }
    .bui-pb__bar { height:100%; border-radius:999px; background:var(--bui-pb-color, var(--bw-content-accent)); transition:width var(--bw-timing-300) var(--bw-ease-out); }
    .bui-pb__inf { position:absolute; top:0; left:0; height:100%; width:40%; border-radius:999px; background:var(--bui-pb-color, var(--bw-content-accent)); animation:bui-pb-inf 1.4s var(--bw-ease-in-out) infinite; }
    @keyframes bui-pb-inf { 0% { left:-40%; } 100% { left:100%; } }
  `,
  host: { role: 'progressbar', '[attr.data-size]': 'size()', '[style.--bui-pb-color]': 'color()' },
})
export class ProgressBar {
  readonly value = input<number>(0);
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly intent = input<ProgressIntent>('default');
  readonly infinite = input(false);
  readonly label = input<string>('');
  protected readonly color = computed(() => {
    const map: Record<ProgressIntent, string> = {
      default: 'var(--bw-content-accent)', positive: 'var(--bw-content-positive)',
      warning: 'var(--bw-content-warning)', negative: 'var(--bw-content-negative)',
    };
    return map[this.intent()];
  });
}

@Component({
  selector: 'bui-s-progress-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [ProgressBar],
  template: `<div style="display:flex; flex-direction:column; gap:20px; width:360px;">
    <bui-progress-bar [value]="35" label="35%" />
    <bui-progress-bar [value]="70" intent="positive" size="large" />
    <bui-progress-bar [infinite]="true" />
  </div>`,
})
export class ProgressBarScenario {}
