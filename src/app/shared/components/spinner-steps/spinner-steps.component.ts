import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

@Component({
  selector: 'app-spinner-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner-steps.component.html',
  styleUrl: './spinner-steps.component.scss',
})
export class SpinnerStepsComponent {
  readonly currentStep = input(0);
  readonly totalSteps = input(0);

  readonly progressPercentage = computed(() => {
    if (this.totalSteps() === 0) return 0;
    return (this.currentStep() / this.totalSteps()) * 100;
  });

  readonly label = computed(() => `${this.currentStep()}/${this.totalSteps()}`);
}
