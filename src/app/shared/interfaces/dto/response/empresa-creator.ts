export interface OrganizationCreatorResponse {
  id: string;
  organizationId: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  headline: string;
  status: string;
  joinedAt: string;
}

export interface CreatorGroupResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  creatorIds: string[];
  creatorsCount: number;
  createdAt: string;
  updatedAt: string;
}
