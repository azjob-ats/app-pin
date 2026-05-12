import { ResumeTrack, TrackProgressStatus } from '@shared/enums/resume-track.enum';
import {
  ResumeDraftResponse,
  ResumePayloadResponse,
  TrackProgressResponse,
} from '@shared/interfaces/dto/response/resume';
import { ResumeDraft, ResumePayload, TrackProgress } from '@shared/interfaces/entity/resume';
import { CreatorPortfolioMap } from '@shared/maps/creator-portfolio.map';

export class ResumeMap {
  public static toEntity(dto: ResumeDraftResponse): ResumeDraft {
    return {
      ownerHandle: dto.ownerHandle,
      updatedAt: new Date(dto.updatedAt),
      isPublished: dto.isPublished,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      tracks: ResumeMap.toTracks(dto.tracks),
      payload: ResumeMap.toPayload(dto.payload),
    };
  }

  private static toTracks(
    raw: Record<string, TrackProgressResponse>,
  ): Record<ResumeTrack, TrackProgress> {
    const empty: TrackProgress = {
      status: TrackProgressStatus.Empty,
      completion: 0,
      lastSavedAt: null,
    };
    const result = {
      [ResumeTrack.Skills]: empty,
      [ResumeTrack.Experience]: empty,
      [ResumeTrack.Education]: empty,
      [ResumeTrack.Languages]: empty,
      [ResumeTrack.Certifications]: empty,
      [ResumeTrack.About]: empty,
      [ResumeTrack.Contact]: empty,
      [ResumeTrack.PronounPcd]: empty,
      [ResumeTrack.Media]: empty,
    } as Record<ResumeTrack, TrackProgress>;

    for (const key of Object.keys(raw)) {
      const value = raw[key];
      if (!value) continue;
      result[key as ResumeTrack] = ResumeMap.toTrackProgress(value);
    }
    return result;
  }

  private static toTrackProgress(dto: TrackProgressResponse): TrackProgress {
    return {
      status: dto.status as TrackProgressStatus,
      completion: dto.completion,
      lastSavedAt: dto.lastSavedAt ? new Date(dto.lastSavedAt) : null,
    };
  }

  private static toPayload(dto: ResumePayloadResponse): ResumePayload {
    return {
      about: dto.about,
      contact: CreatorPortfolioMap.toContact(dto.contact),
      experiences: dto.experiences.map((e) => CreatorPortfolioMap.toExperience(e)),
      educations: dto.educations.map((e) => CreatorPortfolioMap.toEducation(e)),
      skills: [...dto.skills],
      languages: dto.languages.map((l) => CreatorPortfolioMap.toLanguage(l)),
      certifications: dto.certifications.map((c) => CreatorPortfolioMap.toCertification(c)),
      pronoun: dto.pronoun,
      isPcd: dto.isPcd,
      pcdNotes: dto.pcdNotes,
      avatarUrl: dto.avatarUrl ?? null,
      coverUrl: dto.coverUrl ?? null,
    };
  }
}
