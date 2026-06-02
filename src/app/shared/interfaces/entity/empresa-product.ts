import { ProductEligibilityMode } from '@shared/enums/product-eligibility-mode.enum';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ProductType } from '@shared/enums/product-type.enum';

export interface ProductDescriptionBlock {
  id: string;
  title: string;
  body: string;
}

export interface ProductScreeningQuestion {
  id: string;
  question: string;
  idealAnswer: string;
  required: boolean;
}

// ── Learn-more config — mirrors the Dynamic Form Engine shape (learn-more.js) ──

export type ProductLearnMoreLayout = 'horizontal' | 'vertical';

export type ProductLearnMoreElementType =
  | 'text'
  | 'textHTML'
  | 'email'
  | 'select'
  | 'uploadFile'
  | 'checkboxAuthorize';

export interface ProductLearnMoreElementOption {
  name: string;
  code: string;
}

export interface ProductLearnMoreElementValidators {
  required?: boolean;
  errorRequired?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  // uploadFile-specific
  accept?: string;
  multiple?: boolean;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

export interface ProductLearnMoreElement {
  id: string;
  classes?: string;
  type: ProductLearnMoreElementType;
  value?: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
  validators?: ProductLearnMoreElementValidators;
  options?: ProductLearnMoreElementOption[];
}

export interface ProductLearnMoreStep {
  id: string;
  title: string;
  layout: ProductLearnMoreLayout;
  elements: ProductLearnMoreElement[];
}

export interface ProductLearnMoreStepperConfig {
  showStepProgress: boolean;
  showCheckboxPrivacyPolicy: boolean;
  nameLastButton: string;
  setRevisionStepper: boolean;
}

export interface ProductLearnMoreConfig {
  stepperLearnMore: ProductLearnMoreStep[];
  stepperConfig: ProductLearnMoreStepperConfig;
}

export interface ProductMetrics {
  views: number;
  submissions: number;
}

export interface ProductEligibility {
  mode: ProductEligibilityMode;
  creatorIds: string[];
  groupIds: string[];
}

export interface Product {
  id: string;
  organizationId: string;
  type: ProductType;
  phase: ProductPhase;
  title: string;
  subtitle: string;
  badges: string[];
  location: string;
  description: ProductDescriptionBlock[];
  screeningQuestions: ProductScreeningQuestion[];
  learnMoreConfig: ProductLearnMoreConfig;
  eligibility: ProductEligibility;
  metrics: ProductMetrics;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
