export interface CreateCreatorGroupRequest {
  name: string;
  description?: string;
  creatorIds?: string[];
}

export interface UpdateCreatorGroupRequest {
  name?: string;
  description?: string;
}

export interface AddCreatorsToGroupRequest {
  creatorIds: string[];
}
