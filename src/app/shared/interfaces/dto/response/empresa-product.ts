export interface ProductDescriptionBlockResponse {
  id: string;
  title: string;
  body: string;
}

export interface ProductScreeningQuestionResponse {
  id: string;
  question: string;
  idealAnswer: string;
  required: boolean;
}

export interface ProductLearnMoreElementValidatorsResponse {
  required?: boolean;
  errorRequired?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  accept?: string;
  multiple?: boolean;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

export interface ProductLearnMoreElementResponse {
  id: string;
  classes?: string;
  type: string;
  value?: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
  validators?: ProductLearnMoreElementValidatorsResponse;
  options?: Array<{ name: string; code: string }>;
}

export interface ProductLearnMoreStepResponse {
  id: string;
  title: string;
  layout: string;
  elements: ProductLearnMoreElementResponse[];
}

export interface ProductLearnMoreStepperConfigResponse {
  showStepProgress: boolean;
  showCheckboxPrivacyPolicy: boolean;
  nameLastButton: string;
  setRevisionStepper: boolean;
}

export interface ProductLearnMoreConfigResponse {
  stepperLearnMore: ProductLearnMoreStepResponse[];
  stepperConfig: ProductLearnMoreStepperConfigResponse;
}

export interface ProductEligibilityResponse {
  mode: string;
  creatorIds: string[];
  groupIds: string[];
}

export interface ProductResponse {
  id: string;
  organizationId: string;
  type: string;
  phase: string;
  title: string;
  subtitle?: string;
  badges: string[];
  location?: string;
  description: ProductDescriptionBlockResponse[];
  screeningQuestions: ProductScreeningQuestionResponse[];
  learnMoreConfig: ProductLearnMoreConfigResponse;
  eligibility?: ProductEligibilityResponse;
  metrics: {
    views: number;
    submissions: number;
  };
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  data: ProductResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
