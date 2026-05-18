import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { WizardStep } from '@domain/sponsored-campaigns/services/campaign-builder.store';

interface StepInfo {
  index: WizardStep;
  label: string;
}

const STEPS: StepInfo[] = [
  { index: 1, label: 'Palavra-chave' },
  { index: 2, label: 'Janela e horas' },
  { index: 3, label: 'Vídeo' },
  { index: 4, label: 'Checkout' },
];

@Component({
  selector: 'app-wizard-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol class="wizard-stepper" aria-label="Etapas da nova campanha">
      @for (step of steps; track step.index; let i = $index) {
        <li
          class="wizard-stepper__item"
          [class.is-current]="step.index === current()"
          [class.is-done]="step.index < current()"
        >
          <span class="wizard-stepper__index" aria-hidden="true">
            @if (step.index < current()) {
              <span class="material-symbols-rounded">check</span>
            } @else {
              {{ step.index }}
            }
          </span>
          <span class="wizard-stepper__label">{{ step.label }}</span>
          @if (i < steps.length - 1) {
            <span class="wizard-stepper__line" aria-hidden="true"></span>
          }
        </li>
      }
    </ol>
  `,
  styleUrl: './wizard-stepper.component.scss',
})
export class WizardStepperComponent {
  readonly current = input.required<WizardStep>();
  readonly steps = STEPS;
}
