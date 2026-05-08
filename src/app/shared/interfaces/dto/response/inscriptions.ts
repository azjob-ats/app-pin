export interface InscriptionResponse {
  id: string;
  type: string;
  status: string;
  title: string;
  pinId: string;
  pinThumbnailUrl: string;
  creator: InscriptionPartyResponse;
  company: InscriptionPartyResponse;
  submittedAt: string;
  updatedAt: string;
  nextStep: string | null;
  externalUrl: string | null;
  cancellable: boolean;
}

export interface InscriptionPartyResponse {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
}

export interface InscriptionListResponse {
  data: InscriptionResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
