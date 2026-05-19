export interface OrganizationMemberSummaryResponse {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
}

export interface OrganizationResponse {
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
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationListResponse {
  data: OrganizationResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
