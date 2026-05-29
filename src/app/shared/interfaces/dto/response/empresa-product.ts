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

export interface ProductLearnMoreFieldResponse {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface ProductLearnMoreStepResponse {
  id: string;
  title: string;
  fields: ProductLearnMoreFieldResponse[];
}

export interface ProductLearnMoreConfigResponse {
  steps: ProductLearnMoreStepResponse[];
  submitButtonLabel: string;
  showCheckboxPrivacyPolicy: boolean;
  showRevisionStep: boolean;
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
