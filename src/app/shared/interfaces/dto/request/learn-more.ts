export interface LearnMoreSubmitFieldRequest {
  id: string;
  value: unknown;
}

export interface LearnMoreSubmitRequest {
  pinId: string;
  fields: LearnMoreSubmitFieldRequest[];
}
