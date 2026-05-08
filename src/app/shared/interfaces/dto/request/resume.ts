import { ResumePayloadResponse } from '@shared/interfaces/dto/response/resume';

export interface SaveResumeTrackRequest {
  trackId: string;
  payload: Partial<ResumePayloadResponse>;
}

export type PublishResumeRequest = Record<string, never>;
