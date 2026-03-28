import { List } from '@shared/interfaces/base/pages-total-records';
import { RelevantResearchListResponse } from '@shared/interfaces/dto/response/relevant-research';
import { RelevantResearch } from '@shared/interfaces/entity/relevant-research';

export class RelevantResearchMap {
  public static toEntityList(dto: RelevantResearchListResponse): List<RelevantResearch[]> {
    return {
      ...dto,
      data: dto.data.map(
        (item): RelevantResearch => ({
          term: item.term,
        }),
      ),
    };
  }
}
