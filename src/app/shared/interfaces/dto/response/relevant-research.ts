import { List } from '@shared/interfaces/base/pages-total-records';

export interface RelevantResearchResponse {
  term: string;
}

export interface RelevantResearchListResponse extends List {
  data: RelevantResearchResponse[];
}
