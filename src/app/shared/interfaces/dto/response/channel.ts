import { List } from '@shared/interfaces/base/pages-total-records';
import { Channel } from '@shared/interfaces/entity/channel';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';

export type ChannelResponse = Channel;

export interface ChannelGalleryListResponse extends List {
  data: Post[];
}

export interface ChannelCollectionListResponse extends List {
  data: CollectionBundle[];
}
