import { List } from '@shared/interfaces/base/pages-total-records';
import { BoardListResponse, BoardResponse } from '@shared/interfaces/dto/response/board';
import { Board } from '@shared/interfaces/entity/board';

export class BoardMap {
  public static toEntity(dto: BoardResponse): Board {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      coverImageUrl: dto.coverImageUrl,
      coverImages: dto.coverImages,
      pinsCount: dto.pinsCount,
      followersCount: dto.followersCount,
      isPrivate: dto.isPrivate,
      isCollaborative: dto.isCollaborative,
      owner: dto.owner,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  public static toEntityList(dto: BoardListResponse): List<Board[]> {
    return {
      ...dto,
      data: dto.data.map(BoardMap.toEntity),
    };
  }
}
