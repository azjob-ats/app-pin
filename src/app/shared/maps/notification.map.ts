import { List } from '@shared/interfaces/base/pages-total-records';
import { NotificationListResponse, NotificationResponse } from '@shared/interfaces/dto/response/notification';
import { Notification } from '@shared/interfaces/entity/notification';

export class NotificationMap {
  public static toEntity(dto: NotificationResponse): Notification {
    return {
      id: dto.id,
      type: dto.type,
      message: dto.message,
      isRead: dto.isRead,
      createdAt: dto.createdAt,
      actor: dto.actor,
      pin: dto.pin,
      board: dto.board,
    };
  }

  public static toEntityList(dto: NotificationListResponse): List<Notification[]> {
    return {
      ...dto,
      data: dto.data.map(NotificationMap.toEntity),
    };
  }
}
