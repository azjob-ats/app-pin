import { FormGroup } from '@angular/forms';
import { FormStructure } from '@shared/components/dynamic-form/interfaces/form-element.interface';

export type StepIdentifier = 'dynamicForm' | 'revisionStepper' | 'stepTextInContent';

export interface Step {
  identifier: StepIdentifier;
  step: number;
  title: string;
  description?: string;
  formGroup?: FormGroup;
  completed?: boolean;
  valid?: boolean;
  dynamicForm?: FormStructure;
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface StepperConfig {
  id: string;
  title?: string;
  steps: Step[];
  currentStep: number;
  completed: boolean;
  showStepProgress: boolean;
  showCheckboxPrivacyPolicy?: boolean;
  nameLastButton?: string;
}
