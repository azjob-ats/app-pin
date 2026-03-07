export interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  pinId: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}
