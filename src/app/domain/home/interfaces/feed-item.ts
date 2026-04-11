import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';

export type FeedItem =
  | { kind: 'post'; data: Post }
  | { kind: 'collection'; data: CollectionBundle };
