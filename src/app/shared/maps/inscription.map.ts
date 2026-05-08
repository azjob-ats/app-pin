import { InscriptionStatus } from '@shared/enums/inscription-status.enum';
import { InscriptionType } from '@shared/enums/inscription-type.enum';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  InscriptionListResponse,
  InscriptionPartyResponse,
  InscriptionResponse,
} from '@shared/interfaces/dto/response/inscriptions';
import { Inscription, InscriptionParty } from '@shared/interfaces/entity/inscription';

export class InscriptionMap {
  public static toEntity(dto: InscriptionResponse): Inscription {
    return {
      id: dto.id,
      type: dto.type as InscriptionType,
      status: dto.status as InscriptionStatus,
      title: dto.title,
      pinId: dto.pinId,
      pinThumbnailUrl: dto.pinThumbnailUrl,
      creator: InscriptionMap.toParty(dto.creator),
      company: InscriptionMap.toParty(dto.company),
      submittedAt: new Date(dto.submittedAt),
      updatedAt: new Date(dto.updatedAt),
      nextStep: dto.nextStep,
      externalUrl: dto.externalUrl,
      cancellable: dto.cancellable,
    };
  }

  public static toParty(dto: InscriptionPartyResponse): InscriptionParty {
    return { ...dto };
  }

  public static toList(dto: InscriptionListResponse): List<Inscription[]> {
    return {
      data: dto.data.map((item) => InscriptionMap.toEntity(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }
}
