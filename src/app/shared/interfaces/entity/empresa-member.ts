import { MemberStatus } from '@shared/enums/member-role.enum';

export interface RolePermission {
  action: string;
  allowed: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  permissions: RolePermission[];
}

export interface Member {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  avatarUrl: string;
  roleId: string;
  roleName: string;
  status: MemberStatus;
  invitedAt: Date;
  acceptedAt: Date | null;
}

export interface Group {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  defaultRoleId: string | null;
  defaultRoleName: string | null;
  membersCount: number;
}
