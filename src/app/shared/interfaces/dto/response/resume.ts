import {
  CertificationResponse,
  ContactInfoResponse,
  EducationResponse,
  ExperienceResponse,
  LanguageResponse,
} from '@shared/interfaces/dto/response/creator-portfolio';

export interface ResumePayloadResponse {
  handle: string | null;
  displayName: string | null;
  headline: string | null;
  about: string;
  contact: ContactInfoResponse;
  experiences: ExperienceResponse[];
  educations: EducationResponse[];
  skills: string[];
  languages: LanguageResponse[];
  certifications: CertificationResponse[];
  pronoun: string | null;
  isPcd: boolean;
  pcdNotes: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
}

export interface TrackProgressResponse {
  status: string;
  completion: number;
  lastSavedAt: string | null;
}

export interface ResumeDraftResponse {
  ownerHandle: string;
  updatedAt: string;
  isPublished: boolean;
  publishedAt: string | null;
  tracks: Record<string, TrackProgressResponse>;
  payload: ResumePayloadResponse;
}
