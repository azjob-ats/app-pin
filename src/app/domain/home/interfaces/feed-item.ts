import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';
import { WinningSlot } from '@shared/interfaces/entity/winning-slot';

export type FeedItem =
  | { kind: 'post'; data: Post }
  | { kind: 'collection'; data: CollectionBundle }
  | { kind: 'winning-slot'; data: WinningSlot };
