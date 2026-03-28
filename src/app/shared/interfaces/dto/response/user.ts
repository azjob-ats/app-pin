import { List } from '@shared/interfaces/base/pages-total-records';

export interface UserResponse {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  followersCount: number;
  followingCount: number;
  pinsCount: number;
  boardsCount: number;
  isFollowing?: boolean;
  website?: string;
  location?: string;
  monthlyViews?: number;
}

export interface UserListResponse extends List {
  data: UserResponse[];
}

export interface FollowToggleResponse {
  isFollowing: boolean;
  followersCount: number;
}
