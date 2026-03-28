import { List } from '@shared/interfaces/base/pages-total-records';

export interface ContentCategoryResponse {
  key: string;
  icon?: string | null;
}

export interface ContentCategoryListResponse extends List {
  data: ContentCategoryResponse[];
}
