export interface Board {
  id: string;
  name: string;
  description?: string;
  profileNameOfficial?: string;
  profileName?: string;
  verified?: string;
  profilePicture?: string;
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
