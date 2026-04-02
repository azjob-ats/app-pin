export interface LearnMoreElementValidatorsResponse {
  required?: boolean;
  erroRequired?: string;
  accept?: string;
  multiple?: boolean;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

export interface LearnMoreElementOptionResponse {
  name: string;
  code: string;
}

export interface LearnMoreElementResponse {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: unknown;
  classes?: string[];
  options?: LearnMoreElementOptionResponse[];
  validators?: LearnMoreElementValidatorsResponse;
}

export interface LearnMoreStepResponse {
  id: string;
  title: string;
  layout: string;
  elements: LearnMoreElementResponse[];
}

export interface LearnMoreStepperConfigResponse {
  showStepProgress: boolean;
  showCheckboxPrivacyPolicy: boolean;
  nameLastButton: string;
  setRevisionStepper: boolean;
}

export interface LearnMoreConfigResponse {
  stepperLearnMore: LearnMoreStepResponse[];
  stepperConfig: LearnMoreStepperConfigResponse;
}
