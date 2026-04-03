import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface StepDef {
  key: string;
  index: number;
  label: string;
}

@Component({
  selector: 'app-step-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'step-page' },
  template: `
    <nav class="step-page__stepper" aria-label="Etapas">
      @for (s of steps(); track s.key) {
        <div
          class="step-page__step"
          [class.step-page__step--active]="activeStep() === s.key"
          [class.step-page__step--done]="isStepDone(s.key)"
          [attr.aria-current]="activeStep() === s.key ? 'step' : null"
        >
          <span class="step-page__step-dot" aria-hidden="true">
            @if (isStepDone(s.key)) {
              <span class="material-symbols-rounded">check</span>
            } @else {
              {{ s.index }}
            }
          </span>
          <span class="step-page__step-label">{{ s.label }}</span>
        </div>
      }
    </nav>

    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .step-page__stepper {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 0;
    }

    .step-page__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
      flex: 1;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 1rem;
        left: calc(50% + 1rem);
        right: calc(-50% + 1rem);
        height: 2px;
        background: var(--pin-border, rgba(0, 0, 0, 0.12));
        transition: background 0.2s;
      }

      &--done:not(:last-child)::after {
        background: var(--step-page-accent, var(--pin-primary, #e60023));
      }
    }

    .step-page__step-dot {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 2px solid var(--pin-border, rgba(0, 0, 0, 0.15));
      background: var(--pin-surface, #fff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--pin-text);
      opacity: 0.4;
      transition: border-color 0.2s, background 0.2s, color 0.2s, opacity 0.2s;
      z-index: 1;

      .material-symbols-rounded {
        font-size: 1rem;
      }

      .step-page__step--active & {
        border-color: var(--step-page-accent, var(--pin-primary, #e60023));
        color: var(--step-page-accent, var(--pin-primary, #e60023));
        opacity: 1;
      }

      .step-page__step--done & {
        border-color: var(--step-page-accent, var(--pin-primary, #e60023));
        background: var(--step-page-accent, var(--pin-primary, #e60023));
        color: #fff;
        opacity: 1;
      }
    }

    .step-page__step-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--pin-text);
      opacity: 0.4;
      text-align: center;

      .step-page__step--active &,
      .step-page__step--done & {
        opacity: 1;
      }
    }
  `,
})
export class StepPageComponent {
  steps = input.required<StepDef[]>();
  activeStep = input.required<string>();

  private readonly stepOrder = computed(() => this.steps().map((s) => s.key));

  isStepDone(key: string): boolean {
    const order = this.stepOrder();
    return order.indexOf(key) < order.indexOf(this.activeStep());
  }
}
