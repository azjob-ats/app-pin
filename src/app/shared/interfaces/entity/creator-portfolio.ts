import { EmploymentType } from '@shared/enums/employment-type.enum';
import { LanguageProficiency } from '@shared/enums/language-proficiency.enum';
import { WorkMode } from '@shared/enums/work-mode.enum';

export interface CreatorPortfolio {
  handle: string;
  username: string | null;
  displayName: string;
  headline: string;
  avatarUrl: string;
  coverUrl: string;
  about: string;
  pronoun: string | null;
  isPcd: boolean;
  pcdNotes: string | null;
  contact: ContactInfo;
  metrics: PortfolioMetrics;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  highlights: Highlight[];
  community: CommunityInfo;
  socials: SocialLink[];
  isPublished: boolean;
}

export interface ContactInfo {
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
}

export interface PortfolioMetrics {
  totalContents: number;
  averageRetention: number;
  conversionRate: number;
  rankingVertical: number | null;
  totalViews: number;
}

export interface Experience {
  id: string;
  role: string;
  companyName: string;
  companyLogoUrl: string | null;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
}

export interface Education {
  id: string;
  institutionName: string;
  institutionLogoUrl: string | null;
  course: string;
  startDate: Date;
  endDate: Date | null;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface Certification {
  id: string;
  name: string;
  issuerName: string;
  issuerLogoUrl: string | null;
  issuedAt: Date;
  expiresAt: Date | null;
  credentialUrl: string | null;
}

export interface Highlight {
  id: string;
  pinId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
  views: number;
  experienceId: string | null;
}

export interface CommunityInfo {
  followers: number;
  supportsDM: boolean;
}

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'behance' | 'instagram' | 'website' | 'other';
  url: string;
  label: string | null;
}
