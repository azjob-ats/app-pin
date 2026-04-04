export interface DailyStory {
  id: string;
  name: string;
  pinsCount: number;
  coverImages?: string[];
  coverImageUrl?: string;
  owner: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string;
}
