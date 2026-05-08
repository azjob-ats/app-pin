export interface InscriptionListQueryRequest {
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface CancelInscriptionRequest {
  id: string;
  reason?: string;
}
