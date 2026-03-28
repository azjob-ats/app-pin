import { List } from '@shared/interfaces/base/pages-total-records';

export interface BoardOwnerResponse {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface BoardResponse {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverImages?: string[];
  pinsCount: number;
  followersCount?: number;
  isPrivate?: boolean;
  isCollaborative?: boolean;
  owner: BoardOwnerResponse;
  createdAt: string;
  updatedAt?: string;
}

export interface BoardListResponse extends List {
  data: BoardResponse[];
}
