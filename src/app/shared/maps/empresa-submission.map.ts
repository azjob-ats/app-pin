import { ProductType } from '@shared/enums/product-type.enum';
import { SubmissionPhase } from '@shared/enums/submission-phase.enum';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  SubmissionHistoryEntryResponse,
  SubmissionListResponse,
  SubmissionResponse,
} from '@shared/interfaces/dto/response/empresa-submission';
import {
  Submission,
  SubmissionHistoryEntry,
} from '@shared/interfaces/entity/empresa-submission';

const VALID_TYPES = new Set(Object.values(ProductType) as string[]);
const VALID_PHASES = new Set(Object.values(SubmissionPhase) as string[]);

export class SubmissionMap {
  public static toSubmission(dto: SubmissionResponse): Submission {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      productId: dto.productId,
      productType: SubmissionMap.toProductType(dto.productType),
      productTitle: dto.productTitle,
      phase: SubmissionMap.toPhase(dto.phase),
      candidate: { ...dto.candidate },
      answers: dto.answers.map((a) => ({ ...a })),
      screeningAnswers: dto.screeningAnswers.map((a) => ({ ...a })),
      internalNotes: dto.internalNotes,
      assignedTo: dto.assignedTo,
      history: dto.history.map((entry) => SubmissionMap.toHistoryEntry(entry)),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  public static toList(dto: SubmissionListResponse): List<Submission[]> {
    return {
      data: dto.data.map((item) => SubmissionMap.toSubmission(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }

  private static toHistoryEntry(dto: SubmissionHistoryEntryResponse): SubmissionHistoryEntry {
    return {
      id: dto.id,
      actor: dto.actor,
      action: dto.action,
      fromPhase: dto.fromPhase ? SubmissionMap.toPhase(dto.fromPhase) : null,
      toPhase: dto.toPhase ? SubmissionMap.toPhase(dto.toPhase) : null,
      note: dto.note ?? '',
      createdAt: new Date(dto.createdAt),
    };
  }

  private static toProductType(value: string): ProductType {
    return VALID_TYPES.has(value) ? (value as ProductType) : ProductType.Job;
  }

  private static toPhase(value: string): SubmissionPhase {
    return VALID_PHASES.has(value) ? (value as SubmissionPhase) : SubmissionPhase.JobReceived;
  }
}
