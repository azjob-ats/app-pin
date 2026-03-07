export interface User {
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
