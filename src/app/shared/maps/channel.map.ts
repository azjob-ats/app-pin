import { List } from '@shared/interfaces/base/pages-total-records';
import {
  ChannelCollectionListResponse,
  ChannelGalleryListResponse,
  ChannelResponse,
} from '@shared/interfaces/dto/response/channel';
import { Channel } from '@shared/interfaces/entity/channel';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';

export class ChannelMap {
  public static toEntity(dto: ChannelResponse): Channel {
    return { ...dto };
  }

  public static toGalleryList(dto: ChannelGalleryListResponse): List<Post[]> {
    return { ...dto, data: dto.data };
  }

  public static toCollectionList(dto: ChannelCollectionListResponse): List<CollectionBundle[]> {
    return { ...dto, data: dto.data };
  }
}
