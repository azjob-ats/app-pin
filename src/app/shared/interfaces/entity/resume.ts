import { ResumeTrack, TrackProgressStatus } from '@shared/enums/resume-track.enum';
import {
  Certification,
  ContactInfo,
  Education,
  Experience,
  Language,
} from '@shared/interfaces/entity/creator-portfolio';

export type ResumePayload = {
  about: string;
  contact: ContactInfo;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  pronoun: string | null;
  isPcd: boolean;
  pcdNotes: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
};

export interface TrackProgress {
  status: TrackProgressStatus;
  completion: number;
  lastSavedAt: Date | null;
}

export interface ResumeDraft {
  ownerHandle: string;
  updatedAt: Date;
  isPublished: boolean;
  publishedAt: Date | null;
  tracks: Record<ResumeTrack, TrackProgress>;
  payload: ResumePayload;
}
