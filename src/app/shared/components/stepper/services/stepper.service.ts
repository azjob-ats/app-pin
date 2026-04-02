import { computed, Injectable, signal } from '@angular/core';
import { Step, StepperConfig } from '../interfaces/stepper.interface';

@Injectable({ providedIn: 'root' })
export class StepperService {
  private readonly _config = signal<StepperConfig | null>(null);

  readonly currentStep = computed(() => this._config()?.currentStep ?? 1);
  readonly totalSteps = computed(() => this._config()?.steps.length ?? 0);
  readonly isFirstStep = computed(() => this.currentStep() === 1);
  readonly isLastStep = computed(() => this.currentStep() === this.totalSteps());
  readonly currentStepConfig = computed(() =>
    this._config()?.steps.find((s) => s.step === this.currentStep()),
  );

  initializeStepper(config: StepperConfig): void {
    this._config.set({
      ...config,
      currentStep: 1,
      steps: config.steps.map((s) => ({ ...s, completed: false })),
    });
  }

  nextStep(): boolean {
    const cfg = this._config();
    if (!cfg) return false;

    if (!this.isStepValid(cfg.currentStep)) {
      this.markCurrentStepTouched();
      return false;
    }

    const next = cfg.currentStep + 1;
    if (next > cfg.steps.length) return false;

    this._config.update((c) => {
      if (!c) return c;
      return {
        ...c,
        currentStep: next,
        steps: c.steps.map((s) => ({
          ...s,
          completed: s.completed || s.step < next,
        })),
      };
    });
    return true;
  }

  previousStep(): void {
    this._config.update((c) => {
      if (!c || c.currentStep <= 1) return c;
      return { ...c, currentStep: c.currentStep - 1 };
    });
  }

  updateStepData(data: unknown, stepNumber: number): void {
    this._config.update((c) => {
      if (!c) return c;
      return {
        ...c,
        steps: c.steps.map((s) => {
          if (s.step !== stepNumber) return s;
          const updated = { ...s, data: { ...(s.data ?? {}), ...(data as object) } };
          if (updated.formGroup) {
            updated.formGroup.patchValue(data as object, { emitEvent: false });
            updated.formGroup.updateValueAndValidity();
            updated.valid = updated.formGroup.valid;
          }
          return updated;
        }),
      };
    });
  }

  updateStepValidity(stepNumber: number, isValid: boolean): void {
    this._config.update((c) => {
      if (!c) return c;
      return {
        ...c,
        steps: c.steps.map((s) =>
          s.step === stepNumber ? { ...s, valid: isValid } : s,
        ),
      };
    });
  }

  isStepValid(stepNumber: number): boolean {
    const step = this._config()?.steps.find((s) => s.step === stepNumber);
    if (!step) return false;
    if (step.formGroup) return step.formGroup.valid;
    return step.valid ?? false;
  }

  getAllData(): Step[] {
    return this._config()?.steps ?? [];
  }

  reset(): void {
    this._config.set(null);
  }

  private markCurrentStepTouched(): void {
    const step = this.currentStepConfig();
    step?.formGroup?.markAllAsTouched();
  }
}
