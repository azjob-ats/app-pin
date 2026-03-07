export type NotificationType =
  | 'new_follower'
  | 'pin_saved'
  | 'pin_comment'
  | 'board_follow'
  | 'mention'
  | 'pin_react';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  actor?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  pin?: {
    id: string;
    imageUrl: string;
    title?: string;
  };
  board?: {
    id: string;
    name: string;
    coverImageUrl?: string;
  };
}
