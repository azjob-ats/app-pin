import { List } from '@shared/interfaces/base/pages-total-records';
import { CommentListResponse, CommentResponse } from '@shared/interfaces/dto/response/comment';
import { Comment } from '@shared/interfaces/entity/comment';

export class CommentMap {
  public static toEntity(dto: CommentResponse): Comment {
    return {
      id: dto.id,
      text: dto.text,
      author: dto.author,
      pinId: dto.pinId,
      createdAt: dto.createdAt,
      likesCount: dto.likesCount,
      isLiked: dto.isLiked,
    };
  }

  public static toEntityList(dto: CommentListResponse): List<Comment[]> {
    return {
      ...dto,
      data: dto.data.map(CommentMap.toEntity),
    };
  }
}
