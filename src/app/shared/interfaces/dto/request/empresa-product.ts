import {
  ProductDescriptionBlockResponse,
  ProductEligibilityResponse,
  ProductLearnMoreConfigResponse,
  ProductScreeningQuestionResponse,
} from '@shared/interfaces/dto/response/empresa-product';

export interface CreateProductRequest {
  type: string;
  title: string;
  subtitle?: string;
  badges?: string[];
  location?: string;
  department?: string;
  description: ProductDescriptionBlockResponse[];
  screeningQuestions?: ProductScreeningQuestionResponse[];
  learnMoreConfig: ProductLearnMoreConfigResponse;
  eligibility?: ProductEligibilityResponse;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  phase?: string;
}

export interface MoveProductRequest {
  phase: string;
}

export interface ProductListQueryRequest {
  type?: string;
  phase?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}
