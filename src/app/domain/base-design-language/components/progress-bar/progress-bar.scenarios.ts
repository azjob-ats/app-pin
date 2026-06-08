import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation, signal } from '@angular/core';
import { ProgressBar, ProgressBarRounded } from './progress-bar.component';

/** Scenarios portadas de `src/progress-bar/__tests__/*.scenario.tsx`. */

// progressbar.scenario.tsx — 7 barras lineares (tamanhos, ranges, steps, infinite).
@Component({
  selector: 'bui-s-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBar],
  template: `
    <bui-progress-bar [value]="20" showLabel size="small" />
    <br />
    <bui-progress-bar [value]="120" [minValue]="100" [maxValue]="200" showLabel />
    <br />
    <bui-progress-bar [value]="20" showLabel />
    <br />
    <bui-progress-bar [value]="20" showLabel size="large" />
    <br />
    <bui-progress-bar [value]="20" showLabel size="large" [steps]="5" />
    <br />
    <bui-progress-bar [value]="120" [minValue]="100" [maxValue]="200" showLabel size="large" [steps]="10" />
    <br />
    <bui-progress-bar infinite />
  `,
})
export class ProgressbarScenario {}

// progressbar-intent.scenario.tsx — todos os intents (determinado, indeterminado, tamanhos, segmentado).
@Component({
  selector: 'bui-s-progressbar-intent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBar],
  template: `
    <h3>Determinate - All Intents</h3>
    <bui-progress-bar [value]="50" showLabel intent="default" /><br />
    <bui-progress-bar [value]="50" showLabel intent="positive" /><br />
    <bui-progress-bar [value]="50" showLabel intent="warning" /><br />
    <bui-progress-bar [value]="50" showLabel intent="negative" /><br />
    <bui-progress-bar [value]="50" showLabel intent="brand" /><br />

    <h3>Indeterminate - All Intents</h3>
    <bui-progress-bar infinite showLabel intent="default" /><br />
    <bui-progress-bar infinite showLabel intent="positive" /><br />
    <bui-progress-bar infinite showLabel intent="warning" /><br />
    <bui-progress-bar infinite showLabel intent="negative" /><br />
    <bui-progress-bar infinite showLabel intent="brand" /><br />

    <h3>Different Sizes with Intent</h3>
    <bui-progress-bar [value]="60" showLabel size="small" intent="positive" /><br />
    <bui-progress-bar [value]="60" showLabel size="medium" intent="warning" /><br />
    <bui-progress-bar [value]="60" showLabel size="large" intent="negative" /><br />

    <h3>Segmented with Intent</h3>
    <bui-progress-bar [value]="60" showLabel [steps]="5" intent="positive" /><br />
    <bui-progress-bar [value]="60" showLabel [steps]="5" intent="warning" /><br />
    <bui-progress-bar [value]="60" showLabel [steps]="5" intent="negative" />
  `,
})
export class ProgressbarIntentScenario {}

// progressbar-negative.scenario.tsx — 1 barra value=20 com BarProgress bg negative (override).
@Component({
  selector: 'bui-s-progressbar-negative',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBar],
  template: `<bui-progress-bar [value]="20" style="--bui-pb-progress: var(--bw-negative)" />`,
})
export class ProgressbarNegativeScenario {}

// progressbar-rounded.scenario.tsx — 3 rounded (small/medium/large), animate=false, inline.
@Component({
  selector: 'bui-s-progressbar-rounded',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBarRounded],
  template: `
    <bui-progress-bar-rounded [progress]="0.5" size="small" [animate]="false" inline />
    <bui-progress-bar-rounded [progress]="0.5" size="medium" [animate]="false" inline />
    <bui-progress-bar-rounded [progress]="0.5" size="large" [animate]="false" inline />
  `,
})
export class ProgressbarRoundedScenario {}

// progressbar-rounded-animated.scenario.tsx — 3 rounded com progress subindo (~0.165/0.5s).
@Component({
  selector: 'bui-s-progressbar-rounded-animated',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBarRounded],
  template: `
    <bui-progress-bar-rounded [progress]="progress()" size="small" />
    <br />
    <bui-progress-bar-rounded [progress]="progress()" size="medium" />
    <br />
    <bui-progress-bar-rounded [progress]="progress()" size="large" />
  `,
})
export class ProgressbarRoundedAnimatedScenario implements OnDestroy {
  protected readonly progress = signal(0);
  private timer: ReturnType<typeof setTimeout> | undefined;
  constructor() {
    const tick = () => {
      this.progress.update((p) => p + 0.5 * 0.33);
      if (this.progress() < 1) this.timer = setTimeout(tick, 0.5 * 1000);
    };
    tick();
  }
  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}

// progressbar-rounded-overrides.scenario.tsx — 1 rounded progress 0.5 animate=false + overrides.
@Component({
  selector: 'bui-s-progressbar-rounded-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBarRounded],
  template: `<bui-progress-bar-rounded
    [progress]="0.5"
    [animate]="false"
    style="--bui-pbr-w:433.33px;--bui-pbr-h:200px;--bui-pbr-track:pink;--bui-pbr-fg:red;--bui-pbr-text-color:red;--bui-pbr-text-size:48px"
  />`,
})
export class ProgressbarRoundedOverridesScenario {}
