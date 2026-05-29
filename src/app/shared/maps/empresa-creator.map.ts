import {
  CreatorGroupResponse,
  OrganizationCreatorResponse,
} from '@shared/interfaces/dto/response/empresa-creator';
import {
  CreatorGroup,
  OrganizationCreator,
  OrganizationCreatorStatus,
} from '@shared/interfaces/entity/empresa-creator';

const VALID_STATUSES = new Set<OrganizationCreatorStatus>(['active', 'invited', 'inactive']);

export class CreatorMap {
  public static toCreator(dto: OrganizationCreatorResponse): OrganizationCreator {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      handle: dto.handle,
      displayName: dto.displayName,
      avatarUrl: dto.avatarUrl,
      headline: dto.headline,
      status: CreatorMap.toStatus(dto.status),
      joinedAt: new Date(dto.joinedAt),
    };
  }

  public static toGroup(dto: CreatorGroupResponse): CreatorGroup {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      name: dto.name,
      description: dto.description,
      creatorIds: [...dto.creatorIds],
      creatorsCount: dto.creatorsCount,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  private static toStatus(value: string): OrganizationCreatorStatus {
    return VALID_STATUSES.has(value as OrganizationCreatorStatus)
      ? (value as OrganizationCreatorStatus)
      : 'inactive';
  }
}
