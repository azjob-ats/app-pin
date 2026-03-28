import { List } from '@shared/interfaces/base/pages-total-records';
import { NotificationType } from '@shared/interfaces/entity/notification';

export interface NotificationActorResponse {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  actor?: NotificationActorResponse;
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

export interface NotificationListResponse extends List {
  data: NotificationResponse[];
}
