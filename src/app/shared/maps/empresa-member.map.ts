import { MemberStatus } from '@shared/enums/member-role.enum';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  GroupResponse,
  MemberListResponse,
  MemberResponse,
  RoleResponse,
} from '@shared/interfaces/dto/response/empresa-member';
import { Group, Member, Role } from '@shared/interfaces/entity/empresa-member';

const VALID_STATUSES = new Set(Object.values(MemberStatus) as string[]);

export class MemberMap {
  public static toMember(dto: MemberResponse): Member {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      name: dto.name,
      email: dto.email,
      avatarUrl: dto.avatarUrl,
      roleId: dto.roleId,
      roleName: dto.roleName,
      status: MemberMap.toStatus(dto.status),
      invitedAt: new Date(dto.invitedAt),
      acceptedAt: dto.acceptedAt ? new Date(dto.acceptedAt) : null,
    };
  }

  public static toList(dto: MemberListResponse): List<Member[]> {
    return {
      data: dto.data.map((item) => MemberMap.toMember(item)),
      query: dto.query,
      page: dto.page,
      pageSize: dto.pageSize,
      pages: dto.pages,
      totalRecords: dto.totalRecords,
    };
  }

  public static toRole(dto: RoleResponse): Role {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      membersCount: dto.membersCount,
      permissions: dto.permissions.map((p) => ({ ...p })),
    };
  }

  public static toGroup(dto: GroupResponse): Group {
    return {
      id: dto.id,
      organizationId: dto.organizationId,
      name: dto.name,
      description: dto.description,
      defaultRoleId: dto.defaultRoleId,
      defaultRoleName: dto.defaultRoleName,
      membersCount: dto.membersCount,
    };
  }

  private static toStatus(value: string): MemberStatus {
    return VALID_STATUSES.has(value) ? (value as MemberStatus) : MemberStatus.Pending;
  }
}
