export type OrganizationCreatorStatus = 'active' | 'invited' | 'inactive';

export interface OrganizationCreator {
  id: string;
  organizationId: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  headline: string;
  status: OrganizationCreatorStatus;
  joinedAt: Date;
}

export interface CreatorGroup {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  creatorIds: string[];
  creatorsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
