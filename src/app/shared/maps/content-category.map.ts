import { List } from '@shared/interfaces/base/pages-total-records';
import { ContentCategoryListResponse } from '@shared/interfaces/dto/response/content-category';
import { ContentCategory } from '@shared/interfaces/entity/content-category';

export class ContentCategoryMap {
  public static toEntityList(dto: ContentCategoryListResponse): List<ContentCategory[]> {
    return {
      ...dto,
      data: dto.data.map(
        (item): ContentCategory => ({
          key: item.key,
          icon: item.icon ?? undefined,
        }),
      ),
    };
  }
}
