import {
  LearnMoreConfigResponse,
  LearnMoreElementResponse,
  LearnMoreStepResponse,
} from '@shared/interfaces/dto/response/learn-more';
import {
  LearnMoreConfig,
  LearnMoreElement,
  LearnMoreElementType,
  LearnMoreStep,
} from '@shared/interfaces/entity/learn-more';

export class LearnMoreMap {
  public static toConfig(response: LearnMoreConfigResponse): LearnMoreConfig {
    const steps: LearnMoreStep[] = response.stepperLearnMore.map(
      (step): LearnMoreStep => LearnMoreMap.toStep(step),
    );

    if (response.stepperConfig.setRevisionStepper) {
      steps.push({
        id: 'revision',
        title: 'Revisão',
        layout: 'vertical',
        elements: [],
        isRevision: true,
      });
    }

    return {
      steps,
      config: {
        showStepProgress: response.stepperConfig.showStepProgress,
        showCheckboxPrivacyPolicy: response.stepperConfig.showCheckboxPrivacyPolicy,
        nameLastButton: response.stepperConfig.nameLastButton,
        setRevisionStepper: response.stepperConfig.setRevisionStepper,
      },
    };
  }

  private static toStep(step: LearnMoreStepResponse): LearnMoreStep {
    return {
      id: step.id,
      title: step.title,
      layout: step.layout,
      elements: step.elements.map((el) => LearnMoreMap.toElement(el)),
    };
  }

  private static toElement(el: LearnMoreElementResponse): LearnMoreElement {
    return {
      id: el.id,
      type: el.type as LearnMoreElementType,
      label: el.label ?? '',
      placeholder: el.placeholder ?? '',
      value: el.value,
      defaultValue: el.defaultValue,
      classes: el.classes ?? ['col-12'],
      options: (el.options ?? []).map((opt) => ({
        value: opt.code,
        label: opt.name,
      })),
      validators: {
        required: el.validators?.required,
        errorRequired: el.validators?.erroRequired,
        accept: el.validators?.accept,
        multiple: el.validators?.multiple,
        allowedTypes: el.validators?.allowedTypes,
        maxFileSizeMB: el.validators?.maxFileSizeMB,
      },
    };
  }
}
