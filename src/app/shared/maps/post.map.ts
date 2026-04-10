import { List } from '@shared/interfaces/base/pages-total-records';
import { PostListResponse } from '@shared/interfaces/dto/response/post';
import { Post } from '@shared/interfaces/entity/post';

export class PostMap {
  public static toEntityList(dto: PostListResponse): List<Post[]> {
    return { ...dto, data: dto.data };
  }
}
