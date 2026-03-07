export interface Board {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverImages?: string[];
  pinsCount: number;
  followersCount?: number;
  isPrivate?: boolean;
  isCollaborative?: boolean;
  owner: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt?: string;
}
