import { List } from '@shared/interfaces/base/pages-total-records';
import { Post } from '@shared/interfaces/entity/post';

// The server returns Posts in their entity format directly — no DTO transformation needed.
export type PostResponse = Post;

export interface PostListResponse extends List {
  data: PostResponse[];
}
