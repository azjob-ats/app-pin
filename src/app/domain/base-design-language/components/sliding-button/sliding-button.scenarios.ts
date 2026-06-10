import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiSlidingButton } from './sliding-button.component';

/** Scenarios portadas de `src/sliding-button/__tests__/*.scenario.tsx`. */

// sliding-button.scenario.tsx — botão único "Slide to confirm" (threshold high default).
@Component({
  selector: 'bui-s-sliding-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSlidingButton],
  template: `<bui-sliding-button label="Slide to confirm" />`,
})
export class SlidingButtonScenario {}

// sliding-button-low-threshold.scenario.tsx — threshold low + slideBackAfterMs 1500.
@Component({
  selector: 'bui-s-sliding-button-low-threshold',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSlidingButton],
  template: `<bui-sliding-button label="Slide to confirm" threshold="low" [slideBackAfterMs]="1500" />`,
})
export class SlidingButtonLowThresholdScenario {}

// sliding-button-states.scenario.tsx — default / loading (2s) / disabled.
@Component({
  selector: 'bui-s-sliding-button-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSlidingButton],
  template: `<div style="display:flex;flex-direction:column;gap:16px">
    <bui-sliding-button label="Slide to confirm" />
    <bui-sliding-button label="Slide to confirm" [isLoading]="loading()" (complete)="onComplete()" />
    <bui-sliding-button label="Slide to confirm" isDisabled />
  </div>`,
})
export class SlidingButtonStatesScenario {
  protected readonly loading = signal(false);
  protected onComplete(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }
}
