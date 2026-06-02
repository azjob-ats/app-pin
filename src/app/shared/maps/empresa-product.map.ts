import { ProductEligibilityMode } from '@shared/enums/product-eligibility-mode.enum';
import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ProductType } from '@shared/enums/product-type.enum';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  ProductEligibilityResponse,
  ProductListResponse,
  ProductResponse,
} from '@shared/interfaces/dto/response/empresa-product';
import {
  Product,
  ProductEligibility,
  ProductLearnMoreElementType,
} from '@shared/interfaces/entity/empresa-product';

const VALID_TYPES = new Set(Object.values(ProductType) as string[]);
const VALID_PHASES = new Set(Object.values(ProductPhase) as string[]);
const VALID_ELIGIBILITY_MODES = new Set(Object.values(ProductEligibilityMode) as string[]);

export class ProductMap {
  public static toProduct(dto: ProductResponse): Product {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      type: ProductMap.toType(dto.type),
      phase: ProductMap.toPhase(dto.phase),
      title: dto.title,
      subtitle: dto.subtitle ?? '',
      badges: [...dto.badges],
      location: dto.location ?? '',
      description: dto.description.map((block) => ({ ...block })),
      screeningQuestions: dto.screeningQuestions.map((q) => ({ ...q })),
      learnMoreConfig: {
        stepperLearnMore: (dto.learnMoreConfig.stepperLearnMore ?? []).map((step) => ({
          id: step.id,
          title: step.title,
          layout: (step.layout === 'vertical' ? 'vertical' : 'horizontal') as
            | 'horizontal'
            | 'vertical',
          elements: step.elements.map((el) => ({
            id: el.id,
            classes: el.classes,
            type: el.type as ProductLearnMoreElementType,
            value: el.value,
            label: el.label,
            defaultValue: el.defaultValue,
            placeholder: el.placeholder,
            validators: el.validators ? { ...el.validators } : undefined,
            options: el.options ? el.options.map((o) => ({ ...o })) : undefined,
          })),
        })),
        stepperConfig: {
          showStepProgress: dto.learnMoreConfig.stepperConfig?.showStepProgress ?? true,
          showCheckboxPrivacyPolicy:
            dto.learnMoreConfig.stepperConfig?.showCheckboxPrivacyPolicy ?? true,
          nameLastButton: dto.learnMoreConfig.stepperConfig?.nameLastButton ?? 'Enviar',
          setRevisionStepper: dto.learnMoreConfig.stepperConfig?.setRevisionStepper ?? true,
        },
      },
      eligibility: ProductMap.toEligibility(dto.eligibility),
      metrics: { ...dto.metrics },
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  public static toList(dto: ProductListResponse): List<Product[]> {
    return {
      data: dto.data.map((item) => ProductMap.toProduct(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }

  private static toEligibility(dto?: ProductEligibilityResponse): ProductEligibility {
    const mode = dto && VALID_ELIGIBILITY_MODES.has(dto.mode)
      ? (dto.mode as ProductEligibilityMode)
      : ProductEligibilityMode.Any;
    return {
      mode,
      creatorIds: dto?.creatorIds ? [...dto.creatorIds] : [],
      groupIds: dto?.groupIds ? [...dto.groupIds] : [],
    };
  }

  private static toType(value: string): ProductType {
    return VALID_TYPES.has(value) ? (value as ProductType) : ProductType.Job;
  }

  private static toPhase(value: string): ProductPhase {
    return VALID_PHASES.has(value) ? (value as ProductPhase) : ProductPhase.Backlog;
  }
}
