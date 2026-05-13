import { EmploymentType } from '@shared/enums/employment-type.enum';
import { LanguageProficiency } from '@shared/enums/language-proficiency.enum';
import { WorkMode } from '@shared/enums/work-mode.enum';
import {
  CertificationResponse,
  ContactInfoResponse,
  CreatorPortfolioResponse,
  EducationResponse,
  ExperienceResponse,
  HighlightResponse,
  LanguageResponse,
  SocialLinkResponse,
} from '@shared/interfaces/dto/response/creator-portfolio';
import {
  Certification,
  ContactInfo,
  CreatorPortfolio,
  Education,
  Experience,
  Highlight,
  Language,
  SocialLink,
} from '@shared/interfaces/entity/creator-portfolio';

export class CreatorPortfolioMap {
  public static toEntity(dto: CreatorPortfolioResponse): CreatorPortfolio {
    return {
      handle: dto.handle,
      username: dto.username ?? null,
      displayName: dto.displayName,
      headline: dto.headline,
      avatarUrl: dto.avatarUrl,
      coverUrl: dto.coverUrl,
      about: dto.about,
      pronoun: dto.pronoun,
      isPcd: dto.isPcd,
      pcdNotes: dto.pcdNotes,
      contact: CreatorPortfolioMap.toContact(dto.contact),
      metrics: { ...dto.metrics },
      experiences: dto.experiences.map((e) => CreatorPortfolioMap.toExperience(e)),
      educations: dto.educations.map((e) => CreatorPortfolioMap.toEducation(e)),
      skills: [...dto.skills],
      languages: dto.languages.map((l) => CreatorPortfolioMap.toLanguage(l)),
      certifications: dto.certifications.map((c) => CreatorPortfolioMap.toCertification(c)),
      highlights: dto.highlights.map((h) => CreatorPortfolioMap.toHighlight(h)),
      community: { ...dto.community },
      socials: dto.socials.map((s) => CreatorPortfolioMap.toSocial(s)),
      isPublished: dto.isPublished,
    };
  }

  public static toContact(dto: ContactInfoResponse): ContactInfo {
    return { ...dto };
  }

  public static toExperience(dto: ExperienceResponse): Experience {
    return {
      id: dto.id,
      role: dto.role,
      companyName: dto.companyName,
      companyLogoUrl: dto.companyLogoUrl,
      employmentType: dto.employmentType as EmploymentType,
      workMode: dto.workMode as WorkMode,
      location: dto.location,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      isCurrent: dto.isCurrent,
      description: dto.description,
    };
  }

  public static toEducation(dto: EducationResponse): Education {
    return {
      id: dto.id,
      institutionName: dto.institutionName,
      institutionLogoUrl: dto.institutionLogoUrl,
      course: dto.course,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    };
  }

  public static toLanguage(dto: LanguageResponse): Language {
    return {
      id: dto.id,
      name: dto.name,
      proficiency: dto.proficiency as LanguageProficiency,
    };
  }

  public static toCertification(dto: CertificationResponse): Certification {
    return {
      id: dto.id,
      name: dto.name,
      issuerName: dto.issuerName,
      issuerLogoUrl: dto.issuerLogoUrl,
      issuedAt: new Date(dto.issuedAt),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      credentialUrl: dto.credentialUrl,
    };
  }

  public static toHighlight(dto: HighlightResponse): Highlight {
    return {
      id: dto.id,
      pinId: dto.pinId,
      title: dto.title,
      thumbnailUrl: dto.thumbnailUrl,
      publishedAt: new Date(dto.publishedAt),
      views: dto.views,
    };
  }

  public static toSocial(dto: SocialLinkResponse): SocialLink {
    return {
      platform: dto.platform as SocialLink['platform'],
      url: dto.url,
      label: dto.label,
    };
  }
}
