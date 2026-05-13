export interface CreatorPortfolioResponse {
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
  contact: ContactInfoResponse;
  metrics: PortfolioMetricsResponse;
  experiences: ExperienceResponse[];
  educations: EducationResponse[];
  skills: string[];
  languages: LanguageResponse[];
  certifications: CertificationResponse[];
  highlights: HighlightResponse[];
  community: CommunityInfoResponse;
  socials: SocialLinkResponse[];
  isPublished: boolean;
}

export interface ContactInfoResponse {
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
}

export interface PortfolioMetricsResponse {
  totalContents: number;
  averageRetention: number;
  conversionRate: number;
  rankingVertical: number | null;
  totalViews: number;
}

export interface ExperienceResponse {
  id: string;
  role: string;
  companyName: string;
  companyLogoUrl: string | null;
  employmentType: string;
  workMode: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
}

export interface EducationResponse {
  id: string;
  institutionName: string;
  institutionLogoUrl: string | null;
  course: string;
  startDate: string;
  endDate: string | null;
}

export interface LanguageResponse {
  id: string;
  name: string;
  proficiency: string;
}

export interface CertificationResponse {
  id: string;
  name: string;
  issuerName: string;
  issuerLogoUrl: string | null;
  issuedAt: string;
  expiresAt: string | null;
  credentialUrl: string | null;
}

export interface HighlightResponse {
  id: string;
  pinId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  views: number;
}

export interface CommunityInfoResponse {
  followers: number;
  supportsDM: boolean;
}

export interface SocialLinkResponse {
  platform: string;
  url: string;
  label: string | null;
}
