export interface CollectionItem {
  type: 'image' | 'video' | 'audio' | 'app';
  thumbnailUrl?: string;
  videoUrl?: string;
  title?: string;
  duration?: number;
  postId?: string;
}

export interface CollectionBundle {
  id: string;
  channel: string;
  username: string;
  channelPicture?: string;
  verified?: boolean;
  description: string;
  items: CollectionItem[];
  coverUrl?: string;
}
