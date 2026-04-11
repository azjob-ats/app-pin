import { List } from '@shared/interfaces/base/pages-total-records';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';

// The server returns CollectionBundles in their entity format directly — no DTO transformation needed.
export type CollectionBundleResponse = CollectionBundle;

export interface CollectionBundleListResponse extends List {
  data: CollectionBundleResponse[];
}
