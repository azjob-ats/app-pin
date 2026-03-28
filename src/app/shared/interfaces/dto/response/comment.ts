import { List } from '@shared/interfaces/base/pages-total-records';

export interface CommentAuthorResponse {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface CommentResponse {
  id: string;
  text: string;
  author: CommentAuthorResponse;
  pinId: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface CommentListResponse extends List {
  data: CommentResponse[];
}
