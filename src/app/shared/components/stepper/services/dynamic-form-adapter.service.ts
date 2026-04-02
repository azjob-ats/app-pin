import { inject, Injectable } from '@angular/core';
import { FormStructure } from '@shared/components/dynamic-form/interfaces/form-element.interface';
import { DynamicFormService } from '@shared/components/dynamic-form/services/dynamic-form.service';
import { Step } from '../interfaces/stepper.interface';
import { StepperService } from './stepper.service';

@Injectable({ providedIn: 'root' })
export class DynamicFormAdapterService {
  private readonly dynamicFormService = inject(DynamicFormService);
  private readonly stepperService = inject(StepperService);

  createStepWithForm(stepNumber: number, title: string, structure: FormStructure): { step: Step } {
    const formGroup = this.dynamicFormService.createForm(structure);

    formGroup.statusChanges.subscribe(() => {
      this.stepperService.updateStepValidity(stepNumber, formGroup.valid);
    });

    const step: Step = {
      identifier: 'dynamicForm',
      step: stepNumber,
      title,
      formGroup,
      valid: formGroup.valid,
      dynamicForm: structure,
    };

    return { step };
  }
}
