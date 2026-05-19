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

export interface ProductLearnMoreFieldOption {
  value: string;
  label: string;
}

export interface ProductLearnMoreField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: ProductLearnMoreFieldOption[];
}

export interface ProductLearnMoreStep {
  id: string;
  title: string;
  fields: ProductLearnMoreField[];
}

export interface ProductLearnMoreConfig {
  steps: ProductLearnMoreStep[];
  submitButtonLabel: string;
  showCheckboxPrivacyPolicy: boolean;
  showRevisionStep: boolean;
}

export interface ProductMetrics {
  views: number;
  submissions: number;
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
  metrics: ProductMetrics;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
