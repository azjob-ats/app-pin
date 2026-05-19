export interface InviteMemberRequest {
  email: string;
  roleId: string;
}

export interface UpdateMemberRequest {
  roleId?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: Array<{ action: string; allowed: boolean }>;
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {}

export interface CreateGroupRequest {
  name: string;
  description: string;
  defaultRoleId?: string;
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {}

export interface AddMembersToGroupRequest {
  memberIds: string[];
}
