export interface OrganizationMemberSummary {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  corporateEmail: string;
  website: string;
  socialLinks: string[];
  bannerUrl: string;
  logoUrl: string;
  about: string;
  publicPageEnabled: boolean;
  isFavorite: boolean;
  membersCount: number;
  productsCount: number;
  submissionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
