export interface Pin {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  link?: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  boardId?: string;
  boardName?: string;
  saveCount: number;
  commentCount: number;
  isSaved?: boolean;
  tags?: string[];
  createdAt: string;
  dominantColor?: string;
}
