import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LearnMoreApi } from '@shared/apis/learn-more.api';
import { LearnMoreConfig, LearnMoreElement, LearnMoreStep } from '@shared/interfaces/entity/learn-more';
import {
  FormElement,
  FormStructure,
} from '@shared/components/dynamic-form/interfaces/form-element.interface';
import { DynamicFormAdapterService } from '@shared/components/stepper/services/dynamic-form-adapter.service';
import { Step, StepperConfig } from '@shared/components/stepper/interfaces/stepper.interface';

@Injectable()
export class DynamicLearnMoreService {
  private readonly learnMoreApi = inject(LearnMoreApi);
  private readonly formAdapter = inject(DynamicFormAdapterService);

  buildStepperConfig(pinId: string): Observable<StepperConfig> {
    return this.learnMoreApi.getConfig(pinId).pipe(
      map((response) => {
        if (!response.data) throw new Error('learn-more: no data returned');
        return this.mapToStepperConfig(response.data);
      }),
    );
  }

  private mapToStepperConfig(config: LearnMoreConfig): StepperConfig {
    const steps: Step[] = [];
    let stepIndex = 1;

    for (const learnMoreStep of config.steps) {
      if (learnMoreStep.isRevision) {
        steps.push({
          identifier: 'revisionStepper',
          step: stepIndex++,
          title: learnMoreStep.title,
          valid: false,
        });
      } else if (this.isTextOnlyStep(learnMoreStep)) {
        steps.push({
          identifier: 'stepTextInContent',
          step: stepIndex++,
          title: learnMoreStep.title,
          text: (learnMoreStep.elements[0]?.value as string) ?? '',
          valid: true,
        });
      } else {
        const structure = this.toFormStructure(learnMoreStep);
        const { step } = this.formAdapter.createStepWithForm(stepIndex++, learnMoreStep.title, structure);
        steps.push(step);
      }
    }

    return {
      id: 'learn-more',
      currentStep: 1,
      completed: false,
      showStepProgress: config.config.showStepProgress,
      showCheckboxPrivacyPolicy: config.config.showCheckboxPrivacyPolicy,
      nameLastButton: config.config.nameLastButton,
      steps,
    };
  }

  private isTextOnlyStep(step: LearnMoreStep): boolean {
    return step.elements.length > 0 && step.elements.every((el) => el.type === 'textHTML');
  }

  private toFormStructure(step: LearnMoreStep): FormStructure {
    return {
      id: step.id,
      title: step.title,
      layout: step.layout as FormStructure['layout'],
      elements: step.elements.map((el) => this.toFormElement(el)),
    };
  }

  private toFormElement(el: LearnMoreElement): FormElement {
    return {
      id: el.id,
      type: el.type as FormElement['type'],
      label: el.label,
      placeholder: el.placeholder,
      value: el.value,
      defaultValue: el.defaultValue,
      classes: el.classes,
      // Convert {value, label} → {name, code} to match FormElement contract
      options: el.options.map((o) => ({ name: o.label, code: o.value })),
      validators: {
        required: el.validators.required,
        erroRequired: el.validators.errorRequired,
        accept: el.validators.accept,
        multiple: el.validators.multiple,
        allowedTypes: el.validators.allowedTypes,
        maxFileSizeMB: el.validators.maxFileSizeMB,
      },
    };
  }
}
