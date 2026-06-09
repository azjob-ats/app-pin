import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiStepper } from './stepper.component';

/** Scenario portada de `src/stepper/__tests__/stepper.scenario.tsx`. */
@Component({
  selector: 'bui-s-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStepper],
  template: `
    <div>
      <bui-stepper [value]="value()" (valueChange)="value.set($event)" />
      <bui-stepper [value]="0" [disabled]="true" (valueChange)="value.set($event)" />
    </div>
  `,
})
export class StepperScenario {
  protected readonly value = signal(0);
}
