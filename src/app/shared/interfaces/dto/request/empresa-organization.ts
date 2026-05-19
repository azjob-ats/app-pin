export interface CreateOrganizationRequest {
  name: string;
  corporateEmail: string;
  slug: string;
  website?: string;
  socialLinks?: string[];
  bannerUrl?: string;
  logoUrl?: string;
  about?: string;
  representativeConfirmed: boolean;
}

export interface UpdateOrganizationRequest {
  name?: string;
  website?: string;
  socialLinks?: string[];
  bannerUrl?: string;
  logoUrl?: string;
  about?: string;
  publicPageEnabled?: boolean;
}

export interface OrganizationListQueryRequest {
  page?: number;
  pageSize?: number;
}
