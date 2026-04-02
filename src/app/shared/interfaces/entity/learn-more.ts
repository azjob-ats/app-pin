export type LearnMoreElementType =
  | 'text'
  | 'email'
  | 'select'
  | 'uploadFile'
  | 'textHTML'
  | 'checkboxAuthorize';

export interface LearnMoreElementValidators {
  required?: boolean;
  errorRequired?: string;
  accept?: string;
  multiple?: boolean;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

export interface LearnMoreElementOption {
  value: string;
  label: string;
}

export interface LearnMoreElement {
  id: string;
  type: LearnMoreElementType;
  label: string;
  placeholder: string;
  value?: string;
  defaultValue?: unknown;
  classes: string[];
  options: LearnMoreElementOption[];
  validators: LearnMoreElementValidators;
}

export interface LearnMoreStep {
  id: string;
  title: string;
  layout: string;
  elements: LearnMoreElement[];
  isRevision?: boolean;
}

export interface LearnMoreStepperConfig {
  showStepProgress: boolean;
  showCheckboxPrivacyPolicy: boolean;
  nameLastButton: string;
  setRevisionStepper: boolean;
}

export interface LearnMoreConfig {
  steps: LearnMoreStep[];
  config: LearnMoreStepperConfig;
}
