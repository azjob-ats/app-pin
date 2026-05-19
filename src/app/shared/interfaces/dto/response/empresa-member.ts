export interface RolePermissionResponse {
  action: string;
  allowed: boolean;
}

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  permissions: RolePermissionResponse[];
}

export interface MemberResponse {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  avatarUrl: string;
  roleId: string;
  roleName: string;
  status: string;
  invitedAt: string;
  acceptedAt: string | null;
}

export interface GroupResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  defaultRoleId: string | null;
  defaultRoleName: string | null;
  membersCount: number;
}

export interface MemberListResponse {
  data: MemberResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
