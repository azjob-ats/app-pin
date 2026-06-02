import { inject, Injectable } from '@angular/core';
import {
  FormElement,
  FormElementType,
  FormStructure,
} from '@shared/components/dynamic-form/interfaces/form-element.interface';
import { Step, StepperConfig } from '@shared/components/stepper/interfaces/stepper.interface';
import { DynamicFormAdapterService } from '@shared/components/stepper/services/dynamic-form-adapter.service';
import {
  Product,
  ProductLearnMoreConfig,
  ProductLearnMoreElement,
  ProductLearnMoreStep,
} from '@shared/interfaces/entity/empresa-product';

@Injectable({ providedIn: 'root' })
export class ProductLearnMoreAdapter {
  private readonly formAdapter = inject(DynamicFormAdapterService);

  /**
   * Converts the Product's learn-more config (engine shape — same as
   * api-server/src/data/learn-more.js) into the StepperConfig consumed by the
   * GenericStepper engine. Mirrors DynamicLearnMoreService:
   *
   *   textHTML-only step → stepTextInContent
   *   step with inputs   → dynamicForm (FormGroup created by the adapter)
   *   setRevisionStepper → appends a revision step
   */
  toStepperConfig(product: Product): StepperConfig {
    return this.fromConfig(product.learnMoreConfig, product.id, product.title);
  }

  /** Builds a StepperConfig from a raw learn-more config (e.g. wizard preview). */
  fromConfig(config: ProductLearnMoreConfig, id: string, title: string): StepperConfig {
    const steps: Step[] = [];
    let index = 1;

    for (const lmStep of config.stepperLearnMore) {
      if (this.isTextOnly(lmStep)) {
        steps.push({
          identifier: 'stepTextInContent',
          step: index++,
          title: lmStep.title,
          text: lmStep.elements[0]?.value ?? '',
          valid: true,
        });
      } else {
        const structure = this.toFormStructure(lmStep);
        const { step } = this.formAdapter.createStepWithForm(index++, lmStep.title, structure);
        steps.push(step);
      }
    }

    if (config.stepperConfig.setRevisionStepper) {
      steps.push({ identifier: 'revisionStepper', step: index++, title: 'Revisão', valid: false });
    }

    return {
      id: `learn-more-${id}`,
      title,
      steps,
      currentStep: 1,
      completed: false,
      showStepProgress: config.stepperConfig.showStepProgress,
      showCheckboxPrivacyPolicy: config.stepperConfig.showCheckboxPrivacyPolicy,
      nameLastButton: config.stepperConfig.nameLastButton,
    };
  }

  private isTextOnly(step: ProductLearnMoreStep): boolean {
    return step.elements.length > 0 && step.elements.every((el) => el.type === 'textHTML');
  }

  private toFormStructure(step: ProductLearnMoreStep): FormStructure {
    return {
      id: step.id,
      title: step.title,
      layout: step.layout === 'vertical' ? 'vertical' : 'horizontal',
      elements: step.elements.map((el) => this.toElement(el)),
    };
  }

  private toElement(el: ProductLearnMoreElement): FormElement {
    return {
      id: el.id,
      type: el.type as FormElementType,
      label: el.label,
      placeholder: el.placeholder,
      value: el.value,
      defaultValue: el.defaultValue,
      classes: el.classes ? [el.classes] : undefined,
      options: (el.options ?? []).map((o) => ({ name: o.name, code: o.code })),
      validators: {
        required: el.validators?.required,
        erroRequired: el.validators?.errorRequired,
        minLength: el.validators?.minLength,
        maxLength: el.validators?.maxLength,
        pattern: el.validators?.pattern,
        accept: el.validators?.accept,
        multiple: el.validators?.multiple,
        allowedTypes: el.validators?.allowedTypes,
        maxFileSizeMB: el.validators?.maxFileSizeMB,
        ...(el.type === 'email' ? { email: true } : {}),
      },
    };
  }
}
