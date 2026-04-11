import { List } from '@shared/interfaces/base/pages-total-records';
import { CollectionBundleListResponse } from '@shared/interfaces/dto/response/collection-bundle';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';

export class CollectionBundleMap {
  public static toEntityList(dto: CollectionBundleListResponse): List<CollectionBundle[]> {
    return { ...dto, data: dto.data };
  }
}
