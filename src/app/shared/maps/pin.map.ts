import { List } from '@shared/interfaces/base/pages-total-records';
import { PinListResponse, PinResponse } from '@shared/interfaces/dto/response/pin';
import { Pin } from '@shared/interfaces/entity/pin';

export class PinMap {
  public static toEntity(dto: PinResponse): Pin {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      imageUrl: dto.imageUrl,
      imageWidth: dto.imageWidth,
      imageHeight: dto.imageHeight,
      link: dto.link,
      author: dto.author,
      boardId: dto.boardId,
      boardName: dto.boardName,
      saveCount: dto.saveCount,
      commentCount: dto.commentCount,
      isSaved: dto.isSaved,
      tags: dto.tags,
      createdAt: dto.createdAt,
      dominantColor: dto.dominantColor,
    };
  }

  public static toEntityList(dto: PinListResponse): List<Pin[]> {
    return {
      ...dto,
      data: dto.data.map(PinMap.toEntity),
    };
  }
}
