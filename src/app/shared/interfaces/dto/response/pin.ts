import { List } from '@shared/interfaces/base/pages-total-records';

export interface PinAuthorResponse {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PinResponse {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  link?: string;
  author: PinAuthorResponse;
  boardId?: string;
  boardName?: string;
  saveCount: number;
  commentCount: number;
  isSaved?: boolean;
  tags?: string[];
  createdAt: string;
  dominantColor?: string;
}

export interface PinListResponse extends List {
  data: PinResponse[];
}

export interface SaveToggleResponse {
  isSaved: boolean;
  saveCount: number;
}
