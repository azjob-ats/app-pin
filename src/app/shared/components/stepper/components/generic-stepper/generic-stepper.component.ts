import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerStepsComponent } from '@shared/components/spinner-steps/spinner-steps.component';
import { Step } from '../../interfaces/stepper.interface';
import { StepperService } from '../../services/stepper.service';
import { DeviceService } from '@shared/services/device.service';

@Component({
  selector: 'app-generic-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CommonModule, ButtonComponent, SpinnerStepsComponent],
  templateUrl: './generic-stepper.component.html',
  styleUrl: './generic-stepper.component.scss',
})
export class GenericStepperComponent implements OnInit, OnDestroy {
  readonly showStepProgress = input(true);
  readonly nameLastButton = input('Concluir');

  readonly stepCompleted = output<{ step: number; data: unknown }>();
  readonly allStepsCompleted = output<Step[]>();
  readonly close = output<void>();

  readonly stepperService = inject(StepperService);
  readonly device$ = inject(DeviceService).deviceType$;
 

  readonly currentStep = this.stepperService.currentStep;
  readonly totalSteps = this.stepperService.totalSteps;
  readonly isFirstStep = this.stepperService.isFirstStep;
  readonly isLastStep = this.stepperService.isLastStep;

  ngOnInit(): void {
    // StepperService is already initialized by the parent before this runs
  }

  ngOnDestroy(): void {
    this.stepperService.reset();
  }

  onNext(): void {
    if (this.isLastStep()) {
      this.allStepsCompleted.emit(this.stepperService.getAllData());
      return;
    }

    const stepBefore = this.currentStep();
    if (this.stepperService.nextStep()) {
      this.stepCompleted.emit({ step: stepBefore, data: this.stepperService.getAllData() });
    }
  }

  onPrevious(): void {
    this.stepperService.previousStep();
  }

  isCurrentStepValid(): boolean {
    return this.stepperService.isStepValid(this.currentStep());
  }
}
